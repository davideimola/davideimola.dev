import { IconDownload } from "@tabler/icons-react";
import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ButtonLink } from "../../../components/ui/Button";
import { JsonLd } from "../../../components/ui/JsonLd";
import { PageHero } from "../../../components/ui/PageHero";
import {
  ENGAGEMENT_TYPES,
  type EngagementType,
  getContactLinks,
  getEducation,
  getEngagementsByType,
  getIdentity,
  getOpenSource,
  getOrganisedConferences,
  getSelectedTalks,
  getSkills,
  getTotalTalkCount,
} from "../../../lib/cv";
import { CV_PDF_URL_PATH, downloadFileName } from "../../../lib/cv-pdf";
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

// The CV is a document, so its sections use the compact section-title scale
// from docs/design-system.md rather than the `//`-prefixed SectionHeader the
// narrative pages use.
//
// Print tightens the tracking to the 0.08em the aside labels already use: at
// 0.12em a PDF text extractor reads the advance between glyphs as word gaps and
// hands "E X P E R I E N C E" to whatever is parsing the document. The
// difference is invisible at 11px, and it is the section headings a CV parser
// keys off.
function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[11px] font-medium tracking-[0.12em] uppercase text-text-1 pb-3 mb-5 border-b border-border print:tracking-[0.08em] print:break-after-avoid">
      {children}
    </h2>
  );
}

function AsideBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pb-5 mb-5 border-b border-border last:border-0 last:pb-0 last:mb-0 print:break-inside-avoid">
      <p className="font-mono text-[10px] font-medium tracking-[0.08em] uppercase text-accent">
        {title}
      </p>
      {children}
    </div>
  );
}

// The row every entry in the main rail opens with: who on the left, where on the
// right, wrapping rather than colliding on a narrow screen.
function EntryHeader({ name, place }: { name: string; place: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 flex-wrap">
      <h3 className="font-mono text-[15px] font-semibold text-text-1">{name}</h3>
      <p className="font-mono text-[11px] text-text-3 shrink-0">{place}</p>
    </div>
  );
}

function EngagementSection({ type }: { type: EngagementType }) {
  const engagements = getEngagementsByType(type);
  if (engagements.length === 0) return null;

  return (
    <section>
      <SectionTitle>{TYPE_LABEL[type]}</SectionTitle>
      <div className="flex flex-col gap-7 print:gap-5">
        {engagements.map((engagement) => (
          <div key={engagement.slug} className="flex flex-col gap-1 print:break-inside-avoid">
            <EntryHeader name={engagement.org} place={engagement.location} />
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

// Six talks, then the size of the archive: thirty rows would bury the six that
// make the point, and the reader who wants more follows the link.
function SelectedTalksSection() {
  const talks = getSelectedTalks();
  if (talks.length === 0) return null;

  return (
    <section>
      <SectionTitle>Selected talks</SectionTitle>
      <ul className="flex flex-col gap-3">
        {talks.map((talk) => (
          <li key={talk.slug} className="flex flex-col gap-0.5 print:break-inside-avoid">
            <p className="font-sans text-[14px] text-text-1 leading-snug">{talk.title}</p>
            <p className="font-mono text-[11px] text-text-3">
              {talk.event} · {talk.year}
            </p>
          </li>
        ))}
      </ul>
      {/* An arrow points nowhere on paper, so print spells the destination out
          instead. Same link, two words swapped: not a second Rendering. */}
      <Link
        href="/sharing"
        className="inline-block mt-4 font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
      >
        Full archive: {getTotalTalkCount()} talks and appearances{" "}
        <span className="print:hidden">→</span>
        <span className="hidden print:inline">at davideimola.dev/sharing</span>
      </Link>
    </section>
  );
}

// Open Source Day gets a heading of its own rather than a line inside the
// volunteering list. The volunteering entry states the role and the period; this
// section states the thing a conference organiser is actually looking for, which
// is that Davide has run the conference, four editions of it.
function OrganisedConferencesSection() {
  const conferences = getOrganisedConferences();
  if (conferences.length === 0) return null;

  return (
    <section>
      <SectionTitle>Conferences organised</SectionTitle>
      <div className="flex flex-col gap-5">
        {conferences.map((conference) => (
          <div key={conference.slug} className="flex flex-col gap-1 print:break-inside-avoid">
            <EntryHeader name={conference.event} place={conference.location} />
            <p className="font-mono text-[12px] text-accent tabular-nums">
              {conference.editions} {conference.editions === 1 ? "edition" : "editions"} ·{" "}
              {conference.years}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Deliberately no ScrollReveal on the body: this is a dense document meant to
// be scanned in one pass (and printed), so sections that start at opacity 0
// would work against both.
//
// Printing this page is the same markup, not a second layout: the tokens flip
// to the light palette through `print:light-ground` on <body> (globals.css), the
// chrome drops out on `data-print-hide`, and the `print:` utilities below undo
// the two screen affordances that make no sense on paper: the padding that
// clears the fixed NavBar, and the sticky aside.
//
// Paper keeps the two rails. The sheet is narrower than `lg`, so the desktop
// grid does not apply there and the print variant has to state it again at a
// width that fits A4. Single column was the first shape (it is what ATS vendors
// document as safe) and it read badly: with the full sheet to spread across, the
// flush-right dates opened gaps wide enough to look like a bug, and the aside
// landed on a third, half-empty page with the contact details at the very end of
// the document. Two rails is a deliberate trade of ATS parseability for a sheet
// a human can actually read, recorded in docs/adr/0003.
//
// DOM order is main rail then aside on both media, so the reading order a PDF
// extracts matches the reading order on screen.
export default function CvPage() {
  const identity = getIdentity();
  const contact = getContactLinks();
  const skills = getSkills();
  const education = getEducation();
  const openSource = getOpenSource();

  return (
    // `pt-24` clears the fixed NavBar, which paper does not have; the sheet
    // margin comes from `@page` instead of from the page's own padding.
    // In print this is the grid, not just its wrapper: the hero has to be a cell
    // of it so the aside can start at the top of the first sheet. See the comment
    // on the inner wrapper for why that matters.
    //
    // `zoom` is the one knob for print density, and it is deliberately one knob:
    // twenty hand-tuned `print:text-[Npx]` utilities would drift apart the first
    // time a section is edited, while this keeps paper proportionally identical to
    // the screen. It affects layout rather than rasterising, so the PDF still
    // carries real selectable text.
    //
    // 0.66 puts the body at 6.4pt, and that number is not a guess: the CV brought
    // in as the density to match sets its own body at 6.7pt with 6.4pt alongside
    // it, both measured off its text layer. Paired with the tighter print gaps
    // below and the speaking sections moved into the right column, it lands the
    // whole document on one sheet.
    //
    // It is deliberately at the boundary: 0.68 spills onto a second sheet, and one
    // sheet is filled to 793pt of 842. When the Record grows past that, the answer
    // is to trim what the sheet says, not to shrink the type further. Anything
    // under about 6pt stops being a document a human reads.
    //
    // The aside track is stated pre-zoom, hence 288px rather than 190px: zoom
    // enlarges the layout viewport, so a track has to be divided by the factor to
    // land at the intended physical width on paper (288 x 0.66 = 190).
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20 print:px-0 print:pt-0 print:pb-0 print:grid print:grid-cols-[1fr_288px] print:gap-x-7 print:items-start print:[zoom:0.66]">
      <PageHero
        command="cat ./cv.md"
        title={identity.name}
        className="mb-10 print:mb-5 print:col-start-1 print:row-start-1"
        description={<span className="font-mono text-[14px] text-accent">{identity.headline}</span>}
      >
        {/* The page is the link Davide sends; this is the copy a reader keeps.
            It points at the committed Rendering `pnpm cv:pdf` generates from this
            same page, and `download` names the saved file after the person so
            `cv.pdf` never lands anonymously in a stranger's Downloads.
            ButtonLink carries `data-print-hide`, so it is absent from the PDF it
            links to without a rule of its own. */}
        {/* `primary`: on this page downloading the CV is the main CTA, which is
            what the design system reserves the accent fill for. */}
        <ButtonLink
          href={CV_PDF_URL_PATH}
          download={downloadFileName(identity.name)}
          variant="primary"
          className="mt-6"
        >
          <IconDownload size={14} stroke={1.5} />
          Download PDF
        </ButtonLink>
      </PageHero>

      {/* `print:contents` dissolves this wrapper on paper, so the two rails become
          cells of the outer grid alongside the hero rather than of a grid nested
          under it. That is what lets the aside start level with the name.
          Nesting it cost a whole sheet: Chromium refuses to split a row that
          carries a `break-inside: avoid` item taller than the space left under the
          hero, so it pushed the entire row (main rail included) to sheet two and
          left sheet one holding nothing but the name. */}
      <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[1fr_260px] lg:gap-12 print:contents">
        {/* Main rail: the history, typed */}
        <div className="min-w-0 flex flex-col gap-10 print:gap-6 print:col-start-1 print:row-start-2">
          <p className="font-sans text-[15px] text-text-2 leading-relaxed border-l-2 border-accent pl-5">
            {identity.summary}
          </p>

          {ENGAGEMENT_TYPES.map((type) => (
            <EngagementSection key={type} type={type} />
          ))}
        </div>

        {/* The right column: the facts, held apart from the history. It carries the
            aside card and then the speaking sections, so the left rail is nothing
            but experience and the dead space under the card is used rather than
            printed blank. Deliberately not sticky any more: it is a content column
            now, taller than the viewport, and a sticky element that does not fit
            scrolls its own bottom out of reach. */}
        <div className="min-w-0 flex flex-col gap-10 lg:self-start print:gap-6 print:col-start-2 print:row-start-1 print:row-span-2">
          {/* `print:break-inside-avoid` keeps the card whole rather than letting it
              split across the fold, and the tighter padding buys back width at the
              narrower print track. */}
          <aside className="border border-border rounded-sm p-5 bg-bg-card print:p-4 print:break-inside-avoid">
            <AsideBlock title="Contact">
              <div className="flex flex-col gap-1 font-mono text-[12px] text-text-2 break-words">
                {contact.map((item) => {
                  const external = item.href.startsWith("http");
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      className="hover:text-accent transition-colors duration-150"
                    >
                      {item.label}
                    </a>
                  );
                })}
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
                      <p className="font-sans text-[11px] text-text-3 leading-snug">
                        {entry.detail}
                      </p>
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

          <SelectedTalksSection />
          <OrganisedConferencesSection />
        </div>
      </div>

      <JsonLd data={PERSON_SCHEMA} />
    </div>
  );
}
