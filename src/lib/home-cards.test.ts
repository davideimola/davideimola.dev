import { describe, expect, it } from "vitest";
import type { Project, Talk } from "./content";
import { pickBuildingProject, pickSpokenAt, pickStageTalks, todayKey } from "./home-cards";

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

const TODAY = new Date(2026, 9, 14); // 14 Oct 2026, local time

describe("pickStageTalks", () => {
  const rows = (picked: ReturnType<typeof pickStageTalks>) =>
    picked.map((r) => `${r.talk.slug}:${r.upcoming ? "next" : "past"}`);

  it("lists the next talks, soonest first, today included, never more than the limit", () => {
    const picked = pickStageTalks(
      [
        talk("later", "2026-11-19", {}),
        talk("today", "2026-10-14", {}),
        talk("soon", "2026-11-01", {}),
      ],
      TODAY
    );
    expect(rows(picked)).toEqual(["today:next", "soon:next"]);
  });

  it("fills the rows with the latest talks given when fewer are scheduled", () => {
    const picked = pickStageTalks(
      [
        talk("past", "2026-09-26", {}),
        talk("older", "2026-04-25", {}),
        talk("soon", "2026-11-01", {}),
      ],
      TODAY
    );
    expect(rows(picked)).toEqual(["soon:next", "past:past"]);
  });

  it("lists the latest talks given, newest first, when nothing is scheduled", () => {
    const picked = pickStageTalks(
      [
        talk("old", "2025-03-01", {}),
        talk("newer", "2026-09-26", {}),
        talk("mid", "2026-04-25", {}),
      ],
      TODAY
    );
    expect(rows(picked)).toEqual(["newer:past", "mid:past"]);
  });

  it("ignores events where Davide gives no session", () => {
    const picked = pickStageTalks(
      [talk("organised", "2026-11-01"), talk("mine", "2026-12-01", {})],
      TODAY
    );
    expect(rows(picked)).toEqual(["mine:next"]);
  });

  it("returns no rows when there are no talks", () => {
    expect(pickStageTalks([], TODAY)).toEqual([]);
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
