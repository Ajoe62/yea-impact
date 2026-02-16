// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { createServer } from "@/utils/supabase/server";

/**
 * Programs page. Fetches program list from Supabase on the server.
 */
export default async function ProgramsPage() {
  // Fetch programs from the database.  When environment variables are configured
  // this will query the `programs` table and return published programs.
  const supabase = await createServer();
  const { data: programs } = await supabase
    .from("programs")
    .select("id, slug, name, description")
    .order("name", { ascending: true });

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-green-700">
        Programs & Areas of Impact
      </h1>
      {programs && programs.length > 0 ? (
        <ul className="space-y-4">
          {programs.map((p) => (
            <li key={p.id} className="p-4 bg-white rounded shadow">
              <h2 className="text-lg font-bold text-green-700">{p.name}</h2>
              <p className="text-gray-700">{p.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">
          No programs found. Please check back later.
        </p>
      )}
    </section>
  );
}
