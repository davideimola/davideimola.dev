import type { NewsletterIssue } from "../../lib/newsletter";
import { NewsletterIssueEmail } from "../newsletter-issue";

// Sample issue for the react-email preview server (`pnpm email:dev`). Preview-only:
// not shipped, not used at runtime. Uses absolute links (renderIssueEmail absolutizes
// root-relative links itself, but the raw template does not).
const SAMPLE: NewsletterIssue = {
  slug: "2026-07",
  issue: 1,
  subject: "July 2026: shipping quietly, writing loudly",
  previewText:
    "A verification spike, two posts on tools and trust, and where to catch me this autumn.",
  date: "2026-07-28",
  content: [
    "Welcome to the first issue. Once a month, a short digest of what I published: new posts, upcoming talks, and the occasional project. No filler.",
    "",
    "## New on the blog",
    "",
    '- [AI will not secure your codebase](https://davideimola.dev/blog/ai-will-not-secure-your-codebase): why "we added an AI reviewer" is not a security strategy.',
    "- [I built a tool I don't use](https://davideimola.dev/blog/i-built-a-tool-i-dont-use): a small retrospective on shipping the wrong thing.",
    "",
    "## Where to catch me",
    "",
    "I will be speaking at **reactjsday 2026** this autumn. Find me in the hallway.",
    "",
    "## That's it",
    "",
    "Short on purpose. Reply and tell me what you'd want more of.",
  ].join("\n"),
};

export default function NewsletterIssuePreview() {
  return (
    <NewsletterIssueEmail issue={SAMPLE} webUrl="https://davideimola.dev/newsletter/2026-07" />
  );
}
