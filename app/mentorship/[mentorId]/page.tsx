// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { notFound } from "next/navigation";
import { createServer } from "@/utils/supabase/server";
import RequestForm from "./request-form";

interface MentorDetailPageProps {
  params: Promise<{ mentorId: string }>;
}

export default async function MentorDetailPage({ params }: MentorDetailPageProps) {
  const { mentorId } = await params;
  const supabase = await createServer();

  const { data: mentor } = await supabase
    .from("mentors")
    .select("id, bio, expertise, profiles!inner(display_name)")
    .eq("id", mentorId)
    .single();

  if (!mentor) {
    return notFound();
  }

  const displayName = Array.isArray(mentor.profiles)
    ? mentor.profiles[0]?.display_name
    : (mentor.profiles as { display_name?: string })?.display_name;

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-green-700">{displayName || "Mentor"}</h1>
        <p className="text-sm text-gray-600">Expertise: {mentor.expertise}</p>
        <p className="text-gray-700">{mentor.bio}</p>
      </header>
      <RequestForm mentorId={mentor.id} />
    </section>
  );
}
