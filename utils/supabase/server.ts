import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Create a Supabase client on the server.  The client reads cookies to send
 * the user's session token automatically when making requests to Supabase.
 */
export function createServer() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: () => cookies(),
  });
}