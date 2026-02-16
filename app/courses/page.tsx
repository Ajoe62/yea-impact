// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { createServer } from "@/utils/supabase/server";
import Link from "next/link";

export default async function CoursesPage() {
  const supabase = await createServer();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, name, description")
    .order("name", { ascending: true });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-700">
        Digital Skills Courses
      </h1>
      {courses && courses.length > 0 ? (
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <li key={course.id} className="p-4 bg-white rounded shadow">
              <h2 className="font-bold text-green-700">{course.name}</h2>
              <p className="text-sm text-gray-600 line-clamp-3">
                {course.description}
              </p>
              {/* When dynamic routes are implemented, link to `/courses/[id]` */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">No courses available at the moment.</p>
      )}
    </section>
  );
}
