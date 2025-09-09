import { createServer } from '@/utils/supabase/server';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedSection from '@/components/AnimatedSection';

// Helper function to safely get display name from profiles
function getDisplayName(mentor: any): string {
  if (!mentor.profiles) return 'Mentor';
  
  if (Array.isArray(mentor.profiles)) {
    return mentor.profiles[0]?.display_name || 'Mentor';
  }
  
  return mentor.profiles.display_name || 'Mentor';
}

// Define mentorship areas
const mentorshipAreas = [
  {
    id: 'tech',
    name: 'Technology',
    icon: '💻',
    description: 'Software development, data science, IT, and digital skills'
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    description: 'Entrepreneurship, marketing, finance, and strategy'
  },
  {
    id: 'leadership',
    name: 'Leadership',
    icon: '🚀',
    description: 'Community leadership, management, and organizational skills'
  },
  {
    id: 'creative',
    name: 'Creative',
    icon: '🎨',
    description: 'Design, content creation, media, and arts'
  },
  {
    id: 'personal',
    name: 'Personal Growth',
    icon: '🌱',
    description: 'Career development, wellness, and life skills'
  }
];

/**
 * Mentorship page. Lists available mentors and allows logged‑in users to request
 * mentorship.  In a production app, a form would submit a Server Action that
 * inserts into the `mentor_requests` table with a unique constraint on
 * (mentee_id, mentor_id) to prevent duplicates.
 */
export default async function MentorshipPage() {
  const supabase = createServer();
  const { data: mentors } = await supabase
    .from('mentors')
    .select('id, bio, expertise, years_experience, available_hours, profile_image, social_links, area, profiles:profiles(display_name)')
    .order('profiles.display_name', { ascending: true });

  // Group mentors by area of expertise
  const mentorsByArea: Record<string, any[]> = {};
  mentors?.forEach((mentor) => {
    const area = mentor.area || 'general';
    if (!mentorsByArea[area]) {
      mentorsByArea[area] = [];
    }
    mentorsByArea[area].push(mentor);
  });

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-80"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10 bg-pattern-mentorship"></div>
          <div className="hidden md:block absolute right-10 top-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob"></div>
          <div className="hidden md:block absolute left-10 bottom-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="hidden md:block absolute right-1/3 bottom-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          <AnimatedSection animation="fadeIn">
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Find Your Perfect Mentor</h1>
              <p className="text-xl text-gray-600 mb-8">Connect with industry professionals who can help guide your career, share knowledge, and support your growth journey.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="#mentors" className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all shadow-md font-medium text-lg">
                  Browse Mentors
                </Link>
                <Link href="/mentorship/apply" className="px-8 py-3 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-all font-medium text-lg">
                  Become a Mentor
                </Link>
              </div>
            </div>
          </AnimatedSection>
          
          <div className="flex justify-center">
            <AnimatedSection animation="slideUp">
              <div className="relative max-w-4xl">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-green-100 rounded-full border-4 border-white"></div>
                <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-blue-100 rounded-full border-4 border-white"></div>
                <div className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <div>
                      <p className="text-4xl font-bold text-green-600 mb-2">500+</p>
                      <p className="text-gray-600">Active Mentors</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-blue-600 mb-2">30+</p>
                      <p className="text-gray-600">Expertise Areas</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-purple-600 mb-2">2,000+</p>
                      <p className="text-gray-600">Successful Connections</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-16">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,149.3C384,160,480,160,576,138.7C672,117,768,75,864,74.7C960,75,1056,117,1152,117.3C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto py-8">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-3xl font-bold text-center mb-12">How Our Mentorship Program Works</h2>
        </AnimatedSection>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <AnimatedSection animation="slideUp" delay={0.1}>
            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 relative">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold transform transition-transform duration-300 group-hover:scale-110">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">Find Your Match</h3>
              <p className="text-gray-600">Browse our mentor profiles and find someone who aligns with your goals and interests.</p>
              
              <ul className="mt-4 text-sm text-left text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Filter by expertise area</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Read detailed profiles</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>View mentee success stories</span>
                </li>
              </ul>
              
              <div className="hidden md:block absolute top-32 -right-4 w-8 h-8 bg-blue-100 rounded-full z-10"></div>
              <div className="hidden md:block absolute top-36 -right-12 w-24 border-t-2 border-dashed border-blue-300"></div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.2}>
            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 relative">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">Connect & Plan</h3>
              <p className="text-gray-600">Send a request, schedule an initial meeting, and develop a personalized mentorship plan.</p>
              
              <ul className="mt-4 text-sm text-left text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Simple request process</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Integrated scheduling</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Goal setting workshop</span>
                </li>
              </ul>
              
              <div className="hidden md:block absolute top-32 -right-4 w-8 h-8 bg-green-100 rounded-full z-10"></div>
              <div className="hidden md:block absolute top-36 -right-12 w-24 border-t-2 border-dashed border-green-300"></div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.3}>
            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">Grow Together</h3>
              <p className="text-gray-600">Engage in regular sessions, work on your goals, and track your progress over time.</p>
              
              <ul className="mt-4 text-sm text-left text-gray-600 space-y-2">
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Regular check-ins</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Progress tracking</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 text-purple-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Milestone celebrations</span>
                </li>
              </ul>
            </div>
          </AnimatedSection>
        </div>
        
        <AnimatedSection animation="fadeIn" delay={0.4}>
          <div className="text-center mt-12">
            <Link href="/mentorship/how-it-works" className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
              Learn more about our mentorship process
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        </AnimatedSection>
      </section>

      {/* Areas of Mentorship */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 skew-y-3 z-0" style={{ transform: 'skewY(-3deg)' }}></div>
        
        <div className="container mx-auto relative z-10">
          <AnimatedSection animation="fadeIn">
            <h2 className="text-3xl font-bold text-center mb-4">Areas of Mentorship</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Our mentors specialize in these high-impact areas to help you develop valuable skills and advance your career
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 relative">
            {mentorshipAreas.map((area, index) => (
              <AnimatedSection key={area.id} animation="scale" delay={0.1 * index}>
                <a 
                  href={`#${area.id}`}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  
                  <div className="text-5xl mb-4 transform transition-transform duration-300 group-hover:scale-110">{area.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">{area.name}</h3>
                  <p className="text-sm text-gray-600">{area.description}</p>
                  
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center text-blue-600 text-sm font-medium">
                      View mentors
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </span>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection animation="fadeIn" delay={0.6}>
            <div className="text-center mt-10">
              <Link href="/mentorship/areas" className="inline-block px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-300 font-medium">
                Explore All Mentorship Areas
              </Link>
            </div>
          </AnimatedSection>
          
          {/* Decorative Elements */}
          <div className="hidden md:block absolute -bottom-6 -left-16 w-32 h-32 bg-blue-50 rounded-full opacity-70"></div>
          <div className="hidden md:block absolute top-24 -right-10 w-20 h-20 bg-purple-50 rounded-full opacity-70"></div>
          <div className="hidden md:block absolute top-1/2 left-1/4 w-8 h-8 bg-green-50 rounded-full opacity-50"></div>
        </div>
      </section>

      {/* Mentor Listings */}
      <section id="mentors" className="container mx-auto py-16">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-3xl font-bold text-center mb-4">Our Mentors</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Connect with industry professionals who are passionate about sharing their knowledge and experience
          </p>
        </AnimatedSection>

        {mentors && mentors.length > 0 ? (
          <div className="space-y-16">
            {/* Featured Mentors */}
            <div className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <AnimatedSection animation="slideRight">
                  <h3 className="text-2xl font-semibold text-green-700">Featured Mentors</h3>
                </AnimatedSection>
                <AnimatedSection animation="slideLeft">
                  <div className="flex space-x-2">
                    <button className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                    </button>
                    <button className="p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </AnimatedSection>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {mentors.slice(0, 3).map((mentor, index) => (
                  <AnimatedSection key={mentor.id} animation="fadeIn" delay={0.1 * index}>
                    <Link 
                      href={`/mentorship/${mentor.id}`}
                      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group block"
                    >
                      <div className="aspect-[3/2] bg-gray-100 relative overflow-hidden">
                        {mentor.profile_image ? (
                          <Image 
                            src={mentor.profile_image} 
                            alt={getDisplayName(mentor)} 
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                            <span className="text-4xl text-gray-400">{getDisplayName(mentor).charAt(0)}</span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-xl text-green-700 group-hover:text-green-600">
                            {getDisplayName(mentor)}
                          </h4>
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                            {mentor.area}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-green-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          {mentor.expertise}
                          {mentor.years_experience && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">{mentor.years_experience}+ years</span>}
                        </p>
                        <p className="text-gray-600 line-clamp-3 mb-4">{mentor.bio}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center text-green-600 font-medium text-sm group-hover:underline">
                            View full profile
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                            </svg>
                          </span>
                          
                          {mentor.social_links && (
                            <div className="flex space-x-2">
                              {mentor.social_links.linkedin && (
                                <a href={mentor.social_links.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                  </svg>
                                </a>
                              )}
                              {mentor.social_links.twitter && (
                                <a href={mentor.social_links.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                  </svg>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </AnimatedSection>
                ))}
              </div>
            </div>

            {/* Mentors by Area */}
            {Object.keys(mentorsByArea).map((area, areaIndex) => (
              <div key={area} id={area} className="space-y-8">
                <AnimatedSection animation="fadeIn" delay={0.1 * areaIndex}>
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-green-600 to-blue-600 rounded-full mr-3"></div>
                    <h3 className="text-2xl font-semibold text-green-700 capitalize">{area}</h3>
                  </div>
                </AnimatedSection>
                
                <div className="bg-gray-50 p-6 rounded-xl">
                  <div className="flex flex-wrap items-center justify-between mb-6">
                    <p className="text-gray-600 font-medium">
                      <span className="text-green-700 font-bold">{mentorsByArea[area].length}</span> mentors available in this category
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-sm font-medium">
                          <option>Most relevant</option>
                          <option>Newest first</option>
                          <option>Highest rated</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="p-2 rounded-md bg-white border border-gray-200 hover:bg-green-50 transition-colors">
                          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                          </svg>
                        </button>
                        <button className="p-2 rounded-md bg-green-50 border border-gray-200 text-green-700">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mentorsByArea[area].map((mentor, mentorIndex) => (
                      <AnimatedSection key={mentor.id} animation="fadeIn" delay={0.05 * mentorIndex}>
                        <Link 
                          href={`/mentorship/${mentor.id}`}
                          className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all flex gap-4 items-start border border-gray-100 hover:border-green-200"
                        >
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex-shrink-0 relative overflow-hidden border-2 border-white shadow-sm">
                            {mentor.profile_image ? (
                              <Image 
                                src={mentor.profile_image} 
                                alt={getDisplayName(mentor)} 
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
                                <span className="text-xl text-gray-400">{getDisplayName(mentor).charAt(0)}</span>
                              </div>
                            )}
                            {mentor.years_experience && (
                              <div className="absolute -bottom-1 -right-1 bg-green-100 text-green-800 text-xs font-bold px-1.5 py-0.5 rounded-full border border-white shadow-sm">
                                {mentor.years_experience}+
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-green-700 hover:underline line-clamp-1">
                                {getDisplayName(mentor)}
                              </h4>
                              <svg className="w-5 h-5 text-gray-400 hover:text-green-600 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                              </svg>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 my-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                {mentor.expertise?.split(',')[0]}
                              </span>
                              {mentor.expertise?.split(',')[1] && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-50 text-purple-700">
                                  {mentor.expertise?.split(',')[1]}
                                </span>
                              )}
                              {mentor.expertise?.split(',').length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-700">
                                  +{mentor.expertise?.split(',').length - 2}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{mentor.bio}</p>
                            
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs text-gray-500">
                                {mentor.available_hours ? `${mentor.available_hours} hrs/week` : 'Schedule flexible'}
                              </span>
                              <span className="inline-flex items-center text-green-600 font-medium text-xs">
                                Details
                                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </span>
                            </div>
                          </div>
                        </Link>
                      </AnimatedSection>
                    ))}
                  </div>
                  
                  {mentorsByArea[area].length > 6 && (
                    <div className="flex justify-center mt-8">
                      <button className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium hover:border-green-500 hover:text-green-700 transition-colors flex items-center">
                        View all {mentorsByArea[area].length} mentors in {area}
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatedSection animation="fadeIn">
            <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-green-50 rounded-xl border border-dashed border-green-200">
              <div className="max-w-lg mx-auto">
                <svg className="w-20 h-20 mx-auto text-green-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                
                <h3 className="text-2xl font-bold text-green-800 mb-4">Mentors Coming Soon</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We're currently onboarding mentors to our platform. Check back soon or sign up to be notified when mentors become available. You can also apply to become a mentor yourself!
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link 
                    href="/contact" 
                    className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    Join Waiting List
                  </Link>
                  
                  <Link 
                    href="/mentorship/apply" 
                    className="px-6 py-3 border border-green-600 text-green-700 bg-white rounded-md font-medium hover:bg-green-50 transition-colors inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Apply as Mentor
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}
      </section>
      
      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-16 rounded-xl mt-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
          </svg>
        </div>
        
        <AnimatedSection animation="fadeIn">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Accelerate Your Growth?</h2>
              <p className="text-green-50 text-lg mb-8 leading-relaxed">
                Whether you're looking to develop new skills, advance your career, or give back by sharing your knowledge,
                our mentorship program is designed to help you succeed.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/mentorship/find" className="px-8 py-4 bg-white text-green-700 rounded-lg shadow-lg hover:shadow-xl transition-shadow font-bold text-lg">
                  Find a Mentor
                </Link>
                <Link href="/mentorship/become" className="px-8 py-4 bg-green-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow font-bold text-lg">
                  Become a Mentor
                </Link>
              </div>
              
              <div className="mt-10 text-green-50 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Join over 500+ mentorship success stories</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,208C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </section>
    </div>
  );
}
