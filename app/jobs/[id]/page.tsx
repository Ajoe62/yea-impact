// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { notFound } from "next/navigation";
import { createServer } from "@/utils/supabase/server";
import ApplicationForm from "./apply-form";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const supabase = await createServer();

  const { data: job } = await supabase
    .from("jobs")
    .select("id, title, company, description, deadline")
    .eq("id", id)
    .single();

  if (!job) {
    return notFound();
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-green-700">{job.title}</h1>
        <p className="text-sm text-gray-600">Company: {job.company}</p>
        <p className="text-gray-700">{job.description}</p>
        <p className="text-sm text-gray-500">
          Application deadline: {new Date(job.deadline).toLocaleDateString()}
        </p>
      </header>
      <ApplicationForm jobId={job.id} />
    </section>
  );
}
