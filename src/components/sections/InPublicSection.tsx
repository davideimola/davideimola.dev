import { formatDayMonth } from "../../lib/dates";
import type { StageRow } from "../../lib/home-cards";
import { city, eventName } from "../../lib/sharing";
import { ButtonLink } from "../ui/Button";
import { Photo } from "../ui/Photo";
import { HomeBand } from "./HomeBand";

export interface Community {
  title: string;
  description: string;
  href: string;
}

interface InPublicSectionProps {
  /** The Record's creed: this is the block where the sharing happens. */
  quote: string;
  /** Always the same number of rows: what comes next, topped up with the latest. */
  stage: StageRow[];
  /** Conferences Davide has spoken at, derived from the talk archive. */
  spokenAt: string[];
  communities: Community[];
  /** Every talk and appearance in the archive, for the link to /sharing. */
  talkCount: number;
}

function TalkRow({ talk, upcoming }: StageRow) {
  return (
    <li className="border-b border-border">
      <a
        href={`/sharing#${talk.slug}`}
        className="group grid grid-cols-[64px_minmax(0,1fr)] gap-4 py-3.5 no-underline"
      >
        <span className="flex flex-col gap-0.5 font-mono text-[13px] text-fg-subtle pt-0.5">
          {formatDayMonth(talk.date)}
          {upcoming && (
            <span className="text-[11px] uppercase tracking-[0.06em] text-fg">Next</span>
          )}
        </span>
        <span className="flex flex-col gap-1 min-w-0">
          <span className="font-sans font-semibold text-[17px] md:text-[18px] leading-[1.3] tracking-[-0.015em] text-fg group-hover:text-accent transition-colors duration-150">
            {talk.session?.title ?? talk.event}
          </span>
          <span className="font-mono text-[12px] text-fg-subtle">
            {eventName(talk.event)} {talk.date.slice(0, 4)} · {city(talk.location)}
          </span>
        </span>
      </a>
    </li>
  );
}

// IN PUBLIC: the creed as the title, because this is where the sharing
// happens. Two columns of text that weigh about the same: on the left the
// stage (always two rows: the next talks, topped up with the latest given, so
// the column keeps its height whatever the calendar says; where he has spoken;
// the way to invite him), on the right the communities he helps
// run. The Open Source Day audience closes the block as a full-width band of
// its own rather than padding one column.
export function InPublicSection({
  quote,
  stage,
  spokenAt,
  communities,
  talkCount,
}: InPublicSectionProps) {
  return (
    <HomeBand
      tape="In public"
      tilt={2}
      title={quote}
      more={{ label: `${talkCount} talks and appearances`, href: "/sharing" }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
        <div className="flex flex-col items-start gap-4 min-w-0">
          {stage.length > 0 && (
            <div className="w-full">
              <p className="m-0 mb-2.5 font-mono text-[12px] tracking-[0.04em] uppercase text-fg-subtle">
                On stage
              </p>
              <ul className="m-0 p-0 list-none border-t border-fg">
                {stage.map((row) => (
                  <TalkRow key={row.talk.slug} {...row} />
                ))}
              </ul>
            </div>
          )}
          {spokenAt.length > 0 && (
            <p className="m-0 font-mono text-[13px] leading-[1.7] text-fg-subtle">
              Spoken at {spokenAt.join(", ")}
            </p>
          )}
          <ButtonLink variant="link" href="/sharing#speaker-kit">
            Invite me to speak
          </ButtonLink>
        </div>

        <div className="w-full min-w-0">
          <p className="m-0 mb-2.5 font-mono text-[12px] tracking-[0.04em] uppercase text-fg-subtle">
            Communities I help run
          </p>
          <ul className="m-0 p-0 list-none border-t border-fg">
            {communities.map((c) => (
              <li key={c.title} className="border-b border-border">
                <a href={c.href} className="group flex flex-col gap-1 py-3.5 no-underline">
                  <span className="font-sans font-semibold text-[17px] md:text-[18px] leading-[1.3] tracking-[-0.015em] text-fg group-hover:text-accent transition-colors duration-150">
                    {c.title}
                  </span>
                  <span className="font-sans text-[15px] leading-[1.5] text-fg-muted">
                    {c.description}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <figure className="m-0">
        <div className="relative w-full aspect-[3/2] md:aspect-[3/1]">
          <Photo
            src="/images/osday-audience.webp"
            alt="The audience at Open Source Day, rows of people with lanyards watching a talk"
            sizes="(min-width: 1136px) 1072px, 100vw"
            position="object-[50%_60%]"
          />
        </div>
        <figcaption className="font-mono text-[13px] text-fg-subtle pt-2.5">
          Open Source Day, Florence
        </figcaption>
      </figure>
    </HomeBand>
  );
}
