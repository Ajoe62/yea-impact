// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import { createServer } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import PageWrapper from "@/components/PageWrapper";

// Define program categories
const programCategories = [
  {
    id: "skills",
    name: "Skills Development",
    description:
      "Equipping African youth with in-demand technical and soft skills for the modern workforce.",
    icon: "/images/icons/skills.svg",
    color: "bg-blue-500",
  },
  {
    id: "entrepreneurship",
    name: "Entrepreneurship",
    description:
      "Supporting young entrepreneurs with resources, mentorship, and funding opportunities.",
    icon: "/images/icons/entrepreneurship.svg",
    color: "bg-green-500",
  },
  {
    id: "leadership",
    name: "Leadership",
    description:
      "Developing the next generation of African leaders through comprehensive training and practical experience.",
    icon: "/images/icons/leadership.svg",
    color: "bg-yellow-500",
  },
  {
    id: "community",
    name: "Community Impact",
    description:
      "Fostering community development through youth-led initiatives and social projects.",
    icon: "/images/icons/community.svg",
    color: "bg-purple-500",
  },
];

/**
 * Programs page. Fetches program list from Supabase on the server.
 */
export default async function ProgramsPage() {
  // Fetch programs from the database.  When environment variables are configured
  // this will query the `programs` table and return published programs.
  const supabase = createServer();
  const { data: programs } = await supabase
    .from("programs")
    .select(
      "id, slug, name, description, category, image_url, duration, start_date"
    )
    .order("name", { ascending: true });

  // Group programs by category
  const programsByCategory: Record<string, any[]> = {};
  programs?.forEach((program) => {
    const category = program.category || "other";
    if (!programsByCategory[category]) {
      programsByCategory[category] = [];
    }
    programsByCategory[category].push(program);
  });

  return (
    <PageWrapper>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-700 to-green-900 -mx-4 px-4 py-16 text-white rounded-b-3xl">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Programs
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-8">
              YEA Foundation offers a variety of programs designed to empower
              African youth through skills development, entrepreneurship,
              leadership training, and community impact initiatives.
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="#programs"
                className="px-6 py-3 bg-white text-green-700 rounded-md font-semibold hover:bg-gray-100 transition"
              >
                Explore Programs
              </a>
              <Link
                href="/events"
                className="px-6 py-3 bg-transparent border border-white rounded-md font-semibold hover:bg-white hover:text-green-700 transition"
              >
                Upcoming Events
              </Link>
            </div>
          </div>
        </section>

        {/* Program Categories */}
        <section className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Our Focus Areas
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {programCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <div className="text-white text-2xl font-bold">
                    {category.name.charAt(0)}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Program Listings */}
        <section id="programs" className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Available Programs
          </h2>
          {programs && programs.length > 0 ? (
            <div className="space-y-12">
              {Object.keys(programsByCategory).map((category) => (
                <div key={category} className="space-y-6">
                  <h3 className="text-2xl font-semibold text-green-700 capitalize">
                    {category}
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {programsByCategory[category].map((program) => (
                      <div
                        key={program.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
                      >
                        <div className="h-48 bg-gray-200 relative">
                          {program.image_url ? (
                            <Image
                              src={program.image_url}
                              alt={program.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-green-700 font-semibold">
                              {program.name}
                            </div>
                          )}
                          {program.start_date && (
                            <div className="absolute top-4 right-4 bg-green-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              {new Date(program.start_date).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" }
                              )}
                            </div>
                          )}
                        </div>
                        <div className="p-6 space-y-4">
                          <h4 className="text-xl font-bold text-green-700">
                            {program.name}
                          </h4>
                          {program.duration && (
                            <p className="text-sm text-gray-500 flex items-center">
                              <span className="mr-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                              </span>
                              Duration: {program.duration}
                            </p>
                          )}
                          <p className="text-gray-600 line-clamp-3">
                            {program.description}
                          </p>
                          <Link
                            href={`/programs/${program.slug || program.id}`}
                            className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-md font-medium hover:bg-green-200 transition-colors"
                          >
                            Learn More
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700">
                Programs Coming Soon
              </h3>
              <p className="text-gray-600 mt-2 max-w-md mx-auto">
                We're currently developing our program offerings. Please check
                back later or sign up for our newsletter to be notified when new
                programs are available.
              </p>
              <Link
                href="/contact"
                className="mt-6 inline-block px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors"
              >
                Join Our Mailing List
              </Link>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="bg-gray-50 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            We're constantly developing new programs to meet the needs of
            African youth. Contact us to discuss custom programs or to suggest
            new offerings.
          </p>
          <Link
            href="/contact"
            className="px-6 py-3 bg-green-700 text-white rounded-md font-semibold hover:bg-green-800 transition-colors"
          >
            Contact Us
          </Link>
        </section>
      </div>
    </PageWrapper>
  );
}
