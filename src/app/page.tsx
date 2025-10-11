import Link from "next/link";
import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { blogPosts } from "~/content/blog-posts";
import { projects } from "~/content/projects";
import { speakingEvents } from "~/content/speaking-events";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  // Get latest 3 blog posts
  const latestPosts = blogPosts
    .sort(
      (a, b) =>
        new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
    )
    .slice(0, 3);

  // Get featured projects
  const featuredProjects = projects.filter((p) => p.featured);

  // Get latest 3 speaking events (past events, most recent first)
  const latestTalks = speakingEvents
    .filter((event) => new Date(event.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  return (
    <>
      <Header />
      <main className="bg-gray-950">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.900),theme(colors.gray.950))] opacity-20" />
          <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl ring-1 shadow-blue-900/10 ring-gray-800 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 p-1">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-950 text-4xl font-bold text-gray-100">
                  DI
                </div>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-6xl">
              Hi, I&apos;m{" "}
              <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                Davide Imola
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Software Engineer working across infrastructure, security,
              backend, and frontend. Community manager at Schrodinger Hat and
              organizer of OSDay. Building scalable systems and fostering
              open-source communities.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/about"
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
              >
                Learn more about me
              </Link>
              <Link
                href="/speaking"
                className="text-sm leading-6 font-semibold text-gray-300 transition-colors hover:text-blue-400"
              >
                View my talks <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Sections */}
        <section className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                What I Do
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Infrastructure, community building, and open source
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start justify-between rounded-2xl bg-gray-900 p-8 ring-1 ring-gray-800 transition-all duration-300 hover:ring-blue-500/50">
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <svg
                      className="h-6 w-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg leading-6 font-semibold text-gray-100 transition-colors group-hover:text-blue-400">
                    <Link href="/experience">
                      <span className="absolute inset-0" />
                      Full-Stack Engineering
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400">
                    Building and managing cloud infrastructure, backend systems,
                    and frontend applications. Working with Kubernetes, Go,
                    Node.js, Next.js, and implementing security best practices.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between rounded-2xl bg-gray-900 p-8 ring-1 ring-gray-800 transition-all duration-300 hover:ring-blue-500/50">
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <svg
                      className="h-6 w-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg leading-6 font-semibold text-gray-100 transition-colors group-hover:text-blue-400">
                    <Link href="/speaking">
                      <span className="absolute inset-0" />
                      Conference Speaking & MC
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400">
                    Speaking at international conferences about infrastructure,
                    security, GitOps, Kubernetes, and Go. Hosting events and
                    sharing knowledge with the tech community.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between rounded-2xl bg-gray-900 p-8 ring-1 ring-gray-800 transition-all duration-300 hover:ring-blue-500/50">
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                    <svg
                      className="h-6 w-6 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="group relative">
                  <h3 className="mt-3 text-lg leading-6 font-semibold text-gray-100 transition-colors group-hover:text-blue-400">
                    <Link href="/projects">
                      <span className="absolute inset-0" />
                      Open Source & Community
                    </Link>
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-400">
                    Community manager at Schrodinger Hat, organizer of OSDay
                    (Open Source Day) in Florence. Building and nurturing tech
                    communities across Europe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="border-t border-gray-800 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Featured Projects
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Building communities and organizing events
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              {featuredProjects.map((project, index) => (
                <article
                  key={project.id}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-blue-500/50"
                >
                  <div
                    className={`flex aspect-[16/9] items-center justify-center bg-gradient-to-br ${
                      index === 0
                        ? "from-blue-950 to-gray-900"
                        : "from-purple-950 to-gray-900"
                    }`}
                  >
                    <div className="p-8 text-center">
                      <div
                        className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${
                          index === 0
                            ? "bg-blue-500/10 ring-1 ring-blue-500/20"
                            : "bg-purple-500/10 ring-1 ring-purple-500/20"
                        }`}
                      >
                        <svg
                          className={`h-10 w-10 ${index === 0 ? "text-blue-400" : "text-purple-400"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                        >
                          {index === 0 ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          )}
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-x-3 text-xs">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 font-medium ring-1 ${
                          index === 0
                            ? "bg-blue-500/10 text-blue-400 ring-blue-500/20"
                            : "bg-purple-500/10 text-purple-400 ring-purple-500/20"
                        }`}
                      >
                        {project.category}
                      </span>
                      <span className="text-gray-500">{project.status}</span>
                    </div>
                    <div className="group relative flex-1">
                      <h3
                        className={`mt-3 text-xl leading-6 font-semibold text-gray-100 ${
                          index === 0
                            ? "group-hover:text-blue-400"
                            : "group-hover:text-purple-400"
                        }`}
                      >
                        <Link href="/projects">
                          <span className="absolute inset-0" />
                          {project.title}
                        </Link>
                      </h3>
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-400">
                        {project.description}
                      </p>
                    </div>
                    {project.links.website && (
                      <div className="mt-4 flex items-center gap-2">
                        <Link
                          href={project.links.website}
                          target={
                            project.links.website.startsWith("http")
                              ? "_blank"
                              : undefined
                          }
                          rel={
                            project.links.website.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className={`text-sm font-medium ${
                            index === 0
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-purple-400 hover:text-purple-300"
                          }`}
                        >
                          Visit website →
                        </Link>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/projects"
                className="text-sm leading-6 font-semibold text-gray-300 transition-colors hover:text-blue-400"
              >
                View all projects <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Talks */}
        <section className="border-t border-gray-800 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Recent Talks
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Sharing knowledge at conferences and events
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {latestTalks.map((talk) => (
                <article
                  key={talk.id}
                  className="flex flex-col rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all hover:border-blue-500/50"
                >
                  <div className="flex items-center gap-x-3 text-xs">
                    <span className="text-gray-500">
                      {formatDate(talk.date)}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500">{talk.location}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-lg leading-6 font-semibold text-gray-100">
                    {talk.talkTitle}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-400">
                    {talk.title} - {talk.description?.slice(0, 80) ?? talk.type}
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/speaking"
                      className="text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      View details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/speaking"
                className="text-sm leading-6 font-semibold text-gray-300 transition-colors hover:text-blue-400"
              >
                View all talks <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="border-t border-gray-800 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Latest Articles
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Thoughts on infrastructure, security, development, and building
                communities
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {latestPosts.map((post) => (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all hover:border-blue-500/50"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {post.heroImage ? (
                      <img
                        src={post.heroImage}
                        alt={post.heroImageAlt ?? post.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
                          <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                            />
                          </svg>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-x-3 text-xs text-gray-500">
                      <span>{post.category}</span>
                      <span>•</span>
                      <time>{formatDate(post.publishDate)}</time>
                    </div>
                    <h3 className="mt-3 text-lg leading-6 font-semibold text-gray-100">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-400"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-400">
                      {post.excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="text-sm leading-6 font-semibold text-gray-300 transition-colors hover:text-blue-400"
              >
                View all articles <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="border-t border-gray-800 bg-gray-900 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Let&apos;s Connect
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-400">
                Always interested in collaborating on infrastructure projects,
                speaking at events, or discussing software architecture and
                engineering practices.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/experience"
                  className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-500"
                >
                  View my experience
                </Link>
                <Link
                  href="mailto:hello@davideimola.dev"
                  className="text-sm leading-6 font-semibold text-gray-300 transition-colors hover:text-blue-400"
                >
                  Get in touch <span aria-hidden="true">→</span>
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
