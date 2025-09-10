import { notFound } from "next/navigation";
import { createServer } from "@/utils/supabase/server";
import EnrollmentForm from "./enroll-form";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";
import { Metadata } from "next";

// Metadata for the course detail page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServer();
  const { data: course } = await supabase
    .from("courses")
    .select("name")
    .eq("id", id)
    .single();

  return {
    title: course?.name
      ? `${course.name} | YEA Impact`
      : "Course Details | YEA Impact",
    description: "Learn new skills with our structured courses.",
  };
}

interface Course {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  start_date: string;
  duration_weeks?: number;
  image_url?: string;
  instructor_id?: string;
  category?: string;
  prerequisites?: string | string[];
  objectives?: string | string[];
  price?: number;
  price_currency?: string;
  featured?: boolean;
}

interface CourseModule {
  id: string;
  module_number: number;
  title: string;
  content_url?: string;
  description?: string;
  duration_minutes?: number;
}

interface Instructor {
  id: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  title?: string;
  expertise?: string;
}

/**
 * Course detail page. Fetches a single course and its modules from Supabase.
 * Displays detailed information about the course and allows enrollment.
 */
export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createServer();
  // Fetch the course by ID
  const { data: course } = (await supabase
    .from("courses")
    .select(
      "id, name, description, difficulty, start_date, duration_weeks, image_url, instructor_id, category, prerequisites, objectives, price, price_currency, featured"
    )
    .eq("id", id)
    .single()) as { data: Course | null };

  if (!course) {
    return notFound();
  }

  // Fetch modules for the course
  const { data: modules } = (await supabase
    .from("course_modules")
    .select(
      "id, module_number, title, content_url, description, duration_minutes"
    )
    .eq("course_id", id)
    .order("module_number", { ascending: true })) as {
    data: CourseModule[] | null;
  };

  // Fetch instructor information if available
  let instructor: Instructor | null = null;
  if (course.instructor_id) {
    const { data: instructorData } = (await supabase
      .from("profiles")
      .select("id, display_name, bio, avatar_url, title, expertise")
      .eq("id", course.instructor_id)
      .single()) as { data: Instructor | null };

    instructor = instructorData;
  }

  // Format date
  const startDate = course.start_date ? new Date(course.start_date) : null;
  const formattedDate = startDate?.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Parse prerequisites and objectives if they're stored as strings
  const prerequisites: string[] = course.prerequisites
    ? typeof course.prerequisites === "string"
      ? course.prerequisites.split("\n").filter(Boolean)
      : course.prerequisites
    : [];
  const objectives: string[] = course.objectives
    ? typeof course.objectives === "string"
      ? course.objectives.split("\n").filter(Boolean)
      : course.objectives
    : [];

  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-700 to-teal-800 text-white py-12 px-4 rounded-xl">
        <div className="container mx-auto">
          <AnimatedSection animation="fadeIn">
            <Link
              href="/courses"
              className="inline-flex items-center text-green-200 hover:text-white mb-4 transition-colors"
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
              Back to Courses
            </Link>

            <div className="flex flex-wrap items-start gap-6 md:flex-nowrap">
              {course.image_url ? (
                <div className="w-full md:w-64 h-48 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={course.image_url}
                    alt={course.name}
                    width={256}
                    height={192}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-full md:w-64 h-48 bg-white bg-opacity-20 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                  <svg
                    className="w-16 h-16 text-white opacity-50"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </div>
              )}

              <div className="flex-1">
                {course.category && (
                  <span className="text-sm font-medium px-2.5 py-0.5 rounded bg-green-900 bg-opacity-50 text-green-100 mb-2 inline-block">
                    {course.category}
                  </span>
                )}
                <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
                <p className="text-green-100 mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  {course.difficulty && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 opacity-75"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>Difficulty: {course.difficulty}</span>
                    </div>
                  )}

                  {formattedDate && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 opacity-75"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>Starts: {formattedDate}</span>
                    </div>
                  )}

                  {course.duration_weeks && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1 opacity-75"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>
                        Duration: {course.duration_weeks}{" "}
                        {course.duration_weeks === 1 ? "week" : "weeks"}
                      </span>
                    </div>
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
                {/* About This Course */}
                <div>
                  <h2 className="text-xl font-bold mb-4">About This Course</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p>{course.description}</p>
                  </div>
                </div>

                {/* Learning Objectives */}
                {objectives.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">
                      What You'll Learn
                    </h2>
                    <ul className="space-y-2 text-gray-700">
                      {objectives.map((item: string, index: number) => (
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

                {/* Prerequisites */}
                {prerequisites.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Prerequisites</h2>
                    <ul className="space-y-2 text-gray-700">
                      {prerequisites.map((item: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <svg
                            className="w-5 h-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Course Modules */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Course Content</h2>
                  {modules && modules.length > 0 ? (
                    <div className="space-y-4">
                      {modules.map((m) => (
                        <div
                          key={m.id}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">
                                Module {m.module_number}: {m.title}
                              </h3>
                              {m.duration_minutes && (
                                <span className="text-sm text-gray-500 flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  {m.duration_minutes} min
                                </span>
                              )}
                            </div>
                          </div>

                          {m.description && (
                            <div className="p-4 border-t border-gray-200">
                              <p className="text-sm text-gray-600">
                                {m.description}
                              </p>

                              {m.content_url && (
                                <a
                                  href={m.content_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-2 inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
                                >
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                  </svg>
                                  View Content
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      Course content is being prepared and will be available
                      soon.
                    </p>
                  )}
                </div>

                {/* Instructor Information */}
                {instructor && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Instructor</h2>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {instructor.avatar_url ? (
                          <Image
                            src={instructor.avatar_url}
                            alt={instructor.display_name}
                            width={64}
                            height={64}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-xl font-bold text-green-700">
                            {instructor.display_name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {instructor.display_name}
                        </h3>
                        {instructor.title && (
                          <p className="text-sm text-gray-600">
                            {instructor.title}
                          </p>
                        )}
                        {instructor.bio && (
                          <p className="mt-1 text-gray-700 text-sm">
                            {instructor.bio}
                          </p>
                        )}
                        {instructor.expertise && (
                          <p className="mt-2 text-xs text-gray-500">
                            Expertise: {instructor.expertise}
                          </p>
                        )}
                      </div>
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
                    Enroll in this Course
                  </h2>

                  {course.price !== null && course.price !== undefined ? (
                    <div className="mb-6 flex items-center">
                      <span className="text-2xl font-bold text-gray-900">
                        {course.price === 0
                          ? "Free"
                          : `${
                              course.price_currency || "$"
                            }${course.price.toFixed(2)}`}
                      </span>
                      {course.price > 0 && (
                        <span className="ml-2 text-sm text-gray-500">
                          One-time payment
                        </span>
                      )}
                    </div>
                  ) : null}

                  <EnrollmentForm courseId={course.id} />
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-medium mb-3">This course includes:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center text-sm text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {course.duration_weeks
                        ? `${course.duration_weeks} weeks of structured learning`
                        : "Structured learning path"}
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      {modules?.length || 0} learning modules
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
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
                      Completion certificate
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      Access to video lessons
                    </li>
                    <li className="flex items-center text-sm text-gray-700">
                      <svg
                        className="w-5 h-5 mr-2 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                        <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                      </svg>
                      Community support
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <h3 className="font-medium mb-3">Share this course</h3>
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
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Related Courses */}
      <section className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-2xl font-bold mb-6">Related Courses</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i: number) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 p-6 group cursor-pointer"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center mr-3 text-green-700 font-bold">
                    YI
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                      Related Course
                    </h3>
                    <p className="text-sm text-gray-600">YEA Impact</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Check back soon for more courses that match your interests and
                  learning path!
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Coming Soon</span>
                  <span>Self-paced</span>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
