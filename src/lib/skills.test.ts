import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchRepoSkills,
  getSkillCollectionEntries,
  getSkillCollections,
  getSkillsFallback,
  skillSummary,
  skillUrl,
  talkSkillsLinks,
} from "./skills";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

function json(body: unknown) {
  return { ok: true, status: 200, json: async () => body, text: async () => "" };
}

function text(body: string) {
  return { ok: true, status: 200, json: async () => ({}), text: async () => body };
}

const failing = { ok: false, status: 403, json: async () => ({}), text: async () => "" };

beforeEach(() => {
  fetchMock.mockReset();
});

describe("skillSummary", () => {
  it("keeps what the skill does and drops the trigger addressed to the agent", () => {
    expect(
      skillSummary(
        "Security audit of a Go repo or service. Use when the user asks to audit Go code."
      )
    ).toBe("Security audit of a Go repo or service.");
  });

  it("leaves a description with no trigger as it is", () => {
    expect(skillSummary("Captures a spark.")).toBe("Captures a spark.");
  });
});

describe("skillUrl", () => {
  it("points at the skill's folder on the default branch", () => {
    expect(
      skillUrl("davideimola/skills", { name: "idea", description: "x", path: "skills/idea" })
    ).toBe("https://github.com/davideimola/skills/tree/HEAD/skills/idea");
  });
});

describe("fetchRepoSkills", () => {
  it("reads every skills/<name>/SKILL.md, sorted by name, and nothing else", async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("/git/trees/")) {
        return json({
          tree: [
            { path: "README.md" },
            { path: "skills/zeta/SKILL.md" },
            { path: "skills/alpha/SKILL.md" },
            { path: "skills/alpha/assets/SKILL.md" },
          ],
        });
      }
      const name = url.includes("zeta") ? "zeta" : "alpha";
      return text(`---\nname: ${name}\ndescription: Does ${name}.\nlicense: MIT\n---\n\nBody`);
    });

    expect(await fetchRepoSkills("o/r")).toEqual([
      { name: "alpha", description: "Does alpha.", path: "skills/alpha" },
      { name: "zeta", description: "Does zeta.", path: "skills/zeta" },
    ]);
  });

  it("skips a SKILL.md that is not valid YAML and keeps its siblings", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    fetchMock.mockImplementation(async (url: string) => {
      if (url.includes("/git/trees/")) {
        return json({ tree: [{ path: "skills/good/SKILL.md" }, { path: "skills/bad/SKILL.md" }] });
      }
      return url.includes("bad")
        ? text('---\nname: bad\ndescription: Does a thing ("note: this"), badly.\n---\n')
        : text("---\nname: good\ndescription: Does good.\n---\n");
    });

    expect(await fetchRepoSkills("o/r")).toEqual([
      { name: "good", description: "Does good.", path: "skills/good" },
    ]);
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("skills/bad/SKILL.md"));
    warn.mockRestore();
  });

  it("throws on a SKILL.md with no description in strict mode", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.includes("/git/trees/")
        ? json({ tree: [{ path: "skills/a/SKILL.md" }] })
        : text("---\nname: a\n---\n")
    );
    await expect(fetchRepoSkills("o/r", { strict: true })).rejects.toThrow("skills/a/SKILL.md");
  });
});

describe("getSkillCollections", () => {
  it("falls back to the committed snapshot when GitHub cannot be read", async () => {
    fetchMock.mockResolvedValue(failing);
    const collections = await getSkillCollections();
    const fallback = getSkillsFallback();

    expect(collections.length).toBe(getSkillCollectionEntries().length);
    for (const c of collections) {
      expect(c.source).toBe("fallback");
      expect(c.skills).toEqual(fallback[c.repo]);
    }
  });

  it("resolves every talk the collections name", async () => {
    fetchMock.mockResolvedValue(failing);
    const collections = await getSkillCollections();
    for (const entry of getSkillCollectionEntries()) {
      if (!entry.talk) continue;
      expect(collections.find((c) => c.repo === entry.repo)?.talk?.slug).toBe(entry.talk);
    }
  });
});

describe("the committed snapshot", () => {
  it("covers every repo skills.json names", () => {
    const fallback = getSkillsFallback();
    for (const { repo } of getSkillCollectionEntries()) {
      expect(fallback[repo]?.length).toBeGreaterThan(0);
    }
  });
});

describe("talkSkillsLinks", () => {
  it("links each talk skills.json names to its repo's block on /skills", () => {
    const links = talkSkillsLinks();
    for (const { repo, talk } of getSkillCollectionEntries()) {
      if (talk) expect(links.get(talk)).toBe(`/skills#${repo.split("/")[1]}`);
    }
  });
});
