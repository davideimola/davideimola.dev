import { afterEach, describe, expect, it, vi } from "vitest";
import { EVENTS, eventAttributes, trackEvent } from "./analytics";

type TrackedWindow = Window & { umami?: { track: (...args: unknown[]) => void } };

afterEach(() => {
  delete (window as TrackedWindow).umami;
});

describe("eventAttributes", () => {
  it("names the event and prefixes every property the way Umami reads them", () => {
    expect(eventAttributes(EVENTS.talkRating, { talk: "reactjsday-2026" })).toEqual({
      "data-umami-event": "talk-rating",
      "data-umami-event-talk": "reactjsday-2026",
    });
  });

  it("carries the name alone when there is no data", () => {
    expect(eventAttributes(EVENTS.cvDownload)).toEqual({ "data-umami-event": "cv-download" });
  });
});

describe("trackEvent", () => {
  it("hands the event to the tracker", () => {
    const track = vi.fn();
    (window as TrackedWindow).umami = { track };
    trackEvent(EVENTS.newsletterSubscribe);
    expect(track).toHaveBeenCalledWith("newsletter-subscribe", undefined);
  });

  it("does nothing when the tracker never loaded", () => {
    expect(() => trackEvent(EVENTS.contactSent)).not.toThrow();
  });

  it("swallows a tracker that throws", () => {
    (window as TrackedWindow).umami = {
      track: () => {
        throw new Error("blocked");
      },
    };
    expect(() => trackEvent(EVENTS.contactSent)).not.toThrow();
  });
});
