import { render } from "@react-email/render";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { NewsletterEmail } from "../emails/layout";
import { emailMdxComponents } from "../emails/mdx-components";
import { NewsletterIssueBody } from "../emails/newsletter-issue";
import { SITE_URL } from "../emails/url";
import type { NewsletterIssue } from "./newsletter";
import { type IssueState, saveIssue, testIssue } from "./newsletter-api";

// This module is ESM (.mts) on purpose. It runs under tsx (via `pnpm newsletter:draft`),
// and compiling MDX pulls estree-walker@3, which is ESM-only. As a .tsx (CJS by default,
// the repo has no "type":"module") tsx resolves that chain under CJS conditions and fails
// with ERR_PACKAGE_PATH_NOT_EXPORTED. ESM resolution uses the package's "import" condition
// and works. The JSX calls are written as function calls so this stays a .mts (the TS
// loader rejects JSX in .mts). Consumed only by the draft script and the unit test.

/**
 * Render a frozen newsletter issue to the whole email, ready to send: the document, the
 * lockup header, the issue, and the footer whose unsubscribe link is the
 * `{{ unsubscribe_url }}` placeholder newsletter-svc fills per reader. The "read on web"
 * link points at the on-site /newsletter/[slug].
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
  return render(
    NewsletterEmail({
      previewText: issue.previewText || undefined,
      children: NewsletterIssueBody({ issue, webUrl, body }),
    })
  );
}

/**
 * The full flow for one issue: render it, save it on newsletter-svc (replacing an earlier
 * version) and test-send it to Davide. Never sends to the list: that is the button on the
 * issue's admin page, whose URL comes back here. This is the seam the drafting skill calls.
 */
export async function draftIssue(issue: NewsletterIssue): Promise<IssueState> {
  const html = await renderIssueEmail(issue);
  await saveIssue({ slug: issue.slug, subject: issue.subject, html });
  return testIssue(issue.slug);
}
