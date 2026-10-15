import { describe, expect, it } from "vitest";
import { topicOf } from "./topics";

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
