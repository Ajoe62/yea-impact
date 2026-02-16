// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from "@/utils/supabase/server";

/**
 * Server action to create a mentorship request.  Inserts a row into
 * `mentor_requests` with the current user's id as `mentee_id` and the
 * provided `mentor_id`. A composite unique constraint on (mentee_id,
 * mentor_id) prevents duplicate requests. Row Level Security ensures
 * only the mentee and mentor can see the request.
 */
export async function requestMentorship(formData: FormData) {
  const mentorId = formData.get("mentorId") as string;
  const message = formData.get("message") as string | null;
  const supabase = await createServer();
  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Please sign in to request mentorship." };
  }
  const { error } = await supabase.from("mentor_requests").insert({
    mentor_id: mentorId,
    mentee_id: user.id,
    message,
    status: "pending",
  });
  if (error) {
    if ((error as any).code === "23505") {
      return {
        error: "You have already requested mentorship from this mentor.",
      };
    }
    return { error: error.message };
  }
  return { success: true };
}
