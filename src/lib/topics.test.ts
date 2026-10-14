import { describe, expect, it } from "vitest";
import { groupByTopic, topicOf } from "./topics";

const post = (
  slug: string,
  extra: Partial<{ topic: string; category: string; tags: string[] }>
) => ({
  slug,
  category: "Technical",
  tags: [] as string[],
  ...extra,
});

describe("topicOf", () => {
  it("honours the frontmatter topic", () => {
    expect(topicOf(post("a", { topic: "engineering", tags: ["AI"] }))).toBe("engineering");
  });

  it("falls back to category and tags", () => {
    expect(topicOf(post("a", { category: "Personal" }))).toBe("looking-back");
    expect(topicOf(post("a", { tags: ["Security"] }))).toBe("ai-security");
    expect(topicOf(post("a", { tags: ["Go"] }))).toBe("engineering");
    expect(topicOf(post("a", { topic: "nonsense", tags: ["Go"] }))).toBe("engineering");
  });
});

describe("groupByTopic", () => {
  it("keeps topic order, caps each column and leaves out the excluded post", () => {
    const posts = [
      post("latest", { topic: "ai-security" }),
      post("a1", { topic: "ai-security" }),
      post("e1", { topic: "engineering" }),
      post("a2", { topic: "ai-security" }),
      post("a3", { topic: "ai-security" }),
      post("a4", { topic: "ai-security" }),
    ];
    const groups = groupByTopic(posts, { exclude: "latest", perTopic: 3 });
    expect(groups.map((g) => g.slug)).toEqual(["ai-security", "engineering"]);
    expect(groups[0].posts.map((p) => p.slug)).toEqual(["a1", "a2", "a3"]);
  });
});
