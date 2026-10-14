import { Body, Container, Head, Html, Img, Section, Text } from "@react-email/components";
import type { NewsletterIssue } from "../../lib/newsletter";
import { CtaButton } from "../components/CtaButton";
import { PostCard } from "../components/PostCard";
import { SectionHeader } from "../components/SectionHeader";
import { TalkRow } from "../components/TalkRow";
import { NewsletterIssueBody } from "../newsletter-issue";
import { emailColors as c, emailFonts as f } from "../theme";

// Preview harness for `pnpm email:dev`. Shows the FULL digest email - the NewsletterIssueBody
// chrome (read-on-web, meta, subject, rule) plus a representative body built from the email
// components - inside a light mock of the Kit wrapper template (wordmark header + footer),
// so colors and spacing are judged in the real email context. In production the body is the
// issue's compiled MDX (renderIssueEmail); here it is hand-authored JSX so the preview stays
// synchronous. Preview-only; not shipped.

// The same hosted lockup the Kit wrapper uses (public/brand/lockup-1200.png).
const LOCKUP_URL = "https://www.davideimola.dev/brand/lockup-1200.png";

const SAMPLE: NewsletterIssue = {
  slug: "2026-07",
  issue: 1,
  subject: "July 2026: shipping quietly, writing loudly",
  previewText: "A verification spike, two posts on tools and trust, and where to catch me.",
  date: "2026-07-28",
  content: "",
};

const prose = {
  fontFamily: f.sans,
  fontSize: "16px",
  lineHeight: 1.65,
  color: c.text2,
};

function SampleBody() {
  return (
    <>
      <Text style={{ ...prose, margin: "0 0 14px" }}>
        Welcome to the issue. Once a month, what actually happened: what I found, tried, built and
        killed.
      </Text>

      <SectionHeader title="New on the blog" />
      <PostCard
        title="AI will not secure your codebase"
        url="/blog/ai-will-not-secure-your-codebase"
        category="Technical"
        description='Why "we added an AI reviewer" is not a security strategy.'
        meta="Jul 18, 2026 · 7 min read"
      />
      <PostCard
        title="I built a tool I don't use"
        url="/blog/i-built-a-tool-i-dont-use"
        category="Personal"
        description="A small retrospective on shipping the wrong thing, and what it taught me."
        meta="Jul 9, 2026 · 5 min read"
      />

      <Text style={{ ...prose, margin: "0 0 14px" }}>
        A short discursive line between sections, because I want a bit of narrative here.
      </Text>

      <SectionHeader title="Where to catch me" />
      <TalkRow
        event="reactjsday 2026"
        date="Oct 23, 2026"
        location="Verona, Italy"
        type="Conference"
        sessionTitle="Shipping AI you can actually trust"
        url="/sharing#reactjsday-2026"
      />
      <TalkRow event="Schrödinger Hat Meetup" date="Nov 12, 2026" location="Online" type="Meetup" />

      <SectionHeader title="That's it" />
      <Text style={{ ...prose, margin: "0 0 18px" }}>
        Short on purpose. Read the full issue on the web, or just hit reply and tell me what you'd
        want more of.
      </Text>
      <CtaButton href="/newsletter" variant="primary">
        Browse the archive
      </CtaButton>
      <CtaButton href="mailto:davide@davideimola.dev" variant="ghost">
        Reply to this issue
      </CtaButton>
    </>
  );
}

export default function NewsletterIssuePreview() {
  return (
    <Html lang="en">
      <Head />
      <Body style={{ margin: 0, padding: 0, backgroundColor: c.bg, fontFamily: f.sans }}>
        <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: c.bg }}>
          {/* Mock Kit wrapper header: the hosted lockup, as in kit-email-template.html */}
          <Section
            style={{
              padding: "40px 20px 30px",
              textAlign: "center",
              borderBottom: `1px solid ${c.border}`,
            }}
          >
            <Img
              src={LOCKUP_URL}
              width="180"
              height="35"
              alt="Davide Imola"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* The actual content-only body ({{ message_content }}) */}
          <Section style={{ padding: "30px 20px" }}>
            <NewsletterIssueBody
              issue={SAMPLE}
              webUrl="https://davideimola.dev/newsletter/2026-07"
              body={<SampleBody />}
            />
          </Section>

          {/* Mock Kit wrapper footer */}
          <Section
            style={{
              padding: "30px 20px",
              borderTop: `1px solid ${c.border}`,
              textAlign: "center",
            }}
          >
            <Text style={{ fontFamily: f.sans, fontSize: "12px", color: c.text1, margin: 0 }}>
              GitHub · LinkedIn · Website · Unsubscribe · Privacy
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
