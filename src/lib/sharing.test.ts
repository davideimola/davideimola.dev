import { describe, expect, it } from "vitest";
import type { Talk } from "./content";
import {
  city,
  eventName,
  listJoin,
  organisingSummary,
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
    expect(listJoin(["Florence", "Milan", "Verona"])).toBe("Florence, Milan and Verona");
  });
});

describe("organisingSummary", () => {
  it("splits the flagship conference from the other events", () => {
    const talks = [
      t("osd23", "2023-03-28", { event: "Open Source Day 2023", organizer: true }),
      t("osd24", "2024-03-07", { event: "Open Source Day 2024", organizer: true }),
      t("m1", "2025-01-01", { organizer: true, location: "Milan, Italy" }),
      t("m2", "2024-01-01", { organizer: true }),
      t("m3", "2023-01-01", { organizer: true, location: "Verona, Italy" }),
    ];
    const summary = organisingSummary(talks, "Open Source Day", 1);
    expect(summary.conferenceYears).toEqual(["2023", "2024"]);
    expect(summary.recent.map((x) => x.slug)).toEqual(["m1"]);
    expect(summary.more).toBe(2);
    expect(summary.moreCities).toEqual(["Florence", "Verona"]);
  });
});
