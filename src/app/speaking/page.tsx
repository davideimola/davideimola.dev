import type { Metadata } from "next";
import { Badge } from "../../components/ui/Badge";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { getAllTalks } from "../../lib/content";

export const metadata: Metadata = {
  title: "Speaking",
  description: "Talks and presentations on Go, platform engineering, GitOps, and open source.",
  openGraph: {
    title: "Speaking — Davide Imola",
    description: "Talks and presentations on Go, platform engineering, GitOps, and open source.",
    url: "https://davideimola.dev/speaking",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function SpeakingPage() {
  const talks = getAllTalks();

  // Group by year, newest first
  const byYear = talks.reduce<Record<string, typeof talks>>((acc, talk) => {
    const year = new Date(talk.date).getFullYear().toString();
    (acc[year] ??= []).push(talk);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      {/* Page header */}
      <ScrollReveal>
        <header className="mb-12">
          <p className="font-mono text-[13px] text-text-3 mb-4">
            <span className="text-accent mr-2">❯</span>ls ./speaking
          </p>
          <h1 className="font-mono text-[32px] sm:text-[40px] font-bold text-text-1 tracking-[-0.03em] leading-none mb-3">
            Speaking
          </h1>
          <p className="font-sans text-[15px] text-text-2">
            {talks.length} talks at conferences, meetups, and podcasts on engineering, platform thinking, and open source.
          </p>
        </header>
      </ScrollReveal>

      {/* Talks by year */}
      <div className="flex flex-col gap-12">
        {years.map((year) => (
          <section key={year}>
            <ScrollReveal>
              <SectionHeader title={year} />
            </ScrollReveal>
            <ul className="flex flex-col divide-y divide-border">
              {byYear[year].map((talk, i) => (
                <ScrollReveal key={talk.slug} delay={i * 60}>
                  <li id={talk.slug}>
                    <div className="group py-6 flex flex-col gap-4">
                      {/* Top row: date · event · location */}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <span className="font-mono text-[11px] text-text-3">
                          {formatDate(talk.date)}
                        </span>
                        <span className="font-mono text-[11px] text-accent">{talk.event}</span>
                        <span className="font-mono text-[11px] text-text-3">{talk.location}</span>
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
                        <div className="flex flex-wrap gap-2">
                          {talk.tags.map((tag) => (
                            <Badge key={tag} variant="category">{tag}</Badge>
                          ))}
                        </div>
                        {(talk.slides || talk.video) && (
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
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* CTA */}
      <ScrollReveal>
        <div className="mt-16 pt-10 border-t border-border">
          <p className="font-sans text-[14px] text-text-2">
            Interested in having me speak at your event?{" "}
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
