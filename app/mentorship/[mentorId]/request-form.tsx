// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
"use client";

import { useState } from "react";
import { requestMentorship } from "./request-actions";

interface RequestFormProps {
  mentorId: string;
}

const mentorshipGoals = [
  "Career guidance",
  "Skill development",
  "Business advice",
  "Academic support",
  "Personal growth",
  "Industry connections",
];

/**
 * Mentorship request form. Allows the user to submit a note to the
 * mentor. Calls a server action that inserts into `mentor_requests` with
 * a unique constraint on (mentee_id, mentor_id).
 */
export default function RequestForm({ mentorId }: RequestFormProps) {
  const [message, setMessage] = useState("");
  const [goal, setGoal] = useState("");
  const [expectedDuration, setExpectedDuration] = useState("3-months");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const formData = new FormData();
    formData.append("mentorId", mentorId);
    formData.append("message", message);
    formData.append("goal", goal);
    formData.append("expectedDuration", expectedDuration);

    const result = await requestMentorship(formData);
    if (result?.error) {
      setError(result.error);
      setStatus("error");
    } else {
      setStatus("success");
      setMessage("");
    }
  }

  return (
    <div className="p-6">
      {status === "success" ? (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Request Submitted!
          </h3>
          <p className="text-gray-600 mb-6">
            Your mentorship request has been sent successfully. The mentor will
            respond to your request shortly.
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Send another request
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="goal"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              What do you hope to achieve?*
            </label>
            <select
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              required
            >
              <option value="">Select your primary goal</option>
              {mentorshipGoals.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Expected mentorship duration*
            </label>
            <div className="flex gap-3 flex-wrap">
              {["1-month", "3-months", "6-months", "ongoing"].map(
                (duration) => (
                  <label key={duration} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="duration"
                      value={duration}
                      checked={expectedDuration === duration}
                      onChange={() => setExpectedDuration(duration)}
                      className="text-green-600 focus:ring-green-500 h-4 w-4"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">
                      {duration}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Message to mentor*
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Introduce yourself and explain what you're looking to learn or achieve with this mentor's guidance..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              rows={4}
              required
            ></textarea>
            <p className="mt-1 text-xs text-gray-500">
              Be specific about your goals and what you hope to learn. This will
              help the mentor understand if they can assist you.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="text-right">
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full px-4 py-3 text-white bg-green-600 rounded-md hover:bg-green-700 transition duration-300 font-medium disabled:opacity-50"
            >
              {status === "loading"
                ? "Sending Request..."
                : "Request Mentorship"}
            </button>
            <p className="mt-2 text-xs text-gray-500">
              You'll be notified when the mentor responds to your request.
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
