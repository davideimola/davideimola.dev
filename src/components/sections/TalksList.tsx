"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { Talk } from "../../lib/content";
import { formatRelative, formatShortDate } from "../../lib/dates";
import { Badge } from "../ui/Badge";
import { BookingPrompt } from "../ui/BookingPrompt";
import { ScrollReveal } from "../ui/ScrollReveal";
import { SectionHeader } from "../ui/SectionHeader";

interface Timeline {
  isFirst: boolean;
  isLast: boolean;
  relative?: string;
}

interface TalksListProps {
  talks: Talk[];
}

type Role = "speaker" | "organizer";

const ROLE_FLAGS: { flag: string; role?: Role }[] = [
  { flag: "--all" },
  { flag: "--speaker", role: "speaker" },
  { flag: "--organizer", role: "organizer" },
];

function sharingHref(role?: Role, tag?: string) {
  const params = new URLSearchParams();
  if (tag) params.set("tag", tag);
  if (role) params.set("role", role);
  const qs = params.toString();
  return qs ? `/sharing?${qs}` : "/sharing";
}

function AbstractToggle({ abstract }: { abstract: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group font-mono text-[12px] cursor-pointer"
      >
        <span className="text-accent">❯ </span>
        <span
          className={`transition-colors duration-150 ${
            open ? "text-accent" : "text-text-2 group-hover:text-accent"
          }`}
        >
          cat abstract.md
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="font-sans text-[13px] leading-relaxed text-text-2 border-l border-border-mid pl-3 mt-3 max-w-[640px]">
              {abstract}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TalkCard({
  talk,
  index,
  activeTag,
  activeRole,
  timeline,
}: {
  talk: Talk;
  index: number;
  activeTag?: string;
  activeRole?: Role;
  timeline?: Timeline;
}) {
  const { session } = talk;
  const hasMedia = !!(session?.slides || session?.video);
  const displayDate = talk.eventDateRange ?? formatShortDate(talk.date);

  return (
    <ScrollReveal delay={index * 60}>
      <li id={talk.slug} className={`scroll-mt-20 ${timeline ? "relative pl-8" : ""}`}>
        {timeline && (
          <>
            {/* Itinerary spine: a continuous line bounded by the first and last nodes */}
            {!timeline.isFirst && (
              <span aria-hidden className="absolute left-[5px] top-0 h-5 w-px bg-border" />
            )}
            {!timeline.isLast && (
              <span aria-hidden className="absolute left-[5px] top-5 bottom-0 w-px bg-border" />
            )}
            {/* Stop node: filled accent for the next stop, hollow for the rest */}
            <span
              aria-hidden
              className={`absolute left-[1px] top-4 z-10 h-[9px] w-[9px] rounded-[1px] ${
                timeline.isFirst ? "bg-accent" : "border border-border-mid bg-bg"
              }`}
            />
          </>
        )}
        <div className="py-5 flex flex-col gap-3">
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

          {/* Meta row: date · location · type/role badges */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 sm:gap-x-3">
            <span className="font-mono text-[11px] text-text-3">{displayDate}</span>
            <span className="font-mono text-[11px] text-text-3">·</span>
            <span className="font-mono text-[11px] text-text-3">{talk.location}</span>
            <Badge variant="category">{talk.type}</Badge>
            {session && session.format !== "Talk" && (
              <Badge variant="outline">{session.format}</Badge>
            )}
            {/* @-prefixed role badges are always explicit and share the accent tier (personal roles) */}
            {session && <Badge variant="accent">@Speaker</Badge>}
            {talk.organizer && <Badge variant="accent">@Organizer</Badge>}
            {talk.mc && <Badge variant="accent">@MC</Badge>}
          </div>

          {/* Path: ./event / session title */}
          <h3 className="font-mono text-[16px] sm:text-[18px] leading-snug">
            <span className="text-accent">./</span>
            <span className="text-text-2">{talk.event}</span>
            {session && (
              <>
                <span className="text-text-3"> / </span>
                <span className="text-text-1 font-semibold">{session.title}</span>
              </>
            )}
            {session?.coSpeaker && (
              <span className="text-text-3 font-normal text-[13px]"> w/ {session.coSpeaker}</span>
            )}
          </h3>

          {/* Collapsible short abstract */}
          {session?.abstract && <AbstractToggle abstract={session.abstract} />}

          {/* Tags + links */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-x-2 gap-y-1">
              {talk.tags.map((t) => (
                <Link
                  key={t}
                  href={sharingHref(activeRole, t.toLowerCase())}
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
  const roleParam = searchParams.get("role");
  const activeRole: Role | undefined =
    roleParam === "speaker" || roleParam === "organizer" ? roleParam : undefined;

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

  const matchesTag = (t: Talk) =>
    !activeTag || t.tags.map((tag) => tag.toLowerCase()).includes(activeTag.toLowerCase());
  const matchesRole = (t: Talk) =>
    !activeRole || (activeRole === "speaker" ? !!t.session : !!(t.organizer || t.mc));
  const filtered = talks.filter((t) => matchesTag(t) && matchesRole(t));

  // Upcoming reads as an itinerary: soonest stop first. Past stays newest-first.
  const upcoming = filtered
    .filter((t) => new Date(t.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const past = filtered.filter((t) => new Date(t.date) < today);

  const byYear = past.reduce<Record<string, typeof past>>((acc, talk) => {
    const year = new Date(talk.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(talk);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="border-t border-border pt-10">
      {/* Role filter, styled as flags on an ls command */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[12px] mb-10">
        <span className="text-accent">❯</span>
        <span className="text-text-3">ls ./talks</span>
        {ROLE_FLAGS.map(({ flag, role }) => (
          <Link
            key={flag}
            href={sharingHref(role, activeTag)}
            scroll={false}
            aria-current={activeRole === role ? "true" : undefined}
            className={`transition-colors duration-150 ${
              activeRole === role ? "text-accent" : "text-text-3 hover:text-accent"
            }`}
          >
            {flag}
          </Link>
        ))}
      </div>

      {activeTag && (
        <div className="flex items-center gap-2 font-mono text-[12px] -mt-6 mb-10">
          <span className="text-accent">❯</span>
          <span className="text-text-3">grep --tag</span>
          <span className="text-accent">#{activeTag.toLowerCase()}</span>
          <Link
            href={sharingHref(activeRole)}
            scroll={false}
            className="text-text-3 hover:text-accent border border-border hover:border-border-hover rounded-[2px] px-1.5 py-0.5 transition-[color,border-color] duration-150"
          >
            ×
          </Link>
        </div>
      )}

      {(activeTag || activeRole) && upcoming.length === 0 && past.length === 0 ? (
        // Filters matched nothing — give direction instead of a blank page.
        <p className="font-mono text-[13px] text-text-2">
          No engagements match the current filter.{" "}
          <Link
            href="/sharing"
            scroll={false}
            className="text-text-3 hover:text-accent transition-colors duration-150"
          >
            Clear filters →
          </Link>
        </p>
      ) : (
        <div className="flex flex-col gap-16">
          {upcoming.length > 0 ? (
            <section>
              <ScrollReveal>
                <SectionHeader title="Upcoming Engagements" />
                <p className="font-sans text-[13px] text-text-3 -mt-8 mb-8">
                  Where you can catch me next, soonest first.
                </p>
              </ScrollReveal>
              <ul className="flex flex-col">
                {upcoming.map((talk, i) => (
                  <TalkCard
                    key={talk.slug}
                    talk={talk}
                    index={i}
                    activeTag={activeTag}
                    activeRole={activeRole}
                    timeline={{
                      isFirst: i === 0,
                      isLast: i === upcoming.length - 1,
                      relative: i === 0 ? formatRelative(talk.date, today) : undefined,
                    }}
                  />
                ))}
              </ul>
            </section>
          ) : (
            // No upcoming dates — but only pitch when unfiltered (genuinely "calendar open").
            // Under an active filter, an empty upcoming just means "none matching", so stay quiet.
            !activeTag &&
            !activeRole && (
              <section>
                <ScrollReveal>
                  <SectionHeader title="Upcoming Engagements" />
                </ScrollReveal>
                <ScrollReveal>
                  <BookingPrompt message="No public dates on the calendar right now. Want me at your event?" />
                </ScrollReveal>
              </section>
            )
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
                        <TalkCard
                          key={talk.slug}
                          talk={talk}
                          index={i}
                          activeTag={activeTag}
                          activeRole={activeRole}
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
