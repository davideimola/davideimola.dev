import { describe, expect, it } from "vitest";
import type { BlogPost, Project, Talk } from "./content";
import { harvestWindow } from "./harvest";

// Minimal fixtures: harvestWindow only reads post.date, talk.date, and project
// featured/status, so we build just-valid objects rather than full content.
function post(slug: string, date: string): BlogPost {
  return {
    slug,
    title: slug,
    excerpt: "",
    category: "Technical",
    tags: [],
    date,
    readingTime: "1 min read",
    content: "",
  };
}

function talk(slug: string, date: string): Talk {
  return { slug, event: slug, type: "Conference", date, location: "", tags: [] };
}

function project(slug: string, featured: boolean, status: Project["status"]): Project {
  return { slug, title: slug, status, period: "", featured, tags: [], description: "" };
}

const WINDOW = { from: "2026-07-01", to: "2026-07-31" };

describe("harvestWindow - posts", () => {
  it("selects only posts published within the window, inclusive of both edges", () => {
    const posts = [
      post("before", "2026-06-30"),
      post("on-from", "2026-07-01"),
      post("mid", "2026-07-15"),
      post("on-to", "2026-07-31"),
      post("after", "2026-08-01"),
    ];
    const { posts: got } = harvestWindow({ ...WINDOW, posts, talks: [] });
    expect(got.map((p) => p.slug)).toEqual(["on-to", "mid", "on-from"]);
  });

  it("orders selected posts newest-first", () => {
    const posts = [post("a", "2026-07-05"), post("b", "2026-07-20"), post("c", "2026-07-10")];
    const { posts: got } = harvestWindow({ ...WINDOW, posts, talks: [] });
    expect(got.map((p) => p.slug)).toEqual(["b", "c", "a"]);
  });
});

describe("harvestWindow - upcoming talks", () => {
  it("selects only talks after the window end, soonest-first", () => {
    const talks = [
      talk("past", "2026-05-10"), // before window
      talk("in-window", "2026-07-15"), // inside the reported month, already happened by send
      talk("on-to", "2026-07-31"), // exactly the send date - not upcoming
      talk("soon", "2026-08-10"),
      talk("later", "2026-09-02"),
    ];
    const { upcomingTalks } = harvestWindow({ ...WINDOW, posts: [], talks });
    expect(upcomingTalks.map((t) => t.slug)).toEqual(["soon", "later"]);
  });
});

describe("harvestWindow - projects (optional passthrough)", () => {
  it("returns only featured active projects, and is empty when none provided", () => {
    expect(harvestWindow({ ...WINDOW, posts: [], talks: [] }).projects).toEqual([]);

    const projects = [
      project("featured-active", true, "active"),
      project("featured-archived", true, "archived"),
      project("plain-active", false, "active"),
    ];
    const { projects: got } = harvestWindow({ ...WINDOW, posts: [], talks: [], projects });
    expect(got.map((p) => p.slug)).toEqual(["featured-active"]);
  });
});

describe("harvestWindow - skippable (empty month)", () => {
  it("is skippable when there are no posts and no upcoming talks", () => {
    expect(harvestWindow({ ...WINDOW, posts: [], talks: [] }).skippable).toBe(true);
  });

  it("is not skippable when there is a post in the window", () => {
    const result = harvestWindow({ ...WINDOW, posts: [post("p", "2026-07-10")], talks: [] });
    expect(result.skippable).toBe(false);
  });

  it("is not skippable when there is an upcoming talk", () => {
    const result = harvestWindow({ ...WINDOW, posts: [], talks: [talk("t", "2026-08-10")] });
    expect(result.skippable).toBe(false);
  });

  it("ignores projects for the skippable decision", () => {
    const result = harvestWindow({
      ...WINDOW,
      posts: [],
      talks: [],
      projects: [project("p", true, "active")],
    });
    expect(result.skippable).toBe(true);
  });
});
