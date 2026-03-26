"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Talk } from "../../lib/content";
import { Badge } from "../ui/Badge";
import { ScrollReveal } from "../ui/ScrollReveal";
import { SectionHeader } from "../ui/SectionHeader";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

interface TalksListProps {
  talks: Talk[];
}

function buildEngageCommand(talk: Talk): string {
  const flags: string[] = [];
  if (talk.organizer) flags.push("--organizer");
  if (talk.mc) flags.push("--mc");
  if (talk.session) flags.push(`--format ${talk.session.format.toLowerCase().replace(" ", "-")}`);
  if (talk.session?.coSpeaker) flags.push(`--with "${talk.session.coSpeaker}"`);
  return `engage${flags.length > 0 ? ` ${flags.join(" ")}` : ""}`;
}

function TalkCard({
  talk,
  index,
  activeTag,
}: { talk: Talk; index: number; activeTag?: string }) {
  const { session } = talk;
  const hasMedia = !!(session?.slides || session?.video);
  const displayDate = talk.eventDateRange ?? formatDate(talk.date);
  const hasRole = !!(talk.organizer || talk.mc || session);

  return (
    <ScrollReveal delay={index * 60}>
      <li id={talk.slug}>
        <div className="py-6 flex flex-col gap-4">
          {/* Top row: date · location */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="font-mono text-[11px] text-text-3">{displayDate}</span>
            <span className="font-mono text-[11px] text-text-3">·</span>
            <span className="font-mono text-[11px] text-text-3">{talk.location}</span>
          </div>

          {/* Path: ./event / session title */}
          <h2 className="font-mono text-[16px] sm:text-[18px] leading-snug">
            <span className="text-accent">./</span>
            <span className="text-text-2">{talk.event}</span>
            <span className="text-text-3"> / </span>
            {session && (
              <span className="text-text-1 font-semibold">{session.title}</span>
            )}
          </h2>

          {/* Event type badge */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="category">{talk.type}</Badge>
          </div>

          {/* Terminal engage command */}
          {hasRole && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[12px] text-text-3">
                <span className="text-accent">❯ </span>
                <span className="text-text-2">{buildEngageCommand(talk)}</span>
              </span>
            </div>
          )}

          {/* Tags + links */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {talk.tags.map((t) => (
                <Link
                  key={t}
                  href={`/sharing?tag=${encodeURIComponent(t.toLowerCase())}`}
                  scroll={false}
                  className={[
                    "font-mono text-[11px] transition-colors duration-150",
                    activeTag === t.toLowerCase() ? "text-accent" : "text-text-3 hover:text-accent",
                  ].join(" ")}
                >
                  #{t.toLowerCase()}
                </Link>
              ))}
            </div>
            {hasMedia && (
              <div className="flex items-center gap-4">
                {session?.slides && (
                  <a
                    href={session.slides}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
                  >
                    Slides →
                  </a>
                )}
                {session?.video && (
                  <a
                    href={session.video}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
                  >
                    Video →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </li>
    </ScrollReveal>
  );
}

export function TalksList({ talks }: TalksListProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? undefined;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = activeTag
    ? talks.filter((t) => t.tags.map((tag) => tag.toLowerCase()).includes(activeTag.toLowerCase()))
    : talks;

  const upcoming = filtered.filter((t) => new Date(t.date) >= today);
  const past = filtered.filter((t) => new Date(t.date) < today);

  const byYear = past.reduce<Record<string, typeof past>>((acc, talk) => {
    const year = new Date(talk.date).getFullYear().toString();
    (acc[year] ??= []).push(talk);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <ScrollReveal>
        <SectionHeader title="Engagements" className="border-t border-border pt-10" />
      </ScrollReveal>

      {activeTag && (
        <div className="flex items-center gap-2 font-mono text-[12px] mb-6">
          <span className="text-accent">❯</span>
          <span className="text-text-3">grep --tag</span>
          <span className="text-accent">#{activeTag.toLowerCase()}</span>
          <Link
            href="/sharing"
            scroll={false}
            className="text-text-3 hover:text-accent border border-border hover:border-border-hover rounded-[2px] px-1.5 py-0.5 transition-[color,border-color] duration-150"
          >
            ×
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-12">
        {upcoming.length > 0 && (
          <section>
            <ScrollReveal>
              <SectionHeader title="Upcoming" variant="subsection" />
            </ScrollReveal>
            <ul className="flex flex-col divide-y divide-border">
              {upcoming.map((talk, i) => (
                <TalkCard key={talk.slug} talk={talk} index={i} activeTag={activeTag} />
              ))}
            </ul>
          </section>
        )}

        {past.length > 0 && (
          <>
            {upcoming.length > 0 && (
              <ScrollReveal>
                <SectionHeader title="Past" variant="subsection" />
              </ScrollReveal>
            )}
            {years.map((year) => (
              <section key={year}>
                <ScrollReveal>
                  <SectionHeader title={year} variant="subsection" />
                </ScrollReveal>
                <ul className="flex flex-col divide-y divide-border">
                  {byYear[year].map((talk, i) => (
                    <TalkCard key={talk.slug} talk={talk} index={i} activeTag={activeTag} />
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </>
  );
}
