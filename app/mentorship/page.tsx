import { createServer } from '@/utils/supabase/server';
import Link from 'next/link';

/**
 * Mentorship page. Lists available mentors and allows logged‑in users to request
 * mentorship.  In a production app, a form would submit a Server Action that
 * inserts into the `mentor_requests` table with a unique constraint on
 * (mentee_id, mentor_id) to prevent duplicates.
 */
export default async function MentorshipPage() {
  const supabase = await createServer();
  const { data: mentors } = await supabase
    .from('mentors')
    .select('id, bio, expertise, profiles!inner(display_name)')
    .order('profiles.display_name', { ascending: true });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-700">Mentorship & Coaching</h1>
      {mentors && mentors.length > 0 ? (
        <ul className="space-y-4">
          {mentors.map((mentor) => (
            <li key={mentor.id} className="p-4 bg-white rounded shadow">
              <Link href={`/mentorship/${mentor.id}`} className="block space-y-1">
                <h2 className="font-bold text-green-700 hover:underline">
                  {(mentor.profiles as any)?.display_name || 'Mentor'}
                </h2>
                <p className="text-sm text-gray-600">
                  Expertise: {mentor.expertise}
                </p>
                <p className="text-sm text-gray-600">{mentor.bio}</p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No mentors available at the moment.</p>
      )}
    </section>
  );
}