import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { shelfFixture } from "../test/shelf-fixture";
import {
  getShelfFallback,
  getShowcase,
  groupPassesByVerb,
  resetShowcaseCache,
  shelfDocumentSchema,
  shelfTypes,
  showcaseEndpoint,
  verbLabel,
} from "./shelf";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

function okResponse(body: unknown, etag?: string) {
  return {
    ok: true,
    status: 200,
    json: async () => body,
    headers: new Headers(etag ? { ETag: etag } : {}),
  };
}

beforeEach(() => {
  vi.stubEnv("TSUNDOKU_API_URL", "https://tsundoku.example.org");
  vi.stubEnv("TSUNDOKU_BEARER_TOKEN", "test-token");
  fetchMock.mockReset();
  resetShowcaseCache();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("shelfDocumentSchema", () => {
  it("parses the committed fallback snapshot", () => {
    const parsed = shelfDocumentSchema.safeParse(getShelfFallback());
    expect(parsed.success).toBe(true);
  });

  it("keeps the committed snapshot a real one, never the invented fixture", () => {
    expect(getShelfFallback()).not.toEqual(shelfFixture);
  });

  it("parses the invented fixture the tests are written against", () => {
    expect(shelfDocumentSchema.safeParse(shelfFixture).success).toBe(true);
  });

  it("keeps the abandoned pass and its score", () => {
    const doc = shelfFixture;
    const abandoned = doc.finished.recent.filter((pass) => pass.outcome === "given-up");
    expect(abandoned.length).toBeGreaterThan(0);
    expect(abandoned[0].rating?.score).toBeGreaterThan(0);
  });

  it("drops anything a rating carries beyond the score, so no review can reach the page", () => {
    const doc = structuredClone(shelfFixture) as Record<string, unknown>;
    const finished = doc.finished as { recent: Array<{ rating: Record<string, unknown> | null }> };
    finished.recent[0].rating = { score: 7, grain: "a private note that must not be rendered" };
    const parsed = shelfDocumentSchema.parse(doc);
    expect(parsed.finished.recent[0].rating).toEqual({ score: 7 });
  });

  it("carries an abandonment with no score, because a verdict needs no number", () => {
    const unscored = shelfFixture.finished.recent.filter(
      (pass) => pass.outcome === "given-up" && pass.rating === null
    );
    expect(unscored.length).toBeGreaterThan(0);
  });

  it("holds only passes carrying a verdict, the way the API now sends them", () => {
    const doc = shelfFixture;
    expect(doc.finished.recent.length).toBeGreaterThan(0);
    expect(doc.finished.recent.length).toBeLessThanOrEqual(12);
    expect(
      doc.finished.recent.every((pass) => pass.rating !== null || pass.outcome === "given-up")
    ).toBe(true);
  });

  it("counts every verdict behind the sample it shows", () => {
    const doc = shelfFixture;
    expect(doc.finished.count).toBeGreaterThanOrEqual(doc.finished.recent.length);
  });

  it("ignores a field the API grows beside the verdicts sample", () => {
    const doc = shelfFixture;
    const grown = {
      ...doc,
      finished: { ...doc.finished, byType: [] },
    } as Record<string, unknown>;
    const parsed = shelfDocumentSchema.safeParse(grown);
    expect(parsed.success).toBe(true);
  });

  it("accepts a pass with no dates at either end", () => {
    const doc = shelfFixture;
    expect(doc.now.some((pass) => pass.startedAt === null)).toBe(true);
    expect(
      doc.finished.recent.some((pass) => pass.startedAt === null && pass.endedAt === null)
    ).toBe(true);
  });

  it("keeps the Medium as a slug and label pair", () => {
    const game = shelfFixture.now.find((pass) => pass.type.slug === "videogame");
    expect(game?.medium).toEqual({ slug: "playstation-5", label: "PlayStation 5" });
  });

  it("carries the progress unit the model uses", () => {
    const progress = shelfFixture.now.find((pass) => pass.progress)?.progress;
    expect(progress?.unit).toBe("instalments");
  });

  it("keeps a looked-up cover's link back to its source", () => {
    const linked = shelfFixture.shelf.volumes.filter((volume) => volume.cover?.at);
    expect(linked.length).toBeGreaterThan(0);
    const owned = shelfFixture.shelf.volumes.find((volume) => volume.cover?.source === "owner");
    expect(owned?.cover?.at).toBeNull();
  });

  it("accepts a volume that has not been catalogued into a Type", () => {
    const untyped = shelfFixture.shelf.volumes.filter((volume) => volume.type === null);
    expect(untyped.length).toBeGreaterThan(0);
    expect(shelfTypes(shelfFixture).every((type) => type.slug)).toBe(true);
    expect(shelfTypes(shelfFixture).map((type) => type.slug)).toEqual(["manga", "novel"]);
  });

  it("drops a Type counting no volumes, because filtering on it lands on an empty wall", () => {
    const doc = shelfFixture;
    expect(doc.shelf.byType.some((entry) => entry.count === 0)).toBe(true);
    expect(shelfTypes(doc).map((type) => type.slug)).not.toContain("videogame");
  });

  it("carries a cover-less entry so the Series tile branch is exercised", () => {
    const coverless = shelfFixture.shelf.volumes.filter((volume) => volume.cover === null);
    expect(coverless.length).toBeGreaterThan(0);
    expect(coverless[0].series?.tint).toMatch(/^oklch\(/);
  });

  it("rejects a document missing a required block", () => {
    const { pile, ...rest } = shelfFixture;
    expect(pile).toBeDefined();
    expect(shelfDocumentSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects a row whose type has no verbs, because the page must not guess them", () => {
    for (const field of ["verb", "verbBase"]) {
      const doc = structuredClone(shelfFixture) as Record<string, unknown>;
      const now = doc.now as Array<{ type: Record<string, unknown> }>;
      now[0].type[field] = undefined;
      expect(shelfDocumentSchema.safeParse(doc).success).toBe(false);
    }
  });

  it("falls back to 'finished' for an outcome it does not know", () => {
    const doc = structuredClone(shelfFixture) as Record<string, unknown>;
    const finished = doc.finished as { recent: Array<{ outcome: string }> };
    finished.recent[0].outcome = "reshelved";
    const parsed = shelfDocumentSchema.parse(doc);
    expect(parsed.finished.recent[0].outcome).toBe("finished");
  });
});

describe("showcaseEndpoint", () => {
  it("appends the resource to a bare base URL", () => {
    expect(showcaseEndpoint("https://tsundoku.example.org")).toBe(
      "https://tsundoku.example.org/api/showcase"
    );
  });

  it("tolerates a trailing slash", () => {
    expect(showcaseEndpoint("https://tsundoku.example.org/")).toBe(
      "https://tsundoku.example.org/api/showcase"
    );
  });

  it("leaves a URL that already names the resource alone", () => {
    expect(showcaseEndpoint("https://tsundoku.example.org/api/showcase")).toBe(
      "https://tsundoku.example.org/api/showcase"
    );
  });
});

describe("verbLabel", () => {
  it("builds the heading from the bare verb, never from the past participle", () => {
    expect(verbLabel("read")).toBe("Reading");
    expect(verbLabel("play")).toBe("Playing");
  });

  it("still names a verb it has no copy for", () => {
    expect(verbLabel("watch")).toBe("Watching");
    expect(verbLabel("curate")).toBe("Curating");
  });
});

describe("groupPassesByVerb", () => {
  it("splits on the Type verb, reading before playing", () => {
    const groups = groupPassesByVerb(shelfFixture.now);
    expect(groups.map((group) => group.label)).toEqual(["Reading", "Playing"]);
    expect(groups[0].passes.every((pass) => pass.type.verbBase === "read")).toBe(true);
    expect(groups[1].passes.every((pass) => pass.type.verbBase === "play")).toBe(true);
  });

  it("puts two Types that share a verb under one heading", () => {
    const reading = groupPassesByVerb(shelfFixture.now)[0];
    expect(new Set(reading.passes.map((pass) => pass.type.slug))).toEqual(
      new Set(["manga", "novel"])
    );
  });

  it("omits a block with nothing in it", () => {
    const readOnly = shelfFixture.now.filter((pass) => pass.type.verbBase === "read");
    expect(groupPassesByVerb(readOnly).map((group) => group.label)).toEqual(["Reading"]);
    expect(groupPassesByVerb([])).toEqual([]);
  });
});

describe("getShowcase", () => {
  it("calls the showcase resource with the bearer token and returns the live document", async () => {
    const live = { ...shelfFixture, generatedAt: "2026-09-13T06:00:00.000Z" };
    fetchMock.mockResolvedValue(okResponse(live));

    const snapshot = await getShowcase();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://tsundoku.example.org/api/showcase");
    expect(init.headers.Authorization).toBe("Bearer test-token");
    expect(snapshot.source).toBe("live");
    expect(snapshot.document.generatedAt).toBe("2026-09-13T06:00:00.000Z");
  });

  it("sends no If-None-Match on the first read, and the stored ETag afterwards", async () => {
    fetchMock.mockResolvedValue(okResponse(shelfFixture, 'W/"abc123"'));

    await getShowcase();
    expect(fetchMock.mock.calls[0][1].headers["If-None-Match"]).toBeUndefined();

    await getShowcase();
    expect(fetchMock.mock.calls[1][1].headers["If-None-Match"]).toBe('W/"abc123"');
  });

  it("keeps what it has when the API answers 304", async () => {
    const live = { ...shelfFixture, generatedAt: "2026-09-13T06:00:00.000Z" };
    fetchMock.mockResolvedValueOnce(okResponse(live, 'W/"abc123"'));
    await getShowcase();

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 304,
      json: async () => ({}),
      headers: new Headers(),
    });
    const snapshot = await getShowcase();

    expect(snapshot.source).toBe("live");
    expect(snapshot.document.generatedAt).toBe("2026-09-13T06:00:00.000Z");
  });

  it("falls back to the committed snapshot when the API is unreachable", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNREFUSED"));

    const snapshot = await getShowcase();

    expect(snapshot.source).toBe("fallback");
    expect(snapshot.document).toEqual(getShelfFallback());
  });

  it("falls back when the API refuses the token", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401, json: async () => ({}) });

    const snapshot = await getShowcase();

    expect(snapshot.source).toBe("fallback");
  });

  it("falls back when the body does not match the contract", async () => {
    fetchMock.mockResolvedValue(okResponse({ generatedAt: "2026-09-13T06:00:00.000Z" }));

    const snapshot = await getShowcase();

    expect(snapshot.source).toBe("fallback");
  });

  it("falls back without calling fetch when the API URL is missing", async () => {
    vi.stubEnv("TSUNDOKU_API_URL", "");

    const snapshot = await getShowcase();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(snapshot.source).toBe("fallback");
    expect(snapshot.document.shelf.total).toBeGreaterThan(0);
  });

  it("falls back without calling fetch when the token is missing", async () => {
    vi.stubEnv("TSUNDOKU_BEARER_TOKEN", "");

    const snapshot = await getShowcase();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(snapshot.source).toBe("fallback");
  });
});

describe("where a title stands in its run", () => {
  // The committed snapshot predates the field, so the contract has to accept a
  // document without it, a document with it, and a shape nobody here has seen.
  it("defaults to nothing when the document does not carry it", () => {
    const parsed = shelfDocumentSchema.parse({
      ...shelfFixture,
      shelf: {
        ...shelfFixture.shelf,
        volumes: [{ id: "v1", title: "Hyperversum", type: null, cover: null, series: null }],
      },
    });
    expect(parsed.shelf.volumes[0].standsAt).toBeNull();
  });

  it("reads a single part and a range alike, both ends always present", () => {
    const parsed = shelfDocumentSchema.parse({
      ...shelfFixture,
      pile: {
        ...shelfFixture.pile,
        recent: [
          { ...shelfFixture.pile.recent[0], standsAt: { from: 7, to: 7, unit: "instalments" } },
          { ...shelfFixture.pile.recent[1], standsAt: { from: 1, to: 3, unit: "volumes" } },
        ],
      },
    });
    expect(parsed.pile.recent[0].standsAt).toEqual({ from: 7, to: 7, unit: "instalments" });
    expect(parsed.pile.recent[1].standsAt).toEqual({ from: 1, to: 3, unit: "volumes" });
  });

  it("reaches an open pass too, not only a shelved volume", () => {
    const parsed = shelfDocumentSchema.parse({
      ...shelfFixture,
      now: [{ ...shelfFixture.now[0], standsAt: { from: 14, to: 14, unit: "instalments" } }],
    });
    expect(parsed.now[0].standsAt).toEqual({ from: 14, to: 14, unit: "instalments" });
  });

  it("swallows a shape it has never seen rather than failing the document", () => {
    const parsed = shelfDocumentSchema.safeParse({
      ...shelfFixture,
      pile: {
        ...shelfFixture.pile,
        recent: [{ ...shelfFixture.pile.recent[0], standsAt: "7 of 31" }],
      },
    });
    expect(parsed.success).toBe(true);
    expect(parsed.success && parsed.data.pile.recent[0].standsAt).toBeNull();
  });
});
