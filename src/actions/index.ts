import { ActionError, defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro/zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import QRCode from 'qrcode';
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

const credentials = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

export const server = {
  login: defineAction({
    accept: 'form',
    input: credentials,
    handler: async ({ email, password }, context) => {
      const supabase = requireSupabase(context);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new ActionError({ code: 'UNAUTHORIZED', message: error.message });
      return { signedIn: true };
    },
  }),

  signup: defineAction({
    accept: 'form',
    input: credentials,
    handler: async ({ email, password }, context) => {
      const supabase = requireSupabase(context);
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw new ActionError({ code: 'BAD_REQUEST', message: error.message });
      // With email confirmation on, Supabase returns no session until the link is clicked.
      return { signedIn: Boolean(data.session) };
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
      const token = crypto.randomUUID();
      const { error } = await supabase
        .from('event_registrations')
        .insert({ event_id: eventId, user_id: user.id, token, checked_in: false });
      if (error) insertFailed(error, 'You have already registered for this event.');

      // The QR code is a convenience: registration still succeeds if this part fails.
      try {
        const origin = import.meta.env.PUBLIC_SITE_URL || context.url.origin;
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
