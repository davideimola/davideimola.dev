import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { type Metadata } from "next";
import Link from "next/link";
import { projects } from "~/content/projects";

export const metadata: Metadata = {
  title: "Projects - Davide Imola",
  description:
    "Explore Davide Imola's projects including OSDay conference, Schrodinger Hat community, and open-source contributions.",
};

export default function Projects() {
  const featuredProjects = projects.filter((p) => p.featured);
  const otherProjects = projects.filter((p) => !p.featured);

  return (
    <>
      <Header />
      <main className="bg-gray-950">
        {/* Hero Section */}
        <section className="px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              My Projects
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              Building communities, organizing conferences, and contributing to
              open-source projects that make technology more accessible and
              sustainable.
            </p>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="border-b border-gray-800 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100">
                Featured Projects
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-400">
                Main community initiatives and conferences
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  {/* Featured badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                      Featured
                    </span>
                  </div>

                  {/* Content placeholder with gradient */}
                  <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-blue-950 to-gray-900">
                    <div className="p-8 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/20">
                        <svg
                          className="h-8 w-8 text-blue-400"
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
                      <h3 className="text-lg font-semibold text-gray-100 transition-colors group-hover:text-blue-400">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {project.year}
                      </span>
                    </div>

                    <h3 className="mb-3 text-xl font-semibold text-gray-100 transition-colors group-hover:text-blue-400">
                      {project.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                      {project.description}
                    </p>

                    {project.highlights && (
                      <ul className="mb-4 space-y-1">
                        {project.highlights.map((highlight, i) => (
                          <li
                            key={i}
                            className="flex items-start text-xs text-gray-500"
                          >
                            <span className="mr-2 text-blue-400">•</span>
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Technologies */}
                    <div className="mb-4 flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="inline-block rounded bg-gray-800 px-2 py-1 text-xs text-gray-400"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-3">
                        {project.links.website && (
                          <Link
                            href={project.links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                          >
                            Visit →
                          </Link>
                        )}
                        {project.links.github && (
                          <Link
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 transition-colors hover:text-gray-300"
                          >
                            <span className="sr-only">GitHub</span>
                            <svg
                              className="h-5 w-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Link>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                          project.status === "Active"
                            ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
                            : "bg-gray-800 text-gray-400"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Projects */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100">
                Other Projects & Contributions
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherProjects.map((project) => (
                <div
                  key={project.id}
                  className="group overflow-hidden rounded-xl border border-gray-800 bg-gray-900 transition-all duration-300 hover:border-blue-500/50"
                >
                  <div className="flex aspect-[16/9] items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-800">
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
                            d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                          />
                        </svg>
                      </div>
                      <h3 className="line-clamp-2 text-sm font-medium text-gray-300">
                        {project.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-1 text-xs font-medium text-gray-400">
                        {project.category}
                      </span>
                      <span className="text-xs text-gray-600">
                        {project.year}
                      </span>
                    </div>

                    <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-100 transition-colors group-hover:text-blue-400">
                      {project.title}
                    </h3>

                    <p className="mb-4 line-clamp-3 text-sm text-gray-400">
                      {project.description}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-1">
                      {project.technologies.slice(0, 2).map((tech) => (
                        <span
                          key={tech}
                          className="inline-block rounded bg-gray-800 px-2 py-1 text-xs text-gray-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {project.links.website && (
                          <Link
                            href={project.links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-400 hover:text-blue-300"
                          >
                            View →
                          </Link>
                        )}
                        {project.links.github && (
                          <Link
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-500 hover:text-gray-400"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </Link>
                        )}
                      </div>
                    </div>
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
                Let&apos;s Collaborate
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-400">
                Interested in collaborating on open-source projects, organizing
                community events, or building something together?
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
                  View on GitHub <span aria-hidden="true">→</span>
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
