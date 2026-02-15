import { notFound } from 'next/navigation';
import { createServer } from '@/utils/supabase/server';
import ApplicationForm from './apply-form';

interface JobPageProps {
  params: { id: string };
}

/**
 * Job detail page. Shows information about a job opportunity and includes
 * an application form. The application is stored in the `applications` table
 * with a unique constraint on (job_id, applicant_id).
 */
export default async function JobDetailPage({ params }: JobPageProps) {
  const supabase = await createServer();
  const { data: job } = await supabase
    .from('jobs')
    .select('id, title, company, description, deadline, posted_by')
    .eq('id', params.id)
    .single();
  if (!job) {
    return notFound();
  }
  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-green-700">{job.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{job.company}</p>
        <p className="mt-2 text-gray-700">{job.description}</p>
        <p className="mt-1 text-sm text-gray-500">
          Deadline: {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}
        </p>
      </header>
      <ApplicationForm jobId={job.id} />
    </section>
  );
}