import { describe, expect, it } from "vitest";
import type { BlogPost } from "./content";
import {
  articleChanged,
  canonicalKey,
  type DevtoArticle,
  devtoTags,
  isDueForSyndication,
  planSync,
  toDevtoArticle,
  toDevtoMarkdown,
} from "./devto";

const post = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  slug: "my-post",
  title: "My Post",
  excerpt: "What it says.",
  category: "Technical",
  tags: ["AI", "Security", "Go", "PostgreSQL", "GDPR"],
  date: "2026-11-12",
  readingTime: "5 min read",
  heroImage: "/images/blog/my-post/cover.svg",
  syndicate: true,
  content: "Body.\n",
  ...overrides,
});

describe("devtoTags", () => {
  it("keeps the first four tags, lowercase and alphanumeric", () => {
    expect(devtoTags(post())).toEqual(["ai", "security", "go", "postgresql"]);
    expect(devtoTags(post({ tags: ["Open Source", "CI/CD", "ci-cd", "Go"] }))).toEqual([
      "opensource",
      "cicd",
      "go",
    ]);
  });

  it("drops a tag dev.to would refuse for its length", () => {
    expect(devtoTags(post({ tags: ["a".repeat(31), "go"] }))).toEqual(["go"]);
  });

  it("uses devtoTags when the post names them", () => {
    expect(devtoTags(post({ devtoTags: ["Go", "Security"] }))).toEqual(["go", "security"]);
  });
});

describe("toDevtoMarkdown", () => {
  const md = (content: string) => toDevtoMarkdown(post({ content }));

  it("points root-relative links and images at the site", () => {
    expect(md("See [this](/blog/other) and ![x](/images/a.png).")).toContain(
      "See [this](https://davideimola.dev/blog/other) and ![x](https://davideimola.dev/images/a.png)."
    );
  });

  it("turns a figure into its PNG render with the caption", () => {
    const out = md(
      '<DrawnFigure src="/images/blog/my-post/figures/a.svg" alt="Two clocks" caption="Same bug." />'
    );
    expect(out).toContain(
      "![Two clocks](https://davideimola.dev/images/blog/my-post/figures/a.png)\n\n*Same bug.*"
    );
  });

  it("names a code block's file on the line above it", () => {
    expect(md('```go title="store.go"\nx := 1\n```')).toContain(
      "**`store.go`**\n\n```go\nx := 1\n```"
    );
  });

  it("turns a GitHub alert into a labelled quote", () => {
    expect(md("> [!WARNING]\n> Careful.")).toContain("> **Warning**\n> Careful.");
  });

  it("drops MDX comments", () => {
    expect(md("A.\n\n{/* IMAGE: a screenshot */}\nB.")).toMatch(/^A\.\n\nB\./);
  });

  it("ends with the original and the newsletter", () => {
    const out = md("Body.");
    expect(out).toMatch(/^Body\.\n\n---\n\n/);
    expect(out).toContain("[davideimola.dev](https://davideimola.dev/blog/my-post)");
    expect(out).toContain("https://davideimola.dev/newsletter");
  });
});

describe("toDevtoArticle", () => {
  it("fills the dev.to fields from the post", () => {
    const article = toDevtoArticle(post(), "The Four Boundaries");
    expect(article).toMatchObject({
      title: "My Post",
      description: "What it says.",
      published: true,
      tags: ["ai", "security", "go", "postgresql"],
      canonical_url: "https://davideimola.dev/blog/my-post",
      main_image: "https://davideimola.dev/images/blog/my-post/cover.png",
      series: "The Four Boundaries",
    });
  });

  it("leaves out what the post does not have", () => {
    const article = toDevtoArticle(post({ heroImage: undefined }), null);
    expect(article).not.toHaveProperty("main_image");
    expect(article).not.toHaveProperty("series");
  });
});

describe("canonicalKey", () => {
  it("matches the same post however its URL was written", () => {
    const key = canonicalKey("https://davideimola.dev/blog/my-post");
    expect(canonicalKey("https://www.davideimola.dev/blog/my-post")).toBe(key);
    expect(canonicalKey("https://davideimola.dev/blog/my-post/")).toBe(key);
    expect(canonicalKey("http://davideimola.dev/blog/My-Post")).toBe(key);
  });

  it("has no key for a missing URL", () => {
    expect(canonicalKey(null)).toBeNull();
  });
});

describe("isDueForSyndication", () => {
  it("waits three days after the publish date", () => {
    expect(isDueForSyndication(post({ date: "2026-11-12" }), "2026-11-14")).toBe(false);
    expect(isDueForSyndication(post({ date: "2026-11-12" }), "2026-11-15")).toBe(true);
  });

  it("leaves the archive before the start date to the manual push", () => {
    expect(isDueForSyndication(post({ date: "2026-11-11" }), "2026-12-31")).toBe(false);
  });

  it("skips drafts and posts that opt out", () => {
    expect(isDueForSyndication(post({ draft: true }), "2026-12-31")).toBe(false);
    expect(isDueForSyndication(post({ syndicate: false }), "2026-12-31")).toBe(false);
  });
});

describe("articleChanged", () => {
  const wanted = toDevtoArticle(post(), null);
  const existing = {
    id: 1,
    published: true,
    title: wanted.title,
    description: wanted.description,
    body_markdown: `${wanted.body_markdown}\n`,
    tag_list: wanted.tags,
    canonical_url: "https://www.davideimola.dev/blog/my-post/",
  };

  it("is false when dev.to already holds what the post generates", () => {
    expect(articleChanged(existing, wanted)).toBe(false);
  });

  it("ignores the order dev.to returns the tags in", () => {
    expect(articleChanged({ ...existing, tag_list: [...wanted.tags].reverse() }, wanted)).toBe(
      false
    );
  });

  it("is true when the body, the title or the tags differ", () => {
    expect(articleChanged({ ...existing, body_markdown: "old" }, wanted)).toBe(true);
    expect(articleChanged({ ...existing, title: "Old" }, wanted)).toBe(true);
    expect(articleChanged({ ...existing, tag_list: ["ai"] }, wanted)).toBe(true);
    expect(articleChanged({ ...existing, published: false }, wanted)).toBe(true);
  });
});

describe("planSync", () => {
  const today = "2026-11-20";
  const copy = (slug: string, published: boolean, body = "stale") => ({
    id: slug.length,
    published,
    title: "x",
    description: "x",
    body_markdown: body,
    tag_list: [],
    canonical_url: `https://davideimola.dev/blog/${slug}/`,
  });

  it("creates a due post that has no copy", () => {
    const plan = planSync([post({ slug: "new" })], [], today);
    expect(plan).toEqual([{ action: "create", post: expect.objectContaining({ slug: "new" }) }]);
  });

  it("rewrites a published copy that drifted, whatever the post's date", () => {
    const old = post({ slug: "old", date: "2023-01-01" });
    const plan = planSync([old], [copy("old", true)], today);
    expect(plan).toEqual([{ action: "update", post: old, id: 3 }]);
  });

  it("leaves an archive draft alone and publishes a due one", () => {
    const old = post({ slug: "old", date: "2023-01-01" });
    const due = post({ slug: "due" });
    const plan = planSync([old, due], [copy("old", false), copy("due", false)], today);
    expect(plan).toEqual([{ action: "update", post: due, id: 3 }]);
  });

  it("does nothing for an up-to-date copy, a post not yet due or one that opts out", () => {
    const fresh = post({ slug: "fresh" });
    const upToDate = { ...copy("fresh", true), ...toDevtoArticleFields(fresh) };
    const plan = planSync(
      [fresh, post({ slug: "soon", date: "2026-11-19" }), post({ slug: "out", syndicate: false })],
      [upToDate, copy("out", true)],
      today
    );
    expect(plan).toEqual([]);
  });
});

function toDevtoArticleFields(p: BlogPost) {
  const a: DevtoArticle = toDevtoArticle(p, null);
  return {
    title: a.title,
    description: a.description,
    body_markdown: a.body_markdown,
    tag_list: a.tags,
  };
}
