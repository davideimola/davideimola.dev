import fs from "node:fs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  extractToc,
  getAllProjects,
  getRelatedPosts,
  getPrevNextPosts,
  getRecentPosts,
} from "./content";

vi.mock("node:fs", () => ({
  default: {
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}));

const mockFs = vi.mocked(fs);

function mdx(fields: {
  title: string;
  publishDate: string;
  category: string;
  tags: string[];
  featured?: boolean;
}): string {
  return [
    "---",
    `title: "${fields.title}"`,
    `publishDate: "${fields.publishDate}"`,
    `category: "${fields.category}"`,
    `tags: [${fields.tags.map((t) => `"${t}"`).join(", ")}]`,
    `featured: ${fields.featured ?? false}`,
    "---",
    "",
    "Post content.",
  ].join("\n");
}

// Three posts: A is newest, C is oldest
const POST_A = mdx({
  title: "Post A",
  publishDate: "2024-03-01",
  category: "Engineering",
  tags: ["go", "security"],
});
const POST_B = mdx({
  title: "Post B",
  publishDate: "2024-02-01",
  category: "Engineering",
  tags: ["go", "devops"],
});
const POST_C = mdx({
  title: "Post C",
  publishDate: "2024-01-01",
  category: "DevOps",
  tags: ["kubernetes"],
});

function setupBlogPosts() {
  mockFs.readdirSync.mockReturnValue(["post-a.mdx", "post-b.mdx", "post-c.mdx"] as never);
  mockFs.readFileSync.mockImplementation((filePath: unknown) => {
    const p = String(filePath);
    if (p.includes("post-a")) return POST_A;
    if (p.includes("post-b")) return POST_B;
    if (p.includes("post-c")) return POST_C;
    return "";
  });
}

// ── extractToc ─────────────────────────────────────────────────────────────

describe("extractToc", () => {
  it("returns empty array for content without headings", () => {
    expect(extractToc("No headings.\n\nJust paragraphs.")).toEqual([]);
  });

  it("ignores h1 headings", () => {
    expect(extractToc("# Top Level")).toEqual([]);
  });

  it("extracts h2 headings as level 2", () => {
    expect(extractToc("## Hello World")).toEqual([
      { id: "hello-world", text: "Hello World", level: 2 },
    ]);
  });

  it("extracts h3 headings as level 3", () => {
    expect(extractToc("### Deep Section")).toEqual([
      { id: "deep-section", text: "Deep Section", level: 3 },
    ]);
  });

  it("strips inline code, bold and link markdown from heading text", () => {
    expect(extractToc("## `code` and **bold**")).toEqual([
      { id: "code-and-bold", text: "code and bold", level: 2 },
    ]);
  });

  it("preserves insertion order across h2 and h3", () => {
    const toc = extractToc("## Section One\n\n### Subsection\n\n## Section Two");
    expect(toc).toEqual([
      { id: "section-one", text: "Section One", level: 2 },
      { id: "subsection", text: "Subsection", level: 3 },
      { id: "section-two", text: "Section Two", level: 2 },
    ]);
  });
});

// ── getRelatedPosts ────────────────────────────────────────────────────────

describe("getRelatedPosts", () => {
  beforeEach(() => setupBlogPosts());

  it("returns empty array when slug is not found", () => {
    expect(getRelatedPosts("nonexistent")).toEqual([]);
  });

  it("never includes the current post", () => {
    const related = getRelatedPosts("post-a");
    expect(related.every((p) => p.slug !== "post-a")).toBe(true);
  });

  it("scores shared tags (×2) higher than same category (×1)", () => {
    // post-a vs post-b: 1 shared tag "go" (2pts) + same category (1pt) = 3
    // post-a vs post-c: 0 shared tags + different category = 0  → excluded
    const related = getRelatedPosts("post-a");
    expect(related).toHaveLength(1);
    expect(related[0].slug).toBe("post-b");
  });

  it("excludes posts with score 0", () => {
    const related = getRelatedPosts("post-a");
    expect(related.find((p) => p.slug === "post-c")).toBeUndefined();
  });

  it("respects the count limit", () => {
    expect(getRelatedPosts("post-b", 1)).toHaveLength(1);
  });
});

// ── getPrevNextPosts ───────────────────────────────────────────────────────

describe("getPrevNextPosts", () => {
  beforeEach(() => setupBlogPosts());

  // Sorted newest-first: post-a (Mar) → post-b (Feb) → post-c (Jan)
  // prev = older, next = newer

  it("returns null/null when slug is not found", () => {
    expect(getPrevNextPosts("nonexistent")).toEqual({ prev: null, next: null });
  });

  it("newest post has no next", () => {
    expect(getPrevNextPosts("post-a").next).toBeNull();
  });

  it("oldest post has no prev", () => {
    expect(getPrevNextPosts("post-c").prev).toBeNull();
  });

  it("middle post links to both neighbours", () => {
    const { prev, next } = getPrevNextPosts("post-b");
    expect(prev?.slug).toBe("post-c");
    expect(next?.slug).toBe("post-a");
  });
});

// ── getRecentPosts ─────────────────────────────────────────────────────────

describe("getRecentPosts", () => {
  beforeEach(() => setupBlogPosts());

  it("returns posts in descending date order", () => {
    const recent = getRecentPosts(3);
    const dates = recent.map((p) => p.date);
    expect(dates).toEqual([...dates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime()));
  });

  it("respects the count argument", () => {
    expect(getRecentPosts(2)).toHaveLength(2);
  });

  it("defaults to 3 posts", () => {
    expect(getRecentPosts()).toHaveLength(3);
  });
});

// ── getAllProjects ─────────────────────────────────────────────────────────

describe("getAllProjects", () => {
  it("sorts projects: active → coming-soon → archived", () => {
    const raw = [
      { slug: "c", status: "archived", title: "C", featured: false, tags: [], period: "2020", description: "" },
      { slug: "a", status: "active", title: "A", featured: true, tags: [], period: "2023", description: "" },
      { slug: "b", status: "coming-soon", title: "B", featured: false, tags: [], period: "2025", description: "" },
    ];
    mockFs.readFileSync.mockReturnValue(JSON.stringify(raw));

    const result = getAllProjects();
    expect(result.map((p) => p.status)).toEqual(["active", "coming-soon", "archived"]);
  });
});
