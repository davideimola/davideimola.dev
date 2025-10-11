import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { type Metadata } from "next";
import Link from "next/link";
import { speakingEvents, type SpeakingEvent } from "~/content/speaking-events";

export const metadata: Metadata = {
  title: "Speaking - Davide Imola",
  description:
    "Davide Imola's speaking engagements at international conferences about infrastructure, security, GitOps, Kubernetes, Go, and cloud-native technologies.",
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Function to separate events based on current date
function separateEvents(events: SpeakingEvent[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparison

  const upcoming = events
    .filter((event) => new Date(event.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort ascending (nearest first)

  const past = events
    .filter((event) => new Date(event.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort descending (most recent first)

  return { upcoming, past };
}

export default function Speaking() {
  const { upcoming: upcomingEvents, past: pastEvents } =
    separateEvents(speakingEvents);

  const stats = {
    totalTalks: speakingEvents.length,
    countries: 2,
    topics: ["Infrastructure", "GitOps", "Kubernetes", "Go", "Security"],
    conferences: "10+",
  };

  return (
    <>
      <Header />
      <main className="bg-gray-950">
        {/* Hero Section */}
        <section className="px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Speaking & Events
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Sharing knowledge about infrastructure, security, GitOps,
              Kubernetes, and Go at international conferences and community
              events.
            </p>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {stats.totalTalks}
                </div>
                <div className="text-sm text-gray-500">Total Talks</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {stats.conferences}
                </div>
                <div className="text-sm text-gray-500">Conferences</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {stats.countries}
                </div>
                <div className="text-sm text-gray-500">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">
                  {stats.topics.length}
                </div>
                <div className="text-sm text-gray-500">Core Topics</div>
              </div>
            </div>

            {/* Topics */}
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {stats.topics.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-blue-500/20"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 ? (
          <section className="border-b border-gray-800 py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto mb-12 max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-100">
                  Upcoming Events
                </h2>
                <p className="mt-4 text-lg leading-8 text-gray-400">
                  Join me at these upcoming conferences and meetups
                </p>
              </div>

              <div className="space-y-6">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-xl border border-blue-500/50 bg-gray-900 p-6 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-grow">
                        <div className="mb-2 flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                            {event.role}
                          </span>
                          <span className="inline-flex items-center rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/20">
                            Upcoming
                          </span>
                          <span className="text-sm text-gray-500">
                            {event.type}
                          </span>
                        </div>

                        <h3 className="mb-2 text-xl font-semibold text-gray-100">
                          {event.title}
                        </h3>
                        <p className="mb-2 font-medium text-blue-400">
                          {event.talkTitle}
                        </p>

                        {event.coSpeaker && (
                          <p className="mb-2 text-xs text-gray-500">
                            {event.coSpeaker}
                          </p>
                        )}

                        {event.description && (
                          <p className="mb-3 text-gray-400">
                            {event.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg
                              className="mr-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5m-18 0h18"
                              />
                            </svg>
                            {formatDate(event.date)}
                          </div>
                          <div className="flex items-center">
                            <svg
                              className="mr-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                              />
                            </svg>
                            {event.location}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex-shrink-0 lg:mt-0 lg:ml-6">
                        {event.videoUrl && (
                          <Link
                            href={event.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
                          >
                            Event Details
                            <svg
                              className="ml-1 h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="border-b border-gray-800 py-8">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-gray-500 italic">
                  No upcoming speaking activities scheduled at the moment. Check
                  back soon!
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Past Events */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100">
                Past Speaking Engagements
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Conferences, meetups, and podcasts where I&apos;ve shared
                knowledge
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                      {event.role}
                    </span>
                    <span className="text-sm text-gray-500">{event.type}</span>
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-gray-100">
                    {event.title}
                  </h3>
                  <p className="mb-2 text-sm font-medium text-blue-400">
                    {event.talkTitle}
                  </p>

                  {event.coSpeaker && (
                    <p className="mb-2 text-xs text-gray-500">
                      {event.coSpeaker}
                    </p>
                  )}

                  {event.description && (
                    <p className="mb-3 text-sm text-gray-400">
                      {event.description}
                    </p>
                  )}

                  <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5m-18 0h18"
                        />
                      </svg>
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="mr-1 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                        />
                      </svg>
                      {event.location}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {event.videoUrl && (
                      <Link
                        href={event.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                          />
                        </svg>
                        Video
                      </Link>
                    )}
                    {event.slidesUrl && (
                      <Link
                        href={event.slidesUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm font-medium text-purple-400 transition-colors hover:text-purple-300"
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                          />
                        </svg>
                        Slides
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gray-900 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Invite me to speak
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-400">
                Looking for a speaker for your event? I&apos;d love to share my
                experience in infrastructure, security, GitOps, Kubernetes, Go,
                or community building.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="mailto:hello@davideimola.dev"
                  className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
                >
                  Get in touch
                </Link>
                <Link
                  href="https://github.com/davideimola"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm leading-6 font-semibold text-gray-300 transition-colors hover:text-blue-400"
                >
                  View GitHub <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
