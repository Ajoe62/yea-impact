// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import Link from "next/link";
import { createServer } from "@/utils/supabase/server";

interface MentorProfile {
  display_name: string | null;
}

interface MentorRow {
  id: string;
  bio: string | null;
  expertise: string | null;
  profiles: MentorProfile | MentorProfile[] | null;
}

function resolveDisplayName(profile: MentorRow["profiles"]): string {
  if (Array.isArray(profile)) {
    return profile[0]?.display_name || "Mentor";
  }

  return profile?.display_name || "Mentor";
}

export default async function MentorshipPage() {
  const supabase = await createServer();
  const { data: mentors, error } = await supabase
    .from("mentors")
    .select("id, bio, expertise, profiles!inner(display_name)")
    .order("id", { ascending: true })
    .returns<MentorRow[]>();

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-green-700">Mentorship</h1>
        <p className="text-sm text-gray-700">
          Connect with experienced mentors for career guidance, accountability, and practical growth support.
        </p>
      </header>

      {error ? (
        <p className="rounded bg-red-50 p-4 text-sm text-red-700">
          Mentors are temporarily unavailable. Please refresh and try again.
        </p>
      ) : null}

      {!error && mentors && mentors.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {mentors.map((mentor) => (
            <li key={mentor.id} className="rounded bg-white p-5 shadow">
              <h2 className="text-lg font-semibold text-green-700">{resolveDisplayName(mentor.profiles)}</h2>
              <p className="mt-1 text-sm text-gray-600">Expertise: {mentor.expertise || "General mentorship"}</p>
              <p className="mt-2 line-clamp-4 text-sm text-gray-700">
                {mentor.bio || "Available to guide your learning and professional development."}
              </p>
              <Link
                href={`/mentorship/${mentor.id}`}
                className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                View profile
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {!error && (!mentors || mentors.length === 0) ? (
        <p className="text-sm text-gray-700">No mentors are listed right now. Please check back soon.</p>
      ) : null}
    </section>
  );
}
