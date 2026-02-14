// AGENTS.md: Follow repository contribution/security standards in /AGENTS.md.
import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AnimatedSection from "@/components/AnimatedSection";
import PageWrapper from "@/components/PageWrapper";
import ResponsiveGrid, { ResponsiveContainer, ResponsiveSection, ResponsiveCard } from "@/components/ui/ResponsiveGrid";

export default function Home() {
  return (
    <PageWrapper>
      <div className="space-y-16 md:space-y-20">
        {/* Hero Section - Mobile Optimized */}
        <section className="relative bg-gradient-to-r from-green-600 to-blue-600 -mx-4 px-4 py-12 sm:py-16 md:py-24 text-white rounded-b-3xl overflow-hidden">
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
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
          <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
            <AnimatedSection animation="slideLeft" delay={0.1}>
              <div className="space-y-4 md:space-y-6 max-w-xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                  Empowering African Youth for a Brighter Future
                </h1>
                <p className="text-base sm:text-lg opacity-90">
                  Youth Empowerment Africa (YEA) is dedicated to empowering young
                  Africans through advocacy, mindset reorientation, and skills
                  development. Join us in our mission to impact 20 million youths
                  across Africa.
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4">
                  <Link
                    href="/programs"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-white text-blue-600 rounded-md font-semibold hover:bg-blue-50 transition shadow-sm"
                  >
                    Our Programs
                  </Link>
                  <Link
                    href="/courses"
                    className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-transparent border border-white rounded-md font-semibold hover:bg-white hover:text-blue-600 transition"
                  >
                    Explore Courses
                  </Link>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fadeIn" delay={0.2}>
              <div className="hidden md:block relative h-80 lg:h-96">
                <HeroSlider />
              </div>
              {/* Mobile-only smaller slider */}
              <div className="md:hidden relative h-48 mt-6">
                <HeroSlider />
              </div>
            </AnimatedSection>
          </div>
        {/* Wave pattern at bottom of hero section */}
        <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="absolute bottom-0 w-full h-16 text-white"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0Z"
              className="fill-white"
            ></path>
          </svg>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="container mx-auto py-10">
        <AnimatedSection animation="fadeIn" delay={0.1}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Impact
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedSection animation="slideUp" delay={0.1}>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">20M+</div>
              <div className="text-gray-600">Youth Target</div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.15}>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10+</div>
              <div className="text-gray-600">African Countries</div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.2}>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Programs Completed</div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.25}>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">5K+</div>
              <div className="text-gray-600">Skills Trained</div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="container mx-auto py-10 bg-gray-50 rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <h2 className="text-3xl font-bold text-gray-800">
              Featured Programs
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="slideRight" delay={0.2}>
            <Link
              href="/programs"
              className="text-green-700 hover:underline font-semibold"
            >
              View All Programs →
            </Link>
          </AnimatedSection>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Program Card 1 */}
          <AnimatedSection animation="slideUp" delay={0.3}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-green-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-green-700">
                  Program Image
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-xl">
                  Digital Skills Academy
                </h3>
                <p className="text-gray-600 text-sm">
                  Learn in-demand tech skills from industry experts and get
                  certified.
                </p>
                <Link
                  href="/programs/digital-skills"
                  className="text-green-700 hover:underline block text-sm font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </AnimatedSection>
          {/* Program Card 2 */}
          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-green-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-green-700">
                  Program Image
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-xl">Entrepreneurship Hub</h3>
                <p className="text-gray-600 text-sm">
                  Develop business acumen and turn your ideas into successful
                  ventures.
                </p>
                <Link
                  href="/programs/entrepreneurship"
                  className="text-green-700 hover:underline block text-sm font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </AnimatedSection>
          {/* Program Card 3 */}
          <AnimatedSection animation="slideUp" delay={0.5}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-green-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-green-700">
                  Program Image
                </div>
              </div>
              <div className="p-5 space-y-3">
                <h3 className="font-semibold text-xl">
                  Leadership Development
                </h3>
                <p className="text-gray-600 text-sm">
                  Cultivate essential leadership skills to drive change in your
                  community.
                </p>
                <Link
                  href="/programs/leadership"
                  className="text-green-700 hover:underline block text-sm font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto py-10">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            What Our Participants Say
          </h2>
        </AnimatedSection>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <AnimatedSection animation="slideUp" delay={0.3}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Adebayo Johnson</h4>
                  <p className="text-sm text-gray-500">
                    Digital Skills Graduate
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The web development course changed my life. I'm now working
                remotely for a tech company in Europe while living in Lagos."
              </p>
            </div>
          </AnimatedSection>
          {/* Testimonial 2 */}
          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Fatima Ahmed</h4>
                  <p className="text-sm text-gray-500">
                    Entrepreneurship Mentee
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The mentorship I received helped me secure funding for my
                startup. YEA Foundation truly invests in young African
                entrepreneurs."
              </p>
            </div>
          </AnimatedSection>
          {/* Testimonial 3 */}
          <AnimatedSection animation="slideUp" delay={0.5}>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold">Daniel Okafor</h4>
                  <p className="text-sm text-gray-500">
                    Leadership Program Alumnus
                  </p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The leadership program gave me the confidence and skills to
                make a difference in my community. I'm now leading a youth
                development initiative."
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Partners Section */}
      <section className="container mx-auto py-10 bg-gray-50 rounded-xl p-8">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Partners
          </h2>
        </AnimatedSection>
        <div className="flex flex-wrap justify-center gap-10 items-center opacity-80">
          <AnimatedSection animation="scale" delay={0.1}>
            <div className="w-32 h-24 bg-white flex items-center justify-center rounded shadow-sm hover:shadow-md transition-all duration-300">
              <span className="text-gray-400 font-semibold">Partner 1</span>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="scale" delay={0.2}>
            <div className="w-32 h-24 bg-white flex items-center justify-center rounded shadow-sm hover:shadow-md transition-all duration-300">
              <span className="text-gray-400 font-semibold">Partner 2</span>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="scale" delay={0.3}>
            <div className="w-32 h-24 bg-white flex items-center justify-center rounded shadow-sm hover:shadow-md transition-all duration-300">
              <span className="text-gray-400 font-semibold">Partner 3</span>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="scale" delay={0.4}>
            <div className="w-32 h-24 bg-white flex items-center justify-center rounded shadow-sm hover:shadow-md transition-all duration-300">
              <span className="text-gray-400 font-semibold">Partner 4</span>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="scale" delay={0.5}>
            <div className="w-32 h-24 bg-white flex items-center justify-center rounded shadow-sm hover:shadow-md transition-all duration-300">
              <span className="text-gray-400 font-semibold">Partner 5</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white -mx-4 px-4 py-16 rounded-t-3xl text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid-cta"
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
            <rect width="100" height="100" fill="url(#grid-cta)" />
          </svg>
        </div>
        <div className="container mx-auto max-w-3xl space-y-6 relative z-10">
          <AnimatedSection animation="slideUp">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Make an Impact?
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fadeIn" delay={0.2}>
            <p className="text-lg opacity-90 max-w-xl mx-auto">
              Join our community of changemakers and help us build a better
              future for African youth.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/programs"
                className="px-6 py-3 bg-white text-blue-600 rounded-md font-semibold hover:bg-blue-50 transition shadow-md"
              >
                Explore Programs
              </Link>
              <Link
                href="/mentorship"
                className="px-6 py-3 bg-transparent border border-white rounded-md font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                Become a Mentor
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
    </PageWrapper>
  );
}
