import { notFound } from "next/navigation";
import { createServer } from "@/utils/supabase/server";
import RegistrationForm from "./register-form";
import Link from "next/link";
import Image from "next/image";
import AnimatedSection from "@/components/AnimatedSection";

interface EventPageProps {
  params: { id: string };
}

/**
 * Event detail page. Fetches a single event from Supabase and renders a
 * registration form that uses Supabase to create a unique registration
 * record with a token. The user must be authenticated to register.
 */
export default async function EventDetailPage({ params }: EventPageProps) {
  const supabase = createServer();
  const { data: event } = await supabase
    .from("events")
    .select(
      "id, title, description, event_date, location, image_url, category, organizer, capacity, agenda, speaker_ids"
    )
    .eq("id", params.id)
    .single();

  if (!event) {
    return notFound();
  }

  // Fetch speakers if available
  let speakers: any[] = [];
  if (event.speaker_ids && event.speaker_ids.length > 0) {
    const { data: speakersData } = await supabase
      .from("profiles")
      .select("id, display_name, bio, avatar_url, title")
      .in("id", event.speaker_ids);

    speakers = speakersData || [];
  }

  // Format event date
  const eventDate = new Date(event.event_date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section with Image */}
      <section className="relative h-64 md:h-80 lg:h-96 bg-gray-100 rounded-xl overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
            <svg
              className="w-24 h-24 text-white opacity-25"
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
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Link
            href="/events"
            className="text-sm font-medium flex items-center text-white/80 hover:text-white mb-2 transition-colors"
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
            Back to Events
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
          {event.category && (
            <span className="inline-block mt-2 px-3 py-1 bg-green-600/80 text-white text-sm font-medium rounded-full">
              {event.category}
            </span>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatedSection animation="fadeIn">
              <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-green-600"
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
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date & Time
                      </p>
                      <p className="font-bold text-gray-800">
                        {formattedDate} • {formattedTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="font-bold text-gray-800">
                        {event.location}
                      </p>
                    </div>
                  </div>

                  {event.organizer && (
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Organizer
                        </p>
                        <p className="font-bold text-gray-800">
                          {event.organizer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">About This Event</h2>
                  <div className="prose max-w-none text-gray-700">
                    <p>{event.description}</p>
                  </div>
                </div>

                {event.agenda && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Event Agenda</h2>
                    <div className="space-y-4">
                      {event.agenda.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex border-l-2 border-green-500 pl-4"
                        >
                          <div className="flex-shrink-0 w-16 text-sm font-medium text-gray-500">
                            {item.time}
                          </div>
                          <div>
                            <h3 className="font-bold">{item.title}</h3>
                            {item.description && (
                              <p className="text-sm text-gray-600">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AnimatedSection>

            {speakers.length > 0 && (
              <AnimatedSection animation="fadeIn" delay={0.1}>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold mb-6">Featured Speakers</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {speakers.map((speaker) => (
                      <div
                        key={speaker.id}
                        className="flex items-start space-x-4"
                      >
                        <div className="w-16 h-16 rounded-full bg-gray-100 relative flex-shrink-0 overflow-hidden">
                          {speaker.avatar_url ? (
                            <Image
                              src={speaker.avatar_url}
                              alt={speaker.display_name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-green-100 text-green-600 font-bold text-xl">
                              {speaker.display_name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            {speaker.display_name}
                          </h3>
                          {speaker.title && (
                            <p className="text-sm text-gray-600 mb-1">
                              {speaker.title}
                            </p>
                          )}
                          {speaker.bio && (
                            <p className="text-sm text-gray-500 line-clamp-3">
                              {speaker.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}
          </div>

          {/* Sidebar */}
          <div className="mt-8 lg:mt-0">
            <AnimatedSection animation="slideLeft" delay={0.2}>
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-8">
                <h2 className="text-xl font-bold mb-4">Event Registration</h2>
                <div className="mb-6 space-y-3">
                  {event.capacity && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Available spots</span>
                      <span className="font-medium">{event.capacity}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Registration closes</span>
                    <span className="font-medium">
                      {new Date(
                        eventDate.getTime() - 24 * 60 * 60 * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <RegistrationForm eventId={event.id} />

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium mb-3">Share this event</h3>
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
                    <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
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

      {/* Related Events */}
      <section className="container mx-auto px-4">
        <AnimatedSection animation="fadeIn">
          <h2 className="text-2xl font-bold mb-6">
            More Events You Might Like
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
              >
                <div className="h-40 bg-gray-100 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"></div>
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium">
                    Coming Soon
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-800 group-hover:text-green-700 transition-colors">
                    Upcoming Community Event
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 mb-3">
                    Stay tuned for more exciting events from YEA Impact!
                  </p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Coming Soon</span>
                    <span>TBD</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
