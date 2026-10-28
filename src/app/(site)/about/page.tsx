import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "../../../components/ui/JsonLd";
import { Marker } from "../../../components/ui/Marker";
import { Photo } from "../../../components/ui/Photo";
import { Tape } from "../../../components/ui/Tape";
import { getAllProjects } from "../../../lib/content";
import {
  getAboutNarrative,
  getIdentity,
  getOrganisedEvents,
  getTotalTalkCount,
  getTrajectory,
  type ResolvedPhase,
  shortOrg,
} from "../../../lib/cv";
import { OG_SIZE, ogImageUrl } from "../../../lib/og-url";
import { PERSON_SCHEMA } from "../../../lib/schema";

const DESCRIPTION =
  "Tech Lead building AI agents for cybersecurity, open source builder. I believe what you learn must be shared.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  openGraph: {
    title: "About · Davide Imola",
    images: [
      {
        url: ogImageUrl({ title: "About", category: "about", path: "/about", lead: DESCRIPTION }),
        ...OG_SIZE,
      },
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
    context: "Long cooks, sous vide, underrated cuts. Favourite: skirt steak.",
  },
  {
    label: "Video games",
    context: "RPGs and action-adventure. Clair Obscur, Baldur's Gate 3, Zelda.",
  },
  { label: "Pokémon cards", context: "Building the Pokédex in rare and full-art variants." },
  {
    label: "Tabletop and D&D",
    context: "Board game collector, playing a campaign, writing one to DM.",
  },
  { label: "JuJutsu", context: "Hontai Yōshin-ryū. Yellow belt; orange is next." },
  { label: "Music", context: "From Linkin Park to De André, Eminem to Hans Zimmer." },
  { label: "Travel", context: "I travel to learn. Japan was a dream; Asia draws me most." },
  { label: "Film and series", context: "Fantasy and action. Lord of the Rings is untouchable." },
];

const inlineLink = "text-fg border-b border-fg no-underline hover:text-accent hover:border-accent";

function PhaseRow({
  phase,
  index,
  last,
  started,
}: {
  phase: ResolvedPhase;
  index: number;
  last: boolean;
  started: ReactNode;
}) {
  return (
    <article
      className={`grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-4 md:gap-14 py-8 md:py-9 ${
        last ? "" : "border-b border-border"
      }`}
    >
      <div className="flex md:flex-col items-baseline md:items-start gap-3 md:gap-2">
        {/* Decorative: the order is already carried by the periods. */}
        <span
          aria-hidden="true"
          className={`font-mono font-medium text-[32px] md:text-[40px] leading-none tabular-nums ${
            phase.current ? "text-fg" : "text-border"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="font-mono text-[13px] text-fg-subtle">
          {phase.current ? phase.period.replace(/Present$/, "today") : phase.period}
        </span>
        <span className="font-sans text-[15px] text-fg-muted">{phase.credits.join(" · ")}</span>
      </div>
      <div className="flex flex-col gap-3">
        <h2 className="m-0 font-sans font-bold text-[24px] md:text-[30px] tracking-[-0.03em] text-fg">
          {phase.title}
        </h2>
        <p className="m-0 font-sans text-[16px] leading-[1.65] text-fg-body">{phase.prose}</p>
        {phase.tools.length > 0 && (
          <span className="font-mono text-[13px] text-fg-subtle">{phase.tools.join(" · ")}</span>
        )}
        {started}
        {phase.opened.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-1.5">
            {phase.opened.map((question) => (
              <div
                key={question.name}
                className="bg-surface border border-border px-5 py-[18px] flex flex-col gap-1.5"
              >
                <span className="font-mono text-[12px] text-fg-subtle">Open question</span>
                <span className="font-sans font-bold text-[18px] text-fg">{question.name}</span>
                <span className="font-sans text-[15px] leading-[1.5] text-fg-muted">
                  {question.body}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function splitLastWord(text: string): [string, string] {
  const i = text.trimEnd().lastIndexOf(" ");
  return i < 0 ? ["", text] : [text.slice(0, i + 1), text.slice(i + 1)];
}

export default function AboutPage() {
  const identity = getIdentity();
  const { lead, creed } = getAboutNarrative();
  const phases = getTrajectory();
  // Conference series only, which `noun` identifies: what a step *started* is the
  // community and the conference, and the meetup nights and the hackathon are what
  // that community then does. /cv lists all of them.
  const organised = getOrganisedEvents().filter((event) => event.noun === "edition");
  const talkCount = getTotalTalkCount();
  const projects = getAllProjects();

  const creedIndex = phases.findIndex((p) => p.slug === creed.phase);
  const split = creedIndex < 0 ? phases.length : creedIndex + 1;
  const before = phases.slice(0, split);
  const after = phases.slice(split);
  const creedImage = creedIndex < 0 ? undefined : phases[creedIndex].image;
  const [creedHead, creedLast] = splitLastWord(creed.quote);

  // Derived, not restated: the communities from the Record, the conferences
  // from the talk archive's organiser flag, the total from its length.
  const startedLine = (phase: ResolvedPhase) => {
    if (phase.started.length === 0) return null;
    return (
      <span className="font-mono text-[13px] text-fg-subtle">
        Started here:{" "}
        {phase.started.map((engagement) => {
          const project = projects.find((p) => p.slug === engagement.slug);
          const href = project?.url;
          return (
            <span key={engagement.slug}>
              {href ? (
                <a href={href} className={inlineLink}>
                  {shortOrg(engagement)}
                </a>
              ) : (
                shortOrg(engagement)
              )}
              {" · "}
            </span>
          );
        })}
        {organised.map((event) => (
          <span key={event.slug}>
            {event.label}
            {" · "}
          </span>
        ))}
        <a href="/sharing" className={inlineLink}>
          {talkCount} talks so far
        </a>
      </span>
    );
  };

  const renderPhases = (list: ResolvedPhase[], offset: number) =>
    list.map((phase, i) => (
      <PhaseRow
        key={phase.slug}
        phase={phase}
        index={offset + i}
        last={i === list.length - 1}
        started={startedLine(phase)}
      />
    ));

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-12">
      <JsonLd data={PERSON_SCHEMA} />

      <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:gap-[72px] items-stretch">
        <div className="flex flex-col gap-6">
          <Tape tilt={0}>About</Tape>
          <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.98] tracking-[-0.045em]">
            Ten years of pipelines, then the agents that run on them.
          </h1>
          <p className="m-0 font-sans text-[18px] sm:text-[21px] leading-[1.55] text-fg-muted max-w-[640px]">
            {lead}
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[14px] text-fg-subtle">
            <span>{identity.location}</span>
            <span aria-hidden="true">·</span>
            <Link href="/cv" className={inlineLink}>
              The dated version: my CV
            </Link>
          </div>
        </div>
        {/* The portrait stretches to the height of the text beside it. */}
        <figure className="relative m-0 lg:mt-1 w-full max-w-[360px] min-h-[320px] lg:min-h-[380px] aspect-[4/5] lg:aspect-auto">
          <Photo
            src="/images/davide-about-profile.webp"
            alt="Davide at a lectern, laptop covered in community stickers"
            sizes="360px"
            priority
            position="object-[50%_18%]"
          />
        </figure>
      </header>

      <div className="h-px bg-rule mt-12 md:mt-14" />

      {/* The trajectory is the page: each step's prose, what it left behind,
          set going and opened, all from the CV Record. */}
      <section className="pt-2 flex flex-col">{renderPhases(before, 0)}</section>

      {creedIndex >= 0 && (
        <section className="mt-2 py-10 border-t border-b border-rule grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 lg:gap-14 items-center">
          <div className="flex flex-col gap-3.5">
            <p className="m-0 font-sans font-bold text-fg text-[36px] sm:text-[52px] leading-[1.02] tracking-[-0.045em]">
              {creedHead}
              <Marker>{creedLast}</Marker>
            </p>
            <p className="m-0 font-sans text-[17px] sm:text-[18px] leading-[1.5] text-fg-muted">
              {creed.gloss}
            </p>
          </div>
          {creedImage && (
            <figure className="m-0 flex flex-col gap-2">
              <div className="relative w-full h-[236px]">
                <Photo
                  src={creedImage.src}
                  alt={creedImage.caption}
                  sizes="420px"
                  position="object-[center_45%]"
                />
              </div>
              <figcaption className="font-mono text-[13px] text-fg-subtle">
                {creedImage.caption}
              </figcaption>
            </figure>
          )}
        </section>
      )}

      {after.length > 0 && (
        <section className="flex flex-col">{renderPhases(after, before.length)}</section>
      )}

      <section className="py-10 md:pb-12 border-t border-rule grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-6 md:gap-14">
        <div className="flex flex-col items-start gap-3.5">
          <Tape tilt={1}>Off the clock</Tape>
          <p className="m-0 font-sans text-[15px] leading-[1.55] text-fg-muted">
            Outside the story, because they are not part of the job. What I'm reading lives on{" "}
            <Link href="/shelf" className={inlineLink}>
              the shelf
            </Link>
            ; what I'm up to this month, on{" "}
            <Link href="/now" className={inlineLink}>
              now
            </Link>
            ; the desk, on{" "}
            <Link href="/uses" className={inlineLink}>
              uses
            </Link>
            .
          </p>
        </div>
        <ul className="m-0 p-0 list-none grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-9 gap-y-[22px]">
          {HOBBIES.map((hobby) => (
            <li key={hobby.label} className="flex flex-col gap-1">
              <span className="font-sans font-bold text-[17px] text-fg">{hobby.label}</span>
              <span className="font-sans text-[14px] leading-[1.45] text-fg-muted">
                {hobby.context}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="m-0 pt-6 border-t border-border font-sans text-[16px] text-fg-muted">
        Want to talk engineering, community or a talk at your event?{" "}
        <Link href="/contact" className={inlineLink}>
          Say hello
        </Link>
        .
      </p>
    </div>
  );
}
