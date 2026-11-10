// The Umami custom events, named once. Import-free on purpose: client
// components read it, and nothing here may drag a server module into the
// browser bundle.
//
// Two ways to fire one, both no-ops when the tracker is absent (local dev,
// previews without NEXT_PUBLIC_UMAMI_WEBSITE_ID, an ad blocker that won):
//   - a click: spread `eventAttributes()` on the element, and Umami's own
//     click listener sends it. Use this for links and buttons.
//   - an outcome: call `trackEvent()` once the thing has happened, e.g. a form
//     whose Server Action came back successful. A click on Submit is not a
//     subscription.
//
// Events carry no personal data: never an email, a name or a message body.
// Umami already records the page an event fired on.

export const EVENTS = {
  /** The subscribe form queued a confirmation email (double opt-in, not yet confirmed). */
  newsletterSubscribe: "newsletter-subscribe",
  /** The contact form sent its message. */
  contactSent: "contact-sent",
  /** A click on an "Invite me to speak" call to action. */
  speakingInvite: "speaking-invite",
  /** A download from the speaker kit (headshot or logo). */
  speakerKitDownload: "speaker-kit-download",
  /** A download of the CV PDF. */
  cvDownload: "cv-download",
  /** A click through to the flagship project's repo. */
  flagshipRepo: "flagship-repo",
  /** A click on a talk's audience rating link. */
  talkRating: "talk-rating",
} as const;

export type AnalyticsEvent = (typeof EVENTS)[keyof typeof EVENTS];

/** Extra properties, flat strings only: Umami reads them from `data-umami-event-*` attributes. */
export type EventData = Record<string, string>;

interface UmamiTracker {
  track: (event: string, data?: EventData) => void;
}

/** The data attributes Umami's click listener reads. Spread them on a link or button. */
export function eventAttributes(
  event: AnalyticsEvent,
  data: EventData = {}
): Record<string, string> {
  const attributes: Record<string, string> = { "data-umami-event": event };
  for (const [key, value] of Object.entries(data)) {
    attributes[`data-umami-event-${key}`] = value;
  }
  return attributes;
}

/** Sends an event from code. Never throws: analytics must not break the page. */
export function trackEvent(event: AnalyticsEvent, data?: EventData): void {
  if (typeof window === "undefined") return;
  const umami = (window as Window & { umami?: UmamiTracker }).umami;
  try {
    umami?.track(event, data);
  } catch {
    // A tracker that fails is a lost data point, never a broken form.
  }
}
