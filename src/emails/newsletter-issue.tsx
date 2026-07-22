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

// Brand tokens (mirrors src/app/globals.css). Custom fonts are stripped by most email
// clients, so headings fall back to monospace and body to a system sans, approximating
// the site's JetBrains Mono / IBM Plex Sans pairing.
const c = {
  bg: "#080807",
  card: "#0F0E0D",
  border: "#1C1A18",
  text1: "#EAE5DF",
  text2: "#9A948E",
  text3: "#7E7874",
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

          <Section style={{ padding: "14px 28px 0" }}>
            <Text style={{ fontFamily: mono, fontSize: "15px", color: c.text1, margin: 0 }}>
              <span style={{ color: c.accent }}>❯</span> davideimola.dev
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
