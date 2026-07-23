import { Badge } from "../ui/Badge";

interface TalkRowProps {
  event: string;
  date: string;
  location: string;
  /** Talk type, e.g. "Conference" | "Meetup". Rendered as a neutral chip. Optional. */
  type?: string;
  /** Session title, shown after the event path. Optional. */
  sessionTitle?: string;
  /** Link to the engagement (e.g. /sharing#slug). Optional. */
  url?: string;
}

// Web counterpart of the email TalkRow (src/emails/components/TalkRow.tsx): same props,
// same 2px Akane left border, echoing the on-site talk card (meta row + "./event / session"
// path). `not-prose` keeps prose styles off it.
export function TalkRow({ event, date, location, type, sessionTitle, url }: TalkRowProps) {
  const path = (
    <>
      <span className="text-accent">./</span>
      <span className="text-text-2">{event}</span>
      {sessionTitle && (
        <>
          <span className="text-text-3"> / </span>
          <span className="text-text-1 font-semibold">{sessionTitle}</span>
        </>
      )}
    </>
  );

  return (
    <div className="not-prose border-l-2 border-accent pl-4 sm:pl-5 my-5">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mb-2">
        <span className="font-mono text-[11px] text-text-3">{date}</span>
        <span className="font-mono text-[11px] text-text-3">·</span>
        <span className="font-mono text-[11px] text-text-3">{location}</span>
        {type && <Badge variant="category">{type}</Badge>}
      </div>
      <p className="font-mono text-[16px] sm:text-[18px] leading-snug mb-0">
        {url ? (
          <a href={url} className="no-underline">
            {path}
          </a>
        ) : (
          path
        )}
      </p>
    </div>
  );
}
