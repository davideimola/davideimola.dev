import Link from "next/link";
import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { SectionHeader } from "~/app/_components/section-header";
import { ProjectCard } from "~/app/_components/project-card";
import { blogPosts } from "~/content/blog-posts";
import { projects } from "~/content/projects";
import { speakingEvents } from "~/content/speaking-events";
import Image from "next/image";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  // Get latest 3 blog posts
  const sortedPosts = [...blogPosts].sort(
    (a, b) =>
      new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime(),
  );
  const latestPosts = sortedPosts.slice(0, 3);

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
      <main className="bg-[#0D0D0D]">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden px-6 py-32 sm:py-40 lg:px-8">
          <div className="absolute top-0 right-0 -z-20 h-[500px] w-[500px] rounded-full bg-[#C91F37]/20 opacity-50 mix-blend-screen blur-[120px]" />
          <div className="absolute bottom-0 left-0 -z-20 h-[500px] w-[500px] rounded-full bg-[#a39e98]/10 opacity-50 mix-blend-screen blur-[120px]" />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,#C91F37,transparent)] opacity-10" />

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8">
              <div className="float relative mx-auto h-48 w-48 overflow-hidden rounded-full shadow-2xl ring-4 ring-[#C91F37]/20">
                <Image
                  src="/images/davide-speaking-profile.webp"
                  alt="Davide Imola presenting at a conference"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <h1 className="font-playfair text-5xl font-bold tracking-tight text-gray-100 sm:text-7xl">
              <span className="italic">Ciao</span>, I&apos;m{" "}
              <span className="gradient-text">Davide Imola</span>
            </h1>

            {/* Decorative accent line */}
            <div className="mx-auto mt-6 h-0.5 w-32 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a39e98]">
              Software Engineer from Verona building secure infrastructure and
              applications. I work with Kubernetes, Go, and GitOps at RedCarbon,
              and organize Open Source Day in Florence.
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/about"
                className="button-press rounded-md bg-[#C91F37] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#D3381C] hover:shadow-lg hover:shadow-[#C91F37]/25"
              >
                Learn more about me
              </Link>
              <Link
                href="/speaking"
                className="button-press text-sm leading-6 font-semibold text-[#d4cfc9] transition-all duration-200 hover:translate-x-1 hover:text-[#C91F37]"
              >
                View my talks{" "}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Sections */}
        <section className="py-32 sm:py-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                What I Do
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="mt-4 text-lg leading-8 text-[#a39e98]">
                Infrastructure, community building, and open source
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-10 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col items-start justify-between rounded-2xl bg-[#1A1816] p-8 ring-1 ring-[#2A2725] transition-all duration-200 hover:ring-[#C91F37]/50">
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C91F37]/10">
                    <svg
                      className="h-6 w-6 text-[#C91F37]"
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
                  <h3 className="mt-3 text-lg leading-6 font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                    <Link href="/experience">
                      <span className="absolute inset-0" /> Full-Stack
                      Engineering
                    </Link>
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-[#a39e98]">
                    Over 10 years building infrastructure and applications.
                    Currently leading backend and frontend development at
                    RedCarbon. Specializing in Kubernetes, Go, GitOps with Flux,
                    and secure architecture.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between rounded-2xl bg-[#1A1816] p-8 ring-1 ring-[#2A2725] transition-all duration-200 hover:ring-[#C91F37]/50">
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C91F37]/10">
                    <svg
                      className="h-6 w-6 text-[#C91F37]"
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
                  <h3 className="mt-3 text-lg leading-6 font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                    <Link href="/speaking">
                      <span className="absolute inset-0" /> Conference Speaking
                      & MC
                    </Link>
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-[#a39e98]">
                    Speaking at conferences across Europe about infrastructure
                    security, GitOps, Domain-Driven Design, and cloud-native
                    development. Sharing real-world experience and practical
                    insights.
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between rounded-2xl bg-[#1A1816] p-8 ring-1 ring-[#2A2725] transition-all duration-200 hover:ring-[#C91F37]/50">
                <div className="flex items-center gap-x-4 text-xs">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#C91F37]/10">
                    <svg
                      className="h-6 w-6 text-[#C91F37]"
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
                  <h3 className="mt-3 text-lg leading-6 font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                    <Link href="/projects">
                      <span className="absolute inset-0" /> Open Source &
                      Community
                    </Link>
                  </h3>
                  <p className="mt-5 text-sm leading-6 text-[#a39e98]">
                    Running Schrodinger Hat, a non-profit that&apos;s reached
                    20k+ people through open source events. Organizing Open
                    Source Day in Florence, bringing developers and companies
                    together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="bg-[#1A1816]/30 py-32 sm:py-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Projects
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="mt-4 text-lg leading-8 text-[#a39e98]">
                Building communities and organizing events in Italy and beyond
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-10 lg:mx-0 lg:max-w-none lg:grid-cols-2">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  variant="compact"
                />
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/projects"
                className="text-sm leading-6 font-semibold text-[#d4cfc9] transition-colors hover:text-[#C91F37]"
              >
                View all projects <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Talks */}
        <section className="py-32 sm:py-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Recent Talks
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="mt-4 text-lg leading-8 text-[#a39e98]">
                Sharing knowledge at conferences and events
              </p>
            </div>

            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {latestTalks.map((talk) => (
                <article
                  key={talk.id}
                  className="flex flex-col rounded-xl border border-[#2A2725] bg-[#1A1816] p-6 transition-all duration-200 hover:border-[#C91F37]/50"
                >
                  <div className="flex items-center gap-x-3 text-xs">
                    <span className="text-[#726d68]">
                      {formatDate(talk.date)}
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-[#726d68]">{talk.location}</span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-lg leading-6 font-semibold text-gray-100">
                    {talk.talkTitle}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#a39e98]">
                    {talk.title} - {talk.description?.slice(0, 80) ?? talk.type}
                  </p>
                  <div className="mt-4">
                    <Link
                      href="/speaking"
                      className="text-sm font-medium text-[#C91F37] transition-colors duration-200 hover:text-[#D3381C]"
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
                className="text-sm leading-6 font-semibold text-[#d4cfc9] transition-colors hover:text-[#C91F37]"
              >
                View all talks <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Blog Posts */}
        <section className="bg-[#1A1816]/30 py-32 sm:py-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <SectionHeader
                title="Latest Articles"
                subtitle="Thoughts on infrastructure, security, development, and building
                communities"
              />
            </div>

            {/* Asymmetric Grid: First post larger, others standard */}
            <div className="mx-auto mt-16 lg:mx-0 lg:max-w-none">
              {latestPosts.length > 0 && latestPosts[0] && (
                <article
                  key={latestPosts[0].id}
                  className="group card-hover mb-10 flex flex-col overflow-hidden rounded-xl border border-[#2A2725] bg-[#1A1816] transition-all duration-200 hover:border-[#C91F37]/50 lg:flex-row"
                >
                  <div className="relative aspect-[16/9] overflow-hidden lg:w-1/2">
                    {latestPosts[0].heroImage ? (
                      <Image
                        src={latestPosts[0].heroImage}
                        alt={
                          latestPosts[0].heroImageAlt ?? latestPosts[0].title
                        }
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1A1816] to-[#2A2725]">
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#2A2725]">
                          <svg
                            className="h-8 w-8 text-[#a39e98]"
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] to-transparent opacity-50" />
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-center gap-x-3 text-xs text-[#726d68]">
                      <span>{latestPosts[0].category}</span>
                      <span>•</span>
                      <time>{formatDate(latestPosts[0].publishDate)}</time>
                    </div>
                    <h3 className="mt-3 text-2xl leading-7 font-semibold text-gray-100">
                      <Link
                        href={`/blog/${latestPosts[0].slug}`}
                        className="transition-all duration-200 hover:text-[#C91F37]"
                      >
                        {latestPosts[0].title}
                      </Link>
                    </h3>
                    <p className="mt-3 text-base leading-7 text-[#a39e98]">
                      {latestPosts[0].excerpt}
                    </p>
                    <div className="mt-6 flex items-center gap-2">
                      <span className="text-sm text-[#726d68]">
                        {latestPosts[0].readTime}
                      </span>
                    </div>
                  </div>
                </article>
              )}
              {latestPosts.length > 1 && (
                <div className="grid max-w-2xl grid-cols-1 gap-10 lg:max-w-none lg:grid-cols-2">
                  {latestPosts.slice(1).map((post) => (
                    <article
                      key={post.id}
                      className="group card-hover flex flex-col overflow-hidden rounded-xl border border-[#2A2725] bg-[#1A1816] transition-all duration-200 hover:border-[#C91F37]/50"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {post.heroImage ? (
                          <Image
                            src={post.heroImage}
                            alt={post.heroImageAlt ?? post.title}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1A1816] to-[#2A2725]">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#2A2725]">
                              <svg
                                className="h-6 w-6 text-[#a39e98]"
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
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1816] to-transparent opacity-50" />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex items-center gap-x-3 text-xs text-[#726d68]">
                          <span>{post.category}</span>
                          <span>•</span>
                          <time>{formatDate(post.publishDate)}</time>
                        </div>
                        <h3 className="mt-3 text-lg leading-6 font-semibold text-gray-100">
                          <Link
                            href={`/blog/${post.slug}`}
                            className="transition-all duration-200 hover:text-[#C91F37]"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#a39e98]">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-xs text-[#726d68]">
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/blog"
                className="text-sm leading-6 font-semibold text-[#d4cfc9] transition-colors hover:text-[#C91F37]"
              >
                View all articles <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#1A1816] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Let&apos;s Connect
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="mt-6 text-lg leading-8 text-[#a39e98]">
                Always up for talking about infrastructure, security, or team
                leadership. Looking for speakers for your conference? Want to
                collaborate on open source? Let&apos;s connect.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/contact"
                  className="rounded-md bg-[#C91F37] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#D3381C]"
                >
                  Get in touch
                </Link>
                <Link
                  href="/experience"
                  className="text-sm leading-6 font-semibold text-[#d4cfc9] transition-colors hover:text-[#C91F37]"
                >
                  View my experience <span aria-hidden="true">→</span>
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
