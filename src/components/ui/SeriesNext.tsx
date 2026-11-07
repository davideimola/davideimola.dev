import { formatDayMonthYear } from "../../lib/dates";
import type { SeriesPart } from "../../lib/series";

interface SeriesNextProps {
  next: SeriesPart;
  total: number;
}

// The close of a series post: the part that comes next. Once it is out the
// whole card links to it; until then it only says when, and offers the RSS
// feed, the one channel that really tells a reader the day a post lands (the
// newsletter is monthly, so it would promise what it does not do).
export function SeriesNext({ next, total }: SeriesNextProps) {
  const kicker = `NEXT IN THE SERIES · PART ${next.number} OF ${total}`;
  const box = "mt-12 pt-8 border-t border-border";

  if (next.slug) {
    return (
      <nav aria-label="Next in the series" className={box}>
        <a
          href={`/blog/${next.slug}`}
          className="group flex flex-col gap-1 p-4 border border-border bg-surface hover:border-fg transition-colors duration-150 no-underline"
        >
          <span className="font-mono text-[12px] text-fg-subtle tracking-[0.06em]">{kicker}</span>
          <span className="font-sans text-[17px] font-semibold tracking-[-0.01em] text-fg group-hover:text-accent transition-colors duration-150">
            {next.title}
          </span>
        </a>
      </nav>
    );
  }

  return (
    <aside aria-label="Next in the series" className={box}>
      <div className="flex flex-col gap-1 p-4 border border-border bg-surface">
        <span className="font-mono text-[12px] text-fg-subtle tracking-[0.06em]">{kicker}</span>
        <span className="font-sans text-[17px] font-semibold tracking-[-0.01em] text-fg">
          {next.title}
        </span>
        <span className="font-mono text-[13px] text-fg-subtle">
          Out {formatDayMonthYear(next.date)} ·{" "}
          <a href="/rss.xml" className="text-fg-subtle no-underline hover:text-accent">
            RSS
          </a>
        </span>
      </div>
    </aside>
  );
}
