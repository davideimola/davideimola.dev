import { describe, expect, it } from "vitest";
import type { BlogPost, Project, Talk } from "./content";
import { absolutizeUrls, buildLlmsFullTxt, buildLlmsTxt, postToMarkdown } from "./llms";

const post: BlogPost = {
  slug: "test-post",
  title: "Test Post",
  excerpt: "A post used in tests.",
  category: "Technical",
  tags: ["AI", "Testing"],
  date: "2026-03-27",
  readingTime: "5 min read",
  heroImage: "/images/blog/test-post/hero.webp",
  heroImageAlt: "Hero alt text",
  content: "## Section\n\nSome text with a [link](/blog/other) and ![img](/images/pic.webp).",
};

const talk: Talk = {
  slug: "conf-2026",
  event: "Conf 2026",
  type: "Conference",
  date: "2026-11-19",
  location: "Verona, Italy",
  tags: ["AI"],
  session: { title: "My Talk", format: "Talk" },
};

const organizerOnly: Talk = {
  slug: "meetup-2026",
  event: "Meetup 2026",
  type: "Meetup",
  date: "2026-01-28",
  location: "Milan, Italy",
  organizer: true,
  tags: ["Community"],
};

const project: Project = {
  slug: "argus",
  title: "Argus",
  status: "active",
  url: "https://example.com/argus",
  period: "2026",
  featured: true,
  tags: ["Go"],
  description: "AI security review agent.",
};

describe("absolutizeUrls", () => {
  it("rewrites root-relative links and images to absolute URLs", () => {
    const result = absolutizeUrls("[a](/blog/x) ![b](/images/y.webp)", "https://example.com");
    expect(result).toBe("[a](https://example.com/blog/x) ![b](https://example.com/images/y.webp)");
  });

  it("leaves absolute URLs untouched", () => {
    const input = "[a](https://other.com/page)";
    expect(absolutizeUrls(input, "https://example.com")).toBe(input);
  });
});

describe("postToMarkdown", () => {
  it("renders title, metadata, hero image, and absolutized content", () => {
    const md = postToMarkdown(post, "https://example.com");
    expect(md).toContain("# Test Post");
    expect(md).toContain("> A post used in tests.");
    expect(md).toContain("- Published: 2026-03-27");
    expect(md).toContain("- Tags: AI, Testing");
    expect(md).toContain("- Canonical: https://example.com/blog/test-post");
    expect(md).toContain("![Hero alt text](https://example.com/images/blog/test-post/hero.webp)");
    expect(md).toContain("[link](https://example.com/blog/other)");
  });

  it("omits the hero image line when the post has none", () => {
    const md = postToMarkdown({ ...post, heroImage: undefined }, "https://example.com");
    expect(md).not.toContain("![Hero alt text]");
  });
});

describe("buildLlmsTxt", () => {
  const txt = buildLlmsTxt(
    { posts: [post], talks: [talk, organizerOnly], projects: [project] },
    "https://example.com"
  );

  it("links blog posts to their .md version", () => {
    expect(txt).toContain("[Test Post](https://example.com/blog/test-post.md)");
  });

  it("lists only talks with a session", () => {
    expect(txt).toContain("[My Talk]");
    expect(txt).not.toContain("Meetup 2026");
  });

  it("lists projects with their URL and description", () => {
    expect(txt).toContain("[Argus](https://example.com/argus): AI security review agent.");
  });
});

describe("buildLlmsFullTxt", () => {
  it("inlines every post after the site header", () => {
    const txt = buildLlmsFullTxt([post], "https://example.com");
    expect(txt).toContain("# Davide Imola, full blog content");
    expect(txt).toContain("# Test Post");
  });
});
