import { createBrowserClient } from '@supabase/ssr';
import { cleanSupabaseUrl } from './admin';

export function createClient() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !rawKey || rawUrl.includes('placeholder-domain')) {
    // Return a dummy client if not configured to prevent startup crashes
    return createBrowserClient(
      'https://placeholder-domain.supabase.co',
      'placeholder-anon-key'
    );
  }

  const supabaseUrl = cleanSupabaseUrl(rawUrl);
  const supabaseKey = rawKey.trim();

  return createBrowserClient(supabaseUrl, supabaseKey);
}

export const isSupabaseConfigured = () => {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
  const key = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();
  return Boolean(
    url &&
    key &&
    !url.includes('placeholder-domain') &&
    key !== 'placeholder-anon-key' &&
    key.length > 20
  );
};
