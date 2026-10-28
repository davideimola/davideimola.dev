import type { Metadata } from "next";
import { CopyButton } from "../../../components/ui/CopyButton";
import { JsonLd } from "../../../components/ui/JsonLd";
import { Marker } from "../../../components/ui/Marker";
import { Photo } from "../../../components/ui/Photo";
import { Tape } from "../../../components/ui/Tape";
import { getAllProjects, getAllTalks, type Talk } from "../../../lib/content";
import { formatDayMonth, formatMonthYear } from "../../../lib/dates";
import { OG_SIZE, ogImageUrl } from "../../../lib/og-url";
import {
  city,
  describeKind,
  eventName,
  interviews,
  isUpcoming,
  organisedByKind,
  organisedByYear,
  sessionDetail,
  sessionsByYear,
  sharingStats,
} from "../../../lib/sharing";
import { talkSkillsLinks } from "../../../lib/skills";
import { feedbackHost, isFeedbackOpen } from "../../../lib/talk-feedback";

export const metadata: Metadata = {
  title: "Talks",
  description: "Talks, workshops, and events on AI, security, Go, and open source.",
  openGraph: {
    title: "Talks · Davide Imola",
    description: "Talks, workshops, and events on AI, security, Go, and open source.",
    url: "https://davideimola.dev/sharing",
    images: [{ url: ogImageUrl({ title: "Talks", category: "talks" }), ...OG_SIZE }],
  },
};

// Daily: a talk flips from "upcoming" to its material, and a rating window
// opens and closes, without a deploy.
export const revalidate = 86400;

// What used to be /brand, cut to what an event program needs. The files come
// from @davideimola/brand through `pnpm brand:sync`; the full set and the
// guidelines live in the brand repo.
const LOGO_DOWNLOADS = [
  {
    label: "Lockup",
    files: [
      { format: "SVG", href: "/brand/lockup.svg" },
      { format: "PNG", href: "/brand/lockup-1200.png" },
    ],
  },
  {
    label: "On dark",
    files: [
      { format: "SVG", href: "/brand/lockup-dark.svg" },
      { format: "PNG", href: "/brand/lockup-dark-1200.png" },
    ],
  },
  {
    label: "Mark",
    files: [
      { format: "SVG", href: "/brand/mark-l.svg" },
      { format: "PNG", href: "/brand/mark-l-1024.png" },
    ],
  },
  {
    label: "Avatar",
    files: [
      { format: "SVG", href: "/brand/avatar.svg" },
      { format: "PNG", href: "/brand/avatar-1024.png" },
    ],
  },
];

const TOPICS = [
  "AI × Security",
  "Go & Backend Engineering",
  "GitOps & Platform Engineering",
  "Open Source & Community",
];

const SHORT_BIO =
  "Davide Imola is a Tech Lead at RedCarbon, co-founder of Schrodinger Hat, and co-organizer of Open Source Day. He speaks about AI applied to security, Go, and the human side of open source.";

const LONG_BIO =
  "Davide Imola is a Tech Lead at RedCarbon, where he leads platform engineering. He makes the technical decisions across the whole platform, from frontend to infrastructure, builds the AI agents that run on it, and coordinates with the AI and security teams. His focus is technical direction and architecture, not people management. He is co-founder of Schrodinger Hat, an international open source community that has reached 20k+ people across Europe, and co-organizer of Open Source Day, a yearly conference in Florence dedicated to open source culture.\n\nOver the years, Davide has spoken at conferences including GoLab, KCD Italy, DevSecOps Day, Incontro DevOps Italia, and WeAreDevelopers World Congress. His talks focus on AI applied to security, Go, GitOps, and building open source communities.\n\nHe believes that sharing knowledge in public, through talks, writing, and open source contributions, is one of the highest-leverage activities an engineer can do.";

const inlineLink = "text-fg border-b border-fg no-underline hover:text-accent hover:border-accent";

// The skills a talk ships with, from the `talk` slugs in src/content/skills.json,
// so the link is declared once, on the skills side.
const SKILLS_BY_TALK = talkSkillsLinks();

function Material({ talk, today }: { talk: Talk; today: Date }) {
  const skills = SKILLS_BY_TALK.get(talk.slug);
  const skillsLink = skills && (
    <a href={skills} className={inlineLink}>
      Skills
    </a>
  );
  if (isUpcoming(talk, today)) {
    return (
      <span className="flex flex-wrap gap-x-3 gap-y-1">
        <span className="text-fg">upcoming</span>
        {skillsLink}
      </span>
    );
  }
  const links: { label: string; href: string }[] = [];
  if (talk.feedback && isFeedbackOpen(talk, today)) {
    links.push({ label: "Rate this talk", href: talk.feedback.url });
  }
  if (talk.session?.slides) links.push({ label: "Slides", href: talk.session.slides });
  if (talk.session?.video) links.push({ label: "Recording", href: talk.session.video });
  if (links.length === 0 && !skillsLink)
    return <span className="text-fg-subtle">no recording</span>;
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          title={link.label === "Rate this talk" ? feedbackHost(link.href) : undefined}
          className={inlineLink}
        >
          {link.label}
        </a>
      ))}
      {skillsLink}
    </span>
  );
}

// The first column of both ruled indexes: the year once per group, and the
// day on every row, so a long year still says when each thing happened.
// Inline on phones ("2024 · 14 Oct"), stacked from md up.
function When({ year, date }: { year: string | null; date: string }) {
  return (
    <span className="flex md:flex-col items-baseline md:items-start gap-x-2.5 gap-y-0.5">
      {year && (
        <span className="font-sans font-bold text-[22px] tracking-[-0.03em] text-fg">{year}</span>
      )}
      <span className="font-mono text-[13px] text-fg-subtle">{formatDayMonth(date)}</span>
    </span>
  );
}

function Side({
  tape,
  tilt,
  children,
}: {
  tape: string;
  tilt: 0 | 1 | 2;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-3.5">
      <Tape as="h2" tilt={tilt} size="lg">
        {tape}
      </Tape>
      <p className="m-0 font-sans text-[15px] leading-[1.55] text-fg-subtle">{children}</p>
    </div>
  );
}

export default function SharingPage() {
  const allTalks = getAllTalks();
  const today = new Date();
  const stats = sharingStats(allTalks);
  const years = sessionsByYear(allTalks);
  const chats = interviews(allTalks);
  const organised = organisedByYear(allTalks);
  const kinds = organisedByKind(allTalks);
  const projects = getAllProjects();
  const osday = projects.find((p) => p.slug === "os-day");
  const sh = projects.find((p) => p.slug === "schrodinger-hat");

  const talksSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Talks · Davide Imola",
    itemListElement: allTalks.map((talk, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Event",
        name: talk.session?.title ?? talk.event,
        startDate: talk.date,
        eventStatus: "https://schema.org/EventScheduled",
        location: {
          "@type": "Place",
          name: talk.event,
          address: talk.location,
        },
        organizer: {
          "@type": "Organization",
          name: talk.event,
        },
        performer: {
          "@type": "Person",
          name: "Davide Imola",
          url: "https://davideimola.dev",
        },
        ...(talk.session?.video
          ? { url: talk.session.video }
          : { url: `https://davideimola.dev/sharing#${talk.slug}` }),
      },
    })),
  };

  const STATS = [
    { label: "talks on stage", value: stats.onStage },
    { label: "events organised", value: stats.organised },
    { label: "interviews and streams", value: stats.interviews },
    { label: "since", value: stats.since ?? "" },
  ];

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-16">
      <JsonLd data={talksSchema} />

      <header className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-10 lg:gap-[72px] items-end">
        <div className="flex flex-col gap-6">
          <Tape tilt={0} size="lg">
            Talks
          </Tape>
          <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[1] tracking-[-0.045em]">
            What I learn, I say <Marker>out loud</Marker>.
          </h1>
          <p className="m-0 font-sans text-[18px] sm:text-[21px] leading-[1.55] text-fg-muted max-w-[680px]">
            Talks, workshops and the events I organise, on AI applied to security, Go, GitOps and
            open source. Concrete sessions, honest about tradeoffs, with something to apply the next
            day.
          </p>
        </div>
        <dl className="m-0 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-rule pt-[22px]">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse justify-end gap-0.5">
              <dt className="font-mono text-[13px] text-fg-subtle">{stat.label}</dt>
              <dd className="m-0 font-sans font-bold text-[40px] lg:text-[44px] leading-none tracking-[-0.04em] text-fg">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      {/* On stage: a ruled index by year instead of an itinerary line. */}
      <section className="pt-16 md:pt-24 grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 lg:gap-14">
        <Side tape="On stage" tilt={1}>
          Talks and workshops, newest first. Slides and recordings where they exist.
        </Side>
        <div className="flex flex-col min-w-0">
          <div className="hidden md:grid grid-cols-[96px_minmax(0,1fr)_220px_150px] lg:grid-cols-[96px_minmax(0,1fr)_260px_150px] gap-6 pb-3 border-b border-rule font-mono text-[13px] text-fg-subtle">
            <span>When</span>
            <span>Session</span>
            <span>Where</span>
            <span>Material</span>
          </div>
          {years.map((group) => (
            <div key={group.year} className="border-t md:border-t-0 border-rule">
              {group.talks.map((talk, i) => (
                <div
                  key={talk.slug}
                  id={talk.slug}
                  className="scroll-mt-28 grid grid-cols-1 md:grid-cols-[96px_minmax(0,1fr)_220px_150px] lg:grid-cols-[96px_minmax(0,1fr)_260px_150px] gap-x-6 gap-y-1.5 py-5 border-b border-border items-baseline"
                >
                  <When year={i === 0 ? group.year : null} date={talk.date} />
                  <span className="flex flex-col gap-1">
                    <span className="font-sans font-semibold text-[18px] md:text-[20px] leading-[1.3] tracking-[-0.015em] text-fg">
                      {talk.session?.title}
                    </span>
                    <span className="font-sans text-[15px] text-fg-subtle">
                      {sessionDetail(talk)}
                    </span>
                  </span>
                  <span className="font-sans text-[16px] text-fg-muted">
                    {eventName(talk.event)} · {city(talk.location)}
                  </span>
                  <span className="font-mono text-[14px]">
                    <Material talk={talk} today={today} />
                  </span>
                </div>
              ))}
            </div>
          ))}
          {chats.length > 0 && (
            <details className="mt-[22px] group">
              <summary className="cursor-pointer list-none font-sans font-semibold text-[16px] text-fg self-start">
                <span className="border-b border-fg pb-0.5 hover:text-accent hover:border-accent">
                  {chats.length} interviews and streams
                </span>
              </summary>
              <ul className="m-0 mt-4 p-0 list-none flex flex-col">
                {chats.map((talk) => (
                  <li
                    key={talk.slug}
                    id={talk.slug}
                    className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-1 py-3 border-t border-border"
                  >
                    <span className="font-sans text-[16px] text-fg">
                      {talk.session?.video ? (
                        <a
                          href={talk.session.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={inlineLink}
                        >
                          {talk.session?.title}
                        </a>
                      ) : (
                        talk.session?.title
                      )}
                    </span>
                    <span className="font-mono text-[13px] text-fg-subtle">
                      {talk.event} · {formatMonthYear(talk.date)}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </section>

      {/* Organising: the community first, then the same ruled index by year as On stage. */}
      <section
        id="organising"
        className="mt-16 md:mt-24 pt-10 border-t border-rule grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 lg:gap-14 scroll-mt-28"
      >
        <Side tape="Organising" tilt={2}>
          The rooms I help fill, so other people can share too.
        </Side>
        <div className="flex flex-col gap-12 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-8 md:gap-10 items-start">
            <div className="flex flex-col gap-[18px]">
              <h3 className="m-0 font-sans font-bold text-[28px] md:text-[32px] tracking-[-0.03em] text-fg">
                Schrodinger Hat
              </h3>
              <p className="m-0 font-sans text-[17px] md:text-[18px] leading-[1.6] text-fg-body">
                The open source community I co-founded: 20k+ people reached and 100+ speakers across
                Europe. Every year it runs Open Source Day, a conference in Florence on open source
                culture, and in between, meetups wherever there is a room and a topic worth it.
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[14px]">
                {sh?.url && (
                  <a href={sh.url} target="_blank" rel="noopener noreferrer" className={inlineLink}>
                    {sh.url.replace(/^https?:\/\//, "")}
                  </a>
                )}
                {osday?.url && (
                  <a
                    href={osday.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={inlineLink}
                  >
                    {osday.url.replace(/^https?:\/\//, "")}
                  </a>
                )}
              </div>
            </div>
            <figure className="m-0 flex flex-col gap-2.5">
              <div className="relative w-full aspect-[3/2]">
                <Photo
                  src="/images/osday-audience.webp"
                  alt="The Open Source Day audience in Florence"
                  sizes="(min-width: 768px) 420px, 100vw"
                />
              </div>
              <figcaption className="font-mono text-[13px] text-fg-subtle">
                Open Source Day, Florence
              </figcaption>
            </figure>
          </div>

          {/* What it runs, folded by kind: a second long list under On stage
              would read as more of the same, so the full list waits behind a
              disclosure the way the interviews do. */}
          <ul className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {kinds.map((k) => {
              const { title, line } = describeKind(k);
              return (
                <li key={k.kind} className="flex flex-col gap-2 pt-4 border-t border-rule">
                  <span className="font-mono text-[13px] text-fg-subtle">{k.kind}</span>
                  <span className="font-sans font-bold text-[22px] md:text-[24px] leading-[1.15] tracking-[-0.025em] text-fg">
                    {title}
                  </span>
                  <span className="font-sans text-[16px] leading-[1.55] text-fg-muted">{line}</span>
                </li>
              );
            })}
          </ul>

          <details className="group">
            <summary className="cursor-pointer list-none font-sans font-semibold text-[16px] text-fg self-start">
              <span className="border-b border-fg pb-0.5 hover:text-accent hover:border-accent">
                All {stats.organised} events, by year
              </span>
            </summary>
            <div className="mt-5">
              <div className="flex flex-col min-w-0">
                <div className="hidden md:grid grid-cols-[96px_minmax(0,1fr)_140px_150px] gap-6 pb-3 border-b border-rule font-mono text-[13px] text-fg-subtle">
                  <span>When</span>
                  <span>Event</span>
                  <span>Kind</span>
                  <span>Where</span>
                </div>
                {organised.map((group) => (
                  <div key={group.year} className="border-t md:border-t-0 border-rule">
                    {group.talks.map((talk, i) => (
                      <div
                        key={talk.slug}
                        id={talk.slug}
                        className="scroll-mt-28 grid grid-cols-1 md:grid-cols-[96px_minmax(0,1fr)_140px_150px] gap-x-6 gap-y-1 py-4 border-b border-border items-baseline"
                      >
                        <When year={i === 0 ? group.year : null} date={talk.date} />
                        <span className="font-sans font-semibold text-[17px] md:text-[18px] leading-[1.3] tracking-[-0.015em] text-fg">
                          {/* Only a conference series carries its year in the name;
                            a meetup title can end in one ("Dev/DevRel nel 2024"). */}
                          {talk.type === "Conference" ? eventName(talk.event) : talk.event}
                        </span>
                        <span className="md:hidden font-sans text-[15px] text-fg-muted">
                          {talk.type} · {city(talk.location)}
                        </span>
                        <span className="hidden md:block font-sans text-[16px] text-fg-muted">
                          {talk.type}
                        </span>
                        <span className="hidden md:block font-sans text-[16px] text-fg-muted">
                          {city(talk.location)}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </details>
        </div>
      </section>

      {/* Speaker kit */}
      <section
        id="speaker-kit"
        className="mt-16 md:mt-24 pt-10 border-t border-rule grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-8 lg:gap-14 scroll-mt-28"
      >
        <Side tape="Speaker kit" tilt={0}>
          For a CfP or an event program. Copy freely.
        </Side>
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_300px] gap-10">
          <div className="bg-surface border border-border p-6 md:p-7 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[13px] text-fg-subtle">Short bio</span>
              <CopyButton
                code={SHORT_BIO}
                label="Copy"
                copiedLabel="Copied"
                className="border border-fg px-3.5 py-2 text-fg hover:text-accent hover:border-accent"
              />
            </div>
            <p className="m-0 font-sans text-[17px] md:text-[18px] leading-[1.6] text-fg-body">
              {SHORT_BIO}
            </p>
            <details className="group">
              <summary className="cursor-pointer list-none font-mono text-[13px] text-fg">
                <span className="border-b border-fg hover:text-accent hover:border-accent">
                  Long bio
                </span>
              </summary>
              <div className="mt-4 flex flex-col gap-3">
                {LONG_BIO.split("\n\n").map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="m-0 font-sans text-[16px] leading-[1.6] text-fg-body"
                  >
                    {paragraph}
                  </p>
                ))}
                <CopyButton
                  code={LONG_BIO}
                  label="Copy the long bio"
                  copiedLabel="Copied"
                  className="self-start border border-fg px-3.5 py-2 text-fg hover:text-accent hover:border-accent"
                />
              </div>
            </details>
            <p className="m-0 font-mono text-[13px] text-fg-subtle">Topics: {TOPICS.join(" · ")}</p>
          </div>
          <div className="flex flex-col gap-3.5">
            <div className="relative w-full h-[180px]">
              <Photo
                src="/images/davide-speaking-profile.webp"
                alt="Headshot of Davide Imola"
                sizes="300px"
                position="object-top"
              />
            </div>
            <a
              href="/images/davide-speaking-profile.webp"
              download
              className={`self-start font-sans font-semibold text-[16px] ${inlineLink}`}
            >
              Download the headshot
            </a>
            {/* The lockup shown on the paper it was drawn for, whatever the theme. */}
            <div className="mt-3 flex flex-col gap-2.5">
              <div className="border border-border bg-[var(--di-color-paper)] h-[96px] flex items-center justify-center px-6">
                {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
                <img
                  src="/brand/lockup.svg"
                  alt="The Davide Imola lockup: the mark and the wordmark"
                  className="w-full max-w-[220px] h-auto"
                />
              </div>
              <ul className="m-0 p-0 list-none flex flex-col gap-1">
                {LOGO_DOWNLOADS.map((d) => (
                  <li key={d.label} className="flex flex-wrap items-baseline gap-x-3">
                    <span className="font-sans text-[15px] text-fg-muted">{d.label}</span>
                    {d.files.map((f) => (
                      <a
                        key={f.href}
                        href={f.href}
                        download
                        className="font-mono text-[13px] text-fg-subtle no-underline hover:text-accent transition-colors duration-150"
                      >
                        ↓ {f.format}
                      </a>
                    ))}
                  </li>
                ))}
              </ul>
              <p className="m-0 font-mono text-[12px] leading-[1.5] text-fg-subtle">
                Use as-is,{" "}
                <a
                  href="/brand/LICENSE.md"
                  className="text-fg-muted underline hover:text-accent transition-colors duration-150"
                >
                  CC BY-ND 4.0
                </a>
                . Guidelines in the{" "}
                <a
                  href="https://github.com/davideimola/brand/blob/main/docs/brand.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted underline hover:text-accent transition-colors duration-150"
                >
                  brand repo
                </a>
                , and the{" "}
                <a
                  href="https://github.com/davideimola/brand#why-this-mark"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fg-muted underline hover:text-accent transition-colors duration-150"
                >
                  story behind the mark
                </a>
                .
              </p>
            </div>
            <a
              href="/contact"
              className="mt-1 bg-fg text-bg px-5 py-3.5 font-sans font-semibold text-[16px] text-center no-underline hover:bg-fg-body transition-colors duration-150"
            >
              Invite me to speak
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
