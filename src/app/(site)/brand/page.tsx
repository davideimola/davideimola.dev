import tokens from "@davideimola/brand/tokens.json";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHero } from "../../../components/ui/PageHero";
import { ScrollReveal } from "../../../components/ui/ScrollReveal";
import { SectionHeader } from "../../../components/ui/SectionHeader";

export const metadata: Metadata = {
  title: "Brand",
  description:
    "Mark, wordmark, and brand assets for Davide Imola, free to use as-is in conference programs, event pages, and articles.",
  openGraph: {
    title: "Brand · Davide Imola",
    description:
      "Mark, wordmark, and brand assets for Davide Imola, free to use as-is in conference programs, event pages, and articles.",
    url: "https://davideimola.dev/brand",
    images: [
      { url: "https://davideimola.dev/og?title=Brand&category=assets", width: 1200, height: 630 },
    ],
  },
};

const BRAND_REPO = "https://github.com/davideimola/brand";
const palette = tokens.color.palette;

interface Download {
  label: string;
  href: string;
}

function DownloadRow({ downloads }: { downloads: Download[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {downloads.map((d) => (
        <a
          key={d.href}
          href={d.href}
          download
          className="font-mono text-[13px] text-fg-muted no-underline hover:text-accent transition-colors duration-150"
        >
          ↓ {d.label}
        </a>
      ))}
    </div>
  );
}

// The assets are shown on the ground they were drawn for, whatever the site's
// theme: a paper tile for the default files, a night tile for the -dark ones.
function AssetTile({
  ground,
  caption,
  downloads,
  children,
}: {
  ground: "paper" | "night";
  caption: string;
  downloads: Download[];
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div
        className={`border border-border h-[180px] flex items-center justify-center px-8 ${
          ground === "paper" ? "bg-[var(--di-color-paper)]" : "bg-[var(--di-color-night)]"
        }`}
      >
        {children}
      </div>
      <p className="font-sans text-[15px] text-fg-muted m-0">{caption}</p>
      <DownloadRow downloads={downloads} />
    </div>
  );
}

const COLORS = [
  { name: "Paper", hex: palette.paper, note: "the ground" },
  { name: "Ink", hex: palette.ink, note: "titles, tape, rules" },
  { name: "Akane", hex: palette.akane, note: "the knot and the marker" },
  { name: "Night", hex: palette.night, note: "the dark ground" },
  { name: "Chalk", hex: palette.chalk, note: "ink on night" },
  { name: "Akane night", hex: palette["akane-night"], note: "the knot on night" },
];

const TYPE = [
  {
    role: "Sans",
    family: "Schibsted Grotesk",
    use: "Titles and all running text",
    className: "font-sans font-bold",
  },
  {
    role: "Mono",
    family: "IBM Plex Mono",
    use: "Code, metadata, dates, small labels",
    className: "font-mono",
  },
  {
    role: "Label",
    family: "Barlow Condensed",
    use: "Tape labels only, bold, uppercase",
    className: "font-label font-bold uppercase tracking-[0.12em]",
  },
];

const RULES = [
  "Use the assets as-is to refer to me: conference programs, event pages, talk announcements, articles.",
  "The knot is always red. Only the mono files drop it, and only where colour is impossible.",
  "Never put the mark behind a photo or behind text, and never redraw or crop the lockups.",
  "Switch cut instead of shrinking: S below 40px, M from 40 to 95px, L from 96px. Minimum 16px.",
  "The wordmark is never typeset in a font. Use the SVG.",
];

export default function BrandPage() {
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20">
      <PageHero
        label="Brand"
        title="Brand"
        description={
          <>
            A <span className="font-semibold text-fg">d</span> and an{" "}
            <span className="font-semibold text-fg">i</span> drawn as a git graph: the bowl is a
            commit, the stem a branch that merges into the i, tied with a red knot, the knot of a
            martial arts belt. Use these assets as-is to refer to me in conference programs, event
            pages and articles.
          </>
        }
      >
        <p className="font-mono text-meta text-fg-subtle mt-5">
          Source of truth:{" "}
          <a
            href={BRAND_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg-muted hover:text-accent transition-colors duration-150"
          >
            github.com/davideimola/brand
          </a>
        </p>
      </PageHero>

      {/* Mark */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Mark" tilt={1} className="mb-8" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <AssetTile
            ground="paper"
            caption="Large cut, for 96px and up."
            downloads={[
              { label: "SVG", href: "/brand/mark-l.svg" },
              { label: "PNG 1024", href: "/brand/mark-l-1024.png" },
            ]}
          >
            {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
            <img src="/brand/mark-l.svg" alt="The mark, large cut" width={128} height={128} />
          </AssetTile>
          <AssetTile
            ground="night"
            caption="On night: chalk strokes, the knot lifted."
            downloads={[
              { label: "SVG", href: "/brand/mark-l-dark.svg" },
              { label: "PNG 1024", href: "/brand/mark-l-dark-1024.png" },
            ]}
          >
            {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
            <img
              src="/brand/mark-l-dark.svg"
              alt="The mark on a dark ground"
              width={128}
              height={128}
            />
          </AssetTile>
          <AssetTile
            ground="paper"
            caption="Three cuts of one drawing: L, M, S."
            downloads={[
              { label: "M SVG", href: "/brand/mark-m.svg" },
              { label: "S SVG", href: "/brand/mark-s.svg" },
              { label: "Mono SVG", href: "/brand/mark-l-mono.svg" },
            ]}
          >
            <div className="flex items-end gap-6">
              {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
              <img src="/brand/mark-l.svg" alt="Large cut" width={96} height={96} />
              {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
              <img src="/brand/mark-m.svg" alt="Medium cut" width={56} height={56} />
              {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
              <img src="/brand/mark-s.svg" alt="Small cut" width={28} height={28} />
            </div>
          </AssetTile>
        </div>
      </section>

      {/* Wordmark and lockups */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Wordmark" tilt={2} className="mb-8" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <AssetTile
            ground="paper"
            caption="The lockup: large mark plus the regular wordmark."
            downloads={[
              { label: "SVG", href: "/brand/lockup.svg" },
              { label: "PNG 1200", href: "/brand/lockup-1200.png" },
              { label: "Small SVG", href: "/brand/lockup-small.svg" },
            ]}
          >
            {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
            <img src="/brand/lockup.svg" alt="The lockup" className="w-full max-w-[360px] h-auto" />
          </AssetTile>
          <AssetTile
            ground="night"
            caption="The lockup on night."
            downloads={[
              { label: "SVG", href: "/brand/lockup-dark.svg" },
              { label: "PNG 1200", href: "/brand/lockup-dark-1200.png" },
              { label: "Small SVG", href: "/brand/lockup-small-dark.svg" },
            ]}
          >
            {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
            <img
              src="/brand/lockup-dark.svg"
              alt="The lockup on a dark ground"
              className="w-full max-w-[360px] h-auto"
            />
          </AssetTile>
          <AssetTile
            ground="paper"
            caption="Wordmark, regular (300px wide and up) and bold (small sizes)."
            downloads={[
              { label: "Regular SVG", href: "/brand/wordmark.svg" },
              { label: "Bold SVG", href: "/brand/wordmark-bold.svg" },
              { label: "Mono SVG", href: "/brand/wordmark-mono.svg" },
            ]}
          >
            {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
            <img
              src="/brand/wordmark.svg"
              alt="The wordmark"
              className="w-full max-w-[320px] h-auto"
            />
          </AssetTile>
          <AssetTile
            ground="paper"
            caption="Avatar, for profiles and speaker pages."
            downloads={[
              { label: "SVG", href: "/brand/avatar.svg" },
              { label: "PNG 512", href: "/brand/avatar-512.png" },
              { label: "PNG 1024", href: "/brand/avatar-1024.png" },
            ]}
          >
            {/* biome-ignore lint/performance/noImgElement: a downloadable asset shown exactly as served */}
            <img src="/brand/avatar.svg" alt="The avatar" width={128} height={128} />
          </AssetTile>
        </div>
      </section>

      {/* Colours */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Colour" tilt={0} className="mb-8" />
          <p className="font-sans text-[16px] text-fg-muted max-w-[42rem] -mt-2 mb-8">
            Two inks on a light ground, plus a night theme. Red belongs to the knot and the marker,
            nothing else.
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {COLORS.map((c) => (
            <div key={c.name} className="border border-border bg-surface">
              <div className="h-16 border-b border-border" style={{ background: c.hex }} />
              <div className="px-3 py-2.5 flex flex-col gap-0.5">
                <span className="font-mono text-[13px] text-fg">{c.hex}</span>
                <span className="font-sans text-[13px] text-fg-subtle">
                  {c.name}, {c.note}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Type */}
      <section className="mb-16 border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Type" tilt={1} className="mb-8" />
        </ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {TYPE.map((t) => (
            <div key={t.role} className="border-t border-rule pt-4 flex flex-col gap-2">
              <span className={`text-[28px] text-fg leading-tight ${t.className}`}>{t.family}</span>
              <span className="font-mono text-meta text-fg-subtle">
                {t.role} · {t.use}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Usage + license */}
      <section className="border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="Usage & license" tilt={2} className="mb-8" />
          <ul className="flex flex-col gap-2.5 mb-8 list-none m-0 p-0">
            {RULES.map((rule) => (
              <li
                key={rule}
                className="font-sans text-[16px] text-fg-muted flex items-baseline gap-3"
              >
                <span
                  aria-hidden="true"
                  className="inline-block w-[6px] h-[6px] bg-fg shrink-0 -translate-y-0.5"
                />
                {rule}
              </li>
            ))}
          </ul>
          <p className="font-sans text-[16px] text-fg-muted">
            All brand assets are licensed under{" "}
            <a
              href="https://creativecommons.org/licenses/by-nd/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline hover:text-accent transition-colors duration-150"
            >
              CC BY-ND 4.0
            </a>
            {"; see the "}
            <a
              href="/brand/LICENSE.md"
              className="text-fg underline hover:text-accent transition-colors duration-150"
            >
              full license
            </a>
            . The guidelines live in the{" "}
            <a
              href={`${BRAND_REPO}/blob/main/docs/brand.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-fg underline hover:text-accent transition-colors duration-150"
            >
              brand repo
            </a>
            . Need a different format?{" "}
            <a
              href="/contact"
              className="text-fg underline hover:text-accent transition-colors duration-150"
            >
              Get in touch
            </a>
            .
          </p>
        </ScrollReveal>
      </section>
    </div>
  );
}
