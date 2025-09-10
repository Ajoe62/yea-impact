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
    // Provide a CookieMethods-compatible implementation that reads from
    // Next's request cookies. We implement `get` and provide safe `set`
    // and `delete` wrappers that call Next's `cookies()` helpers when
    // available. In some server contexts `cookies()` is read-only, so
    // `set`/`delete` are implemented as no-ops when not supported.
    // Cast to `any` because the expected CookieMethods type comes from
    // the @supabase/ssr package and its runtime shape can vary between
    // Next.js versions. We intentionally forward calls to Next's
    // `cookies()` helper using `as any` to avoid type mismatch errors.
    cookies: ( {
      get: (key: string) => {
        const nextCookies: any = cookies();
        const c = nextCookies?.get ? nextCookies.get(key) : undefined;
        return c?.value ?? null;
      },
      set: (key: string, value: string, options?: Record<string, any>) => {
        try {
          const nextCookies: any = cookies();
          if (typeof nextCookies.set === 'function') {
            try {
              nextCookies.set(key, value);
            } catch {
              nextCookies.set({ name: key, value, ...(options || {}) });
            }
          }
        } catch {
          // no-op when cookies are read-only
        }
      },
      remove: (key: string) => {
        try {
          const nextCookies: any = cookies();
          if (typeof nextCookies.delete === 'function') {
            nextCookies.delete(key);
          } else if (typeof nextCookies.remove === 'function') {
            nextCookies.remove(key);
          }
        } catch {
          // no-op when cookies are read-only
        }
      },
    } as unknown as any ),
  });
}