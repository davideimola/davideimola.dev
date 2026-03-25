import type { Metadata } from "next";
import { Badge } from "../../components/ui/Badge";
import { CopyButton } from "../../components/ui/CopyButton";
import { PageHero } from "../../components/ui/PageHero";
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

const TOPICS = [
  "Go & Backend Engineering",
  "Platform Engineering",
  "GitOps & Security",
  "Open Source & Community",
];

const SHORT_BIO =
  "Davide Imola is a Tech Lead at RedCarbon, co-founder of Schrodinger Hat, and co-organizer of Open Source Day. He speaks about Go, platform engineering, GitOps, and the human side of open source.";

const LONG_BIO =
  "Davide Imola is a Tech Lead at RedCarbon, where he leads the engineering team building an AI-powered cybersecurity platform. He is co-founder of Schrodinger Hat, an international open source community that has reached 20k+ people across Europe, and co-organizer of Open Source Day, a yearly conference in Florence dedicated to open source culture.\n\nOver the years, Davide has spoken at conferences including GOLab, KCD Italy, DevSecOps Day, Incontro DevOps Italia, and WeAreDevelopers World Congress. His talks focus on Go, GitOps, platform engineering, security, and building open source communities.\n\nHe believes that sharing knowledge in public — through talks, writing, and open source contributions — is one of the highest-leverage activities an engineer can do.";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function SpeakingPage() {
  const talks = getAllTalks();

  const byYear = talks.reduce<Record<string, typeof talks>>((acc, talk) => {
    const year = new Date(talk.date).getFullYear().toString();
    (acc[year] ??= []).push(talk);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <PageHero
        command="ls ./speaking"
        title="Speaking"
        description="I speak about the engineering problems I face day to day — Go, platform engineering, GitOps, security, and building open source communities. I like talks that are concrete, honest about tradeoffs, and leave the audience with something they can apply the next day."
      >
        <div className="flex flex-wrap gap-2 mt-6">
          {TOPICS.map((topic) => (
            <Badge key={topic} variant="category">{topic}</Badge>
          ))}
        </div>
        <div className="mt-6">
          <a
            href="https://cal.com/davideimola"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-[12px] text-text-2 border border-border rounded-sm px-3 py-2 hover:border-border-hover hover:text-accent transition-[border-color,color] duration-150"
          >
            <span className="text-accent">❯</span>
            book a call
          </a>
        </div>
      </PageHero>

      {/* Speaker Kit */}
      <section className="mb-16 border-t border-border pt-10" id="speaker-kit">
        <ScrollReveal>
          <SectionHeader title="Speaker Kit" />
          <p className="font-sans text-[14px] text-text-2 -mt-6 mb-10">
            Everything you need for a CfP or event program. Copy and paste freely.
          </p>
        </ScrollReveal>

        <div className="flex flex-col gap-6">
          {/* Short bio */}
          <ScrollReveal>
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="flex items-center justify-between bg-bg-card border-b border-border px-4 py-2">
                <span className="font-mono text-[10px] text-text-3 tracking-[0.06em]">SHORT BIO</span>
                <CopyButton
                  code={SHORT_BIO}
                  label="copy"
                  className="border border-border rounded-[2px] px-2 py-1 hover:border-border-hover hover:text-text-1"
                />
              </div>
              <p className="font-sans text-[14px] text-text-2 leading-relaxed px-4 py-4">
                {SHORT_BIO}
              </p>
            </div>
          </ScrollReveal>

          {/* Long bio */}
          <ScrollReveal>
            <div className="border border-border rounded-sm overflow-hidden">
              <div className="flex items-center justify-between bg-bg-card border-b border-border px-4 py-2">
                <span className="font-mono text-[10px] text-text-3 tracking-[0.06em]">LONG BIO</span>
                <CopyButton
                  code={LONG_BIO}
                  label="copy"
                  className="border border-border rounded-[2px] px-2 py-1 hover:border-border-hover hover:text-text-1"
                />
              </div>
              <div className="px-4 py-4 flex flex-col gap-3">
                {LONG_BIO.split("\n\n").map((paragraph, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static content, order never changes
                  <p key={i} className="font-sans text-[14px] text-text-2 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Topics + links */}
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="bg-bg-card border-b border-border px-4 py-2">
                  <span className="font-mono text-[10px] text-text-3 tracking-[0.06em]">TOPIC AREAS</span>
                </div>
                <ul className="px-4 py-4 flex flex-col gap-2">
                  {TOPICS.map((topic) => (
                    <li key={topic} className="font-sans text-[14px] text-text-2 flex items-center gap-2">
                      <span className="text-accent font-mono text-[10px]">//</span>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-border rounded-sm overflow-hidden">
                <div className="bg-bg-card border-b border-border px-4 py-2">
                  <span className="font-mono text-[10px] text-text-3 tracking-[0.06em]">LINKS</span>
                </div>
                <ul className="px-4 py-4 flex flex-col gap-3">
                  <li>
                    <a
                      href="/images/davide-speaking-profile.webp"
                      download
                      className="font-mono text-[12px] text-text-2 hover:text-accent transition-colors duration-150"
                    >
                      ↓ Headshot (webp)
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://bsky.app/profile/davideimola.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[12px] text-text-2 hover:text-accent transition-colors duration-150"
                    >
                      BlueSky →
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.linkedin.com/in/davideimola/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[12px] text-text-2 hover:text-accent transition-colors duration-150"
                    >
                      LinkedIn →
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://github.com/davideimola"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[12px] text-text-2 hover:text-accent transition-colors duration-150"
                    >
                      GitHub →
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Talks by year */}
      <ScrollReveal>
        <SectionHeader title="Talks" className="border-t border-border pt-10" />
      </ScrollReveal>
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
                          <div className="flex flex-wrap gap-2">
                            {talk.tags.map((tag) => (
                              <Badge key={tag} variant="category">{tag}</Badge>
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

      {/* CTA */}
      <ScrollReveal>
        <div className="mt-12 pt-8 border-t border-border">
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
