import type { APIRoute } from 'astro';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createSupabase } from '../../lib/supabase';

/**
 * Landing page for the email confirmation link. Handles both link styles:
 * the default `?code=` (PKCE) link, and `?token_hash=&type=` from a custom
 * email template, which also works when the link is opened in another browser.
 */
export const GET: APIRoute = async (context) => {
  const params = context.url.searchParams;
  // Only allow same-site paths, so `?next=` can't send people to another site.
  const rawNext = params.get('next') ?? '/';
  const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/';

  const supabase = createSupabase(context);
  const code = params.get('code');
  const tokenHash = params.get('token_hash');
  const type = params.get('type') as EmailOtpType | null;

  let failed = true;
  if (supabase && code) {
    failed = Boolean((await supabase.auth.exchangeCodeForSession(code)).error);
  } else if (supabase && tokenHash && type) {
    failed = Boolean((await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error);
  }

  if (failed) return context.redirect('/login?confirm=failed');
  return context.redirect(next);
};
