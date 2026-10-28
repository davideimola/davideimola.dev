import { Text } from "@react-email/components";
import type { NewsletterIssue } from "../../lib/newsletter";
import { CtaButton } from "../components/CtaButton";
import { PostCard } from "../components/PostCard";
import { SectionHeader } from "../components/SectionHeader";
import { TalkRow } from "../components/TalkRow";
import { NewsletterEmail } from "../layout";
import { NewsletterIssueBody } from "../newsletter-issue";
import { emailColors as c, emailFonts as f } from "../theme";

// Preview harness for `pnpm email:dev`. Shows the FULL digest email as it is sent: the
// NewsletterEmail layout (lockup header, footer with the unsubscribe placeholder) around the
// NewsletterIssueBody chrome and a representative body built from the email components. In
// production the body is the issue's compiled MDX (renderIssueEmail); here it is
// hand-authored JSX so the preview stays synchronous. Preview-only; not shipped.

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
    <NewsletterEmail previewText={SAMPLE.previewText}>
      <NewsletterIssueBody
        issue={SAMPLE}
        webUrl="https://davideimola.dev/newsletter/2026-07"
        body={<SampleBody />}
      />
    </NewsletterEmail>
  );
}
