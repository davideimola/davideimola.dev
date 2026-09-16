// The rating window of a talk: pure, import-free, and shared by the server
// pages and the client components that render it. It reads no filesystem on
// purpose, so a client component can import it without dragging `node:path`
// into the browser bundle.

export interface TalkFeedback {
  /**
   * Where the audience rates the session. Arbitrary on purpose: emblema.live
   * for the talks Davide instruments himself, the conference's own tool where
   * the event provides one.
   */
  url: string;
  /** Override the opening day (default: the day of the talk). ISO `YYYY-MM-DD`. */
  from?: string;
  /** Override the closing day, inclusive (default: the talk plus the window). */
  until?: string;
}

/** How long the link stays up after the talk when the entry says nothing. */
export const FEEDBACK_WINDOW_DAYS = 7;

const DAY_MS = 86_400_000;

/** The calendar day of a value, as `YYYY-MM-DD`. Dates resolve locally: the
 * window has to turn over at the reader's midnight, not at UTC's. */
function dayOf(value: string | Date): string {
  if (typeof value === "string") return value.slice(0, 10);
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${value.getFullYear()}-${month}-${day}`;
}

function shiftDay(day: string, days: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + days * DAY_MS).toISOString().slice(0, 10);
}

/** The window, resolved. Both ends are inclusive calendar days. */
export function feedbackWindow(talk: { date: string; feedback: TalkFeedback }): {
  from: string;
  until: string;
} {
  const talkDay = dayOf(talk.date);
  return {
    from: talk.feedback.from ?? talkDay,
    until: talk.feedback.until ?? shiftDay(talkDay, FEEDBACK_WINDOW_DAYS),
  };
}

/**
 * Is the rating link live today? Comparing day strings rather than instants
 * keeps the question at the granularity it is actually asked in ("is this a
 * conference day?") and out of reach of timezone arithmetic.
 */
export function isFeedbackOpen(
  talk: { date: string; feedback?: TalkFeedback },
  now: Date = new Date()
): boolean {
  if (!talk.feedback) return false;
  const today = dayOf(now);
  const { from, until } = feedbackWindow({ date: talk.date, feedback: talk.feedback });
  return today >= from && today <= until;
}

/**
 * The host behind a rating URL, used as the visible hint ("emblema.live").
 * Derived rather than stored: a new provider is then one URL, not a field and
 * a lookup table. An unparseable URL yields an empty hint, never a throw.
 */
export function feedbackHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
