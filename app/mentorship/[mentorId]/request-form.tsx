// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState } from "react";
import { requestMentorship } from "./request-actions";

interface RequestFormProps {
  mentorId: string;
}

interface RequestMentorshipResult {
  error?: string;
  success?: string;
}

/**
 * Mentorship request form. Allows the user to submit a note to the
 * mentor. Calls a server action that inserts into `mentor_requests` with
 * a unique constraint on (mentee_id, mentor_id).
 */
export default function RequestForm({ mentorId }: RequestFormProps) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") {
      return;
    }

    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("mentorId", mentorId);
    formData.append("message", message);

    const result: RequestMentorshipResult = await requestMentorship(formData);

    if (result?.error) {
      setError(result.error);
      setStatus("error");
    } else {
      setStatus("success");
      setMessage("");
    }
  }

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <h3 className="mb-2 text-lg font-semibold text-green-700">Request Mentorship</h3>
      {status === "success" ? (
        <p className="text-sm text-green-700">Request submitted successfully.</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block mb-1 text-sm font-medium">
              Message to mentor (optional)
            </label>
            <textarea
              id="message"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              rows={4}
              disabled={status === "loading"}
            />
            <p className="mt-1 text-xs text-gray-500">{message.length}/1000</p>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "loading" ? "Submitting..." : "Send Request"}
          </button>
        </form>
      )}
    </div>
  );
}
