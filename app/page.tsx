import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import AnimatedSection from "@/components/AnimatedSection";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative -mx-4 px-4 py-16 sm:py-24 text-white overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"></div>
        </div>

        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
          <AnimatedSection animation="slideLeft" delay={0.2}>
            <div className="space-y-6 max-w-xl">
              <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-4">
                🌍 Empowering 20M+ Youth Across Africa
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Empowering African Youth for a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                  Brighter Future
                </span>
              </h1>
              <p className="text-lg text-white/90 leading-relaxed">
                Youth Empowerment Africa (YEA) is dedicated to empowering young
                Africans through advocacy, mindset reorientation, and skills
                development. Join us in our mission to impact 20 million youths
                across Africa.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/programs"
                  className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-white/90 hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  Our Programs
                </Link>
                <Link
                  href="/courses"
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
                >
                  Explore Courses
                </Link>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeIn" delay={0.5}>
            <div className="hidden md:block relative h-[500px] lg:h-[550px] w-full">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10"></div>
              <HeroSlider />
            </div>
          </AnimatedSection>
        </div>

        {/* Modern wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 md:h-20"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-gray-50"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-gray-50"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-gray-50"
            ></path>
          </svg>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="container mx-auto py-10">
        <AnimatedSection animation="fadeIn" delay={0.2}>
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Impact
          </h2>
        </AnimatedSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <AnimatedSection animation="slideUp" delay={0.3}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">20M+</div>
              <div className="text-gray-600">Youth Target</div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-gray-600">African Countries</div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.5}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Programs Completed</div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.6}>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">5K+</div>
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
              className="text-blue-700 hover:underline font-semibold"
            >
              View All Programs →
            </Link>
          </AnimatedSection>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Program Card 1 */}
          <AnimatedSection animation="slideUp" delay={0.3}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-blue-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-blue-700">
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
                  className="text-blue-700 hover:underline block text-sm font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </AnimatedSection>
          {/* Program Card 2 */}
          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-blue-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-blue-700">
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
                  className="text-blue-700 hover:underline block text-sm font-medium"
                >
                  Learn More →
                </Link>
              </div>
            </div>
          </AnimatedSection>
          {/* Program Card 3 */}
          <AnimatedSection animation="slideUp" delay={0.5}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="h-48 bg-blue-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-blue-700">
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
                  className="text-blue-700 hover:underline block text-sm font-medium"
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
      <section className="relative -mx-4 px-4 py-16 text-white overflow-hidden text-center">
        {/* Modern gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800"></div>

        {/* Animated geometric shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl"></div>
        </div>

        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-3xl space-y-6 relative z-10">
          <AnimatedSection animation="slideUp">
            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20 mb-2">
              ✨ Join Our Community
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to Make an{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                Impact?
              </span>
            </h2>
          </AnimatedSection>
          <AnimatedSection animation="fadeIn" delay={0.2}>
            <p className="text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
              Join our community of changemakers and help us build a better
              future for African youth.
            </p>
          </AnimatedSection>
          <AnimatedSection animation="slideUp" delay={0.4}>
            <div className="flex flex-wrap gap-4 justify-center pt-2">
              <Link
                href="/programs"
                className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-white/90 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Explore Programs
              </Link>
              <Link
                href="/mentorship"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-all duration-300"
              >
                Become a Mentor
              </Link>
            </div>
          </AnimatedSection>
        </div>

        {/* Top wave separator */}
        <div className="absolute top-0 left-0 right-0 transform rotate-180">
          <svg
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="w-full h-16 md:h-20"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="fill-gray-50"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="fill-gray-50"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="fill-gray-50"
            ></path>
          </svg>
        </div>
      </section>
    </div>
  );
}
