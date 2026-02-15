import { createServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, redirect to login
  if (!user) {
    redirect("/login");
  }

  // Fetch user's enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, course_id, courses(name)")
    .eq("user_id", user.id);

  // Fetch user's event registrations
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("id, event_id, events(title, event_date)")
    .eq("user_id", user.id);

  // Fetch user's job applications
  const { data: applications } = await supabase
    .from("applications")
    .select("id, job_id, status, jobs(title, company)")
    .eq("applicant_id", user.id);

  // Fetch user's mentorship requests
  const { data: mentorRequests } = await supabase
    .from("mentor_requests")
    .select("id, mentor_id, status, mentors(profiles(display_name))")
    .eq("mentee_id", user.id);

  return (
    <div className="space-y-8 py-8">
      {/* User Profile Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-4 border-white/30">
            {user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">Welcome back!</h1>
            <p className="text-blue-100 mt-1">{user.email}</p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">
            {enrollments?.length || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Course Enrollments</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">
            {registrations?.length || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Event Registrations</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">
            {applications?.length || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Job Applications</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="text-3xl font-bold text-blue-600">
            {mentorRequests?.length || 0}
          </div>
          <div className="text-sm text-gray-600 mt-1">Mentorship Requests</div>
        </div>
      </section>

      {/* My Courses */}
      <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Courses</h2>
        {enrollments && enrollments.length > 0 ? (
          <div className="space-y-3">
            {enrollments.map((enrollment: any) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {enrollment.courses?.name || "Course"}
                  </h3>
                  <p className="text-sm text-gray-600">Enrolled</p>
                </div>
                <Link
                  href={`/courses/${enrollment.course_id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Course
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven&apos;t enrolled in any courses yet.</p>
            <Link
              href="/courses"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        )}
      </section>

      {/* My Events */}
      <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">My Events</h2>
        {registrations && registrations.length > 0 ? (
          <div className="space-y-3">
            {registrations.map((registration: any) => (
              <div
                key={registration.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {registration.events?.title || "Event"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {registration.events?.event_date
                      ? new Date(
                          registration.events.event_date
                        ).toLocaleDateString()
                      : "Date TBA"}
                  </p>
                </div>
                <Link
                  href={`/events/${registration.event_id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Event
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven&apos;t registered for any events yet.</p>
            <Link
              href="/events"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Events
            </Link>
          </div>
        )}
      </section>

      {/* My Applications */}
      <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          My Job Applications
        </h2>
        {applications && applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((application: any) => (
              <div
                key={application.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {application.jobs?.title || "Job"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {application.jobs?.company || "Company"} •{" "}
                    <span
                      className={`font-medium ${
                        application.status === "pending"
                          ? "text-yellow-600"
                          : application.status === "accepted"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {application.status || "Pending"}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/jobs/${application.job_id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Job
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven&apos;t applied to any jobs yet.</p>
            <Link
              href="/jobs"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        )}
      </section>

      {/* My Mentorship Requests */}
      <section className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          My Mentorship Requests
        </h2>
        {mentorRequests && mentorRequests.length > 0 ? (
          <div className="space-y-3">
            {mentorRequests.map((request: any) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {request.mentors?.profiles?.display_name || "Mentor"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        request.status === "pending"
                          ? "text-yellow-600"
                          : request.status === "accepted"
                          ? "text-green-600"
                          : "text-gray-600"
                      }`}
                    >
                      {request.status || "Pending"}
                    </span>
                  </p>
                </div>
                <Link
                  href={`/mentorship/${request.mentor_id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  View Mentor
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven&apos;t requested any mentorship yet.</p>
            <Link
              href="/mentorship"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Find a Mentor
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
