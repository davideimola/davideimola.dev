import type { Metadata } from "next";
import { Badge } from "../../../components/ui/Badge";
import { CoverTile } from "../../../components/ui/CoverTile";
import { JsonLd } from "../../../components/ui/JsonLd";
import { PageHero } from "../../../components/ui/PageHero";
import { ScrollReveal } from "../../../components/ui/ScrollReveal";
import { SectionHeader } from "../../../components/ui/SectionHeader";
import { formatDate, formatMonthYear } from "../../../lib/dates";
import {
  getShowcase,
  groupPassesByVerb,
  type ShelfFinishedPass,
  type ShelfPass,
  type ShelfProgress,
} from "../../../lib/shelf";

// The showcase document is rebuilt hourly. tsundoku runs on a home cluster, so
// the page is deliberately cheap to serve and never blocks on it: see
// getShowcase, which degrades to the committed snapshot.
export const revalidate = 3600;

const DESCRIPTION =
  "What I am reading and playing, what I finished or put down, and the pile of what I take on next.";

export const metadata: Metadata = {
  title: "Shelf",
  description: DESCRIPTION,
  openGraph: {
    title: "Shelf · Davide Imola",
    description: DESCRIPTION,
    url: "https://davideimola.dev/shelf",
    images: [
      { url: "https://davideimola.dev/og?title=Shelf&category=library", width: 1200, height: 630 },
    ],
  },
};

const TSUNDOKU_REPO = "https://github.com/davideimola/tsundoku";

export default async function ShelfPage() {
  const { document: showcase, source } = await getShowcase();
  const openGroups = groupPassesByVerb(showcase.now);

  const shelfSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Shelf · Davide Imola",
    url: "https://davideimola.dev/shelf",
    description: DESCRIPTION,
    author: { "@type": "Person", name: "Davide Imola", url: "https://davideimola.dev" },
    mainEntity: {
      "@type": "ItemList",
      name: "Recent verdicts",
      itemListElement: showcase.finished.recent.map((pass, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "CreativeWork",
          name: pass.title,
          ...(pass.series
            ? { isPartOf: { "@type": "CreativeWorkSeries", name: pass.series.name } }
            : {}),
        },
      })),
    },
  };

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20">
      <JsonLd data={shelfSchema} />
      <PageHero command="ls ./shelf" title="Shelf" description={DESCRIPTION}>
        <p className="font-mono text-[12px] text-text-3 mt-4 leading-relaxed">
          <span className="text-accent mr-2">{"//"}</span>
          This page is read live out of{" "}
          <a
            href={TSUNDOKU_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-2 hover:text-accent transition-colors duration-150"
          >
            tsundoku
          </a>
          , the open source library I run at home. Every number below is a query against it.
        </p>
        <p className="font-mono text-[11px] text-text-3 mt-2">
          {source === "live" ? (
            <>
              Last read: <span className="text-text-2">{formatDate(showcase.generatedAt)}</span>
            </>
          ) : (
            <>
              tsundoku is not answering right now, so this is the last snapshot committed to the
              site, from <span className="text-text-2">{formatDate(showcase.generatedAt)}</span>.
            </>
          )}
        </p>
      </PageHero>

      {/* 1. Open passes, one block per Type verb. An empty block renders nothing. */}
      {openGroups.map((group) => (
        <section key={group.verbBase} className="mb-16">
          <ScrollReveal>
            <SectionHeader title={group.label} className="mb-6" />
          </ScrollReveal>
          <div className="flex flex-col gap-4">
            {group.passes.map((pass, i) => (
              <ScrollReveal key={pass.id} delay={i * 40}>
                <OpenPassRow pass={pass} />
              </ScrollReveal>
            ))}
          </div>
        </section>
      ))}

      {/* 2. The judgements. What I wrote about a book stays in my own library, so
          this block has a score, an outcome and two dates to work with. That is
          enough: an abandonment is the loudest row on the page.
          tsundoku sends only the passes carrying a verdict, most recent first,
          capped at twelve, with `count` holding every verdict behind them.
          Nothing is filtered or sliced here. */}
      {showcase.finished.recent.length > 0 && (
        <section className="mb-16 border-t border-border pt-10">
          <ScrollReveal>
            <SectionHeader title="Recent verdicts" className="mb-3" />
          </ScrollReveal>
          <ScrollReveal>
            <p className="font-sans text-[14px] text-text-2 leading-relaxed max-w-2xl mb-6">
              A score and a date, no review: what I thought of something stays in my own library.
              Only the passes I actually judged land here, so the quiet finishes I never scored do
              not, and they run newest first where I bothered to write a date down. Putting a book
              down is a verdict too, with or without a number, and it gets the same row as a finish.
              Finishing something bad is the failure.
            </p>
          </ScrollReveal>
          <div className="flex flex-col gap-4">
            {showcase.finished.recent.map((pass, i) => (
              <ScrollReveal key={pass.id} delay={i * 40}>
                <FinishedPassRow pass={pass} />
              </ScrollReveal>
            ))}
          </div>
          {/* When the sample is everything there is, saying "3 of 3" is noise,
              so the line goes away entirely. */}
          {showcase.finished.count > showcase.finished.recent.length && (
            <ScrollReveal>
              <p className="font-mono text-[11px] text-text-3 mt-4">
                Showing {showcase.finished.recent.length} of {showcase.finished.count}. The block is
                the most recent sample, the count is every verdict I have recorded.
              </p>
            </ScrollReveal>
          )}
        </section>
      )}

      {/* 3. The pile, and the last block on the page. The project is named
          after it, so it gets the big number. */}
      <section className="border-t border-border pt-10">
        <ScrollReveal>
          <SectionHeader title="The pile" className="mb-6" />
        </ScrollReveal>
        <ScrollReveal>
          <div className="border border-border rounded-sm bg-bg-card p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
              <div>
                <p className="font-mono text-[44px] sm:text-[56px] font-bold text-accent leading-none tracking-[-0.04em]">
                  {showcase.pile.count}
                </p>
                {/* Not "volumes": the pile holds a videogame as readily as a
                    manga, and the breakdown right under it says so. Not
                    "unread" either: half of it is already in progress and some
                    of it I do not own yet. */}
                <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mt-2">
                  next up
                </p>
              </div>
              <p className="font-sans text-[14px] text-text-2 leading-relaxed max-w-md">
                Tsundoku is the pile that keeps growing, and this is mine: what I take on next, not
                a heap of unread purchases. Some of it I pinned by hand. The rest composes itself
                out of the stories left on a path I am walking, the things I want and do not own
                yet, the runs with somewhere left to go, and the next missing volume of every series
                I collect.
              </p>
            </div>

            {showcase.pile.byType.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {showcase.pile.byType.map((entry) => (
                  <span
                    key={entry.type.slug}
                    className="font-mono text-[11px] text-text-2 border border-border rounded-[2px] px-2 py-1"
                  >
                    {entry.type.label} <span className="text-text-3">· {entry.count}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {showcase.pile.recent.length > 0 && (
          <ScrollReveal>
            <div className="mt-8">
              <p className="font-mono text-[10px] text-text-3 tracking-widest uppercase mb-4">
                Newest in the pile{" "}
                <span className="normal-case tracking-normal">
                  ({showcase.pile.recent.length} of {showcase.pile.count})
                </span>
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                {/* A dozen rows, every one of them a different kind of thing,
                    and no filter above them to say which is which, so here the
                    Type is worth a Badge. */}
                {showcase.pile.recent.map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-2">
                    <CoverTile title={entry.title} cover={entry.cover} series={entry.series} />
                    <div className="flex flex-col gap-1.5">
                      <p className="font-mono text-[10px] text-text-3 leading-tight line-clamp-2">
                        {entry.title}
                      </p>
                      <Badge variant="category" className="self-start">
                        {entry.type.label}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </section>
    </div>
  );
}

function PassMeta({ pass }: { pass: ShelfPass }) {
  return (
    <p className="font-mono text-[11px] text-text-3 flex flex-wrap items-center gap-x-2 gap-y-1">
      <span>{pass.type.label}</span>
      <span className="text-border-mid">/</span>
      {/* The Medium arrives as a label tsundoku chose. Printing the slug back
          would give us "Playstation 5". */}
      <span>{pass.medium.label}</span>
      {pass.series && (
        <>
          <span className="text-border-mid">/</span>
          <span>{pass.series.name}</span>
        </>
      )}
    </p>
  );
}

/**
 * A ratio, because `unit` is "instalments": the model's own word, correct in
 * tsundoku and odd on a public page, where an omnibus makes "volumes" wrong just
 * as often. So the eye gets "7 / 20" and a screen reader gets the full sentence
 * the library would say.
 */
function ProgressRatio({ progress }: { progress: ShelfProgress }) {
  if (!progress) return null;
  return (
    <>
      <span className="sr-only">
        {progress.reached} of {progress.total} {progress.unit}
      </span>
      <span aria-hidden="true">
        {progress.reached} / {progress.total}
      </span>
    </>
  );
}

function OpenPassRow({ pass }: { pass: ShelfPass }) {
  const percent =
    pass.progress && pass.progress.total > 0
      ? Math.min(100, Math.round((pass.progress.reached / pass.progress.total) * 100))
      : null;

  return (
    <article className="flex items-start gap-4 border border-border rounded-sm bg-bg-card p-4 transition-[border-color] duration-200 hover:border-border-hover">
      <div className="w-14 sm:w-16 shrink-0">
        <CoverTile title={pass.title} cover={pass.cover} series={pass.series} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-mono text-[14px] text-text-1 leading-snug mb-1">{pass.title}</h3>
        <PassMeta pass={pass} />
        {/* A pass with no start date is ordinary, and the line simply goes away. */}
        {pass.startedAt && (
          <p className="font-mono text-[11px] text-text-3 mt-2">
            Started {formatMonthYear(pass.startedAt)}
          </p>
        )}
        {percent !== null && pass.progress && (
          <div className="mt-3">
            <div className="h-px w-full bg-border-mid" aria-hidden="true">
              {/* The width is a measurement, so it cannot be a Tailwind class. */}
              <div className="h-px bg-accent" style={{ width: `${percent}%` }} />
            </div>
            <p className="font-mono text-[10px] text-text-3 mt-1.5">
              <ProgressRatio progress={pass.progress} /> <span aria-hidden="true">·</span> {percent}
              %
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

/**
 * The one line of dates a verdict gets. Both ends are nullable, so every
 * combination has to read as a sentence and none of them may be blank.
 */
function verdictDates(pass: ShelfFinishedPass, abandoned: boolean): string | null {
  const verb = abandoned ? "Put down" : "Finished";
  if (pass.startedAt && pass.endedAt) {
    return `${formatMonthYear(pass.startedAt)} to ${formatMonthYear(pass.endedAt)}`;
  }
  if (pass.endedAt) return `${verb} ${formatMonthYear(pass.endedAt)}`;
  if (pass.startedAt) return `Started ${formatMonthYear(pass.startedAt)}`;
  return null;
}

function FinishedPassRow({ pass }: { pass: ShelfFinishedPass }) {
  const abandoned = pass.outcome === "given-up";
  const dates = verdictDates(pass, abandoned);

  return (
    <article
      className={[
        "flex items-start gap-4 rounded-sm bg-bg-card p-4",
        "border transition-[border-color] duration-200 hover:border-border-hover",
        // An abandonment is the most expressive row here, so it wears the accent
        // on its edge and the finishes stay quiet around it.
        abandoned ? "border-border-mid border-l-2 border-l-accent" : "border-border",
      ].join(" ")}
    >
      <div className="w-14 sm:w-16 shrink-0">
        <CoverTile title={pass.title} cover={pass.cover} series={pass.series} />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-mono text-[14px] text-text-1 leading-snug mb-1">{pass.title}</h3>
        <PassMeta pass={pass} />
        <p className="font-mono text-[11px] text-text-3 mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
          {dates && <span>{dates}</span>}
          {abandoned && pass.progress && pass.progress.total > 0 && (
            <>
              {dates && (
                <span className="text-border-mid" aria-hidden="true">
                  /
                </span>
              )}
              <span className="text-text-2">
                stopped at <ProgressRatio progress={pass.progress} />
              </span>
            </>
          )}
        </p>
      </div>

      {/* The verdict column. The score is the loudest thing in the row, and the
          outcome sits under it as its label, so the block scans as a column of
          judgements rather than a table of numbers. */}
      <div className="shrink-0 text-right w-16 sm:w-20">
        {pass.rating ? (
          <p
            className={[
              "font-mono font-bold leading-none tracking-[-0.03em] text-[26px] sm:text-[32px]",
              abandoned ? "text-accent" : "text-text-1",
            ].join(" ")}
          >
            <span className="sr-only">Scored </span>
            {pass.rating.score}
            <span className="text-text-3 text-[13px] sm:text-[15px] font-normal">/10</span>
          </p>
        ) : (
          <p className="font-mono text-[26px] sm:text-[32px] leading-none text-border-mid">
            <span className="sr-only">Not scored</span>
            <span aria-hidden="true">--</span>
          </p>
        )}
        <p
          className={[
            "font-mono text-[10px] tracking-[0.08em] uppercase mt-2",
            abandoned ? "text-accent" : "text-text-3",
          ].join(" ")}
        >
          {abandoned ? "Put down" : "Finished"}
        </p>
      </div>
    </article>
  );
}
