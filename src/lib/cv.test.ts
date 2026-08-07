import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import publishedRecord from "../content/cv.json";
import {
  type CvIdentity,
  type CvRecord,
  type CvRole,
  ENGAGEMENT_TYPES,
  type Engagement,
  getContactLinks,
  getEducation,
  getEngagements,
  getEngagementsByType,
  getIdentity,
  getOpenSource,
  getSkills,
  getTrajectory,
  type TrajectoryPhase,
} from "./cv";

vi.mock("node:fs", () => ({
  default: {
    readFileSync: vi.fn(),
  },
  readFileSync: vi.fn(),
}));

const mockFs = vi.mocked(fs);

// ── Fixtures ───────────────────────────────────────────────────────────────

const IDENTITY: CvIdentity = {
  name: "Test Person",
  headline: "Tester",
  location: "Nowhere",
  email: "test@example.com",
  site: "example.com",
  github: "test",
  linkedin: "test",
  summary: "A test summary.",
};

function role(overrides: Partial<CvRole> = {}): CvRole {
  return { role: "Engineer", period: "2020 – 2021", summary: "Did the work.", ...overrides };
}

function engagement(overrides: Partial<Engagement> = {}): Engagement {
  return {
    slug: "acme",
    type: "employment",
    org: "Acme",
    location: "Remote",
    period: "2020 – 2021",
    roles: [role()],
    ...overrides,
  };
}

function setupRecord(overrides: Partial<CvRecord> = {}): void {
  const record: CvRecord = {
    identity: IDENTITY,
    engagements: [],
    education: [],
    skills: [],
    openSource: [],
    trajectory: [],
    ...overrides,
  };
  mockFs.readFileSync.mockReturnValue(JSON.stringify(record));
}

// ── getEngagementsByType ───────────────────────────────────────────────────

describe("getEngagementsByType", () => {
  it("returns only the engagements of the requested type", () => {
    setupRecord({
      engagements: [
        engagement({ slug: "day-job", type: "employment" }),
        engagement({ slug: "evening-gig", type: "freelance" }),
        engagement({ slug: "community", type: "volunteering" }),
      ],
    });

    expect(getEngagementsByType("freelance").map((e) => e.slug)).toEqual(["evening-gig"]);
  });

  it("returns an empty array when the type is absent from the Record", () => {
    setupRecord({ engagements: [engagement({ type: "employment" })] });

    expect(getEngagementsByType("volunteering")).toEqual([]);
    expect(getEngagementsByType("freelance")).toEqual([]);
  });

  it("keeps the roles of one organisation grouped and in Record order", () => {
    setupRecord({
      engagements: [
        engagement({
          slug: "acme",
          period: "2022 – Present",
          current: true,
          roles: [
            role({ role: "Tech Lead", period: "2026 – Present", current: true }),
            role({ role: "Software Engineer", period: "2022 – 2025" }),
          ],
        }),
        engagement({ slug: "other", period: "2018 – 2022" }),
      ],
    });

    const employment = getEngagementsByType("employment");
    expect(employment.map((e) => e.slug)).toEqual(["acme", "other"]);
    expect(employment[0].roles.map((r) => r.role)).toEqual(["Tech Lead", "Software Engineer"]);
  });
});

// ── getEngagements ─────────────────────────────────────────────────────────

describe("getEngagements", () => {
  it("puts the current employment first even when a volunteering entry starts in a later year", () => {
    setupRecord({
      engagements: [
        engagement({
          slug: "community",
          type: "volunteering",
          period: "2024 – Present",
          current: true,
        }),
        engagement({
          slug: "day-job",
          type: "employment",
          period: "2022 – Present",
          current: true,
        }),
      ],
    });

    expect(getEngagements()[0].slug).toBe("day-job");
  });

  it("orders the remaining engagements newest first", () => {
    setupRecord({
      engagements: [
        engagement({ slug: "oldest", period: "2016 – 2017" }),
        engagement({ slug: "newest", period: "2020 – 2022" }),
        engagement({ slug: "middle", period: "2018 – 2020" }),
      ],
    });

    expect(getEngagements().map((e) => e.slug)).toEqual(["newest", "middle", "oldest"]);
  });

  it("puts employment ahead of freelance and volunteering that started the same year", () => {
    setupRecord({
      engagements: [
        engagement({ slug: "community", type: "volunteering", period: "2022 – Present" }),
        engagement({ slug: "evening-gig", type: "freelance", period: "2022" }),
        engagement({ slug: "day-job", type: "employment", period: "2022 – Present" }),
      ],
    });

    expect(getEngagements().map((e) => e.slug)).toEqual(["day-job", "evening-gig", "community"]);
  });

  it("does not reorder the Record itself", () => {
    setupRecord({
      engagements: [
        engagement({ slug: "oldest", period: "2016 – 2017" }),
        engagement({ slug: "newest", period: "2020 – 2022" }),
      ],
    });

    getEngagements();
    expect(getEngagements().map((e) => e.slug)).toEqual(["newest", "oldest"]);
  });
});

// ── Two Registers on the same facts ────────────────────────────────────────

describe("registers", () => {
  it("carries both the schematic bullets and the prose form of a role", () => {
    setupRecord({
      engagements: [
        engagement({
          roles: [
            role({
              bullets: ["Shipped the thing"],
              prose: "I shipped the thing, and it taught me how to ship the next one.",
            }),
          ],
        }),
      ],
    });

    const [first] = getEngagements()[0].roles;
    expect(first.bullets).toEqual(["Shipped the thing"]);
    expect(first.prose).toContain("taught me");
  });
});

// ── Aside accessors ────────────────────────────────────────────────────────

describe("identity, education, skills and open source", () => {
  it("exposes the Record's aside content unchanged", () => {
    setupRecord({
      education: [
        { slug: "uni", school: "Some University", award: "B.Sc.", period: "2014 – 2018" },
      ],
      skills: [{ group: "Languages", items: ["Go"] }],
      openSource: ["Kubernetes"],
    });

    expect(getIdentity().email).toBe("test@example.com");
    expect(getEducation().map((e) => e.school)).toEqual(["Some University"]);
    expect(getSkills()).toEqual([{ group: "Languages", items: ["Go"] }]);
    expect(getOpenSource()).toEqual(["Kubernetes"]);
  });
});

// ── getContactLinks ────────────────────────────────────────────────────────

describe("getContactLinks", () => {
  it("turns the identity handles into reachable links", () => {
    setupRecord();

    expect(getContactLinks().map((link) => link.href)).toEqual([
      "mailto:test@example.com",
      "https://example.com",
      "https://github.com/test",
      "https://www.linkedin.com/in/test/",
    ]);
  });

  it("emits only mail and web links, never a tel: link", () => {
    setupRecord();

    expect(getContactLinks().every((link) => /^(mailto|https):/.test(link.href))).toBe(true);
  });
});

// ── The published Record ───────────────────────────────────────────────────

// These guard the content itself rather than the module: the CV is public by
// definition, so private contact data must never reach the Record.
describe("the published CV Record", () => {
  it("carries no phone number, street address or fiscal code", () => {
    const serialized = JSON.stringify(publishedRecord);

    expect(serialized).not.toMatch(/\+39/);
    expect(serialized).not.toMatch(/\bVia\s/);
    expect(serialized).not.toMatch(/[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]/);
  });

  it("holds public contact fields only in the identity block", () => {
    const privateLooking = /phone|mobile|address|fiscal|tax|birth/i;

    expect(Object.keys(publishedRecord.identity).filter((k) => privateLooking.test(k))).toEqual([]);
  });

  it("declares every engagement type from the closed set", () => {
    const types = publishedRecord.engagements.map((e) => e.type);

    expect(types.every((t) => (ENGAGEMENT_TYPES as readonly string[]).includes(t))).toBe(true);
  });
});

// ── getTrajectory ──────────────────────────────────────────────────────────

function phase(overrides: Partial<TrajectoryPhase> = {}): TrajectoryPhase {
  return {
    slug: "a-phase",
    title: "A phase",
    covers: [{ engagement: "acme" }],
    prose: "Where I was, what it taught me, where it led.",
    ...overrides,
  };
}

describe("getTrajectory", () => {
  it("resolves a phase to the engagements it references", () => {
    setupRecord({
      engagements: [
        engagement({ slug: "acme", period: "2018 – 2020" }),
        engagement({ slug: "other", period: "2020 – 2022" }),
        engagement({ slug: "unrelated", period: "2010 – 2012" }),
      ],
      trajectory: [phase({ covers: [{ engagement: "acme" }, { engagement: "other" }] })],
    });

    expect(getTrajectory()[0].engagements.map((e) => e.slug)).toEqual(["acme", "other"]);
  });

  it("derives the phase period from the engagements instead of restating it", () => {
    setupRecord({
      engagements: [
        engagement({ slug: "acme", period: "Dec 2017 – Aug 2020" }),
        engagement({ slug: "other", period: "Aug 2020 – Sep 2022" }),
      ],
      trajectory: [phase({ covers: [{ engagement: "acme" }, { engagement: "other" }] })],
    });

    expect(getTrajectory()[0].period).toBe("2017 – 2022");
  });

  it("narrows the period to the role a phase names rather than the whole engagement", () => {
    setupRecord({
      engagements: [
        engagement({
          slug: "acme",
          period: "Sep 2022 – Present",
          current: true,
          roles: [
            role({ role: "Tech Lead", period: "Jan 2026 – Present", current: true }),
            role({ role: "Software Engineer", period: "Sep 2022 – Dec 2025" }),
          ],
        }),
      ],
      trajectory: [
        phase({ slug: "before", covers: [{ engagement: "acme", role: "Software Engineer" }] }),
        phase({ slug: "after", covers: [{ engagement: "acme", role: "Tech Lead" }] }),
      ],
    });

    expect(getTrajectory().map((p) => p.period)).toEqual(["2022 – 2025", "2026 – Present"]);
  });

  it("marks a phase as current only while a period it covers is still open", () => {
    setupRecord({
      engagements: [
        engagement({ slug: "acme", period: "2018 – 2020" }),
        engagement({ slug: "day-job", period: "2022 – Present", current: true }),
      ],
      trajectory: [
        phase({ slug: "past", covers: [{ engagement: "acme" }] }),
        phase({ slug: "now", covers: [{ engagement: "day-job" }] }),
      ],
    });

    expect(getTrajectory().map((p) => p.current)).toEqual([false, true]);
  });

  it("collapses a phase that starts and ends in the same year to that year", () => {
    setupRecord({
      engagements: [engagement({ slug: "acme", period: "2022" })],
      trajectory: [phase()],
    });

    expect(getTrajectory()[0].period).toBe("2022");
  });

  it("reaches back to story-only years that no engagement covers", () => {
    setupRecord({
      engagements: [engagement({ slug: "acme", period: "Nov 2016 – Sep 2017" })],
      trajectory: [phase({ from: "2013" })],
    });

    expect(getTrajectory()[0].period).toBe("2013 – 2017");
  });

  it("keeps the phases in Record order", () => {
    setupRecord({
      engagements: [
        engagement({ slug: "acme", period: "2018 – 2020" }),
        engagement({ slug: "day-job", period: "2022 – Present", current: true }),
      ],
      trajectory: [
        phase({ slug: "first", covers: [{ engagement: "acme" }] }),
        phase({ slug: "second", covers: [{ engagement: "day-job" }] }),
      ],
    });

    expect(getTrajectory().map((p) => p.slug)).toEqual(["first", "second"]);
  });

  it("throws with the offending slug when a phase references an unknown engagement", () => {
    setupRecord({
      engagements: [engagement({ slug: "acme" })],
      trajectory: [phase({ slug: "broken", covers: [{ engagement: "ghost" }] })],
    });

    expect(() => getTrajectory()).toThrow(/ghost/);
    expect(() => getTrajectory()).toThrow(/broken/);
  });

  it("throws when a phase names a role the engagement does not have", () => {
    setupRecord({
      engagements: [engagement({ slug: "acme", roles: [role({ role: "Engineer" })] })],
      trajectory: [phase({ covers: [{ engagement: "acme", role: "Principal Engineer" }] })],
    });

    expect(() => getTrajectory()).toThrow(/Principal Engineer/);
  });

  it("throws when a phase covers nothing at all", () => {
    setupRecord({ trajectory: [phase({ slug: "empty", covers: [] })] });

    expect(() => getTrajectory()).toThrow(/empty/);
  });
});

// ── The published trajectory ───────────────────────────────────────────────

// The trajectory is the one part of the Record /cv never renders, so nothing
// else would catch a phase pointing at an engagement that has been renamed.
describe("the published trajectory", () => {
  // The annotation is the check: the published JSON has to satisfy the type.
  const publishedPhases: TrajectoryPhase[] = publishedRecord.trajectory;

  const firstYear = (period: string) => Number(period.match(/\d{4}/)?.[0] ?? 0);

  it("references only engagements and roles that exist in the Record", () => {
    for (const publishedPhase of publishedPhases) {
      for (const ref of publishedPhase.covers) {
        const target = publishedRecord.engagements.find((e) => e.slug === ref.engagement);
        expect(target, `phase "${publishedPhase.slug}" covers "${ref.engagement}"`).toBeDefined();
        if (ref.role) {
          expect(target?.roles.map((r) => r.role)).toContain(ref.role);
        }
      }
    }
  });

  it("states no period of its own: every phase derives one", () => {
    for (const publishedPhase of publishedPhases) {
      expect(Object.keys(publishedPhase)).not.toContain("period");
      expect(publishedPhase.prose).not.toBe("");
    }
  });

  it("tells the early freelance years as story only, with no engagement behind them", () => {
    const earliestEngagement = Math.min(
      ...publishedRecord.engagements.map((e) => firstYear(e.period))
    );
    const storyStart = Math.min(
      ...publishedPhases.flatMap((p) => (p.from ? [Number(p.from)] : []))
    );

    expect(storyStart).toBeLessThan(earliestEngagement);
  });
});
