import { Link, Section, Text } from "@react-email/components";
import { emailColors as c, emailFonts as f } from "../theme";
import { absoluteUrl } from "../url";

interface TalkRowProps {
  event: string;
  /** Preformatted date, e.g. "Nov 14, 2026". */
  date: string;
  location: string;
  /** Talk type, e.g. "Conference" | "Meetup". Rendered as a neutral chip. Optional. */
  type?: string;
  /** Session title, shown after the event path. Optional. */
  sessionTitle?: string;
  /** Link to the engagement (e.g. /sharing#slug or the event page). Optional. */
  url?: string;
}

// Email echo of the on-site talk card (src/components/sections/TalksList.tsx): a meta row
// (date · location + type chip) above the terminal "./event / session" path. Uses the same
// 2px Akane left border as PostCard so "New on the blog" and "Where to catch me" read as
// one system. Email-safe: tables (Section), inline styles, no hover/flex/grid.
export function TalkRow({ event, date, location, type, sessionTitle, url }: TalkRowProps) {
  const eventPath = (
    <>
      <span style={{ color: c.accent }}>./</span>
      <span style={{ color: c.text2 }}>{event}</span>
      {sessionTitle ? (
        <>
          <span style={{ color: c.text3 }}> / </span>
          <span style={{ color: c.text1, fontWeight: 600 }}>{sessionTitle}</span>
        </>
      ) : null}
    </>
  );

  return (
    <Section
      style={{
        borderLeft: `2px solid ${c.accent}`,
        paddingLeft: "18px",
        paddingTop: "6px",
        marginBottom: "20px",
      }}
    >
      {/* Meta row: date · location + type chip */}
      <Text style={{ fontFamily: f.mono, fontSize: "11px", color: c.text3, margin: "0 0 8px" }}>
        {date}
        <span style={{ color: c.text3 }}> · </span>
        {location}
        {type ? (
          <span
            style={{
              fontFamily: f.mono,
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: c.text3,
              backgroundColor: c.border,
              borderRadius: "2px",
              padding: "3px 7px",
              marginLeft: "10px",
              display: "inline-block",
            }}
          >
            {type}
          </span>
        ) : null}
      </Text>

      {/* Event path */}
      <Text style={{ fontFamily: f.mono, fontSize: "16px", lineHeight: 1.35, margin: 0 }}>
        {url ? (
          <Link href={absoluteUrl(url)} style={{ color: c.text2, textDecoration: "none" }}>
            {eventPath}
          </Link>
        ) : (
          eventPath
        )}
      </Text>
    </Section>
  );
}
