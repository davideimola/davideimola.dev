import { Heading, Hr, Link, Markdown, Section, Text } from "@react-email/components";
import { formatDate } from "../lib/dates";
import type { NewsletterIssue } from "../lib/newsletter";

// CONTENT-ONLY body for the digest email. It is injected into the Kit account template's
// {{ message_content }} slot, which already provides the wordmark header, the footer, and
// the page background (see docs/newsletter/kit-email-template.html) - so this must NOT
// repeat any of that chrome, or the sent email would have a doubled header/footer.
//
// Light palette to match the (light) Kit wrapper; the brand's light-surface lockup
// (docs/brand.md). Email clients strip custom fonts, so headings fall back to monospace
// and body to a system sans. Horizontal padding comes from the wrapper's content cell.
const c = {
  border: "#E1DBD3",
  text1: "#1A1816",
  text2: "#48423C",
  text3: "#6E6862",
  accent: "#C91F37",
};
const mono = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

interface NewsletterIssueBodyProps {
  issue: NewsletterIssue;
  /** Absolute on-site URL of this issue, used for the "read on web" link. */
  webUrl: string;
}

export function NewsletterIssueBody({ issue, webUrl }: NewsletterIssueBodyProps) {
  return (
    <>
      <Section>
        <Link
          href={webUrl}
          style={{ fontFamily: mono, fontSize: "11px", color: c.text3, textDecoration: "none" }}
        >
          Read this issue on the web →
        </Link>
      </Section>

      <Section style={{ paddingTop: "14px" }}>
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

      <Hr style={{ borderColor: c.border, margin: "22px 0" }} />

      <Section>
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
    </>
  );
}
