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
 * Checks Memory Cache -> Redis -> Supabase public.suppressed_emails.
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

  // 3. Check Supabase dedicated suppressed_emails table if configured
  if (isAdminConfigured()) {
    try {
      // Primary: Dedicated standalone suppression table (uncoupled from campaign cascade)
      const { data: suppressedRecord, error: supErr } = await supabaseAdmin
        .from('suppressed_emails')
        .select('email')
        .eq('email', normalized)
        .limit(1)
        .maybeSingle();

      if (!supErr && suppressedRecord?.email) {
        inMemorySuppressionSet.add(normalized);
        return true;
      }

      // Backward-compatible fallback: Check legacy contacts table
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
 * Writes to Supabase public.suppressed_emails, Redis, local memory, and persistent file.
 * Fails closed if durable persistence fails.
 */
export async function recordUnsubscribe(
  email: string,
  metadata?: {
    reason?: string;
    source?: string;
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

  // 1. Enforce durable storage in production: Must have Supabase or Redis
  if (process.env.NODE_ENV === 'production' && !isAdminConfigured() && !process.env.REDIS_URL) {
    throw new Error(
      'Durable suppression storage (Supabase or Redis) is not configured in production environment.'
    );
  }

  // 2. Persist to dedicated Supabase suppressed_emails table (DURABLE SOURCE OF TRUTH)
  if (isAdminConfigured()) {
    const { error: insertError } = await supabaseAdmin
      .from('suppressed_emails')
      .upsert(
        {
          email: normalized,
          reason: metadata?.reason || 'unsubscribed',
          source: metadata?.source || 'user_opt_out',
          contact_id: metadata?.contactId || null,
          campaign_id: metadata?.campaignId || null,
          ip_address: metadata?.ip || null,
          user_agent: metadata?.userAgent || null,
          suppressed_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );

    if (insertError) {
      console.error('[SuppressionService] Failed to insert into suppressed_emails table:', insertError.message);
      throw new Error(`Durable database suppression failed: ${insertError.message}`);
    }

    // Also update active contacts across campaigns (best effort)
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
      console.warn('[SuppressionService] Contact status update notice:', err);
    }
  }

  // 3. Persist to Redis cluster set
  try {
    const redis = getRedisConnection();
    await redis.sadd('artiapply:suppressed_emails', normalized);
  } catch {
    // Redis offline
  }

  // 4. Update in-memory set and persistent fallback file
  inMemorySuppressionSet.add(normalized);
  persistSuppressionFile();

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
