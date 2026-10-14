import { describe, expect, it } from "vitest";
import type { Talk } from "./content";
import {
  city,
  describeKind,
  eventName,
  listJoin,
  organisedByKind,
  organisedByYear,
  sessionDetail,
  sessionsByYear,
  sharingStats,
} from "./sharing";

const t = (slug: string, date: string, extra: Partial<Talk> = {}): Talk => ({
  slug,
  event: `Event ${slug}`,
  type: "Conference",
  date,
  location: "Florence, Italy",
  tags: [],
  ...extra,
});
const session = { title: "S", format: "Talk" as const };

describe("sharingStats", () => {
  it("counts stage sessions, organised events, interviews and the first year", () => {
    const talks = [
      t("a", "2024-01-01", { session }),
      t("b", "2023-01-01", {
        session: { title: "I", format: "Interview" },
        type: "Podcast/Stream",
      }),
      t("c", "2025-01-01", { organizer: true }),
      t("d", "2026-01-01", { session: { ...session, format: "Workshop" }, organizer: true }),
    ];
    expect(sharingStats(talks)).toEqual({ onStage: 2, organised: 2, interviews: 1, since: 2023 });
  });
});

describe("sessionsByYear", () => {
  it("groups stage sessions newest first", () => {
    const talks = [
      t("old", "2023-03-01", { session }),
      t("new", "2024-11-01", { session }),
      t("mid", "2024-06-01", { session }),
      t("audience", "2024-07-01"),
    ];
    expect(sessionsByYear(talks).map((g) => [g.year, g.talks.map((x) => x.slug)])).toEqual([
      ["2024", ["new", "mid"]],
      ["2023", ["old"]],
    ]);
  });
});

describe("formatting helpers", () => {
  it("strips the year, names the city, details the session", () => {
    expect(eventName("GoLab 2024")).toBe("GoLab");
    expect(city("Bologna, Italy")).toBe("Bologna");
    expect(city("Remote")).toBe("remote");
    expect(sessionDetail(t("x", "2024-01-01", { session: { ...session, coSpeaker: "Ada" } }))).toBe(
      "Talk, with Ada"
    );
  });
});

describe("organisedByYear", () => {
  it("groups only the organised events, newest first, by year", () => {
    const talks = [
      t("osd23", "2023-03-28", { event: "Open Source Day 2023", organizer: true }),
      t("given", "2024-05-01"),
      t("osd24", "2024-03-07", { event: "Open Source Day 2024", organizer: true }),
      t("m1", "2024-11-01", { organizer: true }),
      t("m2", "2023-01-01", { organizer: true }),
    ];
    expect(organisedByYear(talks).map((g) => [g.year, g.talks.map((x) => x.slug)])).toEqual([
      ["2024", ["m1", "osd24"]],
      ["2023", ["osd23", "m2"]],
    ]);
  });
});

describe("organisedByKind", () => {
  it("folds the organised events by kind, the conference first", () => {
    const talks = [
      t("osd23", "2023-03-28", { type: "Conference", organizer: true }),
      t("osd24", "2024-03-07", { type: "Conference", organizer: true }),
      t("m1", "2024-11-01", { type: "Meetup", organizer: true, location: "Milan, Italy" }),
      t("m2", "2023-06-01", { type: "Meetup", organizer: true }),
      t("m3", "2023-01-01", { type: "Meetup", organizer: true, location: "Milan, Italy" }),
      t("given", "2025-01-01", { type: "Meetup" }),
    ];
    expect(organisedByKind(talks)).toMatchObject([
      { kind: "Conference", count: 2, years: ["2023", "2024"], cities: ["Florence"] },
      { kind: "Meetup", count: 3, years: ["2023", "2024"], cities: ["Milan", "Florence"] },
    ]);
    expect(organisedByKind(talks)[1].latest.slug).toBe("m1");
  });
});

describe("describeKind", () => {
  const talks = [
    t("osd23", "2023-03-28", { event: "Open Source Day 2023", organizer: true }),
    t("osd24", "2024-03-07", { event: "Open Source Day 2024", organizer: true }),
    t("m1", "2024-11-01", { event: "Go night", type: "Meetup", organizer: true }),
    t("m2", "2023-06-01", { type: "Meetup", organizer: true, location: "Milan, Italy" }),
    t("h", "2026-06-27", {
      event: "Hack",
      type: "Hackathon",
      organizer: true,
      location: "Turin, Italy",
    }),
  ];
  const [osd, meetups, hack] = organisedByKind(talks).map(describeKind);

  it("names a series after itself and counts editions", () => {
    expect(osd).toEqual({
      title: "Open Source Day",
      line: "2 editions, 2023 to 2024, in Florence.",
    });
  });

  it("counts a recurring kind since its first year", () => {
    expect(meetups).toEqual({
      title: "Meetups",
      line: "2 since 2023, in Florence and Milan. The latest: Go night.",
    });
  });

  it("names a one-off after its event", () => {
    expect(hack).toEqual({ title: "Hack", line: "Turin, 2026." });
    expect(listJoin(["Florence", "Milan", "Verona"])).toBe("Florence, Milan and Verona");
  });
});
