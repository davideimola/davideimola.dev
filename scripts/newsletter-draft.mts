// Render a frozen newsletter issue and create a Kit broadcast DRAFT from it (never sends).
// The manual counterpart of the newsletter-digest skill's send step: it lets the author
// (or the skill) turn a committed issue .mdx into a reviewable Kit draft.
//
// Run:  pnpm newsletter:draft [slug]
//   - no slug -> the latest issue (newest sendDate)
//   - slug    -> src/content/newsletter/<slug>.mdx (e.g. 2026-07)
// Requires KIT_API_KEY in the environment (it is read from .env.local by the pnpm script).
// The draft appears in Kit wrapped in the account template; open it, preview it, and use
// Kit's "Send test email" to check it. Nothing sends automatically.

import { getIssueBySlug, getLatestIssue } from "../src/lib/newsletter";
import { draftIssueBroadcast } from "../src/lib/newsletter-email.mjs";

const slug = process.argv[2];
const issue = slug ? getIssueBySlug(slug) : getLatestIssue();

if (!issue) {
  console.error(
    slug
      ? `No newsletter issue found for slug "${slug}" in src/content/newsletter.`
      : "No newsletter issue found in src/content/newsletter."
  );
  process.exit(1);
}

console.log(`Rendering + creating a Kit DRAFT for issue #${issue.issue}: "${issue.subject}"`);
const id = await draftIssueBroadcast(issue);
console.log(`\n✓ Kit broadcast draft created: id=${id}`);
console.log("  It is a DRAFT (public:false, no send). In Kit: open it, preview it (wrapped in");
console.log("  the account template), then use 'Send test email' to check it in your inbox.");
