// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { createServer } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

interface CheckinPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>; // Changed to Promise
}

/**
 * Check‑in page. This page is accessed via a QR code with a token in the
 * query string. It validates the token against the `event_registrations`
 * table and marks the `checked_in` field to true. It can be visited by
 * scanning the QR code at the event.
 */
export default async function EventCheckinPage({ params, searchParams }: CheckinPageProps) {
  const { id } = await params;
  const { token } = await searchParams; // Changed to await searchParams
  
  if (!token) {
    return notFound();
  }

  const supabase = createServer();

  // Validate the registration
  const { data: registration, error } = await supabase
    .from('event_registrations')
    .select('id, checked_in')
    .eq('event_id', id)
    .eq('token', token)
    .single();

  if (!registration || error) {
    return (
      <div className="p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold text-red-600">Invalid or expired token</h1>
        <p className="text-gray-700">Please ensure you scanned the correct QR code.</p>
      </div>
    );
  }

  // If not yet checked in, mark as checked in
  if (!registration.checked_in) {
    await supabase
      .from('event_registrations')
      .update({ checked_in: true })
      .eq('id', registration.id);
  }

  return (
    <div className="p-8 text-center">
      <h1 className="mb-4 text-2xl font-bold text-green-700">Check‑in successful</h1>
      <p className="text-gray-700">Welcome! Your attendance has been recorded.</p>
    </div>
  );
}