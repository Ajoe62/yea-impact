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
  const message = formData.get("message") as string;
  const goal = formData.get("goal") as string;
  const expectedDuration = formData.get("expectedDuration") as string;

  // Simple validation
  if (!message.trim()) {
    return { error: "Please include a message for the mentor." };
  }

  if (!goal) {
    return { error: "Please select a mentorship goal." };
  }

  const supabase = createServer();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to request mentorship." };
  }

  // Insert the request into the database
  const { error } = await supabase.from("mentor_requests").insert({
    mentor_id: mentorId,
    mentee_id: user.id,
    message,
    goal,
    expected_duration: expectedDuration,
    status: "pending",
    created_at: new Date().toISOString(),
  });

  if (error) {
    if ((error as any).code === "23505") {
      return {
        error:
          "You have already requested mentorship from this mentor. Please wait for their response or cancel your previous request.",
      };
    }
    return { error: error.message };
  }

  // Optional: Send notification email to mentor (this would be implemented with a serverless function or email service)

  return { success: true };
}
