import { formatDayMonth } from "../../lib/dates";
import type { StageRow } from "../../lib/home-cards";
import { city, eventName } from "../../lib/sharing";
import { ButtonLink } from "../ui/Button";
import { HomeBand } from "./HomeBand";

interface StageSectionProps {
  /** The Record's creed: the stage is where the sharing happens. */
  quote: string;
  /** Always the same number of rows: what comes next, topped up with the latest. */
  stage: StageRow[];
  /** Conferences Davide has spoken at, derived from the talk archive. */
  spokenAt: string[];
  /** Every talk and appearance in the archive, for the link to /sharing. */
  talkCount: number;
}

// ON STAGE: three talk cards side by side, always three (the next ones, topped
// up with the latest given), each of one fixed shape: the date on top, the
// title always two lines (reserved when shorter, clamped when longer), the
// event at the bottom. Whatever the calendar and the titles, the row keeps one
// height. Then where he has spoken and the way to invite him.
export function StageSection({ quote, stage, spokenAt, talkCount }: StageSectionProps) {
  return (
    <HomeBand
      tape="On stage"
      tilt={2}
      title={quote}
      more={{ label: `${talkCount} talks and appearances`, href: "/sharing" }}
    >
      {stage.length > 0 && (
        <ul className="m-0 p-0 list-none grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {stage.map(({ talk, upcoming }) => (
            <li key={talk.slug} className="h-full">
              <a
                href={`/sharing#${talk.slug}`}
                className="group h-full flex flex-col gap-3 bg-surface border border-border hover:border-fg transition-colors duration-150 px-5 py-4 no-underline"
              >
                <span className="flex items-baseline gap-3 font-mono text-fg">
                  <span className="text-[24px] md:text-[26px] tracking-[-0.03em]">
                    {formatDayMonth(talk.date)}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.06em] text-fg-subtle">
                    {upcoming ? "Next" : talk.date.slice(0, 4)}
                  </span>
                </span>
                <span
                  title={talk.session?.title ?? talk.event}
                  className="font-sans font-semibold text-[17px] leading-[1.3] tracking-[-0.015em] text-fg group-hover:text-accent transition-colors duration-150 line-clamp-2 min-h-[2.6em]"
                >
                  {talk.session?.title ?? talk.event}
                </span>
                <span className="mt-auto font-mono text-[12px] text-fg-subtle truncate">
                  {eventName(talk.event)} {talk.date.slice(0, 4)} · {city(talk.location)}
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 pt-4 border-t border-border">
        {spokenAt.length > 0 && (
          <p className="m-0 font-mono text-[13px] leading-[1.7] text-fg-subtle">
            Spoken at {spokenAt.join(", ")}
          </p>
        )}
        <ButtonLink variant="link" href="/sharing#speaker-kit">
          Invite me to speak
        </ButtonLink>
      </div>
    </HomeBand>
  );
}
