// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { notFound } from "next/navigation";
import Link from "next/link";
import { createServer } from "@/utils/supabase/server";
import RequestForm from "./request-form";

interface MentorDetailPageProps {
  params: Promise<{ mentorId: string }>;
}

interface MentorProfile {
  display_name: string | null;
}

interface MentorRow {
  id: string;
  bio: string | null;
  expertise: string | null;
  profiles: MentorProfile | MentorProfile[] | null;
}

export default async function MentorDetailPage({ params }: MentorDetailPageProps) {
  const { mentorId } = await params;
  const supabase = await createServer();

  const { data: mentor } = await supabase
    .from("mentors")
    .select("id, bio, expertise, profiles!inner(display_name)")
    .eq("id", mentorId)
    .single<MentorRow>();

  if (!mentor) {
    return notFound();
  }

  const displayName = Array.isArray(mentor.profiles)
    ? mentor.profiles[0]?.display_name
    : (mentor.profiles as { display_name?: string })?.display_name;

  return (
    <section className="space-y-6">
      <Link href="/mentorship" className="inline-block text-sm font-medium text-blue-600 hover:underline">
        Back to mentors
      </Link>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-green-700">{displayName || "Mentor"}</h1>
        <p className="text-sm text-gray-600">Expertise: {mentor.expertise || "General mentorship"}</p>
        <p className="text-gray-700">
          {mentor.bio || "This mentor is available to support your growth and career journey."}
        </p>
      </header>
      <RequestForm mentorId={mentor.id} />
    </section>
  );
}
