// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { createServer } from "@/utils/supabase/server";
import Link from "next/link";

export default async function EventsPage() {
  const supabase = await createServer();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, event_date, location")
    .order("event_date", { ascending: true });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-700">Upcoming Events</h1>
      {events && events.length > 0 ? (
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="rounded bg-white p-4 shadow">
              <Link href={`/events/${event.id}`} className="block space-y-1">
                <h2 className="font-bold text-green-700 hover:underline">{event.title}</h2>
                <p className="text-sm text-gray-600">{event.description}</p>
                <p className="text-sm text-gray-600">
                  {new Date(event.event_date).toLocaleString()} | {event.location}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">There are no upcoming events at the moment.</p>
      )}
    </section>
  );
}
