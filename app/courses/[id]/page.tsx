import { notFound } from 'next/navigation';
import { createServer } from '@/utils/supabase/server';
import EnrollmentForm from './enroll-form';

interface CoursePageProps {
  params: { id: string };
}

/**
 * Course detail page. Fetches a single course and its modules from Supabase.
 */
export default async function CourseDetailPage({ params }: CoursePageProps) {
  const supabase = await createServer();
  // Fetch the course by ID
  const { data: course } = await supabase
    .from('courses')
    .select('id, name, description, difficulty, start_date')
    .eq('id', params.id)
    .single();

  if (!course) {
    return notFound();
  }

  // Fetch modules for the course
  const { data: modules } = await supabase
    .from('course_modules')
    .select('id, module_number, title, content_url')
    .eq('course_id', params.id)
    .order('module_number', { ascending: true });

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-green-700">{course.name}</h1>
        <p className="text-gray-700">{course.description}</p>
        <p className="text-sm text-gray-500">
          Difficulty: {course.difficulty} • Starts on: {course.start_date}
        </p>
      </header>
      <div>
        <h2 className="text-xl font-semibold text-green-600">Modules</h2>
        {modules && modules.length > 0 ? (
          <ol className="mt-2 space-y-2 list-decimal list-inside">
            {modules.map((m) => (
              <li key={m.id} className="p-3 bg-white rounded shadow">
                <h3 className="font-medium text-green-700">
                  Module {m.module_number}: {m.title}
                </h3>
                {m.content_url && (
                  <a
                    href={m.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    View content
                  </a>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-700">No modules yet.</p>
        )}
      </div>
      <div>
        <EnrollmentForm courseId={course.id} />
      </div>
    </section>
  );
}