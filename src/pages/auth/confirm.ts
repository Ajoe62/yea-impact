import type { APIRoute } from 'astro';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createSupabase } from '../../lib/supabase';

/**
 * Landing page for every auth email link. Handles both link styles: the
 * `?token_hash=&type=` links from our email templates (supabase/email-templates),
 * which work in any browser, and the default `?code=` (PKCE) links, which only
 * work in the browser that asked for the email. "Continue with Google" also
 * returns here with a `?code=`.
 */
export const GET: APIRoute = async (context) => {
  const params = context.url.searchParams;
  const code = params.get('code');
  const tokenHash = params.get('token_hash');
  const type = params.get('type') as EmailOtpType | null;
  const rawNext = params.get('next');
  const isRecovery = type === 'recovery' || rawNext === '/reset-password';

  // Only allow same-site paths, so `?next=` can't send people to another site.
  const safeNext = rawNext?.startsWith('/') && !rawNext.startsWith('//') ? rawNext : null;
  const next = safeNext ?? (type === 'recovery' || type === 'invite' ? '/reset-password' : '/login?confirmed=1');

  const supabase = createSupabase(context);
  let failed = true;
  if (supabase && tokenHash && type) {
    failed = Boolean((await supabase.auth.verifyOtp({ token_hash: tokenHash, type })).error);
  } else if (supabase && code) {
    failed = Boolean((await supabase.auth.exchangeCodeForSession(code)).error);
  }

  // Google (and any other OAuth provider) reports a cancelled or failed sign-in as `?error=`.
  if (failed && params.get('error')) return context.redirect('/login?oauth=failed');
  if (failed) return context.redirect(isRecovery ? '/forgot-password?expired=1' : '/login?confirm=failed');
  return context.redirect(next);
};
