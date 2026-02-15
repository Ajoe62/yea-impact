import { notFound } from 'next/navigation';
import { createServer } from '@/utils/supabase/server';
import RegistrationForm from './register-form';

interface EventPageProps {
  params: { id: string };
}

/**
 * Event detail page. Fetches a single event from Supabase and renders a
 * registration form that uses Supabase to create a unique registration
 * record with a token. The user must be authenticated to register.
 */
export default async function EventDetailPage({ params }: EventPageProps) {
  const supabase = await createServer();
  const { data: event } = await supabase
    .from('events')
    .select('id, title, description, event_date, location')
    .eq('id', params.id)
    .single();
  if (!event) {
    return notFound();
  }
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-green-700">{event.title}</h1>
        <p className="mt-2 text-gray-700">{event.description}</p>
        <p className="mt-1 text-sm text-gray-500">
          {new Date(event.event_date).toLocaleString()} • {event.location}
        </p>
      </header>
      <RegistrationForm eventId={event.id} />
    </section>
  );
}