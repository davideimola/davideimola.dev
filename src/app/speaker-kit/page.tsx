import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { CopyButton } from "~/app/_components/copy-button";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Speaker Kit | Davide Imola - Tech Speaker",
  description:
    "Download Davide Imola's speaker kit including bio, professional photos, talk abstracts, and technical requirements for conference organizers.",
  keywords:
    "Davide Imola, Speaker Kit, Press Kit, Bio, Speaker Photos, Talk Abstracts, Conference Speaker, Tech Speaker",
  openGraph: {
    title: "Speaker Kit | Davide Imola - Tech Speaker",
    description:
      "Everything conference organizers need: bio, photos, talk abstracts, and technical details for booking Davide Imola as a speaker.",
    url: "https://davideimola.dev/speaker-kit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Speaker Kit | Davide Imola - Tech Speaker",
    description:
      "Speaker kit for conference organizers. Bio, photos, and talk abstracts available.",
  },
};

const bios = {
  short:
    "Davide Imola is a DevOps Engineer and Tech Lead specializing in Cloud Native technologies, GitOps, and Kubernetes. He's an active open-source contributor and community organizer passionate about infrastructure automation and security.",
  medium:
    "Davide Imola is a DevOps Engineer and Tech Lead with deep expertise in Cloud Native technologies, GitOps, and Kubernetes. As an active open-source contributor and community leader, he founded Schrödinger Hat, an international tech community helping developers grow through collaboration. Davide regularly speaks at international conferences about infrastructure, security, and DevOps best practices, combining technical depth with engaging storytelling.",
  long: `Davide Imola is a DevOps Engineer and Tech Lead passionate about Cloud Native technologies, infrastructure automation, and security. With extensive experience in building and scaling cloud infrastructure, he specializes in GitOps, Kubernetes, and Go development.

As a community builder, Davide founded Schrödinger Hat, an international tech community that brings developers together to share knowledge and grow. He's also deeply involved in the Italian tech community, organizing and speaking at events like OSDay.

Davide is a strong advocate for open source and actively contributes to various projects in the Cloud Native ecosystem. He brings both Italian warmth and Japanese-inspired minimalism to his approach, creating solutions that are elegant, efficient, and human-centered. When he's not working on infrastructure, you'll find him exploring Japanese culture, from anime and manga to cuisine and design philosophy.`,
};

const talkTopics = [
  {
    title: "GitOps in Production",
    abstract:
      "Deep dive into implementing GitOps practices at scale, covering ArgoCD, Flux, and real-world challenges in production environments.",
    duration: "30-45 min",
    level: "Intermediate/Advanced",
    tags: ["GitOps", "Kubernetes", "DevOps", "ArgoCD"],
  },
  {
    title: "Securing Secrets in the GitOps Era",
    abstract:
      "Exploring modern approaches to secrets management in GitOps workflows, including sealed secrets, external secrets operators, and security best practices.",
    duration: "30-45 min",
    level: "Intermediate",
    tags: ["Security", "GitOps", "Kubernetes", "Secrets Management"],
  },
  {
    title: "Level Up Your RDBMS Productivity in Go",
    abstract:
      "Practical techniques for working efficiently with relational databases in Go, covering ORMs, query builders, and performance optimization.",
    duration: "30-45 min",
    level: "Intermediate",
    tags: ["Go", "Database", "Performance", "Backend"],
  },
  {
    title: "Building Cloud Native Infrastructure",
    abstract:
      "From containers to Kubernetes: a journey through modern cloud native infrastructure patterns, best practices, and lessons learned.",
    duration: "45-60 min",
    level: "Beginner/Intermediate",
    tags: ["Cloud Native", "Kubernetes", "Infrastructure", "DevOps"],
  },
];

const speakerInfo = {
  languages: ["Italian (native)", "English (fluent)"],
  expertise: [
    "Cloud Native & Kubernetes",
    "GitOps & Infrastructure as Code",
    "DevOps & CI/CD",
    "Go Development",
    "Security & Secrets Management",
    "Open Source & Community Building",
  ],
  formats: ["Conference Talks (30-60 min)", "Workshops (2-4 hours)", "Panels"],
  travel: "Available for events in Europe and internationally",
};

export default function SpeakerKit() {
  return (
    <>
      <Header />
      <main className="bg-[#0A0A0A]">
        {/* Hero Section */}
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Speaker Kit
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
              「Everything you need to know about booking me as a speaker.
              Download bio, photos, and talk abstracts.」
            </p>

            {/* Quick Download Buttons */}
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <a
                href="/images/davide-speaking-profile.webp"
                download
                className="inline-flex items-center gap-2 rounded-md bg-[#C91F37] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D3381C]"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download Photo
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:border-gray-500 hover:text-gray-200"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
                Book Me to Speak
              </Link>
            </div>
          </div>
        </section>

        {/* Professional Photo */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
                Professional Photo
              </h2>
              <div className="mx-auto mb-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="text-lg leading-8 text-gray-400">
                High-resolution speaking photo for conference materials
              </p>
            </div>

            <div className="mx-auto max-w-2xl">
              <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-900">
                <Image
                  src="/images/davide-speaking-profile.webp"
                  alt="Davide Imola speaking at a conference"
                  width={800}
                  height={600}
                  className="w-full"
                  priority
                />
                <div className="p-6">
                  <p className="mb-4 text-sm text-gray-400">
                    Right-click to save, or use the download button below. Photo
                    credit: Conference organizers welcome to use this image
                    freely.
                  </p>
                  <a
                    href="/images/davide-speaking-profile.webp"
                    download="davide-imola-speaker.webp"
                    className="inline-flex items-center gap-2 rounded-md bg-[#C91F37] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D3381C]"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                    Download High-Res Photo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bio Section */}
        <section className="bg-gray-900/30 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
                Biography
              </h2>
              <div className="mx-auto mb-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="text-lg leading-8 text-gray-400">
                Choose the bio length that fits your needs
              </p>
            </div>

            <div className="space-y-6">
              {/* Short Bio */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      Short Bio
                    </h3>
                    <p className="text-sm text-gray-500">
                      ~50 words - Quick introductions
                    </p>
                  </div>
                  <CopyButton text={bios.short} label="Copy" />
                </div>
                <p className="text-gray-300">{bios.short}</p>
              </div>

              {/* Medium Bio */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      Medium Bio
                    </h3>
                    <p className="text-sm text-gray-500">
                      ~100 words - Standard speaker introductions
                    </p>
                  </div>
                  <CopyButton text={bios.medium} label="Copy" />
                </div>
                <p className="text-gray-300">{bios.medium}</p>
              </div>

              {/* Long Bio */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      Long Bio
                    </h3>
                    <p className="text-sm text-gray-500">
                      ~200 words - Detailed conference programs
                    </p>
                  </div>
                  <CopyButton text={bios.long} label="Copy" />
                </div>
                <p className="whitespace-pre-line text-gray-300">{bios.long}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Talk Topics */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
                Talk Topics
              </h2>
              <div className="mx-auto mb-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="text-lg leading-8 text-gray-400">
                Popular talks I can deliver at your event
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {talkTopics.map((talk) => (
                <div
                  key={talk.title}
                  className="rounded-xl border border-gray-800 bg-gray-900 p-6 transition-all duration-300 hover:border-[#C91F37]/50"
                >
                  <h3 className="mb-3 text-xl font-semibold text-gray-100">
                    {talk.title}
                  </h3>
                  <p className="mb-4 text-gray-400">{talk.abstract}</p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {talk.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-[#C91F37]/10 px-3 py-1 text-xs font-medium text-[#C91F37] ring-1 ring-[#C91F37]/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div>
                      <span className="font-medium">Duration:</span>{" "}
                      {talk.duration}
                    </div>
                    <div>
                      <span className="font-medium">Level:</span> {talk.level}
                    </div>
                  </div>

                  <div className="mt-4">
                    <CopyButton
                      text={`${talk.title}\n\n${talk.abstract}\n\nDuration: ${talk.duration}\nLevel: ${talk.level}`}
                      label="Copy Abstract"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Speaker Info */}
        <section className="bg-gray-900/30 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
                Speaker Information
              </h2>
              <div className="mx-auto mb-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Languages */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Languages
                </h3>
                <ul className="space-y-2">
                  {speakerInfo.languages.map((lang) => (
                    <li key={lang} className="flex items-center text-gray-300">
                      <svg
                        className="mr-2 h-5 w-5 text-[#C91F37]"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {lang}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expertise */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Areas of Expertise
                </h3>
                <ul className="space-y-2">
                  {speakerInfo.expertise.map((area) => (
                    <li key={area} className="flex items-center text-gray-300">
                      <svg
                        className="mr-2 h-5 w-5 text-[#C91F37]"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Talk Formats */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Talk Formats
                </h3>
                <ul className="space-y-2">
                  {speakerInfo.formats.map((format) => (
                    <li
                      key={format}
                      className="flex items-center text-gray-300"
                    >
                      <svg
                        className="mr-2 h-5 w-5 text-[#C91F37]"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                      {format}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Travel */}
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Travel & Availability
                </h3>
                <p className="text-gray-300">{speakerInfo.travel}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social & Contact */}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
                Connect & Contact
              </h2>
              <div className="mx-auto mb-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            </div>

            <div className="mx-auto max-w-2xl">
              <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-400">
                      Website
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-2">
                      <code className="text-sm text-gray-300">
                        davideimola.dev
                      </code>
                      <CopyButton text="https://davideimola.dev" label="" />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-400">
                      GitHub
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-2">
                      <code className="text-sm text-gray-300">
                        @davideimola
                      </code>
                      <CopyButton
                        text="https://github.com/davideimola"
                        label=""
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-400">
                      LinkedIn
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-2">
                      <code className="text-sm text-gray-300">
                        @davideimola
                      </code>
                      <CopyButton
                        text="https://linkedin.com/in/davideimola"
                        label=""
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-gray-400">
                      Twitter/X
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-2">
                      <code className="text-sm text-gray-300">
                        @davide_imola
                      </code>
                      <CopyButton
                        text="https://twitter.com/davide_imola"
                        label=""
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="mb-4 text-gray-400">
                    Ready to book me for your event?
                  </p>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 rounded-md bg-[#C91F37] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#D3381C]"
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                      />
                    </svg>
                    Get in Touch
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Past Speaking */}
        <section className="bg-gray-900 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-100">
                Want to see me in action?
              </h2>
              <p className="mb-8 text-gray-400">
                Check out my past speaking engagements, recorded talks, and
                slides from previous conferences.
              </p>
              <Link
                href="/speaking"
                className="inline-flex items-center gap-2 rounded-md border border-gray-600 px-6 py-3 text-sm font-semibold text-gray-300 transition-all hover:border-gray-500 hover:text-gray-200"
              >
                View Speaking History
                <svg
                  className="h-4 w-4"
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
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
