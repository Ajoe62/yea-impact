import { createServer } from '@/utils/supabase/server';

export default async function JobsPage() {
  const supabase = await createServer();
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title, company, description, deadline')
    .order('deadline', { ascending: true });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-700">Industry Opportunities</h1>
      {jobs && jobs.length > 0 ? (
        <ul className="space-y-4">
          {jobs.map((job) => (
            <li key={job.id} className="p-4 bg-white rounded shadow">
              <h2 className="font-bold text-green-700">{job.title}</h2>
              <p className="text-sm text-gray-600">Company: {job.company}</p>
              <p className="text-sm text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-600">
                Application deadline: {new Date(job.deadline).toLocaleDateString()}
              </p>
              {/* Add apply button here */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No opportunities available at this time.</p>
      )}
    </section>
  );
}