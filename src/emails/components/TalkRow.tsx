import { Link, Section, Text } from "@react-email/components";
import { emailColors as c, emailFonts as f } from "../theme";
import { absoluteUrl } from "../url";

interface TalkRowProps {
  event: string;
  /** Preformatted date, e.g. "Nov 14, 2026". */
  date: string;
  location: string;
  /** Talk type, e.g. "Conference" | "Meetup". Printed in the mono meta line. Optional. */
  type?: string;
  /** Session title, shown under the event. Optional. */
  sessionTitle?: string;
  /** Link to the engagement (e.g. /sharing#slug or the event page). Optional. */
  url?: string;
}

// Email echo of a row in the ruled talk index on /sharing: a hairline on top, the event
// in sans bold, the session under it, then date, place and type in mono. Same ruled shape
// as PostCard, so "New on the blog" and "Where to catch me" read as one system.
// Email-safe: tables (Section), inline styles, no hover/flex/grid.
export function TalkRow({ event, date, location, type, sessionTitle, url }: TalkRowProps) {
  const eventStyle = {
    fontFamily: f.sans,
    fontSize: "19px",
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: "-0.02em",
    color: c.text1,
    textDecoration: "none",
    display: "block",
  } as const;

  return (
    <Section
      style={{
        borderTop: `1px solid ${c.border}`,
        paddingTop: "16px",
        marginBottom: "20px",
      }}
    >
      {url ? (
        <Link href={absoluteUrl(url)} style={eventStyle}>
          {event}
        </Link>
      ) : (
        <Text style={{ ...eventStyle, margin: 0 }}>{event}</Text>
      )}

      {sessionTitle ? (
        <Text
          style={{
            fontFamily: f.sans,
            fontSize: "16px",
            lineHeight: 1.5,
            color: c.text2,
            margin: "6px 0 0",
          }}
        >
          {sessionTitle}
        </Text>
      ) : null}

      <Text style={{ fontFamily: f.mono, fontSize: "12px", color: c.text3, margin: "10px 0 0" }}>
        {[date, location, type].filter(Boolean).join(" · ")}
      </Text>
    </Section>
  );
}
