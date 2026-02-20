// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use server";

import { createServer } from "@/utils/supabase/server";

interface RequestMentorshipResult {
  error?: string;
  success?: string;
}

function normalizeTextValue(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Server action to create a mentorship request.  Inserts a row into
 * `mentor_requests` with the current user's id as `mentee_id` and the
 * provided `mentor_id`. A composite unique constraint on (mentee_id,
 * mentor_id) prevents duplicate requests. Row Level Security ensures
 * only the mentee and mentor can see the request.
 */
export async function requestMentorship(formData: FormData): Promise<RequestMentorshipResult> {
  const mentorId = normalizeTextValue(formData.get("mentorId"));
  const message = normalizeTextValue(formData.get("message"));

  if (!mentorId) {
    return { error: "Unable to submit request. Please refresh and try again." };
  }

  const supabase = await createServer();

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Please sign in to request mentorship." };
  }

  if (message.length > 1000) {
    return { error: "Message is too long. Please keep it under 1000 characters." };
  }

  const { error } = await supabase.from("mentor_requests").insert({
    mentor_id: mentorId,
    mentee_id: user.id,
    message: message || null,
    status: "pending",
  });

  if (error) {
    if ((error as { code?: string }).code === "23505") {
      return {
        error: "You have already requested mentorship from this mentor.",
      };
    }

    return { error: "Unable to submit mentorship request right now. Please try again." };
  }

  return { success: "Mentorship request submitted successfully." };
}
