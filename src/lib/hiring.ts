// The open roles /links points at. Pure and import-free, like talk-feedback:
// the data lives in src/content/hiring.json and the page reads it.
//
// Roles come off by hand when they are filled. `until` is the safety net for
// the day nobody remembers: past it the row disappears on its own, and while
// the hiring goes on the date is simply pushed forward.

export interface HiringRole {
  /** The row's title: "Backend engineer". */
  title: string;
  /** The line under it: what the role builds, in a few words. */
  hint: string;
  url: string;
}

export interface Hiring {
  org: string;
  /** The last day the row may show, inclusive. ISO `YYYY-MM-DD`. */
  until: string;
  roles: HiringRole[];
}

// Where the click came from, so the company can count what this page brings.
const UTM = { utm_source: "davideimola.dev", utm_medium: "links" };

/** The calendar day of `now`, local, as `YYYY-MM-DD`. */
function today(now: Date): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * The hiring to show today, with tracked links, or null: past `until`, or with
 * every role filled, the row is gone rather than empty.
 */
export function openHiring(hiring: Hiring, now: Date = new Date()): Hiring | null {
  if (hiring.roles.length === 0 || today(now) > hiring.until) return null;
  return { ...hiring, roles: hiring.roles.map((role) => ({ ...role, url: withUtm(role.url) })) };
}

export function withUtm(url: string): string {
  const tracked = new URL(url);
  for (const [key, value] of Object.entries(UTM)) tracked.searchParams.set(key, value);
  return tracked.toString();
}
