// Render a frozen newsletter issue, save it on newsletter-svc and test-send it to Davide
// (never to the list). The manual counterpart of the newsletter-digest skill's send step.
//
// Run:  pnpm newsletter:draft [slug]
//   - no slug -> the latest issue (newest sendDate)
//   - slug    -> src/content/newsletter/<slug>.mdx (e.g. 2026-07)
// Requires NEWSLETTER_API_URL and NEWSLETTER_API_KEY in the environment (read from .env.local
// by the pnpm script). Re-running replaces the saved version and sends a new test. The real
// send is the button on the issue's admin page, printed at the end.

import { getIssueBySlug, getLatestIssue } from "../src/lib/newsletter";
import { draftIssue } from "../src/lib/newsletter-email.mjs";

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

console.log(`Rendering, saving and test-sending issue #${issue.issue}: "${issue.subject}"`);
const state = await draftIssue(issue);
console.log("\n✓ Saved on newsletter-svc and test-sent to Davide.");
console.log("  Check the test in your inbox. When it is right, send it from:");
console.log(`  ${state.adminUrl}`);
