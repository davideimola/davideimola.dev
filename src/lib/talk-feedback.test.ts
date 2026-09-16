import { describe, expect, it } from "vitest";
import {
  FEEDBACK_WINDOW_DAYS,
  feedbackHost,
  feedbackWindow,
  isFeedbackOpen,
} from "./talk-feedback";

const talk = (feedback?: { url: string; from?: string; until?: string }) => ({
  date: "2026-11-19",
  feedback,
});

const rated = talk({ url: "https://emblema.live/t/abc" });

describe("isFeedbackOpen", () => {
  it("is closed for a talk with no rating link", () => {
    expect(isFeedbackOpen(talk(), new Date("2026-11-19T10:00:00"))).toBe(false);
  });

  it("opens on the day of the talk", () => {
    expect(isFeedbackOpen(rated, new Date("2026-11-19T08:00:00"))).toBe(true);
  });

  it("stays closed the day before", () => {
    expect(isFeedbackOpen(rated, new Date("2026-11-18T23:00:00"))).toBe(false);
  });

  it("stays open through the last day of the default window", () => {
    expect(isFeedbackOpen(rated, new Date("2026-11-26T23:00:00"))).toBe(true);
  });

  it("closes the day after the window", () => {
    expect(isFeedbackOpen(rated, new Date("2026-11-27T00:30:00"))).toBe(false);
  });

  it("honours an explicit early opening", () => {
    const early = talk({ url: "https://reactjsday.it/rate", from: "2026-11-17" });
    expect(isFeedbackOpen(early, new Date("2026-11-17T09:00:00"))).toBe(true);
    expect(isFeedbackOpen(early, new Date("2026-11-16T09:00:00"))).toBe(false);
  });

  it("honours an explicit closing, inclusive of the last day", () => {
    const short = talk({ url: "https://emblema.live/t/abc", until: "2026-11-20" });
    expect(isFeedbackOpen(short, new Date("2026-11-20T22:00:00"))).toBe(true);
    expect(isFeedbackOpen(short, new Date("2026-11-21T00:00:00"))).toBe(false);
  });
});

describe("feedbackWindow", () => {
  it("defaults to the talk day plus the window", () => {
    expect(feedbackWindow({ date: "2026-11-19", feedback: { url: "x" } })).toEqual({
      from: "2026-11-19",
      until: "2026-11-26",
    });
    expect(FEEDBACK_WINDOW_DAYS).toBe(7);
  });

  it("crosses a month boundary", () => {
    expect(feedbackWindow({ date: "2026-09-26", feedback: { url: "x" } }).until).toBe("2026-10-03");
  });
});

describe("feedbackHost", () => {
  it("reads the provider off the URL", () => {
    expect(feedbackHost("https://emblema.live/t/abc")).toBe("emblema.live");
    expect(feedbackHost("https://www.reactjsday.it/feedback")).toBe("reactjsday.it");
  });

  it("yields an empty hint rather than throwing on junk", () => {
    expect(feedbackHost("not a url")).toBe("");
  });
});
