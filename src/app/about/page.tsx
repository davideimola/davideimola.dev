import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Davide Imola",
  description:
    "Learn more about Davide Imola, Software Engineer, conference organizer, and tech speaker. Background, skills, and journey in technology.",
};

export default function About() {
  return (
    <>
      <Header />
      <main className="bg-gray-950">
        {/* Hero Section */}
        <section className="px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
                About Me
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                Passionate about technology, community building, and continuous
                learning.
              </p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="border-t border-gray-800 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg prose-invert max-w-none">
                  <h2 className="mb-6 text-2xl font-bold text-gray-100">
                    My Story
                  </h2>
                  <p className="mb-6 text-gray-400">
                    I&apos;m a Software Engineer with a passion for building
                    exceptional products and fostering vibrant tech communities.
                    My journey in technology has been driven by curiosity,
                    continuous learning, and a desire to make a positive impact
                    through code and community engagement.
                  </p>

                  <p className="mb-6 text-gray-400">
                    Over the years, I&apos;ve had the privilege of working on
                    diverse projects, from startups to enterprise applications,
                    each teaching me something new about software craftsmanship,
                    team collaboration, and product development. I believe that
                    great software is built by great teams, and I&apos;m
                    passionate about creating environments where developers can
                    thrive and grow.
                  </p>

                  <h3 className="mb-4 text-xl font-semibold text-gray-100">
                    Community Involvement
                  </h3>
                  <p className="mb-6 text-gray-400">
                    Beyond writing code, I&apos;m deeply involved in the tech
                    community. I organize conferences, speak at events, and
                    contribute to open-source projects. I believe that sharing
                    knowledge and fostering connections within the developer
                    community is essential for our collective growth and
                    success.
                  </p>

                  <h3 className="mb-4 text-xl font-semibold text-gray-100">
                    Philosophy
                  </h3>
                  <p className="mb-6 text-gray-400">
                    I approach every project with a focus on clean code, user
                    experience, and sustainable architecture. I believe in the
                    power of collaboration, continuous improvement, and the
                    importance of building technology that serves people and
                    solves real problems.
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8 lg:col-span-1">
                {/* Skills */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-100">
                    Technical Skills
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-300">
                        Languages & Frameworks
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Go",
                          "JavaScript",
                          "TypeScript",
                          "Node.js",
                          "Next.js",
                          "React",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="inline-block rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-400 ring-1 ring-blue-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-gray-300">
                        Infrastructure & Security
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Kubernetes",
                          "Docker",
                          "GitOps",
                          "Flux",
                          "AWS",
                          "Terraform",
                        ].map((skill) => (
                          <span
                            key={skill}
                            className="inline-block rounded-full bg-green-500/10 px-2 py-1 text-xs text-green-400 ring-1 ring-green-500/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="mb-8 rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-100">
                    Quick Stats
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Years of Experience</span>
                      <span className="font-semibold text-gray-100">10+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Conferences Organized
                      </span>
                      <span className="font-semibold text-gray-100">2+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">
                        Speaking Engagements
                      </span>
                      <span className="font-semibold text-gray-100">14+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Community Reach</span>
                      <span className="font-semibold text-gray-100">20k+</span>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-gray-100">
                    Get in Touch
                  </h3>
                  <div className="space-y-3">
                    <a
                      href="mailto:hello@davideimola.dev"
                      className="flex items-center text-gray-400 transition-colors hover:text-blue-400"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                      </svg>
                      hello@davideimola.dev
                    </a>
                    <a
                      href="https://linkedin.com/in/davideimola"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 transition-colors hover:text-blue-400"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                    <a
                      href="https://github.com/davideimola"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-400 transition-colors hover:text-blue-400"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
