import type { Metadata } from "next";
import { Badge } from "../../../components/ui/Badge";
import { CoverTile } from "../../../components/ui/CoverTile";
import { JsonLd } from "../../../components/ui/JsonLd";
import { Marker } from "../../../components/ui/Marker";
import { Tape } from "../../../components/ui/Tape";
import { formatDate, formatDayMonth, formatMonthYear } from "../../../lib/dates";
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

  const pad = (n: number) => String(n).padStart(2, "0");
  const queuedTypes = showcase.pile.byType.filter((entry) => entry.count > 0);

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-10 md:pt-11">
      <JsonLd data={shelfSchema} />
      <header className="flex flex-col gap-5 max-w-[920px]">
        <Tape tilt={0}>Shelf</Tape>
        <h1 className="m-0 font-sans font-bold text-fg text-[42px] sm:text-[56px] lg:text-[72px] leading-[0.98] tracking-[-0.045em]">
          What I'm <Marker>reading</Marker>, and what comes next.
        </h1>
        <p className="m-0 font-sans text-[18px] sm:text-[19px] leading-[1.55] text-fg-muted">
          Books, comics and games, straight from{" "}
          <a
            href={TSUNDOKU_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg border-b border-fg no-underline hover:text-accent hover:border-accent"
          >
            tsundoku
          </a>
          , the library I built for myself: what's open now, the verdicts on what I finished or put
          down, and the queue of what to take on next.
        </p>
        <p className="m-0 font-mono text-[13px] text-fg-subtle">
          {source === "live"
            ? `Read live from the library on ${formatDate(showcase.generatedAt)}.`
            : `The library is not answering right now, so this is the last snapshot committed to the site, from ${formatDate(showcase.generatedAt)}.`}
        </p>
      </header>

      {/* 1. Open passes, one block per Type verb. An empty block renders nothing. */}
      {openGroups.map((group, gi) => (
        <section
          key={group.verbBase}
          className="mt-11 pt-7 border-t border-rule flex flex-col gap-[22px]"
        >
          <div className="flex items-baseline justify-between gap-4">
            <Tape as="h2" tilt={gi % 2 === 0 ? 1 : 2}>
              {group.label} now
            </Tape>
            <span className="font-mono text-[13px] text-fg-subtle">{group.passes.length} open</span>
          </div>
          <ul className="m-0 p-0 list-none grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {group.passes.map((pass) => (
              <li key={pass.id}>
                <OpenPassCard pass={pass} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* 2. The judgements: a score, an outcome and the dates, never the review.
          tsundoku sends only the passes carrying a verdict, most recent first,
          capped at twelve, with `count` holding every verdict behind them.
          Nothing is filtered or sliced here. */}
      {showcase.finished.recent.length > 0 && (
        <section className="mt-14 pt-7 border-t border-rule grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-14">
          <div className="flex flex-col items-start gap-3">
            <Tape as="h2" tilt={2}>
              Verdicts
            </Tape>
            <p className="m-0 font-sans text-[15px] leading-[1.5] text-fg-muted">
              Only what I judged lands here, newest first where a date was recorded. The score is
              the whole verdict.
            </p>
          </div>
          <div className="flex flex-col">
            <ul className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
              {showcase.finished.recent.map((pass) => (
                <li key={pass.id}>
                  <VerdictRow pass={pass} />
                </li>
              ))}
            </ul>
            {/* When the sample is everything there is, "3 of 3" is noise. */}
            {showcase.finished.count > showcase.finished.recent.length && (
              <p className="m-0 mt-4 font-mono text-[13px] text-fg-subtle">
                Showing {showcase.finished.recent.length} of {showcase.finished.count}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 3. The pile: what to take on next, a queue and not a heap of unread
          purchases. It holds videogames as readily as manga, and things not
          owned yet, so the copy never calls it volumes or purchases. */}
      <section className="mt-14 pt-7 border-t border-rule grid grid-cols-1 md:grid-cols-[220px_minmax(0,1fr)] gap-6 md:gap-14">
        <div className="flex flex-col items-start gap-2">
          <Tape as="h2" tilt={0}>
            Up next
          </Tape>
          <p className="m-0 mt-1 font-sans text-[15px] leading-[1.5] text-fg-muted">
            A queue, not a heap: what I pinned first, then what my open series and wants put next.
          </p>
          <span className="font-mono font-medium text-[34px] leading-none text-fg mt-2">
            {showcase.pile.count}
          </span>
          <span className="font-mono text-[13px] text-fg-subtle">queued</span>
          {queuedTypes.length > 0 && (
            <span className="font-mono text-[12px] leading-[1.6] text-fg-subtle">
              {queuedTypes.map((entry) => `${entry.type.label} ${entry.count}`).join(" · ")}
            </span>
          )}
        </div>
        {showcase.pile.recent.length > 0 && (
          <div className="flex flex-col gap-4">
            {/* A dozen rows, every one a different kind of thing and no filter to
                say which is which, so the Type is worth a Badge here. */}
            <ol className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
              {showcase.pile.recent.map((entry, i) => (
                <li
                  key={entry.id}
                  className="grid grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-3 py-[11px] border-b border-border"
                >
                  <span className="font-mono text-[13px] text-fg-subtle">{pad(i + 1)}</span>
                  <span className="font-sans font-semibold text-[16px] text-fg">{entry.title}</span>
                  <Badge variant="outline">{entry.type.label}</Badge>
                </li>
              ))}
            </ol>
            {showcase.pile.count > showcase.pile.recent.length && (
              <span className="font-mono text-[13px] text-fg-subtle">
                Showing {showcase.pile.recent.length} of {showcase.pile.count} queued
              </span>
            )}
          </div>
        )}
      </section>
    </div>
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

function OpenPassCard({ pass }: { pass: ShelfPass }) {
  const percent =
    pass.progress && pass.progress.total > 0
      ? Math.min(100, Math.round((pass.progress.reached / pass.progress.total) * 100))
      : null;

  return (
    <article className="flex flex-col gap-2.5">
      <CoverTile title={pass.title} cover={pass.cover} series={pass.series} />
      <h3 className="m-0 font-sans font-bold text-[17px] md:text-[19px] tracking-[-0.02em] text-fg">
        {pass.title}
      </h3>
      {/* The Medium arrives as a label tsundoku chose, never the slug. A pass with
          no start date is ordinary, and that part of the line goes away. */}
      <p className="m-0 font-mono text-[13px] text-fg-subtle">
        {pass.type.label} · {pass.medium.label}
        {pass.startedAt && ` · since ${formatDayMonth(pass.startedAt)}`}
      </p>
      {percent !== null && pass.progress && (
        <div>
          <div className="h-px w-full bg-border" aria-hidden="true">
            {/* The width is a measurement, so it cannot be a Tailwind class. */}
            <div className="h-px bg-fg" style={{ width: `${percent}%` }} />
          </div>
          <p className="m-0 font-mono text-[12px] text-fg-subtle mt-1.5">
            <ProgressRatio progress={pass.progress} />
          </p>
        </div>
      )}
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

// The score is the loudest thing in the row. An abandonment is the loudest row
// of the block: its outcome is a filled ink pill, where a finish stays mono.
function VerdictRow({ pass }: { pass: ShelfFinishedPass }) {
  const abandoned = pass.outcome === "given-up";
  const dates = verdictDates(pass, abandoned);

  return (
    <article className="grid grid-cols-[64px_minmax(0,1fr)] items-baseline gap-4 py-4 border-b border-border">
      {pass.rating ? (
        <p className="m-0 font-mono font-medium text-[26px] leading-none text-fg">
          <span className="sr-only">Scored </span>
          {pass.rating.score}
        </p>
      ) : (
        <p className="m-0 font-mono text-[26px] leading-none text-border">
          <span className="sr-only">Not scored</span>
          <span aria-hidden="true">--</span>
        </p>
      )}
      <div className="flex flex-col gap-1">
        <h3 className="m-0 font-sans font-semibold text-[18px] text-fg">{pass.title}</h3>
        <p className="m-0 font-mono text-[12px] text-fg-subtle flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>{pass.type.label}</span>
          <span aria-hidden="true">·</span>
          {abandoned ? <Badge variant="accent">Put down</Badge> : <span>finished</span>}
          {dates && (
            <>
              <span aria-hidden="true">·</span>
              <span>{dates}</span>
            </>
          )}
          {abandoned && pass.progress && pass.progress.total > 0 && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-fg-muted">
                stopped at <ProgressRatio progress={pass.progress} />
              </span>
            </>
          )}
        </p>
      </div>
    </article>
  );
}
