import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { CompanyLogo } from "~/app/_components/company-logo";
import { type Metadata } from "next";
import Link from "next/link";
import { Icon } from "~/app/_components/icon";
import { nowInfo } from "~/content/now";

export const metadata: Metadata = {
  title: "About Davide Imola | Software Engineer from Verona",
  description:
    "I'm from Verona, Italy. Over 10 years building infrastructure with Kubernetes, Go, and GitOps. Currently at RedCarbon working on cybersecurity. Running Schrodinger Hat and organizing Open Source Day in Florence.",
  keywords:
    "Davide Imola, Software Engineer, Verona, About, Biography, RedCarbon, GitOps, Kubernetes, Open Source Day, Schrodinger Hat",
  openGraph: {
    title: "About Davide Imola | Software Engineer from Verona",
    description:
      "10+ years in infrastructure and security. Building at RedCarbon. Organizing Open Source Day in Florence.",
    url: "https://davideimola.dev/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Davide Imola | Software Engineer from Verona",
    description:
      "Building secure infrastructure with Kubernetes and Go. Running open source events in Italy.",
  },
};

export default function About() {
  return (
    <>
      <Header />
      <main className="bg-[#0A0A0A]">
        {/* Hero Section */}
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
                About Me
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
                「Passionate about technology, community building, and
                continuous learning.」
              </p>
            </div>
          </div>
        </section>

        {/* What I'm Doing Now */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="font-playfair text-3xl font-bold text-gray-100">
                    What I&apos;m Doing Now
                  </h2>
                  <span className="text-sm text-gray-500">
                    (Updated {nowInfo.lastUpdated})
                  </span>
                </div>
                <div className="h-0.5 w-24 bg-gradient-to-r from-[#C91F37] to-transparent"></div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Current Role */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="💼" type="lucide" size="sm" variant="accent" />
                    <h3 className="text-lg font-semibold text-gray-100">
                      Current Role
                    </h3>
                  </div>

                  {/* Company Logo */}
                  {nowInfo.currentRole.companyLogo && (
                    <div className="mb-4 flex items-center gap-3">
                      <CompanyLogo
                        company={nowInfo.currentRole.company}
                        logo={nowInfo.currentRole.companyLogo}
                        size="md"
                      />
                      <div>
                        <p className="text-base font-medium text-[#C91F37]">
                          {nowInfo.currentRole.title}
                        </p>
                        <p className="text-sm text-gray-300">
                          {nowInfo.currentRole.company}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fallback if no logo */}
                  {!nowInfo.currentRole.companyLogo && (
                    <>
                      <p className="mb-2 text-base font-medium text-[#C91F37]">
                        {nowInfo.currentRole.title}
                      </p>
                      <p className="mb-1 text-sm text-gray-300">
                        {nowInfo.currentRole.company}
                      </p>
                    </>
                  )}

                  <p className="text-sm text-gray-500">
                    {nowInfo.currentRole.description}
                  </p>
                </div>

                {/* Location */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="📍" type="lucide" size="sm" variant="accent" />
                    <h3 className="text-lg font-semibold text-gray-100">
                      Based In
                    </h3>
                  </div>
                  <p className="mb-2 text-base font-medium text-gray-300">
                    {nowInfo.location.city}, {nowInfo.location.country}{" "}
                    {nowInfo.location.flag}
                  </p>
                  <p className="text-sm text-gray-500">
                    {nowInfo.location.timezone}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Available for{" "}
                    {nowInfo.location.availableFor
                      .map((item) => item.toLowerCase())
                      .join(", ")}
                  </p>
                </div>

                {/* Currently Learning */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="📚" type="lucide" size="sm" variant="accent" />
                    <h3 className="text-lg font-semibold text-gray-100">
                      Currently Learning
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {nowInfo.learning.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <span className="text-[#C91F37]">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Working On */}
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <Icon name="🚀" type="lucide" size="sm" variant="accent" />
                    <h3 className="text-lg font-semibold text-gray-100">
                      Working On
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {nowInfo.workingOn.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <span className="text-[#C91F37]">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Hobbies & Interests */}
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold text-gray-100">
                  Beyond Code
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {/* Football/Soccer */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon
                        name={nowInfo.hobbies.sports.emoji}
                        type="lucide"
                        size="sm"
                        variant="accent"
                      />
                      <h4 className="text-sm font-medium text-gray-300">
                        {nowInfo.hobbies.sports.name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      {nowInfo.hobbies.sports.details}
                    </p>
                  </div>

                  {/* BBQ */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon
                        name={nowInfo.hobbies.cooking.emoji}
                        type="lucide"
                        size="sm"
                        variant="accent"
                      />
                      <h4 className="text-sm font-medium text-gray-300">
                        {nowInfo.hobbies.cooking.name}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-500">
                      {nowInfo.hobbies.cooking.details}
                    </p>
                  </div>

                  {/* Video Gaming */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon
                        name={nowInfo.hobbies.gaming.emoji}
                        type="lucide"
                        size="sm"
                        variant="accent"
                      />
                      <h4 className="text-sm font-medium text-gray-300">
                        {nowInfo.hobbies.gaming.name}
                      </h4>
                    </div>
                    {nowInfo.hobbies.gaming.currentlyPlaying.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Playing:{" "}
                        {nowInfo.hobbies.gaming.currentlyPlaying.join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Board Gaming */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon
                        name={nowInfo.hobbies.boardGaming.emoji}
                        type="lucide"
                        size="sm"
                        variant="accent"
                      />
                      <h4 className="text-sm font-medium text-gray-300">
                        {nowInfo.hobbies.boardGaming.name}
                      </h4>
                    </div>
                    <p className="mb-1 text-xs text-gray-500">
                      {nowInfo.hobbies.boardGaming.details}
                    </p>
                    {nowInfo.hobbies.boardGaming.currentlyPlaying.length >
                      0 && (
                      <p className="text-xs text-gray-400">
                        On the table:{" "}
                        {nowInfo.hobbies.boardGaming.currentlyPlaying.join(
                          ", ",
                        )}
                      </p>
                    )}
                  </div>

                  {/* Tabletop RPG / D&D */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon
                        name={nowInfo.hobbies.roleplay.emoji}
                        type="lucide"
                        size="sm"
                        variant="accent"
                      />
                      <h4 className="text-sm font-medium text-gray-300">
                        {nowInfo.hobbies.roleplay.name}
                      </h4>
                    </div>
                    <p className="mb-1 text-xs text-gray-500">
                      {nowInfo.hobbies.roleplay.details}
                    </p>
                    {nowInfo.hobbies.roleplay.currentCampaign && (
                      <p className="text-xs text-gray-400">
                        Campaign: {nowInfo.hobbies.roleplay.currentCampaign}
                      </p>
                    )}
                  </div>

                  {/* Music */}
                  <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition-colors hover:border-gray-700">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon
                        name={nowInfo.hobbies.music.emoji}
                        type="lucide"
                        size="sm"
                        variant="accent"
                      />
                      <h4 className="text-sm font-medium text-gray-300">
                        {nowInfo.hobbies.music.name}
                      </h4>
                    </div>
                    <p className="mb-2 text-xs text-gray-500">
                      {nowInfo.hobbies.music.details}
                    </p>
                    {nowInfo.hobbies.music.playlistUrl && (
                      <a
                        href={nowInfo.hobbies.music.playlistUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#C91F37] transition-colors hover:text-[#D3381C]"
                      >
                        <svg
                          className="h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                        </svg>
                        {nowInfo.hobbies.music.playlistName}
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                <p className="text-sm text-gray-500">
                  <Icon
                    name="💡"
                    type="lucide"
                    size="sm"
                    variant="accent"
                    inline={true}
                    className="inline-flex h-4 w-4"
                  />{" "}
                  Inspired by{" "}
                  <a
                    href="https://nownownow.com/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 underline hover:text-[#C91F37]"
                  >
                    Derek Sivers&apos; /now page movement
                  </a>{" "}
                  . This section is updated regularly to reflect my current
                  focus.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="bg-gray-900/30 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="prose prose-lg prose-invert max-w-none">
                  <h2 className="font-playfair mb-4 text-2xl font-bold text-gray-100">
                    My Story
                  </h2>
                  <div className="mb-6 h-0.5 w-16 bg-gradient-to-r from-[#C91F37] to-transparent"></div>
                  <p className="mb-6 text-gray-400">
                    I'm from Verona, Italy, where I also studied Computer
                    Science. I've been writing code professionally for over 10
                    years now, working both as a freelancer and at various
                    companies. What started as curiosity about how things work
                    turned into a career building infrastructure and
                    applications.
                  </p>

                  <p className="mb-6 text-gray-400">
                    For most of my career, I focused on Platform and DevOps
                    Engineering. Setting up Kubernetes clusters, implementing
                    GitOps with Flux, building CI/CD pipelines, managing
                    infrastructure on AWS and GCP—that kind of thing. I've
                    worked with many programming languages over the years, but
                    these days I mostly write Go. There's something satisfying
                    about its simplicity and performance.
                  </p>

                  <p className="mb-6 text-gray-400">
                    Security has always been important to me. Not just as a
                    checkbox, but actually understanding how to build systems
                    that are secure from the ground up. This interest eventually
                    led me to RedCarbon, where I currently work on their
                    AI-powered cybersecurity platform. I'm responsible for both
                    backend and frontend systems, which keeps things
                    interesting.
                  </p>

                  <h3 className="mb-4 text-xl font-semibold text-gray-100">
                    Community & Speaking
                  </h3>
                  <p className="mb-6 text-gray-400">
                    Beyond my day job, I help run Schrodinger Hat, a non-profit
                    that's brought open source events to over 20,000 people
                    across Europe. Our biggest event is Open Source Day in
                    Florence—a full-day conference where we bring together
                    developers, companies, and open source enthusiasts. I also
                    speak at conferences about topics like GitOps,
                    infrastructure security, Domain-Driven Design, and building
                    better systems.
                  </p>

                  <h3 className="mb-4 text-xl font-semibold text-gray-100">
                    What I'm Learning Now
                  </h3>
                  <p className="mb-6 text-gray-400">
                    Right now, I'm working on becoming a better team leader. I'm
                    learning that technical skills are just part of the
                    equation—understanding how to help a team grow and work
                    together effectively is equally important. It's a different
                    kind of challenge, but one I find really rewarding.
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
                            className="inline-block rounded-full bg-[#C91F37]/10 px-2 py-1 text-xs text-[#C91F37] ring-1 ring-[#C91F37]/20"
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
                          "Pulumi",
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
                      className="flex items-center text-gray-400 transition-colors hover:text-[#C91F37]"
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
                      className="flex items-center text-gray-400 transition-colors hover:text-[#C91F37]"
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
                      className="flex items-center text-gray-400 transition-colors hover:text-[#C91F37]"
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

          <div className="mx-auto max-w-4xl pt-16 pb-24">
            <Link
              href="/uses"
              className="group block overflow-hidden rounded-2xl border border-gray-800 bg-gradient-to-br from-gray-900 to-gray-900/50 p-8 transition-all duration-300 hover:border-[#C91F37]/50 hover:shadow-lg hover:shadow-[#C91F37]/10"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-[#C91F37]/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon name="🛠️" type="lucide" size="lg" variant="accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-100 transition-colors group-hover:text-[#C91F37]">
                    Curious about my setup?
                  </h3>
                  <p className="mt-2 text-gray-400">
                    Check out the hardware, software, and tools I use daily for
                    development, infrastructure work, and content creation.
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm font-medium text-[#C91F37] transition-transform duration-300 group-hover:translate-x-2">
                    View my setup
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
