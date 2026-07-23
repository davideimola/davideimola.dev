import { Column, Link, Row, Section, Text } from "@react-email/components";
import { emailColors as c, emailFonts as f } from "../theme";
import { absoluteUrl } from "../url";

interface PostCardProps {
  title: string;
  /** Absolute URL to the post (email links must be absolute). */
  url: string;
  /** One-line "why read it". */
  description: string;
  /** Blog category, rendered as a neutral chip. Optional. */
  category?: string;
  /** Meta line, e.g. "Jul 12, 2026 · 6 min read". Optional. */
  meta?: string;
}

// Email echo of the on-site blog card (src/components/sections/BlogList.tsx): category
// chip, mono title, sans one-liner, meta + "Read". The 2px Akane left border echoes the
// site's terminal band and turns the "New on the blog" link list into scannable cards.
// Kept email-safe: tables (Section/Row/Column), inline styles, no hover/flex/grid.
export function PostCard({ title, url, description, category, meta }: PostCardProps) {
  return (
    <Section
      style={{
        borderLeft: `2px solid ${c.accent}`,
        paddingLeft: "18px",
        paddingTop: "6px",
        marginBottom: "24px",
      }}
    >
      {category ? (
        <Text style={{ margin: "0 0 10px" }}>
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
              display: "inline-block",
            }}
          >
            {category}
          </span>
        </Text>
      ) : null}

      <Link
        href={absoluteUrl(url)}
        style={{
          fontFamily: f.mono,
          fontSize: "17px",
          fontWeight: 700,
          lineHeight: 1.3,
          color: c.text1,
          textDecoration: "none",
          display: "block",
        }}
      >
        {title}
      </Link>

      <Text
        style={{
          fontFamily: f.sans,
          fontSize: "14px",
          lineHeight: 1.6,
          color: c.text2,
          margin: "8px 0 0",
        }}
      >
        {description}
      </Text>

      <Row style={{ marginTop: "12px" }}>
        <Column>
          <Text style={{ fontFamily: f.mono, fontSize: "11px", color: c.text3, margin: 0 }}>
            {meta ?? ""}
          </Text>
        </Column>
        <Column style={{ textAlign: "right" }}>
          <Link
            href={absoluteUrl(url)}
            style={{
              fontFamily: f.mono,
              fontSize: "12px",
              fontWeight: 500,
              color: c.accent,
              textDecoration: "none",
            }}
          >
            Read →
          </Link>
        </Column>
      </Row>
    </Section>
  );
}
