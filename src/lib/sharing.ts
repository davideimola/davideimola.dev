// The shape of /sharing, derived from talks.json: the header numbers, the
// sessions grouped by year, and the organising summary. Pure, so it is tested
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
  const sorted = stageSessions(talks).sort((a, b) => b.date.localeCompare(a.date));
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

export interface OrganisingSummary {
  /** The years of the flagship conference, oldest first. */
  conferenceYears: string[];
  /** The latest other events (meetups, hackathons), newest first. */
  recent: Talk[];
  /** How many more there are beyond `recent`, and in which cities. */
  more: number;
  moreCities: string[];
}

export function organisingSummary(
  talks: Talk[],
  conference = "Open Source Day",
  shown = 4
): OrganisingSummary {
  const organised = talks.filter((t) => t.organizer).sort((a, b) => b.date.localeCompare(a.date));
  const flagship = organised.filter((t) => eventName(t.event) === conference);
  const others = organised.filter((t) => eventName(t.event) !== conference);
  const rest = others.slice(shown);
  return {
    conferenceYears: flagship.map((t) => t.date.slice(0, 4)).sort(),
    recent: others.slice(0, shown),
    more: rest.length,
    moreCities: [...new Set(rest.map((t) => city(t.location)))],
  };
}

/** "Florence, Milan and Verona" */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
