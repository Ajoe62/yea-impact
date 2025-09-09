"use server";

import { createServer } from '@/utils/supabase/server';

/**
 * Server action to enroll the authenticated user in a course.  The
 * `enrollments` table should have a unique constraint on (user_id, course_id)
 * to prevent duplicate rows. Row Level Security must allow the current
 * user to insert/select their own enrollments. If a duplicate exists,
 * Supabase will return a unique violation error which we catch and
 * surface to the client.
 */
export async function enrollInCourse(formData: FormData) {
  const courseId = formData.get('courseId') as string;
  const supabase = createServer();
  // Get the authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: 'Please sign in to enroll.' };
  }
  try {
    const { error } = await supabase.from('enrollments').insert({
      user_id: user.id,
      course_id: courseId,
      status: 'active',
    });
    if (error) {
      // If the status code is 23505, it's a unique violation.
      if ((error as any).code === '23505') {
        return { error: 'You are already enrolled in this course.' };
      }
      return { error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { error: err.message };
  }
}