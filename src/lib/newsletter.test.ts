import fs from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getAllIssues, getIssueBySlug, getLatestIssue } from "./newsletter";

vi.mock("node:fs", () => ({
  default: {
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
  readdirSync: vi.fn(),
  readFileSync: vi.fn(),
  existsSync: vi.fn(),
}));

const mockFs = vi.mocked(fs);

function issueMdx(fields: {
  issue: number;
  subject: string;
  previewText: string;
  sendDate: string;
  draft?: boolean;
}): string {
  return [
    "---",
    `issue: ${fields.issue}`,
    `subject: "${fields.subject}"`,
    `previewText: "${fields.previewText}"`,
    `sendDate: "${fields.sendDate}"`,
    ...(fields.draft !== undefined ? [`draft: ${fields.draft}`] : []),
    "---",
    "",
    "## Intro",
    "",
    "Issue body.",
  ].join("\n");
}

// Two published issues (JULY newest) plus a draft.
const JULY = issueMdx({
  issue: 2,
  subject: "July digest",
  previewText: "What I shipped in July.",
  sendDate: "2026-07-28",
});
const JUNE = issueMdx({
  issue: 1,
  subject: "June digest",
  previewText: "The first issue.",
  sendDate: "2026-06-28",
});
const DRAFT = issueMdx({
  issue: 3,
  subject: "August draft",
  previewText: "Not sent yet.",
  sendDate: "2026-08-28",
  draft: true,
});

function setupIssues(files = ["2026-07.mdx", "2026-06.mdx"]) {
  mockFs.existsSync.mockReturnValue(true);
  mockFs.readdirSync.mockReturnValue(files as never);
  mockFs.readFileSync.mockImplementation((filePath: unknown) => {
    const p = String(filePath);
    if (p.includes("2026-07")) return JULY;
    if (p.includes("2026-06")) return JUNE;
    if (p.includes("2026-08")) return DRAFT;
    return "";
  });
}

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  setupIssues();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("getAllIssues", () => {
  it("returns issues newest-first", () => {
    const issues = getAllIssues();
    expect(issues.map((i) => i.slug)).toEqual(["2026-07", "2026-06"]);
  });

  it("parses frontmatter into the NewsletterIssue shape", () => {
    const [july] = getAllIssues();
    expect(july).toMatchObject({
      slug: "2026-07",
      issue: 2,
      subject: "July digest",
      previewText: "What I shipped in July.",
      date: "2026-07-28",
    });
    expect(july.content).toContain("Issue body.");
  });

  it("returns an empty array when the directory does not exist", () => {
    mockFs.existsSync.mockReturnValue(false);
    expect(getAllIssues()).toEqual([]);
  });

  it("hides drafts in production", () => {
    setupIssues(["2026-07.mdx", "2026-06.mdx", "2026-08.mdx"]);
    const issues = getAllIssues();
    expect(issues.some((i) => i.slug === "2026-08")).toBe(false);
    expect(issues).toHaveLength(2);
  });

  it("includes drafts in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    setupIssues(["2026-07.mdx", "2026-06.mdx", "2026-08.mdx"]);
    const issues = getAllIssues();
    expect(issues.some((i) => i.slug === "2026-08")).toBe(true);
    expect(issues).toHaveLength(3);
  });
});

describe("getIssueBySlug", () => {
  it("returns the issue for a known slug", () => {
    expect(getIssueBySlug("2026-07")?.subject).toBe("July digest");
  });

  it("returns null for a missing file", () => {
    mockFs.existsSync.mockReturnValue(false);
    expect(getIssueBySlug("nope")).toBeNull();
  });

  it("returns null for a draft issue in production", () => {
    mockFs.readFileSync.mockReturnValue(DRAFT);
    expect(getIssueBySlug("2026-08")).toBeNull();
  });

  it("returns a draft issue in development", () => {
    vi.stubEnv("NODE_ENV", "development");
    mockFs.readFileSync.mockReturnValue(DRAFT);
    expect(getIssueBySlug("2026-08")).not.toBeNull();
  });
});

describe("getLatestIssue", () => {
  it("returns the newest published issue", () => {
    expect(getLatestIssue()?.slug).toBe("2026-07");
  });

  it("returns null when there are no issues", () => {
    mockFs.readdirSync.mockReturnValue([] as never);
    expect(getLatestIssue()).toBeNull();
  });
});
