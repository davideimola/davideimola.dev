import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { JsonLd } from "../../../components/ui/JsonLd";
import { ScrollReveal } from "../../../components/ui/ScrollReveal";
import {
  getAboutNarrative,
  getIdentity,
  getOrganisedEvents,
  getTotalTalkCount,
  getTrajectory,
} from "../../../lib/cv";
import { PERSON_SCHEMA } from "../../../lib/schema";

const DESCRIPTION =
  "Tech Lead building AI agents for cybersecurity, open source builder. I believe what you learn must be shared.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  openGraph: {
    title: "About · Davide Imola",
    images: [
      { url: "https://davideimola.dev/og?title=About&category=whoami", width: 1200, height: 630 },
    ],
    description: DESCRIPTION,
    url: "https://davideimola.dev/about",
  },
};

// The one thing on this page that is not derived from the CV Record. Hobbies are
// deliberately outside the story: they are what the page closes with, not a step of
// it, and framing them that way is what stopped them reading as bolted on.
const HOBBIES = [
  { label: "Football", context: "I play futsal and follow Hellas Verona, home games included." },
  {
    label: "BBQ, low and slow",
    context:
      "American-style long cooks, sous vide, and underrated cuts. Favourite: skirt steak. Cheap, flavourful, unbeatable.",
  },
  {
    label: "Video games",
    context:
      "RPGs and action-adventure. Loved: Clair Obscur Expedition 33, Baldur's Gate 3, Zelda BotW and TotK. Lifelong Pokémon fan.",
  },
  {
    label: "Pokémon cards",
    context:
      "Building the Pokédex in rare and full-art variants. An obsession disguised as a hobby.",
  },
  {
    label: "Tabletop and D&D",
    context: "Board game collector. Currently playing a campaign, and writing one to DM soon.",
  },
  { label: "JuJutsu", context: "Hontai Yōshin-ryū. Yellow belt; orange is the next milestone." },
  {
    label: "Music",
    context:
      "Everything from Linkin Park to De André, Eminem to Hans Zimmer. Concerts whenever I can.",
  },
  {
    label: "Travel",
    context: "I travel to learn. Japan was a dream; I'll go back. Asia draws me most.",
  },
  {
    label: "Film and series",
    context: "Fantasy and action. Lord of the Rings is untouchable. The occasional anime binge.",
  },
];

function RailHeading({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-3">{children}</p>
  );
}

function ToolChips({ names }: { names: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {names.map((name) => (
        <li
          key={name}
          className="font-mono text-[11px] text-text-2 border border-border rounded-full px-2.5 py-1"
        >
          {name}
        </li>
      ))}
    </ul>
  );
}

export default function AboutPage() {
  const identity = getIdentity();
  const { lead, creed } = getAboutNarrative();
  const phases = getTrajectory();
  // Conference series only, which `noun` identifies: what a step *started* is the
  // community and the conference, and the meetup nights and the hackathon are what
  // that community then does. /cv lists all of them; here they would turn a
  // three-item block into a five-item one that mixes granularity.
  const organised = getOrganisedEvents().filter((event) => event.noun === "edition");
  const talkCount = getTotalTalkCount();

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <JsonLd data={PERSON_SCHEMA} />

      {/* The portrait stretches to the height of the text beside it rather than
          setting its own: a tall image next to three lines of lead is what used to
          open a band of blank page under the words. */}
      <ScrollReveal>
        <header className="mb-16">
          <p className="font-mono text-[13px] text-text-3 mb-4">
            <span className="text-accent mr-2">❯</span>whoami
          </p>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 sm:items-stretch">
            <div className="flex-1 min-w-0">
              <h1 className="font-mono text-[32px] sm:text-[44px] font-bold text-text-1 tracking-[-0.03em] leading-none mb-5">
                {identity.name}
              </h1>
              <p className="font-sans text-[16px] text-text-2 leading-relaxed max-w-xl mb-8">
                {lead}
              </p>
              {/* The command is stated once and the chapters below are its output.
                  Repeating it per chapter is what made the device wear out. */}
              <p className="font-mono text-[13px] text-text-3">
                <span className="text-accent mr-2">❯</span>git log --oneline --reverse
              </p>
              <p className="font-mono text-[12px] text-text-3 mt-2 pl-6">
                {phases.length} commits, {phases[0].period.split(" ")[0]} to today. The dated
                version is on{" "}
                <Link href="/cv" className="text-text-2 hover:text-accent transition-colors">
                  /cv
                </Link>
                .
              </p>
            </div>
            <div className="shrink-0 w-[200px] sm:w-[220px] sm:self-stretch min-h-[280px] overflow-hidden rounded-sm border border-border">
              <Image
                src="/images/davide-about-profile.webp"
                alt="Portrait of Davide Imola"
                width={220}
                height={420}
                className="w-full h-full object-cover object-top grayscale"
              />
            </div>
          </div>
        </header>
      </ScrollReveal>

      {/* The trajectory is the page. Stack, Community and What I'm exploring used to
          be sections underneath it and are now the steps' own content: what each one
          left behind, set going, and opened. */}
      <div className="flex flex-col gap-16">
        {phases.map((phase, i) => {
          const isCreed = creed.phase === phase.slug;
          const hasRail = phase.started.length > 0 || phase.opened.length > 0;

          return (
            <ScrollReveal key={phase.slug}>
              <section className={i === 0 ? "" : "border-t border-border pt-8"}>
                {/* A photograph belongs to the step it documents, at full width: a
                    band wants a wide frame, not a portrait with its sides cut off. */}
                {phase.image && (
                  <figure className="mb-8">
                    <div className="h-[200px] sm:h-[260px] overflow-hidden rounded-sm border border-border">
                      <Image
                        src={phase.image.src}
                        alt={phase.image.caption}
                        width={1024}
                        height={260}
                        // The crowd is in the middle of the frame: the room's ceiling
                        // fills the top and the floor the bottom, so both `top` and
                        // `bottom` spend the band on an empty surface.
                        className="w-full h-full object-cover object-[center_45%] grayscale"
                      />
                    </div>
                    <figcaption className="font-mono text-[10px] text-text-3 mt-2">
                      {phase.image.caption}
                    </figcaption>
                  </figure>
                )}

                <div className="flex items-baseline gap-4 mb-6">
                  {/* Decorative: the order is already carried by the periods. */}
                  <span
                    aria-hidden="true"
                    className="font-mono text-[40px] sm:text-[56px] font-bold leading-none text-border-mid tabular-nums shrink-0"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] text-text-3 tabular-nums mb-1">
                      {phase.period}
                      {phase.current && <span className="text-accent"> · now</span>}
                    </p>
                    <h2 className="font-mono text-[19px] sm:text-[24px] font-semibold text-text-1 tracking-[-0.01em]">
                      {phase.title}
                    </h2>
                  </div>
                </div>

                {/* Two rails only where there is something for the second one. A step
                    that carries nothing but its tools runs full width instead of
                    sitting next to a blank column. */}
                <div className={hasRail ? "lg:grid lg:grid-cols-[1fr_300px] lg:gap-12" : ""}>
                  <div className="min-w-0">
                    <p className="font-sans text-[15px] sm:text-[16px] text-text-2 leading-relaxed">
                      {phase.prose}
                    </p>

                    {isCreed && (
                      <blockquote className="border-l-2 border-accent pl-6 py-1 mt-8">
                        <p className="font-mono text-[17px] sm:text-[19px] text-text-1 leading-snug">
                          {creed.quote}
                        </p>
                        <p className="font-sans text-[14px] text-text-2 mt-2">{creed.gloss}</p>
                      </blockquote>
                    )}

                    {/* Names only: Docker and Kubernetes explain themselves, and a
                        note per tool ended up saying what he did with them, which the
                        prose above and /sharing already carry. */}
                    {phase.tools.length > 0 && (
                      <div className="mt-8">
                        <RailHeading>What it left me with</RailHeading>
                        <ToolChips names={phase.tools} />
                      </div>
                    )}

                    {/* Deliberately not hung off the tools block. It was, and when
                        "Technical leadership" left the current step's tool list the
                        link went with it and /uses disappeared from the page. It
                        belongs to the step that is today, whatever that step lists. */}
                    {phase.current && (
                      <p className="font-mono text-[11px] text-text-3 mt-8">
                        <Link
                          href="/uses"
                          className="text-text-2 hover:text-accent transition-colors"
                        >
                          /uses
                        </Link>{" "}
                        for the hardware and software behind all of it
                      </p>
                    )}
                  </div>

                  {hasRail && (
                    <aside className="min-w-0 mt-10 lg:mt-0 flex flex-col gap-8">
                      {phase.started.length > 0 && (
                        <div>
                          <RailHeading>What it started</RailHeading>
                          <ul className="flex flex-col gap-3">
                            {phase.started.map((item) => (
                              <li key={item.slug} className="border-l border-border-mid pl-4">
                                <p className="font-mono text-[12px] font-medium text-text-1">
                                  {item.org}
                                  <span className="font-normal text-[10px] text-accent">
                                    {" "}
                                    {item.roles[0].role}
                                  </span>
                                </p>
                                <p className="font-sans text-[12px] text-text-3 leading-snug">
                                  {item.roles[0].summary}
                                </p>
                              </li>
                            ))}

                            {/* Derived, not restated: the conferences come from the
                                talk archive's organiser flag and the total from its
                                length, so neither can drift from /sharing. */}
                            {organised.map((event) => (
                              <li key={event.slug} className="border-l border-border-mid pl-4">
                                <p className="font-mono text-[12px] font-medium text-text-1">
                                  {event.label}
                                  <span className="font-normal text-[10px] text-accent">
                                    {" "}
                                    {event.count > 1 && `${event.count} ${event.noun}s · `}
                                    {event.years}
                                  </span>
                                </p>
                                <p className="font-sans text-[12px] text-text-3 leading-snug">
                                  {event.location}
                                </p>
                              </li>
                            ))}

                            <li className="border-l border-border-mid pl-4">
                              <p className="font-mono text-[12px] font-medium text-text-1">
                                Speaking
                                <span className="font-normal text-[10px] text-accent">
                                  {" "}
                                  {talkCount} talks and appearances
                                </span>
                              </p>
                              <p className="font-sans text-[12px] text-text-3 leading-snug">
                                Concrete talks, honest about tradeoffs.{" "}
                                <Link
                                  href="/sharing"
                                  className="text-text-2 hover:text-accent transition-colors"
                                >
                                  /sharing
                                </Link>
                              </p>
                            </li>
                          </ul>
                        </div>
                      )}

                      {phase.opened.length > 0 && (
                        <div>
                          <RailHeading>What it opened</RailHeading>
                          <ul className="flex flex-col gap-3">
                            {phase.opened.map((question) => (
                              <li key={question.name} className="border-l-2 border-accent pl-4">
                                <p className="font-sans text-[12px] text-text-3 leading-snug">
                                  <span className="font-mono font-medium text-text-1">
                                    {question.name}
                                  </span>
                                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent mx-1.5 align-middle" />
                                  {question.body}
                                </p>
                              </li>
                            ))}
                          </ul>
                          <p className="font-mono text-[11px] text-text-3 mt-4 pl-4">
                            <Link
                              href="/now"
                              className="text-text-2 hover:text-accent transition-colors"
                            >
                              /now
                            </Link>{" "}
                            for this month
                          </p>
                        </div>
                      )}
                    </aside>
                  )}
                </div>
              </section>
            </ScrollReveal>
          );
        })}
      </div>

      <ScrollReveal>
        <section className="mt-16 border-t border-border pt-8">
          <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-2">
            Off the clock
          </p>
          <p className="font-sans text-[14px] text-text-3 mb-6 max-w-2xl">
            None of this is part of the story above, which is the point of putting it after it.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
            {HOBBIES.map((hobby) => (
              <li key={hobby.label} className="font-sans text-[13px] text-text-2">
                <span className="font-mono text-[13px] text-text-1">{hobby.label}</span>
                <span className="text-text-3"> · {hobby.context}</span>
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section className="mt-16 border-t border-border pt-8">
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
        </section>
      </ScrollReveal>
    </div>
  );
}
