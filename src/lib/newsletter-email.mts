import { render } from "@react-email/render";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { emailMdxComponents } from "../emails/mdx-components";
import { NewsletterIssueBody } from "../emails/newsletter-issue";
import { SITE_URL } from "../emails/url";
import { createBroadcastDraft } from "./kit";
import type { NewsletterIssue } from "./newsletter";

// This module is ESM (.mts) on purpose. It runs under tsx (via `pnpm newsletter:draft`),
// and compiling MDX pulls estree-walker@3, which is ESM-only. As a .tsx (CJS by default,
// the repo has no "type":"module") tsx resolves that chain under CJS conditions and fails
// with ERR_PACKAGE_PATH_NOT_EXPORTED. ESM resolution uses the package's "import" condition
// and works. The single JSX call is written as a function call so this stays a .mts (the
// TS loader rejects JSX in .mts). Consumed only by the draft script and the unit test.

/**
 * Render a frozen newsletter issue to email-safe HTML, with the "read on web" link
 * pointing at the on-site /newsletter/[slug]. Content-only (no <html>/<body>, no header
 * or footer): it is injected into the Kit template's {{ message_content }} slot, which
 * supplies the wordmark header, the footer (with the {{ unsubscribe_url }} link), and the
 * page background. Provider-agnostic output (posted to Kit as the broadcast content).
 *
 * The issue body is authored as MDX (prose + <PostCard/>/<TalkRow/>/<SectionHeader/>/<Cta/>)
 * and compiled here with the email component map, so the same .mdx renders in the inbox
 * and in the on-site archive. Links (prose and component props) are absolutized for email
 * by the component map / components themselves.
 */
export async function renderIssueEmail(issue: NewsletterIssue): Promise<string> {
  const webUrl = `${SITE_URL}/newsletter/${issue.slug}`;
  const { content: body } = await compileMDX({
    source: issue.content,
    components: emailMdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm] } },
  });
  return render(NewsletterIssueBody({ issue, webUrl, body }));
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
