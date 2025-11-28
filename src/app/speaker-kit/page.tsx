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
    "Davide Imola is a Software Engineer based in Verona, Italy. He's spent the last decade building infrastructure and applications, working with Kubernetes, Go, and GitOps. At RedCarbon, he leads backend and frontend development for their cybersecurity platform. Outside work, he runs Schrodinger Hat community and organizes Open Source Day in Florence.",
  medium:
    "Davide Imola is a Software Engineer from Verona, Italy, where he also got his Computer Science degree. Over the past 10 years, he's worked as both a freelancer and in companies, focusing mainly on infrastructure and cloud platforms—particularly Kubernetes, GitOps with Flux, and building systems on AWS and GCP. These days, Davide works at RedCarbon, leading their backend and frontend engineering efforts for an AI-powered cybersecurity platform. Go is his language of choice, and he's particularly interested in secure infrastructure design and GitOps practices. When he's not coding, you'll find him organizing Open Source Day in Florence or speaking at conferences about infrastructure security, DDD, and cloud-native development.",
  long: `I'm Davide Imola, a Software Engineer from Verona, Italy. I've been writing code professionally for over 10 years, working across different roles and companies. I got my Computer Science degree from the University of Verona and have been building things ever since.

For most of my career, I focused on Platform and DevOps Engineering—setting up Kubernetes clusters, implementing GitOps workflows with Flux, building CI/CD pipelines, and managing infrastructure on AWS and GCP using tools like Pulumi and AWS CDK. I've worked with many languages along the way: Go (my current favorite), Python, JavaScript/TypeScript, and Java.

Security has always been something I care about. Not just checking boxes, but actually understanding how to build secure systems from the ground up. This interest led me to RedCarbon, where I currently work on their AI-powered cybersecurity platform. I'm responsible for both backend and frontend systems, which keeps things interesting.

Beyond my day job, I'm heavily involved in the open source community. I help run Schrodinger Hat, a non-profit that's brought open source events to over 20,000 people across Europe. Our flagship event is Open Source Day in Florence—a full-day conference where we bring together developers, companies, and open source enthusiasts. I also speak at conferences about topics like GitOps, infrastructure security, Domain-Driven Design, and building better systems.

Right now, I'm working on becoming a better team leader. I'm learning that technical skills are just part of the equation—understanding how to help a team grow and work together effectively is equally important.`,
};

const talkTopics = [
  {
    title: "GitOps in Production",
    abstract:
      "Deep dive into implementing GitOps practices at scale, covering ArgoCD, Flux, and real-world challenges in production environments.",
    duration: "30-45 min",
    level: "Intermediate/Advanced",
    tags: ["GitOps", "Kubernetes", "DevOps", "Flux"],
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
    title: "Gophers Gone Domain-Driven: A Tale of Go and DDD",
    abstract:
      "Exploring how Domain-Driven Design principles work beautifully with Go's simplicity. Real-world experience applying DDD patterns in Go applications, managing bounded contexts, and building maintainable systems that actually reflect your business domain.",
    duration: "30-45 min",
    level: "Intermediate",
    tags: ["Go", "DDD", "Software Architecture", "Design Patterns"],
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
      <main className="bg-[#0D0D0D]">
        {/* Hero Section */}
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Speaker Kit
            </h1>
            {/* Decorative accent line */}
            <div className="mx-auto mt-6 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a39e98]">
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
                className="inline-flex items-center gap-2 rounded-md border border-[#54504c] px-6 py-3 text-sm font-semibold text-[#d4cfc9] transition-all hover:border-[#726d68] hover:text-[#e6e4e0]"
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
              <p className="text-lg leading-8 text-[#a39e98]">
                High-resolution speaking photo for conference materials
              </p>
            </div>

            <div className="mx-auto max-w-2xl">
              <div className="overflow-hidden rounded-xl border border-[#2A2725] bg-[#1A1816]">
                <Image
                  src="/images/davide-speaking-profile.webp"
                  alt="Davide Imola speaking at a conference"
                  width={800}
                  height={600}
                  className="w-full"
                  priority
                />
                <div className="p-6">
                  <p className="mb-4 text-sm text-[#a39e98]">
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
        <section className="bg-[#1A1816]/30 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
                Biography
              </h2>
              <div className="mx-auto mb-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
              <p className="text-lg leading-8 text-[#a39e98]">
                Choose the bio length that fits your needs
              </p>
            </div>

            <div className="space-y-6">
              {/* Short Bio */}
              <div className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      Short Bio
                    </h3>
                    <p className="text-sm text-[#726d68]">
                      ~50 words - Quick introductions
                    </p>
                  </div>
                  <CopyButton text={bios.short} label="Copy" />
                </div>
                <p className="text-[#d4cfc9]">{bios.short}</p>
              </div>

              {/* Medium Bio */}
              <div className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      Medium Bio
                    </h3>
                    <p className="text-sm text-[#726d68]">
                      ~100 words - Standard speaker introductions
                    </p>
                  </div>
                  <CopyButton text={bios.medium} label="Copy" />
                </div>
                <p className="text-[#d4cfc9]">{bios.medium}</p>
              </div>

              {/* Long Bio */}
              <div className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-100">
                      Long Bio
                    </h3>
                    <p className="text-sm text-[#726d68]">
                      ~200 words - Detailed conference programs
                    </p>
                  </div>
                  <CopyButton text={bios.long} label="Copy" />
                </div>
                <p className="whitespace-pre-line text-[#d4cfc9]">
                  {bios.long}
                </p>
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
              <p className="text-lg leading-8 text-[#a39e98]">
                Popular talks I can deliver at your event
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {talkTopics.map((talk) => (
                <div
                  key={talk.title}
                  className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6 transition-all duration-300 hover:border-[#C91F37]/50"
                >
                  <h3 className="mb-3 text-xl font-semibold text-gray-100">
                    {talk.title}
                  </h3>
                  <p className="mb-4 text-[#a39e98]">{talk.abstract}</p>

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

                  <div className="flex flex-wrap gap-4 text-sm text-[#726d68]">
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
        <section className="bg-[#1A1816]/30 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
                Speaker Information
              </h2>
              <div className="mx-auto mb-4 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Languages */}
              <div className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Languages
                </h3>
                <ul className="space-y-2">
                  {speakerInfo.languages.map((lang) => (
                    <li key={lang} className="flex items-center text-[#d4cfc9]">
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
              <div className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Areas of Expertise
                </h3>
                <ul className="space-y-2">
                  {speakerInfo.expertise.map((area) => (
                    <li key={area} className="flex items-center text-[#d4cfc9]">
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
              <div className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Talk Formats
                </h3>
                <ul className="space-y-2">
                  {speakerInfo.formats.map((format) => (
                    <li
                      key={format}
                      className="flex items-center text-[#d4cfc9]"
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
              <div className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-100">
                  Travel & Availability
                </h3>
                <p className="text-[#d4cfc9]">{speakerInfo.travel}</p>
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
              <div className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-8">
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="mb-2 text-sm font-medium text-[#a39e98]">
                      Website
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-[#2A2725] px-4 py-2">
                      <code className="text-sm text-[#d4cfc9]">
                        davideimola.dev
                      </code>
                      <CopyButton text="https://davideimola.dev" label="" />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-[#a39e98]">
                      GitHub
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-[#2A2725] px-4 py-2">
                      <code className="text-sm text-[#d4cfc9]">
                        @davideimola
                      </code>
                      <CopyButton
                        text="https://github.com/davideimola"
                        label=""
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-[#a39e98]">
                      LinkedIn
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-[#2A2725] px-4 py-2">
                      <code className="text-sm text-[#d4cfc9]">
                        @davideimola
                      </code>
                      <CopyButton
                        text="https://linkedin.com/in/davideimola"
                        label=""
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-[#a39e98]">
                      BlueSky
                    </p>
                    <div className="flex items-center justify-between rounded-lg bg-[#2A2725] px-4 py-2">
                      <code className="text-sm text-[#d4cfc9]">
                        @davideimola.dev
                      </code>
                      <CopyButton
                        text="https://bsky.app/profile/davideimola.dev"
                        label=""
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="mb-4 text-[#a39e98]">
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
        <section className="bg-[#1A1816] py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-2xl font-bold text-gray-100">
                Want to see me in action?
              </h2>
              <p className="mb-8 text-[#a39e98]">
                Check out my past speaking engagements, recorded talks, and
                slides from previous conferences.
              </p>
              <Link
                href="/speaking"
                className="inline-flex items-center gap-2 rounded-md border border-[#54504c] px-6 py-3 text-sm font-semibold text-[#d4cfc9] transition-all hover:border-[#726d68] hover:text-[#e6e4e0]"
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
