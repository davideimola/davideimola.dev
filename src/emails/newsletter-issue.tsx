import { Heading, Hr, Link, Section, Text } from "@react-email/components";
import type { ReactNode } from "react";
import { formatDate } from "../lib/dates";
import type { NewsletterIssue } from "../lib/newsletter";
import { emailColors as c, emailFonts as f } from "./theme";

// The issue part of the digest email: read-on-web link, issue meta, subject, rule, then the
// body. It sits inside NewsletterEmail (layout.tsx), which supplies the document, the
// lockup header and the footer with the unsubscribe link, so it must not repeat any of
// that chrome.
//
// The issue body itself is the MDX compiled by renderIssueEmail (newsletter-email.mts) with
// the email component map (mdx-components.tsx) and passed in as `body` - same authored
// .mdx that the on-site archive renders, so prose + <PostCard/>/<TalkRow/>/<Cta/> match.
//
// The brand's light palette (src/emails/theme.ts). The subject is a sans bold title like
// an article h1 on the site; the issue meta is mono. Email clients often strip custom
// fonts, so both fall back to a system face.

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
          style={{
            fontFamily: f.mono,
            fontSize: "12px",
            color: c.text3,
            textDecoration: "underline",
            textUnderlineOffset: "3px",
          }}
        >
          Read this issue on the web
        </Link>
      </Section>

      <Section style={{ paddingTop: "14px" }}>
        <Text style={{ fontFamily: f.mono, fontSize: "12px", color: c.text3, margin: "0 0 10px" }}>
          Issue #{issue.issue} · {formatDate(issue.date)}
        </Text>
        <Heading
          as="h1"
          style={{
            fontFamily: f.sans,
            fontSize: "30px",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            color: c.text1,
            margin: 0,
            lineHeight: 1.1,
          }}
        >
          {issue.subject}
        </Heading>
      </Section>

      <Hr style={{ borderColor: c.text1, margin: "22px 0" }} />

      <Section>{body}</Section>
    </>
  );
}
