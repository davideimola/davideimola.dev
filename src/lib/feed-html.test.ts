import { describe, expect, it } from "vitest";
import { postToFeedHtml } from "./feed-html";

describe("postToFeedHtml", () => {
  const html = (content: string) => postToFeedHtml(content, "https://davideimola.dev");

  it("renders the Markdown, not the source", () => {
    expect(html("## Title\n\nSome **bold** text.")).toBe(
      "<h2>Title</h2>\n<p>Some <strong>bold</strong> text.</p>"
    );
  });

  it("keeps code blocks with their language", () => {
    expect(html('```go title="a.go"\nx := 1\n```')).toContain(
      '<pre><code class="language-go">x := 1\n</code></pre>'
    );
  });

  it("points links and figures at the site, figures at their PNG", () => {
    const out = html(
      '[a](/blog/b)\n\n<DrawnFigure src="/images/blog/p/figures/f.svg" alt="F" caption="Cap." />'
    );
    expect(out).toContain('href="https://davideimola.dev/blog/b"');
    expect(out).toContain('src="https://davideimola.dev/images/blog/p/figures/f.png"');
    expect(out).toContain("<em>Cap.</em>");
  });

  it("renders GFM tables and footnotes", () => {
    const out = html("| a |\n| - |\n| 1 |\n\nText.[^n]\n\n[^n]: Note.");
    expect(out).toContain("<table>");
    expect(out).toContain("data-footnotes");
  });
});
