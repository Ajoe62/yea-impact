import type { AstroCookies } from 'astro';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** True once the Supabase keys are set in `.env`. */
export const isSupabaseConfigured = Boolean(url && key && !url.startsWith('YOUR_'));

/**
 * Server-side Supabase client for one request. It reads the session from the
 * request cookies and writes refreshed session cookies back to the response.
 * Returns null when Supabase is not configured, so pages can still render.
 */
export function createSupabase(context: { request: Request; cookies: AstroCookies }): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return parseCookieHeader(context.request.headers.get('Cookie') ?? '').map(({ name, value }) => ({
          name,
          value: value ?? '',
        }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          context.cookies.set(name, value, options);
        }
      },
    },
  });
}

/** Postgres unique-violation code, raised by the composite UNIQUE constraints. */
export const UNIQUE_VIOLATION = '23505';
