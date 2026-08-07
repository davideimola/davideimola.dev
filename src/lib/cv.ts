import { getAllProjects, getAllTalks, type Talk } from "./content";
import { readContentJson } from "./content-json";

// The CV Record is the single source of truth for Davide's professional
// history: every Rendering (the /cv page, the PDF, the /about trajectory)
// derives from it and holds no facts of its own. This module is the only seam
// over it, so a Rendering never reads the JSON itself.

// ── Types ──────────────────────────────────────────────────────────────────

// Closed set. An engagement is a full-time job (Employment), a scoped paid
// engagement taken alongside one (Freelance), or unpaid community work
// (Volunteering). Nothing else.
export const ENGAGEMENT_TYPES = ["employment", "freelance", "volunteering"] as const;

export type EngagementType = (typeof ENGAGEMENT_TYPES)[number];

export interface CvRole {
  role: string;
  period: string;
  current?: boolean;
  // Schematic Register: what /cv renders.
  summary: string;
  bullets?: string[];
  // Narrative Register: the same fact in prose, for /about. One fact in two
  // voices, not two facts.
  prose?: string;
}

export interface Engagement {
  slug: string;
  type: EngagementType;
  org: string;
  location: string;
  period: string;
  current?: boolean;
  // Several roles at the same organisation stay nested under it, newest first,
  // so a promotion reads as one continuous engagement.
  roles: CvRole[];
}

export interface CvIdentity {
  name: string;
  headline: string;
  location: string;
  // Public contact only. No phone number, no home address, no fiscal code:
  // this repo is public, so anything here is published by definition.
  email: string;
  site: string;
  github: string;
  linkedin: string;
  summary: string;
}

export interface ContactLink {
  label: string;
  href: string;
}

export interface EducationEntry {
  slug: string;
  school: string;
  award: string;
  detail?: string;
  period: string;
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface CvRecord {
  identity: CvIdentity;
  engagements: Engagement[];
  // Talks are named by slug only: talks.json describes them.
  selectedTalks: string[];
  // Projects are named by slug only: projects.json describes them.
  selectedProjects: string[];
  education: EducationEntry[];
  skills: SkillGroup[];
  openSource: string[];
  trajectory: TrajectoryPhase[];
}

// ── Record ─────────────────────────────────────────────────────────────────

export function getCvRecord(): CvRecord {
  return readContentJson<CvRecord>("cv.json");
}

export function getIdentity(): CvIdentity {
  return getCvRecord().identity;
}

// The identity block stores handles, not URLs. Turning them into links is a
// derivation, so it belongs here rather than in each Rendering: the same list
// serves the page today and the PDF later. Mirrors lib/social.ts, which owns
// the outbound profile links for the rest of the site.
export function getContactLinks(): ContactLink[] {
  const { email, site, github, linkedin } = getIdentity();
  return [
    { label: email, href: `mailto:${email}` },
    { label: site, href: `https://${site}` },
    { label: `github/${github}`, href: `https://github.com/${github}` },
    { label: `in/${linkedin}`, href: `https://www.linkedin.com/in/${linkedin}/` },
  ];
}

export function getEducation(): EducationEntry[] {
  return getCvRecord().education;
}

export function getSkills(): SkillGroup[] {
  return getCvRecord().skills;
}

export function getOpenSource(): string[] {
  return getCvRecord().openSource;
}

// ── Ordering ───────────────────────────────────────────────────────────────

const TYPE_ORDER: Record<EngagementType, number> = {
  employment: 0,
  freelance: 1,
  volunteering: 2,
};

// The year an engagement started, read off its period label.
function startYear(period: string): number {
  const year = period.match(/\d{4}/);
  return year ? Number(year[0]) : 0;
}

// The current job answers the first question a reader has, so it leads
// regardless of dates. A purely chronological sort buries it under a
// volunteering entry that happens to have started later.
function isCurrentEmployment(engagement: Engagement): number {
  return engagement.type === "employment" && engagement.current ? 0 : 1;
}

// All engagements, current employment first, then newest first, with paid work
// ahead of volunteering when two started the same year.
export function getEngagements(): Engagement[] {
  return [...getCvRecord().engagements].sort(
    (a, b) =>
      isCurrentEmployment(a) - isCurrentEmployment(b) ||
      startYear(b.period) - startYear(a.period) ||
      TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
  );
}

// The typed sections of /cv. An absent type is not an error: a Record with no
// freelance work renders that section empty.
export function getEngagementsByType(type: EngagementType): Engagement[] {
  return getEngagements().filter((engagement) => engagement.type === type);
}

// ── Speaking ───────────────────────────────────────────────────────────────

// A talk is described in exactly one place in this repo, talks.json, so the
// Record picks talks by slug and nothing else. These three facts are the
// schematic Register of a talk: what a conference organiser reads in ten
// seconds, resolved here so no Rendering touches the talk archive itself.
export interface SelectedTalk {
  slug: string;
  title: string;
  event: string;
  year: string;
}

// An event Davide runs rather than speaks at. One row stands for a whole series,
// because fifteen individual rows would bury the fact they are meant to carry.
export interface OrganisedEvent {
  // The newest instance, so the row has a stable identity.
  slug: string;
  label: string;
  location: string;
  count: number;
  // Singular; the Rendering pluralises. A conference has editions, a meetup night
  // is just itself, and saying "4 editions" of a meetup would be wrong.
  noun: string;
  years: string;
}

// A project the CV names in its own right, resolved from projects.json so the
// project is described in exactly one place, the same way talks are.
export interface SelectedProject {
  slug: string;
  title: string;
  period: string;
  description: string;
}

// The Record's order is the curation, so it survives untouched: leading with
// the talk Davide is proudest of is a decision, not an accident of dates.
export function getSelectedTalks(): SelectedTalk[] {
  const archive = getAllTalks();

  return getCvRecord().selectedTalks.map((slug) => {
    const talk = archive.find((candidate) => candidate.slug === slug);
    // Loud on purpose, and named in the message: a renamed slug has to break
    // the build rather than quietly empty a section of the CV.
    if (!talk) {
      throw new Error(`Unknown selected talk slug in the CV Record: "${slug}"`);
    }
    if (!talk.session) {
      throw new Error(`Selected talk "${slug}" has no session: only delivered talks belong here`);
    }
    return { slug, title: talk.session.title, event: talk.event, year: talkYear(talk) };
  });
}

// What the CV states instead of listing thirty rows: the size of the archive it
// links out to.
export function getTotalTalkCount(): number {
  return getAllTalks().length;
}

// Which kinds of organised event get a row of their own, and in which order: a
// conference is the fact a reader is looking for, a meetup programme is the fact
// that he keeps a community running between conferences.
const EVENT_KINDS: { type: Talk["type"]; noun: string; fold: "series" | "all" }[] = [
  // Folded by series, so four editions of Open Source Day are one row.
  { type: "Conference", noun: "edition", fold: "series" },
  // Folded together: ten meetup nights have ten different names, and listing them
  // would cost half the sheet to say one thing.
  { type: "Meetup", noun: "meetup", fold: "all" },
  { type: "Hackathon", noun: "hackathon", fold: "series" },
];

// Derived from the archive rather than restated in the Record: an event is one he
// organises when the archive says he organised it, so a new edition appears
// without the Record being touched and the count can never drift from the
// archive. Editions are named after the series ("Open Source Day 2026"), so
// stripping the trailing year is what turns four editions into one row.
export function getOrganisedEvents(): OrganisedEvent[] {
  // getAllTalks is newest first, so the first instance seen in a group is its
  // newest and lends the group its slug.
  const organised = getAllTalks().filter((talk) => talk.organizer);
  const rows: OrganisedEvent[] = [];

  for (const { type, noun, fold } of EVENT_KINDS) {
    const ofKind = organised.filter((talk) => talk.type === type);
    if (ofKind.length === 0) continue;

    const groups = new Map<string, Talk[]>();
    for (const talk of ofKind) {
      const key = fold === "all" ? type : talk.event.replace(/\s+\d{4}$/, "");
      groups.set(key, [...(groups.get(key) ?? []), talk]);
    }

    for (const [key, instances] of groups) {
      const newest = instances[0];
      rows.push({
        slug: newest.slug,
        // A folded-together group is named after what it is, since its instances
        // share no name to inherit.
        label: fold === "all" ? `${type}s` : key,
        location: fold === "all" ? cities(instances) : newest.location,
        count: instances.length,
        noun,
        years: yearSpan(instances.map((talk) => Number(talkYear(talk)))),
      });
    }
  }

  return rows;
}

// "Florence, Italy" is where one meetup was; a row standing for ten of them wants
// the cities, without the country repeated three times. Sorted rather than left in
// archive order so the string does not change when a new meetup lands.
function cities(talks: Talk[]): string {
  return [...new Set(talks.map((talk) => talk.location.split(",")[0].trim()))].sort().join(", ");
}

// The Record names projects by slug, so a project is described in exactly one
// place. Unknown slugs throw for the same reason talk slugs do.
export function getSelectedProjects(): SelectedProject[] {
  const all = getAllProjects();

  return getCvRecord().selectedProjects.map((slug) => {
    const project = all.find((candidate) => candidate.slug === slug);
    if (!project) {
      throw new Error(`Unknown selected project slug in the CV Record: "${slug}"`);
    }
    return {
      slug,
      title: project.title,
      period: cvPeriod(project.period),
      description: project.description,
    };
  });
}

// projects.json writes "2026–present" because that is how the projects page reads.
// The CV writes "Feb 2022 – Present" everywhere, and a row in a different house
// style looks like a mistake rather than a difference. Normalising here rather than
// editing projects.json keeps the project described in exactly one place.
function cvPeriod(period: string): string {
  return period
    .split(/\s*[–-]\s*/)
    .map((part) => part.replace(/^present$/i, "Present"))
    .join(" – ");
}

function talkYear(talk: Talk): string {
  return talk.date.slice(0, 4);
}

// En dash and spaces, matching the period labels the Record already writes.
function yearSpan(years: number[]): string {
  const first = Math.min(...years);
  const last = Math.max(...years);
  return first === last ? String(first) : `${first} – ${last}`;
}
// ── The /about trajectory ──────────────────────────────────────────────────

// /about tells the trajectory instead of repeating the dated list /cv already
// does better: where he was, what it taught him, where it led. The phases live
// in the Record and reference the engagements they cover, so a period is stated
// once, in the engagement, and derived here. The prose is the phase's own
// content and the one thing the Record holds that /cv never renders.

// A phase points at an engagement, optionally narrowed to one of its roles: a
// promotion splits one engagement across two phases of the story.
export interface EngagementReference {
  engagement: string;
  role?: string;
}

export interface TrajectoryPhase {
  slug: string;
  title: string;
  // The year the story reaches back to before the first engagement it covers.
  // Only for years the Record deliberately holds no entry for: the websites
  // built during university are story on /about and never entries on /cv.
  from?: string;
  covers: EngagementReference[];
  prose: string;
}

export interface ResolvedPhase {
  slug: string;
  title: string;
  prose: string;
  // Derived, never authored: the span of everything the phase covers.
  period: string;
  // True while one of those periods is still open.
  current: boolean;
  engagements: Engagement[];
}

// The last year of a period, or null while it is still running.
function endYear(period: string): number | null {
  if (/present|now/i.test(period)) return null;
  const years = period.match(/\d{4}/g);
  // Same fallback as startYear: a period holding no year at all reads as 0.
  return years ? Number(years[years.length - 1]) : 0;
}

function spanLabel(first: number, last: number | null): string {
  if (last === null) return `${first} – Present`;
  return last === first ? `${first}` : `${first} – ${last}`;
}

// An unknown reference throws rather than being skipped: a renamed slug or a
// renamed role would otherwise delete a phase of the story in silence.
function resolveReference(
  record: CvRecord,
  phase: TrajectoryPhase,
  reference: EngagementReference
): { engagement: Engagement; period: string } {
  const engagement = record.engagements.find((e) => e.slug === reference.engagement);
  if (!engagement) {
    throw new Error(
      `Trajectory phase "${phase.slug}" references unknown engagement "${reference.engagement}".`
    );
  }
  if (!reference.role) return { engagement, period: engagement.period };

  const role = engagement.roles.find((r) => r.role === reference.role);
  if (!role) {
    throw new Error(
      `Trajectory phase "${phase.slug}" references unknown role "${reference.role}" of engagement "${reference.engagement}".`
    );
  }
  return { engagement, period: role.period };
}

// The phases of /about, in Record order: the story's order is editorial, so it
// is not re-sorted here the way the schematic history is.
export function getTrajectory(): ResolvedPhase[] {
  const record = getCvRecord();

  return record.trajectory.map((phase) => {
    if (phase.covers.length === 0) {
      throw new Error(`Trajectory phase "${phase.slug}" covers no engagement.`);
    }
    const covered = phase.covers.map((reference) => resolveReference(record, phase, reference));
    const periods = covered.map((entry) => entry.period);

    const starts = periods.map(startYear);
    if (phase.from) starts.push(startYear(phase.from));
    const closed = periods.map(endYear).filter((year): year is number => year !== null);
    const current = closed.length !== periods.length;

    return {
      slug: phase.slug,
      title: phase.title,
      prose: phase.prose,
      period: spanLabel(Math.min(...starts), current ? null : Math.max(...closed)),
      current,
      engagements: [...new Set(covered.map((entry) => entry.engagement))],
    };
  });
}
