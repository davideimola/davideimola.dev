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

export function TalksList({ talks }: TalksListProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag") ?? undefined;

  const filtered = activeTag
    ? talks.filter((t) => t.tags.map((tag) => tag.toLowerCase()).includes(activeTag.toLowerCase()))
    : talks;

  const byYear = filtered.reduce<Record<string, typeof filtered>>((acc, talk) => {
    const year = new Date(talk.date).getFullYear().toString();
    (acc[year] ??= []).push(talk);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <ScrollReveal>
        <SectionHeader title="Talks" className="border-t border-border pt-10" />
      </ScrollReveal>

      {activeTag && (
        <div className="flex items-center gap-2 font-mono text-[12px] mb-6">
          <span className="text-accent">❯</span>
          <span className="text-text-3">grep --tag</span>
          <span className="text-accent">#{activeTag.toLowerCase()}</span>
          <Link
            href="/speaking"
            scroll={false}
            className="text-text-3 hover:text-accent border border-border hover:border-border-hover rounded-[2px] px-1.5 py-0.5 transition-[color,border-color] duration-150"
          >
            ×
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-12">
        {years.map((year) => (
          <section key={year}>
            <ScrollReveal>
              <SectionHeader title={year} variant="subsection" />
            </ScrollReveal>
            <ul className="flex flex-col divide-y divide-border">
              {byYear[year].map((talk, i) => {
                const hasMedia = !!(talk.slides || talk.video);
                return (
                  <ScrollReveal key={talk.slug} delay={i * 60}>
                    <li id={talk.slug}>
                      <div className="py-6 flex flex-col gap-4">
                        {/* Top row: date · event · location */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                          <span className="font-mono text-[11px] text-text-3">
                            {formatDate(talk.date)}
                          </span>
                          <span className="font-mono text-[11px] text-accent">{talk.event}</span>
                          <span className="font-mono text-[11px] text-text-3">{talk.location}</span>
                          {hasMedia && (
                            <span className="font-mono text-[10px] text-text-3 border border-border rounded-[2px] px-1.5 py-0.5">
                              {talk.video && talk.slides
                                ? "video + slides"
                                : talk.video
                                  ? "video"
                                  : "slides"}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="font-mono text-[17px] sm:text-[19px] font-semibold text-text-1 leading-snug">
                          {talk.title}
                        </h2>

                        {/* Role · type · co-speaker */}
                        <div className="flex flex-wrap items-center gap-3">
                          <Badge variant={talk.role === "Speaker" ? "category" : "active"}>
                            {talk.role}
                          </Badge>
                          <Badge variant="category">{talk.type}</Badge>
                          {talk.coSpeaker && (
                            <span className="font-mono text-[11px] text-text-3">
                              w/ {talk.coSpeaker}
                            </span>
                          )}
                        </div>

                        {/* Tags + links */}
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {talk.tags.map((t) => (
                              <Link
                                key={t}
                                href={`/speaking?tag=${encodeURIComponent(t.toLowerCase())}`}
                                scroll={false}
                                className={[
                                  "font-mono text-[11px] transition-colors duration-150",
                                  activeTag === t.toLowerCase()
                                    ? "text-accent"
                                    : "text-text-3 hover:text-accent",
                                ].join(" ")}
                              >
                                #{t.toLowerCase()}
                              </Link>
                            ))}
                          </div>
                          {hasMedia && (
                            <div className="flex items-center gap-4">
                              {talk.slides && (
                                <a
                                  href={talk.slides}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
                                >
                                  Slides →
                                </a>
                              )}
                              {talk.video && (
                                <a
                                  href={talk.video}
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
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
