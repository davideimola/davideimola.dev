import { describe, expect, it } from "vitest";
import { archiveByYear, categoryCounts, topTags } from "./blog-index";

const p = (slug: string, date: string, tags: string[] = [], category = "Technical") => ({
  slug,
  date,
  tags,
  category,
});

describe("topTags", () => {
  it("counts tags, most used first, ties alphabetical, capped", () => {
    const posts = [p("a", "2026-01-01", ["Go", "AI"]), p("b", "2025-01-01", ["AI", "Git"])];
    expect(topTags(posts, 2)).toEqual([
      { label: "AI", count: 2 },
      { label: "Git", count: 1 },
    ]);
  });
});

describe("categoryCounts", () => {
  it("counts each category", () => {
    const posts = [
      p("a", "2026-01-01"),
      p("b", "2026-01-01", [], "Personal"),
      p("c", "2026-01-01"),
    ];
    expect(categoryCounts(posts)).toEqual([
      { label: "Technical", count: 2 },
      { label: "Personal", count: 1 },
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
