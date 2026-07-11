import {
  IconBrandBluesky,
  IconBrandGithub,
  IconBrandLinkedin,
  IconWorld,
} from "@tabler/icons-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Card } from "../../components/ui/Card";
import { JsonLd } from "../../components/ui/JsonLd";
import { LinkTile } from "../../components/ui/LinkTile";
import { ScrollReveal } from "../../components/ui/ScrollReveal";
import { getAllPosts, getUpcomingTalks } from "../../lib/content";
import { CAL_COM_URL, SOCIAL_PROFILES } from "../../lib/social";

// Regenerate daily so time-based blocks (upcoming talks) expire without a deploy.
export const revalidate = 86400;

const DESCRIPTION =
  "Profiles, latest writing, and upcoming talks — every place you can find me, in one page.";

export const metadata: Metadata = {
  title: "Links",
  description: DESCRIPTION,
  openGraph: {
    title: "Links — Davide Imola",
    description: DESCRIPTION,
    url: "https://davideimola.dev/links",
    // og:image comes from the co-located opengraph-image.tsx (file-based metadata)
  },
};

const SOCIAL_ICONS: Record<string, typeof IconBrandGithub> = {
  GitHub: IconBrandGithub,
  LinkedIn: IconBrandLinkedin,
  BlueSky: IconBrandBluesky,
};

// LinkedIn first — it's the primary channel for this page's audience.
const SOCIAL_ORDER = ["LinkedIn", "GitHub", "BlueSky"];

const SOCIALS = [...SOCIAL_PROFILES]
  .sort((a, b) => SOCIAL_ORDER.indexOf(a.label) - SOCIAL_ORDER.indexOf(b.label))
  .map((profile) => ({
    label: profile.label,
    handle: profile.handle,
    href: profile.url,
    icon: SOCIAL_ICONS[profile.label],
  }));

const IDENTITY_LINKS = [
  { label: "Website", handle: "davideimola.dev", href: "/", icon: IconWorld },
  ...SOCIALS,
];

const SCHRODINGER_HAT = [
  { label: "Community site", hint: "schroedinger-hat.org", href: "https://schroedinger-hat.org" },
  { label: "Telegram", hint: "join the hatters", href: "https://t.me/hatters25" },
];

const PROFILE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: "Davide Imola",
    url: "https://davideimola.dev",
    sameAs: SOCIALS.map((profile) => profile.href),
  },
};

function CommandLine({ command, className = "" }: { command: string; className?: string }) {
  return (
    <p className={`font-mono text-[13px] text-text-3 ${className}`}>
      <span className="text-accent mr-2">❯</span>
      {command}
    </p>
  );
}

export default function LinksPage() {
  const year = new Date().getFullYear();
  const latestPost = getAllPosts()[0];
  const upcomingTalks = getUpcomingTalks().slice(0, 2);

  return (
    <div className="max-w-[520px] mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-12">
      <JsonLd data={PROFILE_JSON_LD} />

      {/* ❯ whoami — identity block, rendered like command output */}
      <ScrollReveal>
        <header className="mb-12">
          <CommandLine command="whoami" className="mb-6" />
          <div className="flex items-center gap-5 sm:gap-7">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-full overflow-hidden border border-border-mid">
              <Image
                src="/images/davide-about-profile.webp"
                alt="Davide Imola"
                fill
                sizes="(min-width: 640px) 112px, 96px"
                priority
                className="object-cover grayscale scale-[1.4] origin-[52%_12%]"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="font-mono text-[24px] sm:text-[30px] font-bold text-text-1 tracking-[-0.03em] leading-tight mb-1.5">
                Davide Imola
              </h1>
              <p className="font-sans text-[13px] sm:text-[14px] text-text-2 leading-relaxed">
                Tech Lead @ RedCarbon
                <br />
                Co-founder @ Schrödinger Hat
              </p>
              <div className="flex items-center gap-2.5 mt-4">
                {IDENTITY_LINKS.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      aria-label={`${link.label} — ${link.handle}`}
                      title={link.label}
                      className="flex h-11 w-11 items-center justify-center rounded-md border border-border bg-bg-card text-text-1 transition-colors duration-150 hover:border-border-hover hover:text-accent"
                      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <link.icon size={19} stroke={1.5} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </header>
      </ScrollReveal>

      {/* ❯ latest post */}
      {latestPost && (
        <ScrollReveal>
          <section className="mb-12">
            <CommandLine command="ls -t ./blog | head -n 1" className="mb-5" />
            <Card href={`/blog/${latestPost.slug}`} className="group">
              {latestPost.heroImage && (
                <div className="relative h-28 -mx-6 -mt-6 mb-5 overflow-hidden">
                  <Image
                    src={latestPost.heroImage}
                    alt={latestPost.heroImageAlt ?? latestPost.title}
                    fill
                    sizes="(min-width: 640px) 520px, 100vw"
                    className="object-cover grayscale-[0.6] transition-[filter] duration-500 group-hover:grayscale-0"
                  />
                </div>
              )}
              <p className="font-mono text-[11px] text-text-3 mb-2">
                {new Date(latestPost.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}{" "}
                · {latestPost.category}
              </p>
              <p className="font-mono text-[15px] font-semibold text-text-1 leading-snug">
                {latestPost.title}
              </p>
              <p className="font-sans text-[13px] text-text-2 leading-relaxed mt-2 line-clamp-2">
                {latestPost.excerpt}
              </p>
            </Card>
          </section>
        </ScrollReveal>
      )}

      {/* ❯ upcoming talks */}
      {upcomingTalks.length > 0 && (
        <ScrollReveal>
          <section className="mb-12">
            <CommandLine command="ls ./talks --upcoming" className="mb-5" />
            <div className="flex flex-col gap-3">
              {upcomingTalks.map((talk) => {
                const date = new Date(talk.date);
                return (
                  <Card key={talk.slug} href="/sharing">
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 shrink-0 rounded-md border border-border-mid">
                        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-accent leading-none">
                          {date.toLocaleDateString("en-US", { month: "short" })}
                        </span>
                        <span className="font-mono text-[18px] font-bold text-text-1 leading-none mt-1">
                          {date.getDate()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-mono text-[14px] font-medium text-text-1 truncate">
                          {talk.event}
                        </p>
                        <p className="font-sans text-[12px] text-text-2 mt-1 line-clamp-1">
                          {talk.session?.title ?? talk.type} — {talk.location}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* ❯ book a call — cal(1) pun intended */}
      <ScrollReveal>
        <section className="mb-12">
          <CommandLine command="cal --book" className="mb-5" />
          <LinkTile label="Book a call" hint="cal.com/davideimola" href={CAL_COM_URL} />
        </section>
      </ScrollReveal>

      {/* ❯ schrödinger hat */}
      <ScrollReveal>
        <section className="mb-12">
          <CommandLine command="ls ./schrodinger-hat" className="mb-5" />
          <div className="flex flex-col gap-3">
            {SCHRODINGER_HAT.map((link) => (
              <LinkTile key={link.href} label={link.label} hint={link.hint} href={link.href} />
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* Idle prompt — the session stays open */}
      <p className="font-mono text-[13px] text-text-3 mb-10" aria-hidden="true">
        <span className="text-accent mr-2">❯</span>
        <span className="inline-block w-[7px] h-[0.95em] bg-accent align-middle animate-[blink_1.1s_steps(1)_infinite]" />
      </p>

      {/* Minimal footer — the global one is hidden on this route */}
      <footer className="border-t border-border pt-6 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
        <p className="font-mono text-[11px] text-text-3">
          © {year} <span className="text-accent">Davide Imola</span>
        </p>
        <nav className="flex gap-5">
          <a
            href="/"
            className="font-mono text-[11px] text-text-3 no-underline transition-colors duration-150 hover:text-text-2"
          >
            davideimola.dev
          </a>
          <a
            href="/privacy"
            className="font-mono text-[11px] text-text-3 no-underline transition-colors duration-150 hover:text-text-2"
          >
            privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
