import { render } from "@react-email/render";
import { NewsletterIssueBody } from "../emails/newsletter-issue";
import { createBroadcastDraft } from "./kit";
import type { NewsletterIssue } from "./newsletter";

const SITE_URL = "https://davideimola.dev";

// Issue .mdx uses root-relative links (/blog/…) that resolve on the site but break in
// email. Absolutize them so the sent email links work everywhere. The negative lookahead
// leaves protocol-relative links (](//cdn…) untouched so they are not mangled.
function absolutizeLinks(markdown: string): string {
  return markdown.replace(/\]\(\/(?!\/)/g, `](${SITE_URL}/`);
}

/**
 * Render a frozen newsletter issue to email-safe HTML, with the "read on web" link
 * pointing at the on-site /newsletter/[slug]. Content-only (no <html>/<body>, no header
 * or footer): it is injected into the Kit template's {{ message_content }} slot, which
 * supplies the wordmark header, the footer (with the {{ unsubscribe_url }} link), and the
 * page background. Provider-agnostic output (posted to Kit as the broadcast content).
 */
export async function renderIssueEmail(issue: NewsletterIssue): Promise<string> {
  const webUrl = `${SITE_URL}/newsletter/${issue.slug}`;
  const forEmail = { ...issue, content: absolutizeLinks(issue.content) };
  return render(<NewsletterIssueBody issue={forEmail} webUrl={webUrl} />);
}

/**
 * The full flow for one issue: render its email HTML and create a Kit broadcast DRAFT
 * with the issue's subject. Returns the broadcast id. Never sends. This is the seam the
 * drafting skill (#77) calls; sending stays a manual dashboard step (ADR-0002).
 */
export async function draftIssueBroadcast(issue: NewsletterIssue): Promise<number> {
  const html = await renderIssueEmail(issue);
  return createBroadcastDraft({ subject: issue.subject, html });
}
