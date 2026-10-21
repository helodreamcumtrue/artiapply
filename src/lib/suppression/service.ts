import fs from 'fs';
import path from 'path';
import { supabaseAdmin, isAdminConfigured } from '../supabase/admin';
import { getRedisConnection } from '../queue/client';

// Local in-memory suppression set for fast lookups
const inMemorySuppressionSet = new Set<string>();

// Path for persistent fallback suppression file (persists across server restarts locally/in serverless /tmp)
const SUPPRESSION_FILE_PATH = process.env.VERCEL
  ? path.join('/tmp', 'artiapply_suppressed_emails.json')
  : path.join(process.cwd(), '.data', 'suppressed_emails.json');

/**
 * Initialize persistent storage cache
 */
function loadSuppressionFile(): void {
  try {
    if (fs.existsSync(SUPPRESSION_FILE_PATH)) {
      const data = fs.readFileSync(SUPPRESSION_FILE_PATH, 'utf-8');
      const list = JSON.parse(data);
      if (Array.isArray(list)) {
        list.forEach((e) => {
          if (typeof e === 'string' && e.trim()) {
            inMemorySuppressionSet.add(e.trim().toLowerCase());
          }
        });
      }
    }
  } catch (err) {
    console.warn('[SuppressionService] Notice loading suppression file:', err);
  }
}

function persistSuppressionFile(): void {
  try {
    const dir = path.dirname(SUPPRESSION_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const arr = Array.from(inMemorySuppressionSet);
    fs.writeFileSync(SUPPRESSION_FILE_PATH, JSON.stringify(arr, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[SuppressionService] Notice saving suppression file:', err);
  }
}

// Load on initial module evaluation
loadSuppressionFile();

/**
 * Normalizes an email address for uniform suppression checking
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Checks if an email address is on the global suppression / opt-out list.
 * Checks Memory Cache -> Redis -> Supabase.
 */
export async function isSuppressed(email: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;

  // 1. Check in-memory set (fastest)
  if (inMemorySuppressionSet.has(normalized)) {
    return true;
  }

  // 2. Check Redis if available
  try {
    const redis = getRedisConnection();
    const isMember = await redis.sismember('artiapply:suppressed_emails', normalized);
    if (isMember === 1) {
      inMemorySuppressionSet.add(normalized);
      return true;
    }
  } catch {
    // Redis offline, proceed to database
  }

  // 3. Check Supabase if configured
  if (isAdminConfigured()) {
    try {
      // Check contacts marked as unsubscribed
      const { data: unsubContact } = await supabaseAdmin
        .from('contacts')
        .select('id')
        .eq('email', normalized)
        .eq('error_message', 'Recipient unsubscribed')
        .limit(1)
        .maybeSingle();

      if (unsubContact) {
        inMemorySuppressionSet.add(normalized);
        return true;
      }
    } catch {
      // Supabase unavailable
    }
  }

  return false;
}

/**
 * Permanently adds an email to the server-side suppression list.
 * This cannot be undone by frontend CSV re-uploads or campaign relaunch.
 */
export async function recordUnsubscribe(
  email: string,
  metadata?: {
    reason?: string;
    contactId?: string;
    campaignId?: string;
    ip?: string;
    userAgent?: string;
  }
): Promise<{ success: boolean; email: string }> {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    throw new Error('Valid email address is required to record unsubscribe');
  }

  // 1. Add to in-memory set and write to persistent file
  inMemorySuppressionSet.add(normalized);
  persistSuppressionFile();

  // 2. Add to Redis set
  try {
    const redis = getRedisConnection();
    await redis.sadd('artiapply:suppressed_emails', normalized);
  } catch {
    // Redis offline
  }

  // 3. Update Supabase records
  if (isAdminConfigured()) {
    try {
      if (metadata?.contactId) {
        await supabaseAdmin
          .from('contacts')
          .update({
            status: 'failed',
            error_message: 'Recipient unsubscribed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', metadata.contactId);
      }

      // Mark all contacts across all campaigns with this email
      await supabaseAdmin
        .from('contacts')
        .update({
          status: 'failed',
          error_message: 'Recipient unsubscribed',
          updated_at: new Date().toISOString(),
        })
        .eq('email', normalized)
        .in('status', ['pending', 'queued']);
    } catch (err) {
      console.warn('[SuppressionService] Database update notice:', err);
    }
  }

  console.log(`[SuppressionService] Email permanently suppressed: ${normalized}`);
  return { success: true, email: normalized };
}

/**
 * Filters an array of contacts against the suppression list.
 * Any suppressed contact is filtered out so it cannot be launched or enqueued.
 */
export async function filterSuppressedContacts<T extends { email?: string }>(
  contacts: T[]
): Promise<{ allowed: T[]; suppressed: T[] }> {
  const allowed: T[] = [];
  const suppressed: T[] = [];

  for (const contact of contacts) {
    const email = contact.email || '';
    if (await isSuppressed(email)) {
      suppressed.push(contact);
    } else {
      allowed.push(contact);
    }
  }

  return { allowed, suppressed };
}

/**
 * Returns list of suppressed emails (for testing / admin verification)
 */
export function getSuppressedEmailsSnapshot(): string[] {
  return Array.from(inMemorySuppressionSet);
}
