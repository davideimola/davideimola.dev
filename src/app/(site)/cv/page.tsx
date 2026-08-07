import type { Metadata } from "next";
import type { ReactNode } from "react";
import { JsonLd } from "../../../components/ui/JsonLd";
import { PageHero } from "../../../components/ui/PageHero";
import {
  type EngagementType,
  getEducation,
  getEngagementsByType,
  getIdentity,
  getOpenSource,
  getSkills,
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

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase text-text-1 pb-3 mb-5 border-b border-border">
      {children}
    </h2>
  );
}

function AsideBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pb-5 mb-5 border-b border-border last:border-0 last:pb-0 last:mb-0">
      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-accent">{title}</p>
      {children}
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
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <h3 className="font-mono text-[15px] font-semibold text-text-1">{engagement.org}</h3>
              <p className="font-mono text-[11px] text-text-3 shrink-0">{engagement.location}</p>
            </div>
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

export default function CvPage() {
  const identity = getIdentity();
  const skills = getSkills();
  const education = getEducation();
  const openSource = getOpenSource();

  const contact = [
    { label: identity.email, href: `mailto:${identity.email}` },
    { label: identity.site, href: `https://${identity.site}` },
    { label: `github/${identity.github}`, href: `https://github.com/${identity.github}` },
    { label: `in/${identity.linkedin}`, href: `https://www.linkedin.com/in/${identity.linkedin}/` },
  ];

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

          <EngagementSection type="employment" />
          <EngagementSection type="freelance" />
          <EngagementSection type="volunteering" />
        </div>

        {/* Aside: the facts, held apart from the history */}
        <aside className="min-w-0 lg:sticky lg:top-20 lg:self-start border border-border rounded-sm p-5 bg-bg-card">
          <AsideBlock title="Contact">
            <div className="flex flex-col gap-1 font-mono text-[12px] text-text-2 break-words">
              {contact.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="hover:text-accent transition-colors duration-150"
                >
                  {item.label}
                </a>
              ))}
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
