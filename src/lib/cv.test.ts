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
