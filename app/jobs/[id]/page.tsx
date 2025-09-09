import { notFound } from "next/navigation";
import { createServer } from "@/utils/supabase/server";
import ApplicationForm from "./apply-form";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";

// Define the types for component props
interface AnimatedSectionProps {
  animation: "fadeIn" | "fadeUp" | "slideLeft" | "slideRight";
  delay?: number;
  children: React.ReactNode;
}

interface JobPageProps {
  params: { id: string };
}

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  deadline?: string;
  posted_by?: string;
  location?: string;
  job_type?: string;
  salary_range?: string;
  company_logo?: string;
  skills?: string | string[];
  experience_level?: string;
  remote?: boolean;
  requirements?: string | string[];
  responsibilities?: string | string[];
  benefits?: string | string[];
  company_description?: string;
}

/**
 * Job detail page. Shows information about a job opportunity and includes
 * an application form. The application is stored in the `applications` table
 * with a unique constraint on (job_id, applicant_id).
 */
export default async function JobDetailPage({ params }: JobPageProps) {
  const supabase = createServer();
  const { data: job } = (await supabase
    .from("jobs")
    .select(
      "id, title, company, description, deadline, posted_by, location, job_type, salary_range, company_logo, skills, experience_level, remote, requirements, responsibilities, benefits, company_description"
    )
    .eq("id", params.id)
    .single()) as { data: Job | null };

  if (!job) {
    return notFound();
  }

  // Calculate days remaining until deadline
  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    return daysDiff;
  };

  const daysRemaining = job.deadline ? getDaysRemaining(job.deadline) : null;

  // Split skills into array if it's a string
  const skills: string[] = job.skills
    ? typeof job.skills === "string"
      ? job.skills.split(",").map((s: string) => s.trim())
      : job.skills
    : [];

  // Split requirements into array if it's a string
  const requirements: string[] = job.requirements
    ? typeof job.requirements === "string"
      ? job.requirements.split("\n").filter(Boolean)
      : job.requirements
    : [];

  // Split responsibilities into array if it's a string
  const responsibilities: string[] = job.responsibilities
    ? typeof job.responsibilities === "string"
      ? job.responsibilities.split("\n").filter(Boolean)
      : job.responsibilities
    : [];

  // Split benefits into array if it's a string
  const benefits: string[] = job.benefits
    ? typeof job.benefits === "string"
      ? job.benefits.split("\n").filter(Boolean)
      : job.benefits
    : [];

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white py-12 px-4 rounded-xl">
        <div className="container mx-auto">
          <AnimatedSection animation="fadeIn">
            <Link
              href="/jobs"
              className="inline-flex items-center text-purple-200 hover:text-white mb-4 transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Back to Jobs
            </Link>

            <div className="flex flex-wrap items-start gap-6">
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                {job.company_logo ? (
                  <Image
                    src={job.company_logo}
                    alt={job.company}
                    width={64}
                    height={64}
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="text-2xl font-bold text-purple-700">
                    {job.company?.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="font-medium">{job.company}</span>
                  <span className="w-1 h-1 rounded-full bg-purple-300"></span>
                  <span>
                    {job.location || (job.remote ? "Remote" : "On-site")}
                  </span>
                  {job.job_type && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-purple-300"></span>
                      <span>{job.job_type}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection animation="fadeIn">
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-8">
                {/* Key Details Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Job Type</p>
                    <p className="font-medium text-gray-900">
                      {job.job_type || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Experience</p>
                    <p className="font-medium text-gray-900">
                      {job.experience_level || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="font-medium text-gray-900">
                      {job.location || (job.remote ? "Remote" : "On-site")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Deadline</p>
                    <p className="font-medium text-gray-900">
                      {job.deadline
                        ? new Date(job.deadline).toLocaleDateString()
                        : "Open until filled"}
                    </p>
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Job Description</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p>{job.description}</p>
                  </div>
                </div>

                {/* Key Skills */}
                {skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Key Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsibilities */}
                {responsibilities.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Responsibilities</h2>
                    <ul className="space-y-2 text-gray-700">
                      {responsibilities.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Requirements */}
                {requirements.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Requirements</h2>
                    <ul className="space-y-2 text-gray-700">
                      {requirements.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-purple-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {benefits.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Benefits</h2>
                    <ul className="space-y-2 text-gray-700">
                      {benefits.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* About Company */}
                {job.company_description && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      About {job.company}
                    </h2>
                    <div className="prose max-w-none text-gray-700">
                      <p>{job.company_description}</p>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            <AnimatedSection animation="slideLeft" delay={0.2}>
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    Apply for this position
                  </h2>
                  {daysRemaining !== null && (
                    <div
                      className={`mb-6 p-3 rounded-lg ${
                        daysRemaining <= 3
                          ? "bg-red-50 text-red-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      <div className="flex items-center">
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
                        <span className="font-medium">
                          {daysRemaining > 0 ? (
                            <>
                              {daysRemaining}{" "}
                              {daysRemaining === 1 ? "day" : "days"} left to
                              apply
                            </>
                          ) : (
                            "Application deadline has passed"
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  <ApplicationForm jobId={job.id} />
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-medium mb-3">Share this job</h3>
                  <div className="flex space-x-4">
                    <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-100 text-blue-400 rounded-full hover:bg-blue-400 hover:text-white transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-700 hover:text-white transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-600 hover:text-white transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {job.salary_range && (
                  <div className="pt-6 border-t border-gray-100">
                    <h3 className="font-medium mb-3">Compensation</h3>
                    <div className="flex items-center text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"></path>
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                      <span className="font-medium">{job.salary_range}</span>
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Similar Jobs */}
      <section className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-2xl font-bold mb-6">Similar Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i: number) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-6 group cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center mr-3 text-purple-700 font-bold">
                    YI
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                      Related Position
                    </h3>
                    <p className="text-sm text-gray-600">YEA Impact</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Check back soon for more job opportunities that match your
                  skills and interests!
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Coming Soon</span>
                  <span>Full-time</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
