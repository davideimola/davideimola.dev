import {
  IconBallFootball,
  IconDeviceGamepad2,
  IconDice5,
  IconDownload,
  IconGrill,
  IconKarate,
  IconMovie,
  IconMusic,
  IconPlane,
  IconPokeball,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import type { ExperienceEntry } from "../../components/ui/ExperienceTimeline";
import { ExperienceTimeline } from "../../components/ui/ExperienceTimeline";
import { JsonLd } from "../../components/ui/JsonLd";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { SectionHeader } from "../../components/ui/SectionHeader";

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Davide Imola",
  url: "https://davideimola.dev",
  jobTitle: "Tech Lead",
  worksFor: { "@type": "Organization", name: "RedCarbon" },
  description:
    "Tech Lead, platform engineer, open source builder. Conference speaker on DevOps, GitOps, and Go.",
  sameAs: [
    "https://github.com/davideimola",
    "https://www.linkedin.com/in/davideimola/",
    "https://bsky.app/profile/davideimola.dev",
  ],
};

export const metadata: Metadata = {
  title: "About",
  description:
    "Tech Lead, platform engineer, open source builder. I believe what you learn must be shared.",
  openGraph: {
    title: "About — Davide Imola",
    images: [
      {
        url: "https://davideimola.dev/og?title=About&category=whoami",
        width: 1200,
        height: 630,
      },
    ],
    description:
      "Tech Lead, platform engineer, open source builder. I believe what you learn must be shared.",
    url: "https://davideimola.dev/about",
  },
};

const TECHNOLOGIES = [
  {
    name: "Go",
    context: "Primary language. Production microservices, two GOLab talks.",
  },
  {
    name: "Kubernetes",
    context: "Platform engineering backbone. Multiple conference talks, KCD Italy speaker.",
  },
  {
    name: "Flux",
    context: "GitOps operator of choice. Dedicated talks at KCD, DevOps Day, Incontro DevOps.",
  },
  { name: "gRPC", context: "Microservices communication at RedCarbon." },
  {
    name: "TypeScript / Next.js",
    context: "Product frontend. What this site is built with.",
  },
  {
    name: "Pulumi",
    context: "Infrastructure as code. Code-first approach over config-heavy alternatives.",
  },
];

const METHODOLOGIES = [
  {
    name: "DDD",
    context: "Domain-Driven Design. Modeling complex domains — GOLab 2024 talk on Go + DDD.",
  },
  {
    name: "TDD",
    context: "Discipline built through Clean Code and Clean Architecture. Non-negotiable.",
  },
  {
    name: "GitOps",
    context: "Declarative infrastructure. State lives in Git, not in someone's head.",
  },
  {
    name: "DevOps culture",
    context: "CI/CD, IaC, developer experience as engineering leverage. ~10 years background.",
  },
  {
    name: "Agile / team leadership",
    context:
      "Growing a team, not just shipping features. If we don't all grow, the company doesn't.",
  },
];

const EXPERIENCE: ExperienceEntry[] = [
  {
    company: "RedCarbon",
    period: "Sep 2022 — Present",
    current: true,
    roles: [
      {
        role: "Tech Lead",
        period: "Jan 2026 — Present",
        description:
          "Tech lead for the development team building an AI-powered cybersecurity platform. I still write code every day — the role is about helping the team move faster and grow, not stepping back from engineering.",
        current: true,
      },
      {
        role: "Software Engineer",
        period: "Sep 2022 — Dec 2025",
        description:
          "Backend engineering on a Go microservices platform. Kubernetes, GCP, gRPC, Next.js. Grew into the tech lead role from here.",
        current: false,
      },
    ],
  },
  {
    company: "Milkman Technologies",
    period: "Aug 2020 — Sep 2022",
    current: false,
    roles: [
      {
        role: "DevOps Engineer",
        period: "Aug 2020 — Sep 2022",
        description:
          "Last-mile delivery platform. AWS, Kafka, PostgreSQL, Datadog. Focus on reliability and observability.",
        current: false,
      },
    ],
  },
  {
    company: "Codemotion",
    period: "Jan 2021 — Apr 2021",
    current: false,
    roles: [
      {
        role: "IT Instructor",
        period: "Jan 2021 — Apr 2021",
        description:
          "Freelance instructor. Wrote and delivered courses on IaC, DevOps practices, and Cloud Security.",
        current: false,
      },
    ],
  },
  {
    company: "ASEM S.r.l.",
    period: "Dec 2017 — Aug 2020",
    current: false,
    roles: [
      {
        role: "DevOps Engineer",
        period: "Dec 2017 — Aug 2020",
        description:
          "Industrial automation software. Built CI/CD pipelines, containerized legacy systems with Docker, C#.",
        current: false,
      },
    ],
  },
  {
    company: "EDALab",
    period: "Nov 2016 — Sep 2017",
    current: false,
    roles: [
      {
        role: "Software Engineer",
        period: "Nov 2016 — Sep 2017",
        description:
          "Internship turned first job. Embedded systems, Qt, iOS, C++. Where engineering got serious.",
        current: false,
      },
    ],
  },
];

const COMMUNITY = [
  {
    name: "Open Source Day",
    role: "Co-organizer",
    description:
      "Yearly open source conference in Florence, Italy. 500+ attendees, international speakers, full community effort. The project I'm most proud of.",
    href: "https://osday.dev",
  },
  {
    name: "Schrodinger Hat",
    role: "Co-founder",
    description:
      "International open source community. 20k+ people across Europe. Built from scratch, still growing.",
    href: "https://schrodinger-hat.it",
  },
  {
    name: "Sharing",
    role: "Speaker & Organizer",
    description:
      "GOLab, KCD Italy, WeAreDevelopers World Congress, DevSecOps Day, Incontro DevOps Italia and more. Concrete talks, honest about tradeoffs.",
    href: "/sharing",
  },
  {
    name: "Teaching",
    role: "Instructor & mentor",
    description:
      "Codemotion courses on DevOps, IaC, Cloud Security. Workshops at community events. Knowledge shared is knowledge multiplied.",
    href: null,
  },
];

const HOBBIES = [
  {
    label: "Football",
    icon: IconBallFootball,
    context: "I play futsal and follow Hellas Verona — home games included.",
    href: null,
  },
  {
    label: "BBQ & low and slow",
    icon: IconGrill,
    context:
      "American-style long cooks, sous vide, and underrated cuts. Favourite: skirt steak (diaframma) — cheap, flavourful, unbeatable.",
    href: null,
  },
  {
    label: "Video games",
    icon: IconDeviceGamepad2,
    context:
      "RPGs and action-adventure. Loved: Clair Obscur Expedition 33, Baldur's Gate 3, Zelda BotW & TotK. Also a lifelong Pokémon fan.",
    href: null,
  },
  {
    label: "Pokémon cards",
    icon: IconPokeball,
    context:
      "Collecting for a couple of years. Building the Pokédex in rare and full-art variants. It's an obsession disguised as a hobby.",
    href: null,
  },
  {
    label: "Tabletop & D&D",
    icon: IconDice5,
    context: "Board game collector. Currently playing a D&D campaign — and writing one to DM soon.",
    href: null,
  },
  {
    label: "JuJutsu",
    icon: IconKarate,
    context: "Hontai Yōshin-ryū. White belt — still figuring out how to fall correctly.",
    href: null,
  },
  {
    label: "Music",
    icon: IconMusic,
    context:
      "Everything from Linkin Park to De André, Eminem to Hans Zimmer. I go to concerts whenever I can — saw LP live in 2025.",
    href: "https://open.spotify.com/playlist/1qLEh5nRfgkelDOQqBScxE?si=de08590bfe4f4eee",
  },
  {
    label: "Travel",
    icon: IconPlane,
    context:
      "I travel to learn. Japan was a dream — I'll go back. Asia draws me most: temples, art, religion, and food I'd never stop to think twice about trying.",
    href: null,
  },
  {
    label: "Film & Series",
    icon: IconMovie,
    context:
      "Fantasy and action. Lord of the Rings is untouchable. Grew up with Harry Potter. The occasional anime binge or documentary at midnight.",
    href: null,
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <JsonLd data={PERSON_SCHEMA} />
      {/* Page header */}
      <ScrollReveal>
        <header className="mb-16">
          <p className="font-mono text-[13px] text-text-3 mb-4">
            <span className="text-accent mr-2">❯</span>whoami
          </p>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-12 items-start">
            {/* Bio text */}
            <div className="flex-1 min-w-0">
              <h1 className="font-mono text-[32px] sm:text-[40px] font-bold text-text-1 tracking-[-0.03em] leading-none mb-6">
                About
              </h1>
              <div className="flex flex-col gap-4">
                <p className="font-sans text-[15px] text-text-2 leading-relaxed">
                  I started with curiosity. A CS degree from Verona, a lot of self-taught tools, and
                  the drive to understand how things actually work — not just how to make them run.
                  My first real team job taught me that readable code isn't just a nicety: it's the
                  difference between a codebase that scales and one that breaks you. Clean Code and
                  Clean Architecture landed at the right moment.
                </p>
                <p className="font-sans text-[15px] text-text-2 leading-relaxed">
                  I spent about ten years in the DevOps world — building pipelines, containerizing
                  systems, moving infrastructure into code. Then I moved deeper into backend
                  engineering, found DDD, and started treating software as a language for domains,
                  not just a set of instructions. Now I'm a Tech Lead at RedCarbon, where I lead a
                  team of developers building an AI-powered cybersecurity platform — and still write
                  code every day.
                </p>
                <p className="font-sans text-[15px] text-text-2 leading-relaxed">
                  The shift to leadership changed something: I care less about my own code and more
                  about the team's trajectory. If we don't all grow, the company doesn't.
                </p>
              </div>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[12px] text-text-3 hover:text-accent transition-colors duration-150 mt-2 w-fit"
              >
                <IconDownload size={13} stroke={1.5} />
                Download CV →
              </a>
            </div>

            {/* Photo */}
            <div className="shrink-0 sm:mt-14">
              <div className="w-[220px] sm:w-[280px] aspect-3/4 overflow-hidden rounded-sm border border-border">
                <img
                  src="/images/davide-about-profile.webp"
                  alt="Davide Imola speaking at a conference"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </div>
        </header>
      </ScrollReveal>

      {/* Philosophy */}
      <ScrollReveal>
        <section className="mb-16 border-t border-border pt-10">
          <blockquote className="border-l-2 border-accent pl-6 py-1">
            <p className="font-mono text-[15px] sm:text-[17px] text-text-1 leading-snug">
              What you learn, you must share.
              <br />
              <span className="text-text-2 text-[13px] sm:text-[15px]">
                Knowledge shared is not knowledge lost — it's knowledge multiplied.
              </span>
            </p>
          </blockquote>
          <p className="font-sans text-[14px] text-text-3 mt-4 pl-6">
            This is why I speak at conferences, organize OS Day, write, teach, and try to make open
            source communities actually work. You learn from others; you owe it back.
          </p>
        </section>
      </ScrollReveal>

      {/* Tech stack */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Stack" />
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Technologies */}
          <ScrollReveal>
            <div>
              <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
                Technologies
              </p>
              <ul className="flex flex-col gap-4">
                {TECHNOLOGIES.map((tech) => (
                  <li key={tech.name} className="flex flex-col gap-0.5">
                    <span className="font-mono text-[13px] font-medium text-text-1 flex items-center gap-2">
                      <span className="text-accent text-[10px]">{`//`}</span>
                      {tech.name}
                    </span>
                    <span className="font-sans text-[13px] text-text-3 pl-5">{tech.context}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Methodologies */}
          <ScrollReveal>
            <div>
              <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
                Methodologies & approach
              </p>
              <ul className="flex flex-col gap-4">
                {METHODOLOGIES.map((m) => (
                  <li key={m.name} className="flex flex-col gap-0.5">
                    <span className="font-mono text-[13px] font-medium text-text-1 flex items-center gap-2">
                      <span className="text-accent text-[10px]">{`//`}</span>
                      {m.name}
                    </span>
                    <span className="font-sans text-[13px] text-text-3 pl-5">{m.context}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        {/* Link to /uses */}
        <ScrollReveal>
          <p className="font-mono text-[12px] text-text-3 mt-8">
            Full hardware + software setup →{" "}
            <a
              href="/uses"
              className="text-text-2 hover:text-accent transition-colors duration-150"
            >
              /uses
            </a>
          </p>
        </ScrollReveal>
      </section>

      {/* Experience */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Experience" />
        </ScrollReveal>
        <ExperienceTimeline entries={EXPERIENCE} />

        {/* Education */}
        <ScrollReveal>
          <div className="mt-4 pt-6 border-t border-border flex flex-col gap-3">
            <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-2">
              Education
            </p>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[13px] text-text-1">
                Università degli Studi di Verona
              </span>
              <span className="font-sans text-[13px] text-text-2">
                B.Sc. Computer Science — 94/110, 2014–2017
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[13px] text-text-1">ITI G. Marconi, Verona</span>
              <span className="font-sans text-[13px] text-text-2">
                Technical high school — 2009–2014
              </span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Community */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Community" />
        </ScrollReveal>

        {/* OS Day — featured */}
        <ScrollReveal>
          <div className="border border-border-hover bg-accent-glow rounded-sm p-6 flex flex-col gap-3 mb-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-mono text-[14px] font-semibold text-text-1">
                Open Source Day
              </span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-accent tracking-[0.06em]">
                  Co-organizer
                </span>
                <span className="font-mono text-[10px] text-text-3 border border-border rounded-[2px] px-1.5 py-0.5">
                  most proud of
                </span>
              </div>
            </div>
            <p className="font-sans text-[14px] text-text-2 leading-relaxed">
              Yearly open source conference in Florence, Italy. 500+ attendees, international
              speakers — and completely free. Students, early-career developers, anyone without a
              budget: everyone can come. Knowledge should be open and accessible to all. That's not
              a tagline, it's the reason this conference exists. There's an enormous amount of
              invisible work behind every edition — and that's exactly why it matters.
            </p>
            <a
              href="https://osday.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150 self-start"
            >
              Visit →
            </a>
          </div>
        </ScrollReveal>

        {/* Other community items */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {COMMUNITY.filter((item) => item.name !== "Open Source Day").map((item, i) => (
            <ScrollReveal key={item.name} delay={i * 60}>
              <div className="border border-border rounded-sm p-5 flex flex-col gap-2 h-full hover:border-border-hover transition-colors duration-150">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <span className="font-mono text-[13px] font-medium text-text-1">{item.name}</span>
                  <span className="font-mono text-[10px] text-accent tracking-[0.06em]">
                    {item.role}
                  </span>
                </div>
                <p className="font-sans text-[13px] text-text-2 leading-relaxed flex-1">
                  {item.description}
                </p>
                {item.href && (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150 self-start mt-1"
                  >
                    {item.href.startsWith("http") ? "Visit →" : "See talks →"}
                  </a>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* What I'm exploring */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="What I'm exploring" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ScrollReveal>
            <div className="border-l-2 border-accent pl-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-medium text-text-1">Security</span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                  in progress
                </span>
              </div>
              <p className="font-sans text-[13px] text-text-2 leading-relaxed">
                Working inside a cybersecurity company changes how you think about every line of
                code. The field is moving fast and there's no standing still — I'm deep in it daily
                at RedCarbon.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={60}>
            <div className="border-l-2 border-accent pl-5 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[13px] font-medium text-text-1">
                  AI / LLM infrastructure
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px] text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse inline-block" />
                  in progress
                </span>
              </div>
              <p className="font-sans text-[13px] text-text-2 leading-relaxed">
                Model hosting, MLOps, vLLM on Kubernetes. AI is changing how software is built and I
                want to understand the infrastructure layer — not just use the APIs.
              </p>
            </div>
          </ScrollReveal>
        </div>
        <ScrollReveal>
          <p className="font-mono text-[12px] text-text-3 mt-8">
            What I'm doing right now →{" "}
            <a href="/now" className="text-text-2 hover:text-accent transition-colors duration-150">
              /now
            </a>
          </p>
        </ScrollReveal>
      </section>

      {/* Beyond the code */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Beyond the code" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {HOBBIES.map((hobby, i) => (
            <ScrollReveal key={hobby.label} delay={i * 40}>
              <div className="border border-border rounded-sm p-4 flex flex-col gap-2 h-full hover:border-border-hover transition-colors duration-150">
                <div className="flex items-center gap-2">
                  <hobby.icon size={18} stroke={1.5} className="text-text-3 shrink-0" />
                  <span className="font-mono text-[12px] font-medium text-text-1">
                    {hobby.label}
                  </span>
                </div>
                <p className="font-sans text-[12px] text-text-2 leading-relaxed flex-1">
                  {hobby.context}
                </p>
                {hobby.href && (
                  <a
                    href={hobby.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150 self-start mt-1"
                  >
                    Playlist →
                  </a>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Companion pages */}
      <ScrollReveal>
        <section className="mb-12 border-t border-border pt-10">
          <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
            Go deeper
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="/now"
              className="group border border-border rounded-sm p-5 flex flex-col gap-2 hover:border-border-hover transition-colors duration-150"
            >
              <span className="font-mono text-[13px] font-medium text-text-1 group-hover:text-accent transition-colors duration-150">
                /now
              </span>
              <p className="font-sans text-[13px] text-text-2 leading-relaxed">
                What I'm working on, reading, and thinking about right now. Updated when something
                changes.
              </p>
              <span className="font-mono text-[11px] text-text-3 group-hover:text-accent transition-colors duration-150 mt-1">
                View →
              </span>
            </a>
            <a
              href="/uses"
              className="group border border-border rounded-sm p-5 flex flex-col gap-2 hover:border-border-hover transition-colors duration-150"
            >
              <span className="font-mono text-[13px] font-medium text-text-1 group-hover:text-accent transition-colors duration-150">
                /uses
              </span>
              <p className="font-sans text-[13px] text-text-2 leading-relaxed">
                Hardware, software, tools, and setup. Everything I use daily to build and think.
              </p>
              <span className="font-mono text-[11px] text-text-3 group-hover:text-accent transition-colors duration-150 mt-1">
                View →
              </span>
            </a>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA */}
      <ScrollReveal>
        <div className="pt-8 border-t border-border">
          <p className="font-sans text-[14px] text-text-2">
            Want to talk engineering, community, or collaboration?{" "}
            <a
              href="https://www.linkedin.com/in/davideimola/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-1 hover:text-accent transition-colors duration-150"
            >
              Get in touch →
            </a>
          </p>
        </div>
      </ScrollReveal>
    </div>
  );
}
