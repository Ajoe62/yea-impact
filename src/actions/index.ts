import { ActionError, defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro/zod';
import type { AuthError, SupabaseClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
import { isPast } from '../lib/format';
import { createSupabase, UNIQUE_VIOLATION } from '../lib/supabase';

function requireSupabase(context: ActionAPIContext): SupabaseClient {
  const supabase = createSupabase(context);
  if (!supabase) {
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Supabase is not configured yet. Add your keys to .env and restart the server.',
    });
  }
  return supabase;
}

async function requireUser(supabase: SupabaseClient, message: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new ActionError({ code: 'UNAUTHORIZED', message });
  return user;
}

/** Turns an insert error into a friendly message; duplicates hit the UNIQUE constraints. */
function insertFailed(error: { code?: string; message: string }, duplicateMessage: string): never {
  if (error.code === UNIQUE_VIOLATION) throw new ActionError({ code: 'CONFLICT', message: duplicateMessage });
  throw new ActionError({ code: 'BAD_REQUEST', message: error.message });
}

/** Where auth emails link back to: the main domain in production, else this server. */
function siteOrigin(context: ActionAPIContext): string {
  return import.meta.env.PUBLIC_SITE_URL || context.url.origin;
}

/** Plain-language messages for the Supabase Auth errors people actually run into. */
function authMessage(error: AuthError): string {
  switch (error.code) {
    case 'invalid_credentials':
      return 'That email and password don’t match. Check them and try again, or reset your password.';
    case 'user_already_exists':
    case 'email_exists':
      return 'An account with this email already exists. Sign in instead, or reset your password if you’ve forgotten it.';
    case 'over_email_send_rate_limit':
      return 'We’ve just sent you an email. Please wait a minute before asking for another one.';
    case 'over_request_rate_limit':
      return 'Too many attempts. Please wait a minute and try again.';
    case 'weak_password':
      return 'That password is too easy to guess. Use at least 8 characters, mixing letters and numbers.';
    case 'same_password':
      return 'Your new password must be different from your current one.';
    case 'email_address_invalid':
      return 'That email address can’t receive mail. Check it and try again.';
    case 'signup_disabled':
      return 'Registration is closed at the moment. Please contact us.';
  }
  // Supabase reports SMTP failures as a 500 with no specific code.
  if (error.status === 500 && /email/i.test(error.message)) {
    return 'We couldn’t send your email just now. Please try again in a few minutes, or contact us if it keeps happening.';
  }
  return error.message;
}

const email = z.email('Enter a valid email address.');
const newPassword = z.string().min(8, 'Use at least 8 characters.').max(72, 'Use at most 72 characters.');

export const server = {
  login: defineAction({
    accept: 'form',
    input: z.object({ email, password: z.string().min(1, 'Enter your password.') }),
    handler: async ({ email, password }, context) => {
      const supabase = requireSupabase(context);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error?.code === 'email_not_confirmed') {
        // Send a fresh link straight away, since the first one may be lost or expired.
        await supabase.auth.resend({
          type: 'signup',
          email,
          options: { emailRedirectTo: new URL('/auth/confirm', siteOrigin(context)).toString() },
        });
        throw new ActionError({
          code: 'FORBIDDEN',
          message: `Please confirm your email address first. We’ve sent a new confirmation link to ${email}. Check your inbox and spam folder.`,
        });
      }
      if (error) throw new ActionError({ code: 'UNAUTHORIZED', message: authMessage(error) });
      return { signedIn: true };
    },
  }),

  signup: defineAction({
    accept: 'form',
    input: z.object({ email, password: newPassword }),
    handler: async ({ email, password }, context) => {
      const supabase = requireSupabase(context);
      // The confirmation link lands on /auth/confirm, which signs the user in and
      // forwards them to `next`. This URL must be in Supabase's Redirect URLs list.
      const confirmUrl = new URL('/auth/confirm', siteOrigin(context));
      const next = context.url.searchParams.get('next');
      if (next) confirmUrl.searchParams.set('next', next);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: confirmUrl.toString() },
      });
      if (error) throw new ActionError({ code: 'BAD_REQUEST', message: authMessage(error) });
      // For an email that is already registered and confirmed, Supabase returns a
      // stand-in user with no identities (and sends nothing) rather than an error.
      if (data.user && data.user.identities?.length === 0) {
        throw new ActionError({
          code: 'CONFLICT',
          message: 'An account with this email already exists. Sign in instead, or reset your password if you’ve forgotten it.',
        });
      }
      // With email confirmation on, Supabase returns no session until the link is clicked.
      return { signedIn: Boolean(data.session), email };
    },
  }),

  resendConfirmation: defineAction({
    accept: 'form',
    input: z.object({ email }),
    handler: async ({ email }, context) => {
      const supabase = requireSupabase(context);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: new URL('/auth/confirm', siteOrigin(context)).toString() },
      });
      if (error) throw new ActionError({ code: 'BAD_REQUEST', message: authMessage(error) });
      return { sent: true, email };
    },
  }),

  requestPasswordReset: defineAction({
    accept: 'form',
    input: z.object({ email }),
    handler: async ({ email }, context) => {
      const supabase = requireSupabase(context);
      const redirectTo = new URL('/auth/confirm', siteOrigin(context));
      redirectTo.searchParams.set('next', '/reset-password');
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectTo.toString() });
      // Unknown emails succeed silently, so this can't be used to find out who has an account.
      if (error) throw new ActionError({ code: 'BAD_REQUEST', message: authMessage(error) });
      return { sent: true, email };
    },
  }),

  updatePassword: defineAction({
    accept: 'form',
    input: z
      .object({ password: newPassword, confirmPassword: z.string() })
      .refine((value) => value.password === value.confirmPassword, {
        message: 'The passwords don’t match.',
        path: ['confirmPassword'],
      }),
    handler: async ({ password }, context) => {
      const supabase = requireSupabase(context);
      await requireUser(supabase, 'Your reset link has expired. Please request a new one.');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new ActionError({ code: 'BAD_REQUEST', message: authMessage(error) });
      return { updated: true };
    },
  }),

  signOut: defineAction({
    accept: 'form',
    handler: async (_input, context) => {
      await requireSupabase(context).auth.signOut();
      return { signedOut: true };
    },
  }),

  enrollInCourse: defineAction({
    accept: 'form',
    input: z.object({ courseId: z.string().min(1) }),
    handler: async ({ courseId }, context) => {
      const supabase = requireSupabase(context);
      const user = await requireUser(supabase, 'Please sign in to enroll.');
      const { error } = await supabase
        .from('enrollments')
        .insert({ user_id: user.id, course_id: courseId, status: 'active' });
      if (error) insertFailed(error, 'You are already enrolled in this course.');
      return { enrolled: true };
    },
  }),

  registerForEvent: defineAction({
    accept: 'form',
    input: z.object({ eventId: z.string().min(1) }),
    handler: async ({ eventId }, context) => {
      const supabase = requireSupabase(context);
      const user = await requireUser(supabase, 'Please sign in to register.');
      const { data: event } = await supabase.from('events').select('event_date').eq('id', eventId).single();
      if (!event) throw new ActionError({ code: 'NOT_FOUND', message: 'This event no longer exists.' });
      if (isPast(event.event_date)) throw new ActionError({ code: 'BAD_REQUEST', message: 'This event has ended.' });
      const token = crypto.randomUUID();
      const { error } = await supabase
        .from('event_registrations')
        .insert({ event_id: eventId, user_id: user.id, token, checked_in: false });
      if (error) insertFailed(error, 'You have already registered for this event.');

      // The QR code is a convenience: registration still succeeds if this part fails.
      try {
        const origin = siteOrigin(context);
        const png = await QRCode.toBuffer(`${origin}/events/${eventId}/checkin?token=${token}`, { width: 480, margin: 2 });
        const bucket = supabase.storage.from('qr-codes');
        const fileName = `${token}.png`;
        const { error: uploadError } = await bucket.upload(fileName, png, { contentType: 'image/png', upsert: true });
        if (uploadError) return { registered: true, qrUrl: null };
        return { registered: true, qrUrl: bucket.getPublicUrl(fileName).data.publicUrl };
      } catch {
        return { registered: true, qrUrl: null };
      }
    },
  }),

  applyForJob: defineAction({
    accept: 'form',
    input: z.object({
      jobId: z.string().min(1),
      cvUrl: z.url('Enter a full link to your CV, starting with https://'),
      notes: z.string().max(2000).optional(),
    }),
    handler: async ({ jobId, cvUrl, notes }, context) => {
      const supabase = requireSupabase(context);
      const user = await requireUser(supabase, 'Please sign in to apply.');
      const { error } = await supabase
        .from('applications')
        .insert({ job_id: jobId, applicant_id: user.id, cv_url: cvUrl, notes: notes ?? null, status: 'submitted' });
      if (error) insertFailed(error, 'You have already applied for this job.');
      return { applied: true };
    },
  }),

  requestMentorship: defineAction({
    accept: 'form',
    input: z.object({
      mentorId: z.string().min(1),
      message: z.string().max(2000).optional(),
    }),
    handler: async ({ mentorId, message }, context) => {
      const supabase = requireSupabase(context);
      const user = await requireUser(supabase, 'Please sign in to request mentorship.');
      const { error } = await supabase
        .from('mentor_requests')
        .insert({ mentor_id: mentorId, mentee_id: user.id, message: message ?? null, status: 'pending' });
      if (error) insertFailed(error, 'You have already requested mentorship from this mentor.');
      return { requested: true };
    },
  }),
};
