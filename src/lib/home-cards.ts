// What the three cards under the home hero show (docs/brand.md, "Site"):
// WRITING is the latest post and BUILDING the active project, both always
// present; the third slot rotates and never renders empty. Pure on purpose:
// the page gathers the inputs, these functions only choose, so the rule is
// unit-tested rather than eyeballed on the live site.
//
// Types only from content.ts and shelf.ts: both read the filesystem, and
// importing a value from them would drag node:fs into any client reader.
import type { Project, Talk } from "./content";
import type { ShelfPass } from "./shelf";

export type RotatingCard =
  | { kind: "next-talk"; talk: Talk }
  | { kind: "last-recording"; talk: Talk }
  | { kind: "reading"; pass: ShelfPass };

/** The local calendar day as YYYY-MM-DD, the shape talk dates are written in. */
export function todayKey(today: Date): string {
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * The rotating slot, first match wins:
 * 1. the next talk Davide gives (an engagement with a session, today included);
 * 2. otherwise the most recent past talk that has a recording;
 * 3. otherwise the first thing being read right now (the shelf's `now`, in the
 *    order tsundoku sends it; things being played do not count);
 * 4. otherwise nothing, and the grid closes up around the two fixed cards.
 */
export function pickRotatingCard({
  talks,
  reading,
  today,
}: {
  talks: Talk[];
  reading: ShelfPass[];
  today: Date;
}): RotatingCard | null {
  const key = todayKey(today);
  const given = talks.filter((t) => t.session);

  const next = given
    .filter((t) => t.date.slice(0, 10) >= key)
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  if (next) return { kind: "next-talk", talk: next };

  const recorded = given
    .filter((t) => t.date.slice(0, 10) < key && t.session?.video)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
  if (recorded) return { kind: "last-recording", talk: recorded };

  const book = reading.find((p) => p.type.verbBase === "read");
  if (book) return { kind: "reading", pass: book };

  return null;
}

function startYear(period: string): number {
  const match = period.match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

/**
 * The BUILDING card: the active flagship project if there is one, otherwise the
 * active project Davide most recently started building.
 * A project with a `role` is a workplace rather than something he builds, so it
 * only stands in when nothing else is active. Ties keep the content file's order.
 */
export function pickBuildingProject(projects: Project[]): Project | null {
  const active = projects.filter((p) => p.status === "active");
  const flagship = active.find((p) => p.flagship);
  if (flagship) return flagship;
  const pool = active.some((p) => !p.role) ? active.filter((p) => !p.role) : active;
  let best: Project | null = null;
  for (const project of pool) {
    if (!best || startYear(project.period) > startYear(best.period)) best = project;
  }
  return best;
}

/**
 * The conferences Davide has given a session at, newest first, the year
 * stripped from the event name and each named once. Events he organised are
 * left out: the IN PUBLIC block already names those.
 */
export function pickSpokenAt(talks: Talk[], today: Date, limit = 5): string[] {
  const key = todayKey(today);
  const names: string[] = [];
  const sorted = [...talks].sort((a, b) => b.date.localeCompare(a.date));
  for (const talk of sorted) {
    if (talk.type !== "Conference" || !talk.session || talk.organizer) continue;
    if (talk.date.slice(0, 10) >= key) continue;
    const name = talk.event.replace(/\s+\d{4}$/, "");
    if (!names.includes(name)) names.push(name);
    if (names.length === limit) break;
  }
  return names;
}
