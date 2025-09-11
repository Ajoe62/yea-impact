import { createServer } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import PageWrapper from "@/components/PageWrapper";

export default async function JobsPage() {
  const supabase = createServer();
  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      "id, title, company, description, deadline, location, job_type, salary_range, company_logo, skills, experience_level, remote"
    )
    .order("deadline", { ascending: true });

  // Group jobs by job type
  const jobsByType: Record<string, any[]> = {};

  jobs?.forEach((job) => {
    const type = job.job_type || "Other";

    if (!jobsByType[type]) {
      jobsByType[type] = [];
    }

    jobsByType[type].push(job);
  });

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  };

  return (
    <PageWrapper>
      <div className="space-y-16 pb-16">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-700 to-purple-700 text-white py-16 px-4 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container mx-auto relative z-10">
            <AnimatedSection animation="fadeIn">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl">
                Find Your Next Career Opportunity
              </h1>
              <p className="text-xl opacity-90 max-w-xl mb-8">
                Explore job openings from our partner companies and
                organizations committed to supporting young professionals
              </p>
            </AnimatedSection>

            <AnimatedSection animation="slideUp" delay={0.1}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="#opportunities"
                  className="px-6 py-3 bg-white text-purple-700 rounded-lg font-bold hover:shadow-lg transition-shadow"
                >
                  Browse Jobs
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors"
                >
                  Post a Job
                </Link>
              </div>
            </AnimatedSection>

            {/* Decorative elements */}
            <div className="hidden md:block absolute top-10 right-10 w-20 h-20 bg-white rounded-full opacity-20"></div>
            <div className="hidden md:block absolute bottom-10 right-40 w-12 h-12 bg-white rounded-full opacity-10"></div>
          </div>
        </section>

        {/* Job Filter Section */}
        <section className="container mx-auto px-4">
          <AnimatedSection animation="fadeIn">
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  ></path>
                </svg>
                <span className="font-medium text-gray-700">Filter By:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors">
                  All Jobs
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Full-time
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Internship
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Remote
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                  Entry Level
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Job Listings Section */}
        <section id="opportunities" className="container mx-auto px-4">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl font-bold text-center mb-12">
              Industry Opportunities
            </h2>
          </AnimatedSection>

          {jobs && jobs.length > 0 ? (
            <div className="space-y-16">
              {Object.entries(jobsByType).map(([type, typeJobs], typeIndex) => (
                <AnimatedSection
                  key={type}
                  animation="fadeIn"
                  delay={0.1 * typeIndex}
                >
                  <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                    <span className="w-1.5 h-5 bg-purple-600 rounded-full mr-2"></span>
                    {type} Positions
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {typeJobs.map((job, jobIndex) => {
                      const daysRemaining = getDaysRemaining(job.deadline);
                      return (
                        <AnimatedSection
                          key={job.id}
                          animation="fadeIn"
                          delay={0.05 * jobIndex}
                        >
                          <Link
                            href={`/jobs/${job.id}`}
                            className="block group"
                          >
                            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
                              <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-md relative overflow-hidden mr-3 flex-shrink-0">
                                      {job.company_logo ? (
                                        <Image
                                          src={job.company_logo}
                                          alt={job.company}
                                          fill
                                          className="object-contain p-1"
                                          sizes="48px"
                                        />
                                      ) : (
                                        <div className="flex items-center justify-center h-full bg-purple-100 text-purple-700 font-bold text-lg">
                                          {job.company?.charAt(0)}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <h3 className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                                        {job.title}
                                      </h3>
                                      <p className="text-sm text-gray-600">
                                        {job.company}
                                      </p>
                                    </div>
                                  </div>

                                  {daysRemaining > 0 && (
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        daysRemaining <= 3
                                          ? "bg-red-100 text-red-700"
                                          : "bg-green-100 text-green-700"
                                      }`}
                                    >
                                      {daysRemaining}{" "}
                                      {daysRemaining === 1 ? "day" : "days"}{" "}
                                      left
                                    </span>
                                  )}
                                </div>

                                <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                                  {job.description}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {job.skills &&
                                    job.skills
                                      .split(",")
                                      .map((skill: string, i: number) => (
                                        <span
                                          key={i}
                                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                                        >
                                          {skill.trim()}
                                        </span>
                                      ))}
                                </div>

                                <div className="border-t border-gray-100 pt-4 mt-auto">
                                  <div className="flex flex-wrap justify-between items-center text-sm text-gray-600">
                                    <div className="flex items-center mr-4 mb-2 sm:mb-0">
                                      <svg
                                        className="w-4 h-4 mr-1 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        ></path>
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        ></path>
                                      </svg>
                                      {job.location ||
                                        (job.remote ? "Remote" : "On-site")}
                                    </div>

                                    {job.salary_range && (
                                      <div className="flex items-center mb-2 sm:mb-0">
                                        <svg
                                          className="w-4 h-4 mr-1 text-gray-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                          ></path>
                                        </svg>
                                        {job.salary_range}
                                      </div>
                                    )}

                                    {job.experience_level && (
                                      <div className="flex items-center">
                                        <svg
                                          className="w-4 h-4 mr-1 text-gray-500"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                          ></path>
                                        </svg>
                                        {job.experience_level}
                                      </div>
                                    )}
                                  </div>

                                  <div className="mt-4 flex justify-between items-center">
                                    <p className="text-xs text-gray-500">
                                      Apply by{" "}
                                      {new Date(
                                        job.deadline
                                      ).toLocaleDateString()}
                                    </p>
                                    <span className="text-purple-600 text-sm font-medium group-hover:underline flex items-center">
                                      View Details
                                      <svg
                                        className="w-4 h-4 ml-1"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M9 5l7 7-7 7"
                                        ></path>
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </AnimatedSection>
                      );
                    })}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          ) : (
            <AnimatedSection animation="fadeIn">
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Job Openings
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6">
                  There are no job opportunities available at this time. Check
                  back soon or subscribe to be notified when new positions are
                  posted.
                </p>
                <Link
                  href="/contact"
                  className="inline-block px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Get Job Alerts
                </Link>
              </div>
            </AnimatedSection>
          )}
        </section>

        {/* Call to Action */}
        <section className="container mx-auto px-4">
          <AnimatedSection animation="fadeIn">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern
                      id="dots"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <circle cx="3" cy="3" r="1.5" fill="white" />
                    </pattern>
                  </defs>
                  <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#dots)" />
                </svg>
              </div>

              <div className="relative z-10 md:flex items-center justify-between">
                <div className="mb-6 md:mb-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">
                    Are you an employer?
                  </h2>
                  <p className="text-indigo-100 max-w-xl">
                    Post your job openings on our platform to reach motivated
                    young professionals ready to make an impact.
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:shadow-xl transition-shadow"
                >
                  Post a Job
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>

        {/* Resources Section */}
        <section className="container mx-auto px-4">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-2xl font-bold mb-8">Job Search Resources</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Resume Workshop</h3>
                <p className="text-gray-600 mb-4">
                  Get tips and templates for crafting a resume that stands out
                  to employers.
                </p>
                <Link
                  href="/resources/resume"
                  className="text-purple-600 font-medium hover:underline inline-flex items-center"
                >
                  Learn more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Interview Preparation
                </h3>
                <p className="text-gray-600 mb-4">
                  Practice common interview questions and learn strategies for
                  success.
                </p>
                <Link
                  href="/resources/interviews"
                  className="text-blue-600 font-medium hover:underline inline-flex items-center"
                >
                  Learn more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">
                  Networking Strategies
                </h3>
                <p className="text-gray-600 mb-4">
                  Learn how to build professional connections that can help
                  advance your career.
                </p>
                <Link
                  href="/resources/networking"
                  className="text-green-600 font-medium hover:underline inline-flex items-center"
                >
                  Learn more
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </PageWrapper>
  );
}
