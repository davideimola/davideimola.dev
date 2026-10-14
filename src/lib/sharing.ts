// The shape of /sharing, derived from talks.json: the header numbers, the
// sessions and the organised events grouped by year. Pure, so it is tested
// rather than eyeballed. Types only from content.ts (it reads the filesystem).
import type { Talk } from "./content";
import { todayKey } from "./home-cards";

export interface SharingStats {
  onStage: number;
  organised: number;
  interviews: number;
  since: number | null;
}

const isInterview = (t: Talk) => t.type === "Podcast/Stream" || t.session?.format === "Interview";

/** Sessions Davide gives on a stage: talks, workshops, panels. Not interviews. */
export function stageSessions(talks: Talk[]): Talk[] {
  return talks.filter((t) => t.session && !isInterview(t));
}

export function interviews(talks: Talk[]): Talk[] {
  return talks.filter(isInterview);
}

export function sharingStats(talks: Talk[]): SharingStats {
  const years = talks.map((t) => Number(t.date.slice(0, 4))).filter(Boolean);
  return {
    onStage: stageSessions(talks).length,
    organised: talks.filter((t) => t.organizer).length,
    interviews: interviews(talks).length,
    since: years.length > 0 ? Math.min(...years) : null,
  };
}

/** "GoLab 2024" → "GoLab": the year column already says it. */
export function eventName(event: string): string {
  return event.replace(/\s+\d{4}$/, "");
}

/** "Florence, Italy" → "Florence"; "Remote" → "remote". */
export function city(location: string): string {
  const first = location.split(",")[0].trim();
  return first === "Remote" ? "remote" : first;
}

export interface YearRows {
  year: string;
  talks: Talk[];
}

/** Stage sessions newest first, grouped by year. */
export function sessionsByYear(talks: Talk[]): YearRows[] {
  return byYear(stageSessions(talks));
}

/** The events Davide organises (conferences, meetups, hackathons), newest first, by year. */
export function organisedByYear(talks: Talk[]): YearRows[] {
  return byYear(talks.filter((t) => t.organizer));
}

function byYear(talks: Talk[]): YearRows[] {
  const sorted = [...talks].sort((a, b) => b.date.localeCompare(a.date));
  const groups: YearRows[] = [];
  for (const talk of sorted) {
    const year = talk.date.slice(0, 4);
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.talks.push(talk);
    else groups.push({ year, talks: [talk] });
  }
  return groups;
}

export function isUpcoming(talk: Talk, today: Date): boolean {
  return talk.date.slice(0, 10) >= todayKey(today);
}

/** Session format plus who it was given with: "Workshop, with Lorenzo Bugli". */
export function sessionDetail(talk: Talk): string {
  const format = talk.session?.format ?? "Talk";
  return talk.session?.coSpeaker ? `${format}, with ${talk.session.coSpeaker}` : format;
}

export interface OrganisedKind {
  /** The talk type: "Conference", "Meetup", "Hackathon". */
  kind: string;
  count: number;
  /** Years with at least one, oldest first. */
  years: string[];
  /** Cities, most recent first, each once. */
  cities: string[];
  latest: Talk;
}

/**
 * The organised events folded by kind: what /sharing shows instead of a second
 * long list. The conference leads (it is the flagship), then the kinds that
 * happen most.
 */
export function organisedByKind(talks: Talk[]): OrganisedKind[] {
  const sorted = talks.filter((t) => t.organizer).sort((a, b) => b.date.localeCompare(a.date));
  const kinds = new Map<string, OrganisedKind>();
  for (const talk of sorted) {
    const kind = talk.type ?? "Event";
    const year = talk.date.slice(0, 4);
    const where = city(talk.location);
    const entry = kinds.get(kind);
    if (!entry) {
      kinds.set(kind, { kind, count: 1, years: [year], cities: [where], latest: talk });
      continue;
    }
    entry.count += 1;
    if (!entry.years.includes(year)) entry.years.unshift(year);
    if (!entry.cities.includes(where)) entry.cities.push(where);
  }
  const rank = (k: OrganisedKind) => (k.kind === "Conference" ? Number.POSITIVE_INFINITY : k.count);
  return [...kinds.values()].sort((a, b) => rank(b) - rank(a));
}

/** "Florence, Milan and Verona" */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/**
 * One kind as a title and a sentence. A conference is a series, so it is named
 * after itself and counted in editions; a one-off is named after its event;
 * anything else is counted since its first year.
 */
export function describeKind(k: OrganisedKind): { title: string; line: string } {
  const first = k.years[0];
  const last = k.years[k.years.length - 1];
  const where = listJoin(k.cities);
  if (k.kind === "Conference") {
    const span = first === last ? first : `${first} to ${last}`;
    return {
      title: eventName(k.latest.event),
      line: `${k.count} ${k.count === 1 ? "edition" : "editions"}, ${span}, in ${where}.`,
    };
  }
  if (k.count === 1) {
    return { title: k.latest.event, line: `${where}, ${first}.` };
  }
  return {
    title: `${k.kind}s`,
    line: `${k.count} since ${first}, in ${where}. The latest: ${k.latest.event}.`,
  };
}
