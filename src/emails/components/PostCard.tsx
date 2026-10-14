import { Link, Section, Text } from "@react-email/components";
import { emailColors as c, emailFonts as f } from "../theme";
import { absoluteUrl } from "../url";

interface PostCardProps {
  title: string;
  /** Absolute URL to the post (email links must be absolute). */
  url: string;
  /** One-line "why read it". */
  description: string;
  /** Blog category, printed in the mono meta line. Optional. */
  category?: string;
  /** Meta line, e.g. "Jul 12, 2026 · 6 min read". Optional. */
  meta?: string;
}

// Email echo of a row in the site's ruled archive (/blog): a hairline on top, the title in
// sans bold, the one-liner, then a mono meta line with the category. No red, no chips.
// Email-safe: tables (Section), inline styles, no hover/flex/grid.
export function PostCard({ title, url, description, category, meta }: PostCardProps) {
  const metaLine = [category, meta].filter(Boolean).join(" · ");
  return (
    <Section
      style={{
        borderTop: `1px solid ${c.border}`,
        paddingTop: "16px",
        marginBottom: "20px",
      }}
    >
      <Link
        href={absoluteUrl(url)}
        style={{
          fontFamily: f.sans,
          fontSize: "19px",
          fontWeight: 700,
          lineHeight: 1.25,
          letterSpacing: "-0.02em",
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
          fontSize: "16px",
          lineHeight: 1.55,
          color: c.text2,
          margin: "6px 0 0",
        }}
      >
        {description}
      </Text>

      {metaLine ? (
        <Text style={{ fontFamily: f.mono, fontSize: "12px", color: c.text3, margin: "10px 0 0" }}>
          {metaLine}
        </Text>
      ) : null}
    </Section>
  );
}
