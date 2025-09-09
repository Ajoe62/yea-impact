import { createBrowserClient } from '@supabase/ssr';

/**
 * Returns a Supabase client for browser (client components).
 * The client is created lazily so multiple imports share the same instance.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  return createBrowserClient(supabaseUrl, supabaseKey);
}