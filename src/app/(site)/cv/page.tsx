import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "../../../components/ui/JsonLd";
import { PageHero } from "../../../components/ui/PageHero";
import {
  ENGAGEMENT_TYPES,
  type EngagementType,
  getContactLinks,
  getEducation,
  getEngagementsByType,
  getIdentity,
  getOpenSource,
  getOrganisedConferences,
  getSelectedTalks,
  getSkills,
  getTotalTalkCount,
} from "../../../lib/cv";
import { PERSON_SCHEMA } from "../../../lib/schema";

const DESCRIPTION =
  "The full professional history: employment, freelance engagements and community work, dated and typed. Tech Lead at RedCarbon, ten years in DevOps and platform engineering.";

// Indexable but absent from the nav: someone searching the name should land
// here, while the site's navigation stays about the work.
export const metadata: Metadata = {
  title: "CV",
  description: DESCRIPTION,
  robots: { index: true, follow: true },
  openGraph: {
    title: "CV · Davide Imola",
    description: DESCRIPTION,
    url: "https://davideimola.dev/cv",
    images: [
      { url: "https://davideimola.dev/og?title=CV&category=whoami", width: 1200, height: 630 },
    ],
  },
};

const TYPE_LABEL: Record<EngagementType, string> = {
  employment: "Experience",
  freelance: "Freelance work",
  volunteering: "Community & volunteering",
};

// The CV is a document, so its sections use the compact section-title scale
// from docs/design-system.md rather than the `//`-prefixed SectionHeader the
// narrative pages use.
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-text-1 pb-3 mb-5 border-b border-border">
      {children}
    </h2>
  );
}

function AsideBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pb-5 mb-5 border-b border-border last:border-0 last:pb-0 last:mb-0">
      <p className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase text-accent">
        {title}
      </p>
      {children}
    </div>
  );
}

// The row every entry in the main rail opens with: who on the left, where on the
// right, wrapping rather than colliding on a narrow screen.
function EntryHeader({ name, place }: { name: string; place: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 flex-wrap">
      <h3 className="font-mono text-[15px] font-semibold text-text-1">{name}</h3>
      <p className="font-mono text-[11px] text-text-3 shrink-0">{place}</p>
    </div>
  );
}

function EngagementSection({ type }: { type: EngagementType }) {
  const engagements = getEngagementsByType(type);
  if (engagements.length === 0) return null;

  return (
    <section>
      <SectionTitle>{TYPE_LABEL[type]}</SectionTitle>
      <div className="flex flex-col gap-7">
        {engagements.map((engagement) => (
          <div key={engagement.slug} className="flex flex-col gap-1">
            <EntryHeader name={engagement.org} place={engagement.location} />
            {engagement.roles.map((role) => (
              <div key={role.role} className="mt-2">
                <div className="flex items-baseline justify-between gap-3 flex-wrap">
                  <p className="font-mono text-[13px] text-accent">{role.role}</p>
                  <p className="font-mono text-[11px] text-text-2 tabular-nums shrink-0">
                    {role.period}
                  </p>
                </div>
                {role.bullets ? (
                  <ul className="mt-1.5 flex flex-col gap-1">
                    {role.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="font-sans text-[13px] text-text-2 leading-relaxed flex gap-2"
                      >
                        <span className="text-text-3 shrink-0">·</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="font-sans text-[13px] text-text-2 leading-relaxed mt-1">
                    {role.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

// Six talks, then the size of the archive: thirty rows would bury the six that
// make the point, and the reader who wants more follows the link.
function SelectedTalksSection() {
  const talks = getSelectedTalks();
  if (talks.length === 0) return null;

  return (
    <section>
      <SectionTitle>Selected talks</SectionTitle>
      <ul className="flex flex-col gap-3">
        {talks.map((talk) => (
          <li key={talk.slug} className="flex flex-col gap-0.5">
            <p className="font-sans text-[14px] text-text-1 leading-snug">{talk.title}</p>
            <p className="font-mono text-[11px] text-text-3">
              {talk.event} · {talk.year}
            </p>
          </li>
        ))}
      </ul>
      <Link
        href="/sharing"
        className="inline-block mt-4 font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
      >
        Full archive: {getTotalTalkCount()} talks and appearances →
      </Link>
    </section>
  );
}

// Open Source Day gets a heading of its own rather than a line inside the
// volunteering list. The volunteering entry states the role and the period; this
// section states the thing a conference organiser is actually looking for, which
// is that Davide has run the conference, four editions of it.
function OrganisedConferencesSection() {
  const conferences = getOrganisedConferences();
  if (conferences.length === 0) return null;

  return (
    <section>
      <SectionTitle>Conferences organised</SectionTitle>
      <div className="flex flex-col gap-5">
        {conferences.map((conference) => (
          <div key={conference.slug} className="flex flex-col gap-1">
            <EntryHeader name={conference.event} place={conference.location} />
            <p className="font-mono text-[12px] text-accent tabular-nums">
              {conference.editions} {conference.editions === 1 ? "edition" : "editions"} ·{" "}
              {conference.years}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Deliberately no ScrollReveal on the body: this is a dense document meant to
// be scanned in one pass (and printed), so sections that start at opacity 0
// would work against both.
export default function CvPage() {
  const identity = getIdentity();
  const contact = getContactLinks();
  const skills = getSkills();
  const education = getEducation();
  const openSource = getOpenSource();

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="cat ./cv.md"
        title={identity.name}
        className="mb-10"
        description={<span className="font-mono text-[14px] text-accent">{identity.headline}</span>}
      />

      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_260px] lg:gap-12">
        {/* Main rail: the history, typed */}
        <div className="min-w-0 flex flex-col gap-10">
          <p className="font-sans text-[15px] text-text-2 leading-relaxed border-l-2 border-accent pl-5">
            {identity.summary}
          </p>

          {ENGAGEMENT_TYPES.map((type) => (
            <EngagementSection key={type} type={type} />
          ))}

          <SelectedTalksSection />
          <OrganisedConferencesSection />
        </div>

        {/* Aside: the facts, held apart from the history */}
        <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start border border-border rounded-sm p-5 bg-bg-card">
          <AsideBlock title="Contact">
            <div className="flex flex-col gap-1 font-mono text-[12px] text-text-2 break-words">
              {contact.map((item) => {
                const external = item.href.startsWith("http");
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                    className="hover:text-accent transition-colors duration-150"
                  >
                    {item.label}
                  </a>
                );
              })}
              <span className="text-text-3">{identity.location}</span>
            </div>
          </AsideBlock>

          <AsideBlock title="Skills">
            <div className="flex flex-col gap-3">
              {skills.map((group) => (
                <div key={group.group}>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-text-3 mb-0.5">
                    {group.group}
                  </p>
                  <p className="font-sans text-[12px] text-text-1 leading-snug">
                    {group.items.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </AsideBlock>

          <AsideBlock title="Education">
            <div className="flex flex-col gap-3">
              {education.map((entry) => (
                <div key={entry.slug}>
                  <p className="font-mono text-[12px] text-text-1 leading-snug">{entry.school}</p>
                  <p className="font-sans text-[12px] text-text-2">{entry.award}</p>
                  {entry.detail && (
                    <p className="font-sans text-[11px] text-text-3 leading-snug">{entry.detail}</p>
                  )}
                  <p className="font-mono text-[11px] text-text-3 tabular-nums">{entry.period}</p>
                </div>
              ))}
            </div>
          </AsideBlock>

          <AsideBlock title="Open source">
            <p className="font-sans text-[12px] text-text-1">{openSource.join(", ")}</p>
          </AsideBlock>
        </aside>
      </div>

      <JsonLd data={PERSON_SCHEMA} />
    </div>
  );
}
