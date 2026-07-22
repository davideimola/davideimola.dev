import { Body, Container, Head, Html, Section, Text } from "@react-email/components";
import type { NewsletterIssue } from "../../lib/newsletter";
import { NewsletterIssueBody } from "../newsletter-issue";

// Preview harness for `pnpm email:dev`. The real digest body is content-only (it renders
// into the Kit template's {{ message_content }} slot), so here we wrap it in a light
// mock of that Kit wrapper (docs/newsletter/kit-email-template.html) - wordmark header +
// footer with unsubscribe - to preview the full email in context. Preview-only.
const mono = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace";
const sans = "'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

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
    <Html lang="en">
      <Head />
      <Body style={{ margin: 0, padding: 0, backgroundColor: "#EDE8E1", fontFamily: sans }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#EDE8E1" }}>
          {/* Mock Kit wrapper header */}
          <Section
            style={{
              padding: "40px 20px 30px",
              textAlign: "center",
              borderBottom: "1px solid #E1DBD3",
            }}
          >
            <Text
              style={{
                fontFamily: mono,
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "#1A1816",
                margin: 0,
              }}
            >
              davideimola
              <span
                style={{
                  display: "inline-block",
                  width: "3px",
                  height: "16px",
                  backgroundColor: "#C91F37",
                  marginLeft: "3px",
                  verticalAlign: "middle",
                }}
              />
            </Text>
          </Section>

          {/* The actual content-only body ({{ message_content }}) */}
          <Section style={{ padding: "30px 20px" }}>
            <NewsletterIssueBody
              issue={SAMPLE}
              webUrl="https://davideimola.dev/newsletter/2026-07"
            />
          </Section>

          {/* Mock Kit wrapper footer */}
          <Section
            style={{ padding: "30px 20px", borderTop: "1px solid #E1DBD3", textAlign: "center" }}
          >
            <Text style={{ fontFamily: sans, fontSize: "12px", color: "#6E6862", margin: 0 }}>
              GitHub · LinkedIn · Website · Unsubscribe · Privacy
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
