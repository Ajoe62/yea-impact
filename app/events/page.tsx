import { createServer } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedSection from '@/components/AnimatedSection';
import PageWrapper from '@/components/PageWrapper';

export default async function EventsPage() {
  const supabase = createServer();
  const { data: events } = await supabase
    .from('events')
    .select('id, title, description, event_date, location, image_url, category, organizer, capacity')
    .order('event_date', { ascending: true });

  // Group events by month
  const eventsByMonth: Record<string, any[]> = {};
  
  events?.forEach((event) => {
    const date = new Date(event.event_date);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    if (!eventsByMonth[monthYear]) {
      eventsByMonth[monthYear] = [];
    }
    
    eventsByMonth[monthYear].push(event);
  });

  // Function to format the date and time
  const formatEventDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const formattedDate = date.toLocaleDateString('en-US', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short' 
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    return { formattedDate, formattedTime };
  };

  return (
    <PageWrapper>
      <div className="space-y-16 pb-16">
        {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white py-16 px-4 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto relative z-10">
          <AnimatedSection animation="fadeIn">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl">Discover Exciting Events and Opportunities</h1>
            <p className="text-xl opacity-90 max-w-xl mb-8">
              Join us for workshops, networking events, and community gatherings that inspire growth and connection
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.1}>
            <div className="flex flex-wrap gap-4">
              <Link href="#upcoming" className="px-6 py-3 bg-white text-green-700 rounded-lg font-bold hover:shadow-lg transition-shadow">
                Browse Events
              </Link>
              <Link href="/contact" className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
                Host an Event
              </Link>
            </div>
          </AnimatedSection>
          
          {/* Decorative elements */}
          <div className="hidden md:block absolute top-10 right-10 w-20 h-20 bg-white rounded-full opacity-20"></div>
          <div className="hidden md:block absolute bottom-10 right-40 w-12 h-12 bg-white rounded-full opacity-10"></div>
        </div>
      </section>

      {/* Event Filter Section */}
      <section className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <div className="bg-white rounded-xl shadow-sm p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
              </svg>
              <span className="font-medium text-gray-700">Filter By:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium hover:bg-green-100 transition-colors">
                All Events
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Workshops
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Networking
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors">
                Community
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Upcoming Events Section */}
      <section id="upcoming" className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-3xl font-bold text-center mb-12">Upcoming Events</h2>
        </AnimatedSection>
        
        {events && events.length > 0 ? (
          <div className="space-y-16">
            {Object.entries(eventsByMonth).map(([month, monthEvents], monthIndex) => (
              <AnimatedSection key={month} animation="fadeIn" delay={0.1 * monthIndex}>
                <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
                  <span className="w-1.5 h-5 bg-green-600 rounded-full mr-2"></span>
                  {month}
                </h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {monthEvents.map((event, eventIndex) => {
                    const { formattedDate, formattedTime } = formatEventDate(event.event_date);
                    return (
                      <AnimatedSection key={event.id} animation="fadeIn" delay={0.05 * eventIndex}>
                        <Link href={`/events/${event.id}`} className="block group">
                          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
                            {/* Event Image or Placeholder */}
                            <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
                              {event.image_url ? (
                                <Image 
                                  src={event.image_url} 
                                  alt={event.title} 
                                  fill 
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                  </svg>
                                </div>
                              )}
                              
                              {/* Category Badge */}
                              {event.category && (
                                <span className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                                  {event.category}
                                </span>
                              )}
                            </div>
                            
                            <div className="p-5 flex-1 flex flex-col">
                              <div className="flex justify-between items-start mb-3">
                                <div className="text-center px-3 py-2 bg-green-50 rounded-lg">
                                  <div className="text-sm font-bold text-green-800">{formattedDate.split(',')[0]}</div>
                                  <div className="text-2xl font-bold text-green-700">{formattedDate.split(' ')[1]}</div>
                                </div>
                                
                                <div className="text-right">
                                  <span className="text-sm text-gray-600">{formattedTime}</span>
                                  <div className="flex items-center mt-1 text-xs text-gray-500">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                    </svg>
                                    {event.location}
                                  </div>
                                </div>
                              </div>
                              
                              <h3 className="font-bold text-lg text-gray-800 group-hover:text-green-700 transition-colors mb-2">
                                {event.title}
                              </h3>
                              
                              <p className="text-gray-600 text-sm line-clamp-2 mb-3 flex-1">
                                {event.description}
                              </p>
                              
                              <div className="flex justify-between items-center mt-2">
                                {event.organizer && (
                                  <span className="text-xs text-gray-500">
                                    By {event.organizer}
                                  </span>
                                )}
                                
                                <div className="flex items-center">
                                  {event.capacity && (
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full mr-2">
                                      {event.capacity} spots
                                    </span>
                                  )}
                                  <span className="text-green-600 text-sm font-medium group-hover:underline flex items-center">
                                    Details
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
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
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Events Scheduled</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                There are no upcoming events at the moment. Check back soon or subscribe to be notified when new events are added.
              </p>
              <Link href="/contact" className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                Get Notified
              </Link>
            </div>
          </AnimatedSection>
        )}
      </section>
      
      {/* Call to Action */}
      <section className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="1.5" fill="white" />
                  </pattern>
                </defs>
                <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#dots)" />
              </svg>
            </div>
            
            <div className="relative z-10 md:flex items-center justify-between">
              <div className="mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Want to host your own event?</h2>
                <p className="text-blue-100 max-w-xl">
                  Partner with us to organize workshops, talks, or networking events that align with our mission.
                </p>
              </div>
              
              <Link href="/contact" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-bold hover:shadow-xl transition-shadow">
                Get in Touch
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
    </PageWrapper>
  );
}