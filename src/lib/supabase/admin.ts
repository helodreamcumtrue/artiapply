import { createClient } from '@supabase/supabase-js';

/**
 * Sanitizes and normalizes the Supabase Project URL.
 * Automatically removes accidental paths like /rest/v1, /auth/v1, or trailing slashes
 * that cause PostgREST "Invalid path specified in request URL" errors.
 */
export function cleanSupabaseUrl(urlRaw?: string): string {
  if (!urlRaw) return 'https://placeholder-domain.supabase.co';
  let url = urlRaw.trim();
  if (!url) return 'https://placeholder-domain.supabase.co';

  // Ensure protocol
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    // Origin is strictly https://hostname:port with no path segments
    return parsed.origin;
  } catch {
    // Regex fallback
    return url
      .replace(/\/+$/, '')
      .replace(/\/(rest|auth|storage|graphql)\/v[0-9]+.*$/i, '')
      .replace(/\/+$/, '');
  }
}

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const rawServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseUrl = cleanSupabaseUrl(rawUrl);
export const supabaseServiceKey = (rawServiceKey || '').trim() || 'placeholder-service-key';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const isAdminConfigured = () => {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  return Boolean(
    url &&
    key &&
    !url.includes('placeholder-domain') &&
    key !== 'placeholder-service-key' &&
    key.length > 20
  );
};
