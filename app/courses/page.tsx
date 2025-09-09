import { createServer } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";

interface Course {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  category?: string;
  difficulty?: string;
  duration_weeks?: number;
  price?: number;
  price_currency?: string;
  instructor_id?: string;
  start_date?: string;
  featured?: boolean;
}

export default async function CoursesPage() {
  const supabase = createServer();
  const { data: courses } = (await supabase
    .from("courses")
    .select(
      "id, name, description, image_url, category, difficulty, duration_weeks, price, price_currency, instructor_id, start_date, featured"
    )
    .order("featured", { ascending: false })
    .order("name", { ascending: true })) as { data: Course[] | null };

  // Get instructors for the courses
  const instructorIds =
    courses?.filter((c) => c.instructor_id).map((c) => c.instructor_id) || [];

  let instructors: Record<
    string,
    { display_name: string; avatar_url?: string }
  > = {};

  if (instructorIds.length > 0) {
    const { data: instructorsData } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", instructorIds as string[]);

    if (instructorsData) {
      instructorsData.forEach((instructor) => {
        instructors[instructor.id] = {
          display_name: instructor.display_name,
          avatar_url: instructor.avatar_url,
        };
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatedSection animation="fadeIn">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Digital Skills Courses
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enhance your digital skills with our professionally designed
            courses. From beginner to advanced, we offer learning paths to help
            you achieve your goals.
          </p>
        </div>
      </AnimatedSection>

      {/* Featured courses section */}
      {courses?.some((course) => course.featured) && (
        <section className="mb-16">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-2xl font-bold text-green-700 mb-6">
              Featured Courses
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {courses
                .filter((course) => course.featured)
                .map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.id}`}
                    className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col md:flex-row h-full"
                  >
                    <div className="md:w-2/5 bg-green-50 relative">
                      {course.image_url ? (
                        <Image
                          src={course.image_url}
                          alt={course.name}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-50 p-6">
                          <svg
                            className="w-16 h-16 text-green-500 opacity-75"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                          </svg>
                        </div>
                      )}
                      {course.category && (
                        <span className="absolute top-2 left-2 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded">
                          {course.category}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 group-hover:text-green-700 transition-colors mb-2">
                          {course.name}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {course.description}
                        </p>
                      </div>
                      <div className="mt-4 flex flex-wrap items-center justify-between">
                        <div className="flex items-center mb-2 md:mb-0">
                          {course.instructor_id &&
                          instructors[course.instructor_id] ? (
                            <>
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-green-100 flex items-center justify-center">
                                {instructors[course.instructor_id]
                                  .avatar_url ? (
                                  <Image
                                    src={
                                      instructors[course.instructor_id]
                                        .avatar_url as string
                                    }
                                    alt={
                                      instructors[course.instructor_id]
                                        .display_name
                                    }
                                    width={32}
                                    height={32}
                                    className="object-cover"
                                  />
                                ) : (
                                  <span className="font-bold text-green-700">
                                    {instructors[
                                      course.instructor_id
                                    ].display_name.charAt(0)}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-gray-600">
                                {instructors[course.instructor_id].display_name}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-600">
                              YEA Impact
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-green-700">
                          {course.price === 0
                            ? "Free"
                            : course.price
                            ? `${course.price_currency || "$"}${course.price}`
                            : "Enroll Now"}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </AnimatedSection>
        </section>
      )}

      {/* All courses section */}
      <section>
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <h2 className="text-2xl font-bold text-green-700 mb-6">
            All Courses
          </h2>
          {courses && courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col h-full"
                >
                  <div className="h-40 bg-green-50 relative">
                    {course.image_url ? (
                      <Image
                        src={course.image_url}
                        alt={course.name}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-teal-50">
                        <svg
                          className="w-12 h-12 text-green-500 opacity-75"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                      </div>
                    )}
                    {course.category && (
                      <span className="absolute top-2 left-2 bg-green-700 text-white text-xs font-bold px-2 py-1 rounded">
                        {course.category}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h2 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors mb-2">
                        {course.name}
                      </h2>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          {course.difficulty && (
                            <span className="mr-3 flex items-center">
                              <svg
                                className="w-4 h-4 mr-1 text-gray-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {course.difficulty}
                            </span>
                          )}
                          {course.duration_weeks && (
                            <span className="flex items-center">
                              <svg
                                className="w-4 h-4 mr-1 text-gray-400"
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
                              {course.duration_weeks}{" "}
                              {course.duration_weeks === 1 ? "week" : "weeks"}
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-medium text-green-700">
                          {course.price === 0
                            ? "Free"
                            : course.price
                            ? `${course.price_currency || "$"}${course.price}`
                            : "View"}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-100">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              <p className="text-gray-500 text-lg">
                No courses available at the moment.
              </p>
              <p className="text-gray-400 mt-2">
                Check back soon for new learning opportunities.
              </p>
            </div>
          )}
        </AnimatedSection>
      </section>

      {/* Call to action */}
      <section className="mt-16">
        <AnimatedSection animation="fadeIn" delay={0.4}>
          <div className="bg-gradient-to-r from-green-700 to-teal-700 rounded-xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to enhance your skills?
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Join our community of learners and take the first step toward
              mastering new digital skills. Our courses are designed to help you
              succeed in today's digital economy.
            </p>
            <Link
              href="/login"
              className="inline-block bg-white text-green-700 font-bold py-2 px-6 rounded-lg hover:bg-green-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
