import { describe, expect, it } from "vitest";
import { getAiSecurityHub, hubFacts, hubTalks, START_POST } from "./ai-security";
import type { Project, Talk } from "./content";

function talk(slug: string, date: string, tags: string[], title?: string): Talk {
  return {
    slug,
    event: slug.toUpperCase(),
    type: "Conference",
    date,
    location: "Verona, Italy",
    tags,
    session: title ? { title, format: "Talk" } : undefined,
  };
}

describe("hubTalks", () => {
  it("keeps security stage sessions, newest first, and folds a talk given twice", () => {
    const rows = hubTalks([
      talk("secrets-2023", "2023-10-13", ["Security"], "Secrets"),
      talk("go-2026", "2026-11-01", ["Go", "Security"], "Securing Go"),
      talk("secrets-2024", "2024-02-07", ["Security"], "Secrets"),
      talk("ddd", "2024-11-13", ["Go"], "DDD"),
      talk("hackathon", "2026-06-27", ["Security"]),
    ]);
    expect(rows.map((r) => [r.talk.slug, r.events])).toEqual([
      ["go-2026", ["GO-2026"]],
      ["secrets-2024", ["SECRETS-2024", "SECRETS-2023"]],
    ]);
  });
});

describe("hubFacts", () => {
  it("counts sessions from the earliest year and names the flagship", () => {
    const sessions = [talk("a", "2026-01-01", []), talk("b", "2023-05-01", [])];
    const flagship = { title: "Argus" } as Project;
    expect(
      hubFacts({
        sessions,
        posts: 6,
        series: { slug: "s", title: "S", parts: [1, 2, 3, 4].map(() => ({}) as never) },
        flagship,
      })
    ).toEqual(["2 security talks since 2023", "6 posts", "a 4-part series", "maintainer of Argus"]);
  });

  it("leaves out what there is none of", () => {
    expect(hubFacts({ sessions: [], posts: 1, series: null, flagship: null })).toEqual(["1 post"]);
  });
});

describe("getAiSecurityHub", () => {
  it("resolves every slug it names against the real content", () => {
    const hub = getAiSecurityHub();
    expect(hub.start.slug).toBe(START_POST);
    expect(hub.series.parts.length).toBeGreaterThan(0);
    expect(hub.skills).not.toBeNull();
    // Step 5 never repeats a post a step above already shows.
    const above = new Set([
      hub.start.slug,
      hub.flagshipPost?.slug,
      ...hub.series.parts.map((p) => p.slug),
    ]);
    expect(hub.further.some((p) => above.has(p.slug))).toBe(false);
  });
});
