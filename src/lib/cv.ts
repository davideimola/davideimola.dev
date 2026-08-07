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
