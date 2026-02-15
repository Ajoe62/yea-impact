import { notFound } from 'next/navigation';
import { createServer } from '@/utils/supabase/server';
import RequestForm from './request-form';

interface MentorDetailProps {
  params: { mentorId: string };
}

/**
 * Mentor detail page. Displays information about a specific mentor and
 * provides a form to request mentorship. The `mentor_requests` table uses
 * a unique constraint on (mentee_id, mentor_id) to prevent duplicate
 * requests.
 */
export default async function MentorDetailPage({ params }: MentorDetailProps) {
  const supabase = await createServer();
  const { data: mentor } = await supabase
    .from('mentors')
    .select('id, bio, expertise, profiles(display_name)')
    .eq('id', params.mentorId)
    .single();
  if (!mentor) {
    return notFound();
  }
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-green-700">
          {mentor.profiles?.[0]?.display_name || 'Mentor'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">Expertise: {mentor.expertise}</p>
        <p className="mt-2 text-gray-700">{mentor.bio}</p>
      </header>
      <RequestForm mentorId={mentor.id} />
    </section>
  );
}