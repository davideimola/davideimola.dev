import { Badge } from "../ui/Badge";
import { ROW_CLASSES } from "./row";

interface TalkRowProps {
  event: string;
  date: string;
  location: string;
  /** Talk type, e.g. "Conference" | "Meetup". Rendered as a Badge. Optional. */
  type?: string;
  /** Session title. Optional. */
  sessionTitle?: string;
  /** Link to the engagement (e.g. /sharing#slug). Optional. */
  url?: string;
}

// Web counterpart of the email TalkRow (src/emails/components/TalkRow.tsx): same props.
// A ruled row like the index on /sharing: the session in sans, the event under it, the
// date and place in mono. `not-prose` keeps prose styles off it.
export function TalkRow({ event, date, location, type, sessionTitle, url }: TalkRowProps) {
  const body = (
    <>
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[13px] text-fg-subtle">
        <span>
          {date} · {location}
        </span>
        {type && <Badge variant="category">{type}</Badge>}
      </span>
      <span className="block mt-2 font-sans text-[19px] sm:text-[20px] font-bold text-fg leading-[1.25] tracking-[-0.02em] group-hover:text-accent transition-colors duration-150">
        {sessionTitle ?? event}
      </span>
      {sessionTitle && (
        <span className="block mt-1 font-sans text-[16px] text-fg-muted">{event}</span>
      )}
    </>
  );

  return url ? (
    <a href={url} className={ROW_CLASSES}>
      {body}
    </a>
  ) : (
    <div className={ROW_CLASSES}>{body}</div>
  );
}
