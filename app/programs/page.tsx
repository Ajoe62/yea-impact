// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { createServer } from "@/utils/supabase/server";

interface ProgramRow {
  id: string;
  slug: string | null;
  name: string;
  description: string | null;
  category: string | null;
  is_active: boolean | null;
}

export default async function ProgramsPage() {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("programs")
    .select("id, slug, name, description, category, is_active")
    .order("name", { ascending: true });

  const programs: ProgramRow[] = data ?? [];

  return (
    <section className="space-y-8" aria-labelledby="programs-heading">
      <header className="space-y-3">
        <h1 id="programs-heading" className="text-3xl font-bold text-green-700">
          Our Programs
        </h1>
        <p className="max-w-3xl text-gray-700">
          Explore the initiatives designed to build skills, create opportunities,
          and accelerate youth impact across Africa.
        </p>
      </header>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
        >
          We could not load programs right now. Please try again later.
        </div>
      ) : programs.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-gray-700">
          No programs are available at the moment. Please check back soon.
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <li
              key={program.id}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                {program.category ? (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-800">
                    {program.category}
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gray-700">
                    Program
                  </span>
                )}
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    program.is_active === false
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {program.is_active === false ? "Upcoming" : "Open"}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-gray-900">{program.name}</h2>
              <p className="mt-2 text-sm text-gray-600">
                {program.description?.trim() ||
                  "Program details will be published soon."}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
