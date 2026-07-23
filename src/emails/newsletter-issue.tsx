import { Heading, Hr, Link, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { formatDate } from "../lib/dates";
import type { NewsletterIssue } from "../lib/newsletter";
import { emailColors as c, emailFonts as f } from "./theme";

// CONTENT-ONLY body for the digest email. It is injected into the Kit account template's
// {{ message_content }} slot, which already provides the wordmark header, the footer, and
// the page background (see docs/newsletter/kit-email-template.html) - so this must NOT
// repeat any of that chrome, or the sent email would have a doubled header/footer.
//
// This renders only the issue CHROME (read-on-web link, issue meta, subject, rule). The
// issue body itself is the MDX compiled by renderIssueEmail (newsletter-email.mts) with
// the email component map (mdx-components.tsx) and passed in as `body` - same authored
// .mdx that the on-site archive renders, so prose + <PostCard/>/<TalkRow/>/<Cta/> match.
//
// Light palette to match the (light) Kit wrapper. Email clients strip custom fonts, so
// headings fall back to monospace and body to a system sans.

interface NewsletterIssueBodyProps {
  issue: NewsletterIssue;
  /** Absolute on-site URL of this issue, used for the "read on web" link. */
  webUrl: string;
  /** The compiled MDX issue body (see renderIssueEmail). */
  body: ReactNode;
}

export function NewsletterIssueBody({ issue, webUrl, body }: NewsletterIssueBodyProps) {
  return (
    <>
      <Section>
        <Link
          href={webUrl}
          style={{ fontFamily: f.mono, fontSize: "11px", color: c.text3, textDecoration: "none" }}
        >
          Read this issue on the web →
        </Link>
      </Section>

      <Section style={{ paddingTop: "14px" }}>
        <Text style={{ fontFamily: f.mono, fontSize: "11px", color: c.text3, margin: "0 0 8px" }}>
          Issue #{issue.issue} · {formatDate(issue.date)}
        </Text>
        <Heading
          as="h1"
          style={{
            fontFamily: f.mono,
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

      <Section>{body}</Section>
    </>
  );
}
