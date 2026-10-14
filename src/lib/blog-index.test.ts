import { describe, expect, it } from "vitest";
import { archiveByYear, topicCounts } from "./blog-index";

const p = (slug: string, date: string, tags: string[] = [], category = "Technical") => ({
  slug,
  date,
  tags,
  category,
});

describe("topicCounts", () => {
  it("counts the posts in each topic, in the fixed order, empty topics left out", () => {
    const posts = [
      { topic: "engineering", category: "Technical", tags: ["Go"] },
      { topic: "ai-security", category: "Technical", tags: ["AI"] },
      { category: "Technical", tags: ["Security"] },
    ];
    expect(topicCounts(posts)).toEqual([
      { slug: "ai-security", label: "AI and security", count: 2 },
      { slug: "engineering", label: "Engineering and Go", count: 1 },
    ]);
  });
});

describe("archiveByYear", () => {
  it("groups the recent years and folds the rest into Earlier", () => {
    const posts = [
      p("a", "2026-10-14"),
      p("b", "2025-12-31"),
      p("c", "2023-12-28"),
      p("d", "2022-12-20"),
      p("e", "2020-06-01"),
    ];
    const groups = archiveByYear(posts, 3);
    expect(groups.map((g) => [g.label, g.posts.map((x) => x.slug)])).toEqual([
      ["2026", ["a"]],
      ["2025", ["b"]],
      ["2023", ["c"]],
      ["Earlier", ["d", "e"]],
    ]);
  });

  it("has no Earlier group when there is nothing older", () => {
    expect(archiveByYear([p("a", "2026-01-01")]).map((g) => g.label)).toEqual(["2026"]);
  });
});
