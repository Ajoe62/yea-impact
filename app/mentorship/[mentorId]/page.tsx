import { notFound } from "next/navigation";
import { createServer } from "@/utils/supabase/server";
import Image from "next/image";
import Link from "next/link";
import RequestForm from "./request-form";

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
  const supabase = createServer();
  const { data: mentor } = await supabase
    .from("mentors")
    .select(
      "id, bio, expertise, years_experience, education, achievements, available_hours, profile_image, social_links, area, location, languages, profiles:profiles(display_name)"
    )
    .eq("id", params.mentorId)
    .single();

  if (!mentor) {
    return notFound();
  }

  // Sample upcoming sessions - in a real app, these would be fetched from a database
  const upcomingSessions = [
    {
      id: 1,
      title: "Introduction to Web Development",
      date: "2025-09-15T14:00:00",
      duration: "60 minutes",
      spots: 5,
      description:
        "Learn the basics of HTML, CSS, and JavaScript in this introductory session.",
    },
    {
      id: 2,
      title: "Career Path Guidance",
      date: "2025-09-20T10:00:00",
      duration: "45 minutes",
      spots: 3,
      description:
        "Personal guidance on navigating tech career options and opportunities.",
    },
  ];

  const socialLinks = mentor.social_links || {};
  // Fix the profiles access - it's an array with one item
  const profileData = Array.isArray(mentor.profiles)
    ? mentor.profiles[0]
    : mentor.profiles;
  const displayName = profileData?.display_name || "Mentor";

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex justify-start mb-6">
        <Link
          href="/mentorship"
          className="text-green-700 hover:text-green-800 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Mentors
        </Link>
      </div>

      {/* Mentor Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/3 h-64 md:h-auto relative">
            {mentor.profile_image ? (
              <Image
                src={mentor.profile_image}
                alt={displayName}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                <span className="text-6xl text-gray-400">
                  {displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div className="p-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {displayName}
                </h1>
                <p className="text-xl font-medium text-green-700 mb-2">
                  {mentor.expertise}
                </p>
                <p className="text-gray-600 mb-4">
                  {mentor.location || "Remote"}
                </p>
              </div>
              <div className="flex space-x-2">
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                    </svg>
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex flex-wrap gap-3">
                {mentor.years_experience && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {mentor.years_experience}+ years experience
                  </span>
                )}
                {mentor.languages &&
                  mentor.languages.map((language: string) => (
                    <span
                      key={language}
                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                {mentor.area && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    {mentor.area}
                  </span>
                )}
              </div>

              <div className="flex items-center text-gray-600 text-sm">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  Available: {mentor.available_hours || "By appointment"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Column - Mentor Details */}
        <div className="md:col-span-2 space-y-8">
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              About {displayName}
            </h2>
            <div className="text-gray-700 space-y-4">
              <p>{mentor.bio}</p>
            </div>
          </section>

          {mentor.education && (
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Education & Background
              </h2>
              <div className="text-gray-700">
                <p>{mentor.education}</p>
              </div>
            </section>
          )}

          {mentor.achievements && (
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Achievements
              </h2>
              <div className="text-gray-700">
                <p>{mentor.achievements}</p>
              </div>
            </section>
          )}

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Upcoming Group Sessions
            </h2>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-4">
                {upcomingSessions.map((session) => (
                  <div
                    key={session.id}
                    className="border rounded-lg p-4 hover:border-green-500 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-green-700">
                        {session.title}
                      </h3>
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                        {session.spots} spots left
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 my-2">
                      {new Date(session.date).toLocaleString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      • {session.duration}
                    </p>
                    <p className="text-sm text-gray-600">
                      {session.description}
                    </p>
                    <button className="mt-3 px-4 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded">
                      Reserve Spot
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                No upcoming sessions scheduled. Request a private mentorship
                session instead.
              </p>
            )}
          </section>
        </div>

        {/* Right Column - Request Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow sticky top-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Request Mentorship
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Fill out the form below to connect with{" "}
                {displayName.split(" ")[0]}.
              </p>
            </div>
            <RequestForm mentorId={mentor.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
