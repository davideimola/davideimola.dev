import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Markdown,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { formatDate } from "../lib/dates";
import type { NewsletterIssue } from "../lib/newsletter";

// Light palette, per the brand's light-surface lockup (docs/brand.md: ink #1A1816 on a
// warm light surface, Akane Red accent). Deliberately light — not the site's dark theme —
// so the digest reads as the same family as Kit's (light) double opt-in confirmation email.
// Custom fonts are stripped by most email clients, so headings fall back to monospace and
// body to a system sans, approximating the site's JetBrains Mono / IBM Plex Sans pairing.
const c = {
  bg: "#EDE8E1",
  card: "#FAF8F5",
  border: "#E1DBD3",
  text1: "#1A1816",
  text2: "#48423C",
  text3: "#6E6862",
  accent: "#C91F37",
};
const mono = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

interface NewsletterIssueEmailProps {
  issue: NewsletterIssue;
  /** Absolute on-site URL of this issue, used for the "read on web" link. */
  webUrl: string;
}

export function NewsletterIssueEmail({ issue, webUrl }: NewsletterIssueEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{issue.previewText}</Preview>
      <Body style={{ backgroundColor: c.bg, margin: 0, padding: "24px 0", fontFamily: sans }}>
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: c.card,
            border: `1px solid ${c.border}`,
            borderRadius: "4px",
          }}
        >
          <Section style={{ padding: "18px 28px 0" }}>
            <Link
              href={webUrl}
              style={{ fontFamily: mono, fontSize: "11px", color: c.text3, textDecoration: "none" }}
            >
              Read this issue on the web →
            </Link>
          </Section>

          {/* Wordmark: "davideimola" + the red cursor bar (per docs/brand.md). Text-based
              so it always renders (no image blocking); the cursor is always Akane Red. */}
          <Section style={{ padding: "16px 28px 0" }}>
            <Text
              style={{
                fontFamily: mono,
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: c.text1,
                margin: 0,
              }}
            >
              davideimola
              <span
                style={{
                  display: "inline-block",
                  width: "3px",
                  height: "13px",
                  backgroundColor: c.accent,
                  marginLeft: "3px",
                  verticalAlign: "middle",
                }}
              />
            </Text>
          </Section>

          <Section style={{ padding: "22px 28px 0" }}>
            <Text style={{ fontFamily: mono, fontSize: "11px", color: c.text3, margin: "0 0 8px" }}>
              Issue #{issue.issue} · {formatDate(issue.date)}
            </Text>
            <Heading
              as="h1"
              style={{
                fontFamily: mono,
                fontSize: "22px",
                fontWeight: 700,
                color: c.text1,
                margin: 0,
                lineHeight: 1.25,
              }}
            >
              {issue.subject}
            </Heading>
          </Section>

          <Hr style={{ borderColor: c.border, margin: "22px 28px" }} />

          <Section style={{ padding: "0 28px" }}>
            <Markdown
              markdownContainerStyles={{
                fontFamily: sans,
                fontSize: "15px",
                lineHeight: 1.65,
                color: c.text2,
              }}
              markdownCustomStyles={{
                h2: { fontFamily: mono, fontSize: "18px", color: c.text1, marginTop: "28px" },
                h3: { fontFamily: mono, fontSize: "15px", color: c.text1, marginTop: "22px" },
                p: { color: c.text2 },
                li: { color: c.text2 },
                link: { color: c.accent },
                bold: { color: c.text1 },
              }}
            >
              {issue.content}
            </Markdown>
          </Section>

          <Hr style={{ borderColor: c.border, margin: "28px 28px 18px" }} />

          <Section style={{ padding: "0 28px 24px" }}>
            <Text style={{ fontFamily: sans, fontSize: "12px", color: c.text3, margin: 0 }}>
              You're getting this because you subscribed at{" "}
              <Link href="https://davideimola.dev/newsletter" style={{ color: c.text2 }}>
                davideimola.dev
              </Link>
              .
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
