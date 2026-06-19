"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
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

// Coarse, drift-tolerant proximity hint for the next upcoming stop.
function formatRelative(dateStr: string, today: Date): string {
  const days = Math.round((new Date(dateStr).getTime() - today.getTime()) / 86_400_000);
  if (days <= 7) return "this week";
  if (days <= 21) return "in a few weeks";
  const months = Math.max(1, Math.round(days / 30));
  return months === 1 ? "next month" : `in ${months} months`;
}

interface Timeline {
  isFirst: boolean;
  isLast: boolean;
  relative?: string;
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
  timeline,
}: {
  talk: Talk;
  index: number;
  activeTag?: string;
  timeline?: Timeline;
}) {
  const { session } = talk;
  const hasMedia = !!(session?.slides || session?.video);
  const displayDate = talk.eventDateRange ?? formatDate(talk.date);
  const hasRole = !!(talk.organizer || talk.mc || session);

  return (
    <ScrollReveal delay={index * 60}>
      <li id={talk.slug} className={`scroll-mt-20 ${timeline ? "relative pl-8" : ""}`}>
        {timeline && (
          <>
            {/* Itinerary spine: a continuous line bounded by the first and last nodes */}
            {!timeline.isFirst && (
              <span aria-hidden className="absolute left-[5px] top-0 h-6 w-px bg-border" />
            )}
            {!timeline.isLast && (
              <span aria-hidden className="absolute left-[5px] top-6 bottom-0 w-px bg-border" />
            )}
            {/* Stop node: filled accent for the next stop, hollow for the rest */}
            <span
              aria-hidden
              className={`absolute left-[1px] top-5 z-10 h-[9px] w-[9px] rounded-[1px] ${
                timeline.isFirst ? "bg-accent" : "border border-border-mid bg-bg"
              }`}
            />
          </>
        )}
        <div className="py-6 flex flex-col gap-4">
          {/* Next-stop eyebrow */}
          {timeline?.isFirst && (
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-accent">❯ next</span>
              {timeline.relative && (
                <>
                  <span className="text-text-3">·</span>
                  <span className="text-text-2">{timeline.relative}</span>
                </>
              )}
            </div>
          )}

          {/* Top row: date · location */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span className="font-mono text-[11px] text-text-3">{displayDate}</span>
            <span className="font-mono text-[11px] text-text-3">·</span>
            <span className="font-mono text-[11px] text-text-3">{talk.location}</span>
          </div>

          {/* Path: ./event / session title */}
          <h3 className="font-mono text-[16px] sm:text-[18px] leading-snug">
            <span className="text-accent">./</span>
            <span className="text-text-2">{talk.event}</span>
            <span className="text-text-3"> / </span>
            {session && <span className="text-text-1 font-semibold">{session.title}</span>}
          </h3>

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

  // Re-trigger hash scroll after the list mounts.
  // The native browser scroll fires before this client component hydrates,
  // so direct links like /sharing#golab-2026 land at the top of the page.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    let cancelled = false;
    const tryScroll = (attempts = 0) => {
      if (cancelled) return;
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ block: "start" });
      } else if (attempts < 20) {
        requestAnimationFrame(() => tryScroll(attempts + 1));
      }
    };
    tryScroll();
    return () => {
      cancelled = true;
    };
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filtered = activeTag
    ? talks.filter((t) => t.tags.map((tag) => tag.toLowerCase()).includes(activeTag.toLowerCase()))
    : talks;

  // Upcoming reads as an itinerary: soonest stop first. Past stays newest-first.
  const upcoming = filtered
    .filter((t) => new Date(t.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = filtered.filter((t) => new Date(t.date) < today);

  const byYear = past.reduce<Record<string, typeof past>>((acc, talk) => {
    const year = new Date(talk.date).getFullYear().toString();
    (acc[year] ??= []).push(talk);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="border-t border-border pt-10">
      {activeTag && (
        <div className="flex items-center gap-2 font-mono text-[12px] mb-10">
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

      <div className="flex flex-col gap-16">
        {upcoming.length > 0 && (
          <section>
            <ScrollReveal>
              <SectionHeader title="Upcoming Engagements" />
              <p className="font-sans text-[13px] text-text-3 -mt-8 mb-8">
                Where you can catch me next — soonest first.
              </p>
            </ScrollReveal>
            <ul className="flex flex-col">
              {upcoming.map((talk, i) => (
                <TalkCard
                  key={talk.slug}
                  talk={talk}
                  index={i}
                  activeTag={activeTag}
                  timeline={{
                    isFirst: i === 0,
                    isLast: i === upcoming.length - 1,
                    relative: i === 0 ? formatRelative(talk.date, today) : undefined,
                  }}
                />
              ))}
            </ul>
          </section>
        )}

        {past.length > 0 && (
          <section>
            <ScrollReveal>
              <SectionHeader title="Past Engagements" />
            </ScrollReveal>
            <div className="flex flex-col gap-10">
              {years.map((year) => (
                <div key={year}>
                  <ScrollReveal>
                    {/* T3 group divider — year grouping, subordinate to the Past section */}
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-mono text-[11px] text-text-3 tracking-[0.08em]">
                        {year}
                      </span>
                      <span aria-hidden className="h-px flex-1 bg-border" />
                    </div>
                  </ScrollReveal>
                  <ul className="flex flex-col divide-y divide-border">
                    {byYear[year].map((talk, i) => (
                      <TalkCard key={talk.slug} talk={talk} index={i} activeTag={activeTag} />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
