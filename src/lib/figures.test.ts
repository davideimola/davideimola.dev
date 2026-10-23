import { describe, expect, it } from "vitest";
import { figuresToMarkdown, isFigurePath } from "./figures";

describe("isFigurePath", () => {
  it("accepts a figure kept with its post", () => {
    expect(isFigurePath("/images/blog/my-post/figures/two-clocks.svg")).toBe(true);
  });

  it("rejects anything else", () => {
    expect(isFigurePath("/images/blog/my-post/cover.svg")).toBe(false);
    expect(isFigurePath("/images/blog/my-post/figures/two-clocks-dark.svg")).toBe(false);
    expect(isFigurePath("/images/blog/my-post/figures/../../../secret.svg")).toBe(false);
    expect(isFigurePath("https://example.com/figures/x.svg")).toBe(false);
  });
});

describe("figuresToMarkdown", () => {
  it("turns a figure into a Markdown image with its caption", () => {
    const mdx = `Before.\n\n<DrawnFigure src="/images/blog/p/figures/a.svg" alt="Two clocks" caption="Same bug." />\n\nAfter.`;
    expect(figuresToMarkdown(mdx)).toBe(
      "Before.\n\n![Two clocks](/images/blog/p/figures/a.svg)\n\n*Same bug.*\n\nAfter."
    );
  });

  it("leaves out the caption line when there is none, across lines too", () => {
    const mdx = `<DrawnFigure\n  src="/images/blog/p/figures/a.svg"\n  alt="Two clocks"\n/>`;
    expect(figuresToMarkdown(mdx)).toBe("![Two clocks](/images/blog/p/figures/a.svg)");
  });

  it("leaves the rest of the post alone", () => {
    expect(figuresToMarkdown("## Title\n\n![x](/a.png)")).toBe("## Title\n\n![x](/a.png)");
  });
});
