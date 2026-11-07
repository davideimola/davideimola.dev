import { formatDayMonthYear } from "../../lib/dates";
import type { ResolvedSeries } from "../../lib/series";

interface SeriesPartsProps {
  series: ResolvedSeries;
  /** The part the reader is on. */
  current: number;
  /** Show the mono "The series" label above the list (the rail does, the phone disclosure has its own summary). */
  label?: boolean;
  className?: string;
}

// Every part of a series on a ruled list, the way /cv rules its entries: ink
// rule on top, hairlines between. The current part is bold, the published
// ones link, the upcoming ones are subtle and carry their planned date.
export function SeriesParts({ series, current, label = true, className = "" }: SeriesPartsProps) {
  return (
    <nav aria-label={`Series: ${series.title}`} className={className}>
      {label && (
        <p className="font-mono text-[12px] text-fg-subtle tracking-[0.06em] uppercase mb-3.5">
          The series
        </p>
      )}
      <ol className="list-none m-0 p-0 border-t border-fg">
        {series.parts.map((part) => {
          const isCurrent = part.number === current;
          const row = "grid grid-cols-[22px_minmax(0,1fr)] gap-x-1 py-2.5 border-b border-border";
          const number = (
            <span className="font-mono text-[12px] text-fg-subtle pt-[3px]">{part.number}</span>
          );
          if (isCurrent) {
            return (
              <li key={part.number} aria-current="page" className={row}>
                {number}
                <span className="font-sans font-semibold text-[15px] leading-[1.4] text-fg">
                  {part.short}
                </span>
              </li>
            );
          }
          if (part.slug) {
            return (
              <li key={part.number}>
                <a
                  href={`/blog/${part.slug}`}
                  className={`${row} no-underline font-sans text-[15px] leading-[1.4] text-fg-muted hover:text-accent transition-colors duration-150`}
                >
                  {number}
                  <span>{part.short}</span>
                </a>
              </li>
            );
          }
          return (
            <li key={part.number} className={row}>
              {number}
              <span className="flex flex-col gap-0.5 font-sans text-[15px] leading-[1.4] text-fg-subtle">
                {part.short}
                <span className="font-mono text-[12px]">{formatDayMonthYear(part.date)}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
