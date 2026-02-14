// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from '@/utils/supabase/server';

/**
 * Server action to submit a job application.  Inserts a row into the
 * `applications` table with a unique constraint on (job_id, applicant_id).
 */
export async function applyForJob(formData: FormData) {
  const jobId = formData.get('jobId') as string;
  const cvUrl = formData.get('cvUrl') as string;
  const notes = formData.get('notes') as string;
  const supabase = createServer();
  // Ensure user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Please sign in to apply.' };
  }
  const { error } = await supabase.from('applications').insert({
    job_id: jobId,
    applicant_id: user.id,
    cv_url: cvUrl,
    notes,
    status: 'submitted',
  });
  if (error) {
    if ((error as any).code === '23505') {
      return { error: 'You have already applied for this job.' };
    }
    return { error: error.message };
  }
  return { success: true };
}