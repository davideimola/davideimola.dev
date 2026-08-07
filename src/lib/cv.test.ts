import fs from "node:fs";
import { describe, expect, it, vi } from "vitest";
import publishedRecord from "../content/cv.json";
import publishedTalks from "../content/talks.json";
import type { Talk } from "./content";
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
  getOrganisedConferences,
  getSelectedTalks,
  getSkills,
  getTotalTalkCount,
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

function setupRecord(overrides: Partial<CvRecord> = {}, talks: Talk[] = []): void {
  const record: CvRecord = {
    identity: IDENTITY,
    engagements: [],
    selectedTalks: [],
    education: [],
    skills: [],
    openSource: [],
    ...overrides,
  };
  // Selected talks are resolved against the talk archive, so the two content
  // files have to answer separately.
  mockFs.readFileSync.mockImplementation((file: unknown) =>
    String(file).endsWith("talks.json") ? JSON.stringify(talks) : JSON.stringify(record)
  );
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

// ── Speaking fixtures ──────────────────────────────────────────────────────

function talk(overrides: Partial<Talk> = {}): Talk {
  return {
    slug: "acme-conf-2024",
    event: "Acme Conf 2024",
    type: "Conference",
    date: "2024-05-01",
    location: "Verona, Italy",
    tags: [],
    session: { title: "A Talk About Things", format: "Talk" },
    ...overrides,
  };
}

// ── getSelectedTalks ───────────────────────────────────────────────────────

describe("getSelectedTalks", () => {
  it("resolves a slug against the talk archive", () => {
    setupRecord({ selectedTalks: ["acme-conf-2024"] }, [talk()]);

    expect(getSelectedTalks()).toEqual([
      {
        slug: "acme-conf-2024",
        title: "A Talk About Things",
        event: "Acme Conf 2024",
        year: "2024",
      },
    ]);
  });

  it("keeps the Record's order, because the selection is the curation", () => {
    setupRecord({ selectedTalks: ["older-conf-2019", "acme-conf-2024"] }, [
      talk(),
      talk({ slug: "older-conf-2019", event: "Older Conf 2019", date: "2019-03-01" }),
    ]);

    expect(getSelectedTalks().map((t) => t.slug)).toEqual(["older-conf-2019", "acme-conf-2024"]);
  });

  it("throws, naming the offending slug, when the archive has no such talk", () => {
    setupRecord({ selectedTalks: ["renamed-conf-2024"] }, [talk()]);

    expect(() => getSelectedTalks()).toThrow(/renamed-conf-2024/);
  });

  it("throws, naming the offending slug, when the entry has no session", () => {
    setupRecord({ selectedTalks: ["organised-only-2024"] }, [
      talk({ slug: "organised-only-2024", organizer: true, session: undefined }),
    ]);

    expect(() => getSelectedTalks()).toThrow(/organised-only-2024/);
  });

  it("returns nothing when the Record selects no talks", () => {
    setupRecord({}, [talk()]);

    expect(getSelectedTalks()).toEqual([]);
  });
});

// ── getTotalTalkCount ──────────────────────────────────────────────────────

describe("getTotalTalkCount", () => {
  it("counts the whole archive, not the selection", () => {
    setupRecord({ selectedTalks: ["acme-conf-2024"] }, [
      talk(),
      talk({ slug: "b", event: "B 2023", date: "2023-01-01" }),
      talk({ slug: "c", event: "C 2022", date: "2022-01-01" }),
    ]);

    expect(getTotalTalkCount()).toBe(3);
  });

  it("counts nothing when the archive is empty", () => {
    setupRecord();

    expect(getTotalTalkCount()).toBe(0);
  });
});

// ── getOrganisedConferences ────────────────────────────────────────────────

describe("getOrganisedConferences", () => {
  it("folds the editions of one conference into a single entry", () => {
    setupRecord({}, [
      talk({
        slug: "osd-2026",
        event: "Open Source Day 2026",
        organizer: true,
        date: "2026-04-25",
      }),
      talk({
        slug: "osd-2024",
        event: "Open Source Day 2024",
        organizer: true,
        date: "2024-03-07",
        location: "Florence, Italy",
      }),
      talk({
        slug: "osd-2023",
        event: "Open Source Day 2023",
        organizer: true,
        date: "2023-03-28",
        location: "Florence, Italy",
      }),
    ]);

    expect(getOrganisedConferences()).toEqual([
      {
        slug: "osd-2026",
        event: "Open Source Day",
        location: "Verona, Italy",
        editions: 3,
        years: "2023 – 2026",
      },
    ]);
  });

  it("states a single year when there is one edition", () => {
    setupRecord({}, [talk({ organizer: true })]);

    expect(getOrganisedConferences()[0].years).toBe("2024");
  });

  it("ignores the talks he only spoke at and the meetups he organised", () => {
    setupRecord({}, [
      talk({ slug: "spoke-at", event: "Someone Else Conf 2024" }),
      talk({ slug: "meetup", event: "A Meetup 2024", type: "Meetup", organizer: true }),
      talk({ slug: "hackathon", event: "A Hackathon 2024", type: "Hackathon", organizer: true }),
      talk({ slug: "own-conf", event: "Own Conf 2024", organizer: true }),
    ]);

    expect(getOrganisedConferences().map((c) => c.event)).toEqual(["Own Conf"]);
  });

  it("returns nothing when he has organised no conference", () => {
    setupRecord({}, [talk()]);

    expect(getOrganisedConferences()).toEqual([]);
  });
});

// ── The published talk selection ───────────────────────────────────────────

// A guard on the content rather than on the module: the throw above only fires
// at build time, and this fails in the test run instead.
describe("the published talk selection", () => {
  it("names only slugs that exist in the archive and carry a session", () => {
    const archive = new Map(publishedTalks.map((entry) => [entry.slug, entry]));

    for (const slug of publishedRecord.selectedTalks) {
      const entry = archive.get(slug);
      expect(entry, `selected talk "${slug}" is missing from talks.json`).toBeDefined();
      expect(entry && "session" in entry, `selected talk "${slug}" has no session`).toBe(true);
    }
  });

  it("restates nothing about a talk beyond its slug", () => {
    expect(publishedRecord.selectedTalks.every((slug) => typeof slug === "string")).toBe(true);
  });
});
