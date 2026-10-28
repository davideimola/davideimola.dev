import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Marker } from "../../../components/ui/Marker";
import { Tape } from "../../../components/ui/Tape";
import { OG_SIZE, ogImageUrl } from "../../../lib/og-url";

const DESCRIPTION = "The type, the drawings and the code behind these pages.";

export const metadata: Metadata = {
  title: "Colophon",
  description: DESCRIPTION,
  openGraph: {
    title: "Colophon · Davide Imola",
    description: DESCRIPTION,
    url: "https://davideimola.dev/colophon",
    images: [
      {
        url: ogImageUrl({
          title: "Colophon",
          category: "site",
          path: "/colophon",
          lead: DESCRIPTION,
        }),
        ...OG_SIZE,
      },
    ],
  },
};

const link = "text-fg border-b border-fg no-underline hover:text-accent hover:border-accent";

// Hand-written, like /uses. Every claim here is something the repo does, so
// change it when the stack changes.
const ROWS: { label: string; body: ReactNode }[] = [
  {
    label: "The mark",
    body: (
      <>
        A <em>d</em> and an <em>i</em> drawn as a git graph, tied with a red knot. The red belongs
        to the knot and to one marker per page, and nothing else on the site is allowed to wear it.
        The{" "}
        <a href="https://github.com/davideimola/brand#why-this-mark" className={link}>
          story behind the mark
        </a>{" "}
        and every rule that follows from it live in{" "}
        <a href="https://github.com/davideimola/brand" className={link}>
          their own repo
        </a>
        .
      </>
    ),
  },
  {
    label: "Type",
    body: "Schibsted Grotesk for the titles and the reading, IBM Plex Mono for dates, code and the small print, Barlow Condensed for the tape labels and nowhere else. All three are open fonts.",
  },
  {
    label: "Drawings",
    body: "Every post cover is a monoline drawing in the mark's stroke: ink on paper, round ends, exactly one red detail. Each one draws itself the first time it scrolls into view, and has a night twin for the dark theme.",
  },
  {
    label: "Motion",
    body: "Only the brand moves, never the text. The mark ties its knot on the first visit to the home page, the marker draws its line once, and a post closes on the knot. With reduced motion turned on, everything arrives already drawn.",
  },
  {
    label: "Code",
    body: (
      <>
        Next.js and TypeScript, Tailwind CSS, Biome, Vitest and Storybook, deployed on Vercel. The{" "}
        <a href="https://github.com/davideimola/davideimola.dev" className={link}>
          source is public
        </a>
        , and the bigger decisions are written down as ADRs next to the code they explain.
      </>
    ),
  },
  {
    label: "Privacy",
    body: "Analytics are Umami: no cookies, no profile of you, so no banner asking about them. Comments under the posts live in GitHub Discussions, through giscus.",
  },
  {
    label: "For machines",
    body: (
      <>
        An{" "}
        <a href="/rss.xml" className={link}>
          RSS feed
        </a>
        , an{" "}
        <a href="/llms.txt" className={link}>
          llms.txt
        </a>
        , and every post as plain Markdown at{" "}
        <code className="font-mono text-[0.9em]">/blog/slug.md</code>.
      </>
    ),
  },
  {
    label: "Paper",
    body: (
      <>
        The{" "}
        <a href="/cv" className={link}>
          CV
        </a>{" "}
        prints from the same page you see, onto a single A4 sheet, always in the light palette.
      </>
    ),
  },
];

export default function ColophonPage() {
  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-10">
      <header className="flex flex-col items-start gap-5 max-w-[820px]">
        <Tape tilt={0}>Colophon</Tape>
        <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.98] tracking-[-0.045em]">
          How this site is <Marker>made.</Marker>
        </h1>
        <p className="m-0 font-sans text-[18px] sm:text-[20px] leading-[1.5] text-fg-muted">
          {DESCRIPTION} For anyone who reads the colophon first.
        </p>
      </header>

      <dl className="m-0 mt-10 md:mt-14 border-t border-rule">
        {ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-1.5 md:gap-8 py-5 md:py-6 border-b border-border"
          >
            <dt className="font-mono text-[13px] text-fg-subtle md:pt-1">{row.label}</dt>
            <dd className="m-0 max-w-[700px] font-sans text-[17px] md:text-[18px] leading-[1.6] text-fg-body">
              {row.body}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
