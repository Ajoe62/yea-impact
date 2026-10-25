import type { APIRoute } from 'astro';
import { createSupabase } from '../../lib/supabase';

/**
 * Starts "Continue with Google". Supabase hands back Google's sign-in URL and
 * stores the PKCE verifier in a cookie; Google then returns the user to
 * /auth/confirm?code=…, which finishes the sign-in. Posted from the login form
 * so the redirect isn't triggered by link prefetching.
 */
export const POST: APIRoute = async (context) => {
  const supabase = createSupabase(context);
  if (!supabase) return context.redirect('/login?oauth=failed');

  // Only allow same-site paths, so `?next=` can't send people to another site.
  const rawNext = context.url.searchParams.get('next') ?? '/';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  const redirectTo = new URL('/auth/confirm', import.meta.env.PUBLIC_SITE_URL || context.url.origin);
  redirectTo.searchParams.set('next', next);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectTo.toString(), queryParams: { prompt: 'select_account' } },
  });
  if (error || !data.url) return context.redirect('/login?oauth=failed');
  return context.redirect(data.url);
};
