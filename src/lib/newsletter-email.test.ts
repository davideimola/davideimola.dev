import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NewsletterIssue } from "./newsletter";
import { draftIssue, renderIssueEmail } from "./newsletter-email";

const issue: NewsletterIssue = {
  slug: "2026-07",
  issue: 1,
  subject: "July digest",
  previewText: "What I shipped in July.",
  date: "2026-07-28",
  content: "## Intro\n\nRead [my post](/blog/hello) and get the rest.",
};

describe("renderIssueEmail", () => {
  it("renders the issue subject and content into HTML", async () => {
    const html = await renderIssueEmail(issue);
    expect(html).toContain("July digest");
    expect(html).toContain("Intro");
  });

  it("is the whole email: document, lockup header, preview text and footer", async () => {
    const html = await renderIssueEmail(issue);
    expect(html).toMatch(/<html/i);
    expect(html).toMatch(/<body/i);
    expect(html).toContain("https://www.davideimola.dev/brand/lockup-1200.png");
    expect(html).toContain("What I shipped in July.");
    expect(html).toContain("https://davideimola.dev/privacy");
  });

  it("leaves the unsubscribe link as the placeholder newsletter-svc fills per reader", async () => {
    const html = await renderIssueEmail(issue);
    expect(html).toContain('href="{{ unsubscribe_url }}"');
  });

  it("carries no image but the lockup, so nothing in it can tell who opened it", async () => {
    const html = await renderIssueEmail(issue);
    const images = html.match(/<img\b[^>]*>/gi) ?? [];
    expect(images).toHaveLength(1);
    expect(images[0]).toContain("lockup-1200.png");
  });

  it("points the read-on-web link at the on-site issue URL", async () => {
    const html = await renderIssueEmail(issue);
    expect(html).toContain("https://davideimola.dev/newsletter/2026-07");
  });

  it("absolutizes root-relative content links for email", async () => {
    const html = await renderIssueEmail(issue);
    expect(html).toContain("https://davideimola.dev/blog/hello");
    expect(html).not.toContain('href="/blog/hello"');
  });

  it("renders inline MDX components and absolutizes their url/href props", async () => {
    const withComponents: NewsletterIssue = {
      ...issue,
      content: [
        "Intro prose.",
        "",
        '<SectionHeader title="New on the blog" />',
        "",
        '<PostCard title="Hello post" url="/blog/hello" category="Technical" description="Why it matters." meta="Jul 1 · 3 min" />',
        "",
        '<TalkRow event="reactjsday 2026" date="Oct 23" location="Verona" type="Conference" url="/sharing#x" />',
        "",
        '<Cta href="/newsletter" variant="primary">Browse the archive →</Cta>',
      ].join("\n"),
    };
    const html = await renderIssueEmail(withComponents);
    // Components rendered (not left as raw MDX text).
    expect(html).toContain("New on the blog");
    expect(html).toContain("Hello post");
    expect(html).toContain("reactjsday 2026");
    expect(html).toContain("Browse the archive →");
    // The ruled hairline proves PostCard/TalkRow rendered as components, and the red
    // rule holds: nothing in the email is Akane at rest.
    expect(html).toContain("1px solid #DEDCD5");
    expect(html).not.toMatch(/#C91F37/i);
    // Component-prop links are absolutized for email.
    expect(html).toContain("https://davideimola.dev/blog/hello");
    expect(html).toContain("https://davideimola.dev/sharing#x");
    expect(html).not.toContain('href="/blog/hello"');
    expect(html).not.toContain('href="/sharing#x"');
  });
});

describe("draftIssue", () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const state = {
    slug: "2026-07",
    subject: "July digest",
    status: "draft",
    tested: true,
    adminUrl: "https://news.example.com/admin/issues/2026-07",
  };

  beforeEach(() => {
    vi.stubEnv("NEWSLETTER_API_URL", "https://news.example.com");
    vi.stubEnv("NEWSLETTER_API_KEY", "test-key");
    fetchMock.mockReset().mockResolvedValue({ ok: true, status: 200, json: async () => state });
  });

  afterEach(() => vi.unstubAllEnvs());

  it("saves the rendered email, then test-sends it, and never sends to the list", async () => {
    const result = await draftIssue(issue);

    expect(result.adminUrl).toBe(state.adminUrl);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const [saveUrl, saveInit] = fetchMock.mock.calls[0];
    expect(saveUrl).toBe("https://news.example.com/api/issues/2026-07");
    expect(saveInit.method).toBe("PUT");
    const body = JSON.parse(saveInit.body);
    expect(body.subject).toBe(issue.subject);
    expect(body.html).toContain("Intro");
    expect(body.html).toContain("{{ unsubscribe_url }}");
    expect(fetchMock.mock.calls[1][0]).toBe("https://news.example.com/api/issues/2026-07/test");
  });
});
