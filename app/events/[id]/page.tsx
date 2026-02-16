// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { notFound } from "next/navigation";
import { createServer } from "@/utils/supabase/server";
import RegistrationForm from "./register-form";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const supabase = await createServer();

  const { data: event } = await supabase
    .from("events")
    .select("id, title, description, event_date, location")
    .eq("id", id)
    .single();

  if (!event) {
    return notFound();
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-green-700">{event.title}</h1>
        <p className="text-gray-700">{event.description}</p>
        <p className="text-sm text-gray-500">
          {new Date(event.event_date).toLocaleString()} | {event.location}
        </p>
      </header>
      <RegistrationForm eventId={event.id} />
    </section>
  );
}
