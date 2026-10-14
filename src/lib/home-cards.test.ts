import { describe, expect, it } from "vitest";
import type { Project, Talk } from "./content";
import { pickBuildingProject, pickRotatingCard, pickSpokenAt, todayKey } from "./home-cards";
import type { ShelfPass } from "./shelf";

function talk(slug: string, date: string, session?: Partial<NonNullable<Talk["session"]>>): Talk {
  return {
    slug,
    event: `Event ${slug}`,
    type: "Conference",
    date,
    location: "Verona",
    tags: [],
    ...(session ? { session: { title: `Talk ${slug}`, format: "Talk", ...session } } : {}),
  };
}

function pass(id: string, verbBase: string): ShelfPass {
  return {
    id,
    title: `Title ${id}`,
    type: { slug: verbBase, label: verbBase, verb: verbBase, verbBase },
    medium: { slug: "paper", label: "Paper" },
    startedAt: null,
    standsAt: null,
    progress: null,
    cover: null,
    series: null,
  } as ShelfPass;
}

const TODAY = new Date(2026, 9, 14); // 14 Oct 2026, local time

describe("pickRotatingCard", () => {
  it("prefers the next upcoming talk, soonest first", () => {
    const card = pickRotatingCard({
      talks: [
        talk("later", "2026-12-01", {}),
        talk("soon", "2026-11-01", {}),
        talk("old", "2026-01-01", { video: "v" }),
      ],
      reading: [pass("a", "read")],
      today: TODAY,
    });
    expect(card).toEqual({ kind: "next-talk", talk: expect.objectContaining({ slug: "soon" }) });
  });

  it("counts a talk happening today as upcoming", () => {
    const card = pickRotatingCard({
      talks: [talk("today", "2026-10-14", {})],
      reading: [],
      today: TODAY,
    });
    expect(card?.kind).toBe("next-talk");
  });

  it("ignores upcoming events where Davide gives no session", () => {
    const card = pickRotatingCard({
      talks: [talk("organising", "2026-11-01"), talk("recorded", "2026-03-01", { video: "v" })],
      reading: [],
      today: TODAY,
    });
    expect(card).toEqual({
      kind: "last-recording",
      talk: expect.objectContaining({ slug: "recorded" }),
    });
  });

  it("falls back to the most recent past talk that has a recording", () => {
    const card = pickRotatingCard({
      talks: [
        talk("no-video", "2026-09-01", {}),
        talk("older-video", "2025-05-01", { video: "v1" }),
        talk("newer-video", "2026-04-01", { video: "v2" }),
      ],
      reading: [pass("a", "read")],
      today: TODAY,
    });
    expect(card).toEqual({
      kind: "last-recording",
      talk: expect.objectContaining({ slug: "newer-video" }),
    });
  });

  it("falls back to what is being read, skipping what is being played", () => {
    const card = pickRotatingCard({
      talks: [talk("no-video", "2026-09-01", {})],
      reading: [pass("game", "play"), pass("book", "read")],
      today: TODAY,
    });
    expect(card).toEqual({ kind: "reading", pass: expect.objectContaining({ id: "book" }) });
  });

  it("returns nothing when no slot has content, so the card is not rendered", () => {
    expect(
      pickRotatingCard({ talks: [], reading: [pass("game", "play")], today: TODAY })
    ).toBeNull();
  });
});

describe("pickBuildingProject", () => {
  const base: Omit<Project, "slug" | "title" | "period"> = {
    status: "active",
    featured: true,
    tags: [],
    description: "",
  };

  it("picks the most recently started active project Davide builds", () => {
    const projects: Project[] = [
      { ...base, slug: "work", title: "Work", role: "Tech Lead", period: "2026–present" },
      { ...base, slug: "community", title: "Community", period: "2022–present" },
      { ...base, slug: "argus", title: "Argus", period: "2026–present" },
      { ...base, slug: "old", title: "Old", status: "archived", period: "2027" },
    ];
    expect(pickBuildingProject(projects)?.slug).toBe("argus");
  });

  it("prefers the active flagship", () => {
    const projects: Project[] = [
      { ...base, slug: "newer", title: "Newer", period: "2027–present" },
      { ...base, slug: "flag", title: "Flag", period: "2020–present", flagship: true },
    ];
    expect(pickBuildingProject(projects)?.slug).toBe("flag");
  });

  it("keeps file order on a tie", () => {
    const projects: Project[] = [
      { ...base, slug: "first", title: "First", period: "2024–present" },
      { ...base, slug: "second", title: "Second", period: "2024–present" },
    ];
    expect(pickBuildingProject(projects)?.slug).toBe("first");
  });

  it("falls back to a workplace when nothing else is active", () => {
    const projects: Project[] = [
      { ...base, slug: "work", title: "Work", role: "Tech Lead", period: "2022–present" },
    ];
    expect(pickBuildingProject(projects)?.slug).toBe("work");
  });

  it("returns null with no active project", () => {
    expect(
      pickBuildingProject([{ ...base, slug: "x", title: "X", status: "archived", period: "2020" }])
    ).toBeNull();
  });
});

describe("todayKey", () => {
  it("formats the local calendar day", () => {
    expect(todayKey(new Date(2026, 0, 5, 23, 30))).toBe("2026-01-05");
  });
});

describe("pickSpokenAt", () => {
  it("names past conferences with a session once, newest first, without the year", () => {
    const talks: Talk[] = [
      { ...talk("g24", "2024-11-13", {}), event: "GoLab 2024" },
      { ...talk("g23", "2023-11-21", {}), event: "GoLab 2023" },
      { ...talk("kcd", "2024-06-20", {}), event: "KCD Italy 2024" },
      { ...talk("future", "2026-12-01", {}), event: "Future Conf 2026" },
      { ...talk("org", "2025-03-21", {}), event: "Open Source Day 2025", organizer: true },
      { ...talk("meet", "2025-01-01", {}), event: "A Meetup", type: "Meetup" },
      { ...talk("nosession", "2025-02-01"), event: "Audience Only 2025" },
    ];
    expect(pickSpokenAt(talks, TODAY)).toEqual(["GoLab", "KCD Italy"]);
  });
});
