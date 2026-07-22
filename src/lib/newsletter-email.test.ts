import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { NewsletterIssue } from "./newsletter";
import { draftIssueBroadcast, renderIssueEmail } from "./newsletter-email";

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

  it("is content-only: a fragment with no <html>/<body> wrapper or footer chrome", async () => {
    const html = await renderIssueEmail(issue);
    // The Kit template supplies the <html>/<body>, the header, and the footer/unsubscribe.
    expect(html).not.toMatch(/<html/i);
    expect(html).not.toMatch(/<body/i);
    expect(html).not.toContain("Unsubscribe");
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
});

describe("draftIssueBroadcast", () => {
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);

  beforeEach(() => {
    vi.stubEnv("KIT_API_KEY", "test-key");
    fetchMock
      .mockReset()
      .mockResolvedValue({ ok: true, status: 201, json: async () => ({ broadcast: { id: 7 } }) });
  });

  afterEach(() => vi.unstubAllEnvs());

  it("creates a draft whose subject is the issue subject and content is the rendered email", async () => {
    const id = await draftIssueBroadcast(issue);

    expect(id).toBe(7);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.kit.com/v4/broadcasts");
    const body = JSON.parse(init.body);
    expect(body.subject).toBe(issue.subject);
    expect(body.public).toBe(false);
    // content is the rendered email HTML: carries the issue content + read-on-web link
    expect(body.content).toContain("Intro");
    expect(body.content).toContain("https://davideimola.dev/newsletter/2026-07");
  });
});
