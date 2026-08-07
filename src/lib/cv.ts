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
