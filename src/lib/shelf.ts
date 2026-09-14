import { z } from "zod";
import { readContentJson } from "./content-json";

// The /shelf page renders the showcase document served by tsundoku, the
// personal library at https://github.com/davideimola/tsundoku. tsundoku exposes
// one read-only resource behind a bearer token, and this module is the only
// seam over it: the page never talks to the API itself and never sees an
// unvalidated shape.
//
// Two rules drive the design:
//  1. The document is a Rendering, not a record. Whatever is not in it does not
//     exist to this site, so nothing here reconstructs anything it was not sent.
//  2. The page must survive tsundoku being off. The home cluster is allowed to
//     be down, so a failed fetch, an invalid body or a missing env falls back to
//     the committed snapshot in src/content/shelf.fallback.json instead of
//     throwing at build or at revalidation time.

// ── Schema ─────────────────────────────────────────────────────────────────

// The Type carries both verbs, because English will not derive one from the
// other: `verb` is the past participle the library speaks in ("read", "played")
// and `verbBase` the bare verb ("read", "play"), which is the only one a
// heading can be built from. Both stay open strings: a new Type in tsundoku
// must not invalidate the whole document here.
const typeSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
  verb: z.string().min(1),
  verbBase: z.string().min(1),
});

// The Medium is a pair, so the page prints the label tsundoku chose and never
// title-cases a slug into something like "Playstation 5".
const mediumSchema = z.object({
  slug: z.string().min(1),
  label: z.string().min(1),
});

// `source` is open on purpose: the site does not render it, so an unknown value
// is not worth failing a document over. `at` is the source's own page for the
// volume and is null for the owner's own images; where it is present the cover
// must link to it, which is what tsundoku's ADR-0013 promises the lookup
// provider.
const coverSchema = z
  .object({
    url: z.url(),
    source: z.string().min(1),
    at: z.string().nullable().optional().default(null),
  })
  .nullable();

// A null cover is a promise that `series` carries the tint the site draws
// instead, but a fork may send neither, so the tile has its own last resort.
// The tint arrives as one ready-to-use CSS colour string, oklch() in practice,
// and is handed to the tile untouched.
const seriesSchema = z
  .object({
    name: z.string().min(1),
    tint: z.string().min(1),
  })
  .nullable();

// `unit` is the model's own noun, "instalments", because an omnibus is one
// Volume carrying three Instalments. The page keeps it out of the visible text
// and puts it in the accessible label instead: see OpenPassRow.
const progressSchema = z
  .object({
    reached: z.number(),
    total: z.number(),
    unit: z.string().min(1),
  })
  .nullable();

// A score and nothing else. The written review stays private in tsundoku and
// never reaches this site.
const ratingSchema = z
  .object({
    score: z.number(),
  })
  .nullable();

// Where a title sits in its run, on every row that names one. Always a range:
// a single part arrives with `from` and `to` at the same value, an omnibus with
// the two ends it carries under one cover, and a standalone object (or a pass
// that went through no object at all) with nothing.
//
// It is data, not display text. The site prints titles exactly as the library
// sends them and never composes a number into one: the owner's titles already
// carry their numbers ("Slam Dunk 20"), so appending would read "Slam Dunk 20
// 20", and the string match that avoids that holds only until it meets an odd
// title. The field stays in the contract because a number as data beats a
// number inside a string, and because an omnibus spans a range no title can
// express.
//
// Optional and `.catch(null)` throughout: the committed snapshot predates the
// field, and a shape this site has never seen must never cost the whole
// document.
const standsAtSchema = z
  .object({
    from: z.number(),
    to: z.number(),
    unit: z.enum(["instalments", "volumes"]),
  })
  .nullable()
  .optional()
  .catch(null)
  .default(null);

// A pass with no dates is ordinary: the library records what it knows, so both
// ends are nullable and neither may blank the page.
const passSchema = z.object({
  id: z.string(),
  title: z.string(),
  type: typeSchema,
  medium: mediumSchema,
  startedAt: z.string().nullable(),
  standsAt: standsAtSchema,
  progress: progressSchema.optional().default(null),
  cover: coverSchema,
  series: seriesSchema,
});

// Every pass in `finished.recent` carries a verdict, because tsundoku only
// sends the ones that do: a pass with a score, or one given up even with no
// score, since an abandonment is a judgement without a number. The list is
// capped at 12, most recent first, undated last. None of that is redone here:
// the page renders what it is sent, in the order it is sent, and must never
// filter or slice the block for itself.
const finishedPassSchema = passSchema.extend({
  endedAt: z.string().nullable(),
  // The outcome is a verdict the page renders, so it is a closed set. `.catch`
  // keeps one unknown value from costing the whole document: an outcome this
  // site has never heard of reads as a finish, not as an abandonment.
  outcome: z.enum(["finished", "given-up"]).catch("finished"),
  rating: ratingSchema.optional().default(null),
});

const pileEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  type: typeSchema,
  standsAt: standsAtSchema,
  cover: coverSchema,
  series: seriesSchema,
});

// A shelf volume may have no Type at all: an object whose contents are not
// catalogued yet is a gap the library shows rather than refuses, so the site
// shows it too.
const shelfVolumeSchema = pileEntrySchema.extend({
  type: typeSchema.nullable(),
});

const typeCountSchema = z.object({
  type: typeSchema,
  count: z.number(),
});

// Every object here is non-strict, which is the point: tsundoku may grow a field
// without this site knowing about it, and an unknown key is dropped rather than
// failing the document.
export const shelfDocumentSchema = z.object({
  generatedAt: z.string(),
  now: z.array(passSchema),
  // `finished` is shaped like `pile` and `shelf`: `count` is every verdict in
  // the library, `recent` the most recent 12 of them.
  finished: z.object({
    count: z.number(),
    recent: z.array(finishedPassSchema),
  }),
  pile: z.object({
    count: z.number(),
    byType: z.array(typeCountSchema),
    recent: z.array(pileEntrySchema),
  }),
  shelf: z.object({
    total: z.number(),
    byType: z.array(typeCountSchema),
    volumes: z.array(shelfVolumeSchema),
  }),
  // Off unless the tsundoku instance enables it, and this owner does not.
  // Accepted so a fork that switches it on does not fail validation here; this
  // site builds no UI for it.
  wish: z.array(pileEntrySchema).optional(),
});

export type ShelfType = z.infer<typeof typeSchema>;
export type ShelfMedium = z.infer<typeof mediumSchema>;
export type ShelfCover = z.infer<typeof coverSchema>;
export type ShelfSeries = z.infer<typeof seriesSchema>;
export type ShelfProgress = z.infer<typeof progressSchema>;
export type ShelfPass = z.infer<typeof passSchema>;
export type ShelfFinishedPass = z.infer<typeof finishedPassSchema>;
export type ShelfStandsAt = z.infer<typeof standsAtSchema>;
export type ShelfPileEntry = z.infer<typeof pileEntrySchema>;
export type ShelfVolume = z.infer<typeof shelfVolumeSchema>;
export type ShelfTypeCount = z.infer<typeof typeCountSchema>;
export type ShelfDocument = z.infer<typeof shelfDocumentSchema>;

export interface ShelfSnapshot {
  document: ShelfDocument;
  // "fallback" means the visitor is looking at the committed snapshot because
  // tsundoku could not be reached or answered something unusable. The page says
  // so rather than pretending the numbers are live.
  source: "live" | "fallback";
}

// ── The committed snapshot ─────────────────────────────────────────────────

let fallbackCache: ShelfDocument | null = null;

/**
 * The snapshot the page renders when tsundoku is unreachable. Parsed through
 * the same schema as the live document, so a drift between the contract and the
 * committed file is a test failure rather than a production surprise.
 */
export function getShelfFallback(): ShelfDocument {
  if (!fallbackCache) {
    fallbackCache = shelfDocumentSchema.parse(readContentJson<unknown>("shelf.fallback.json"));
  }
  return fallbackCache;
}

// ── The fetch ──────────────────────────────────────────────────────────────

const SHOWCASE_PATH = "/api/showcase";

/**
 * TSUNDOKU_API_URL is documented as the origin, but a URL that already names
 * the resource is accepted so a misconfiguration is not a silent 404.
 */
export function showcaseEndpoint(baseUrl: string): string {
  const trimmed = baseUrl.replace(/\/+$/, "");
  return trimmed.endsWith(SHOWCASE_PATH) ? trimmed : `${trimmed}${SHOWCASE_PATH}`;
}

// The last document this process saw, with the ETag it came with. tsundoku's
// ETag is stable across rebuilds (it excludes generatedAt), so a revalidation
// that changes nothing costs a 304 and no body at all.
let lastSeen: { etag: string; document: ShelfDocument } | null = null;

/** Test seam: forget the conditional-request state between cases. */
export function resetShowcaseCache(): void {
  lastSeen = null;
}

/**
 * Fetches the showcase document from tsundoku. Never throws: every failure path
 * (missing env, network error, non-2xx, body that does not match the contract)
 * degrades to the committed snapshot.
 */
export async function getShowcase(): Promise<ShelfSnapshot> {
  const baseUrl = process.env.TSUNDOKU_API_URL;
  const token = process.env.TSUNDOKU_BEARER_TOKEN;

  if (!baseUrl || !token) {
    return { document: getShelfFallback(), source: "fallback" };
  }

  try {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    };
    if (lastSeen) {
      headers["If-None-Match"] = lastSeen.etag;
    }

    const response = await fetch(showcaseEndpoint(baseUrl), {
      headers,
      // The page revalidates hourly; the fetch follows it rather than holding a
      // cache of its own.
      next: { revalidate: 3600 },
    });

    // Nothing has changed since the last read, so the document we already have
    // is the current one.
    if (response.status === 304 && lastSeen) {
      return { document: lastSeen.document, source: "live" };
    }

    if (!response.ok) {
      return { document: getShelfFallback(), source: "fallback" };
    }

    const parsed = shelfDocumentSchema.safeParse(await response.json());
    if (!parsed.success) {
      return { document: getShelfFallback(), source: "fallback" };
    }

    const etag = response.headers?.get?.("ETag");
    lastSeen = etag ? { etag, document: parsed.data } : null;

    return { document: parsed.data, source: "live" };
  } catch {
    return { document: getShelfFallback(), source: "fallback" };
  }
}

// ── Rendering helpers ──────────────────────────────────────────────────────

// The two headings the site has copy for, keyed by the Type's bare verb. The
// past participle cannot be bent into a heading ("played" will not become
// "Playing"), which is why the contract ships both.
const VERB_BASE_LABELS: Record<string, string> = {
  read: "Reading",
  play: "Playing",
};

const VERB_BASE_ORDER = ["read", "play"];

export interface PassGroup<T extends { type: ShelfType }> {
  verbBase: string;
  label: string;
  passes: T[];
}

/**
 * The heading for a bare verb. A verb this site has no copy for still gets a
 * readable block rather than disappearing: a naive gerund is wrong far less
 * often than dropping the passes would be.
 */
export function verbLabel(verbBase: string): string {
  const known = VERB_BASE_LABELS[verbBase];
  if (known) return known;
  const stem =
    verbBase.endsWith("e") && !verbBase.endsWith("ee") ? verbBase.slice(0, -1) : verbBase;
  return `${stem.charAt(0).toUpperCase()}${stem.slice(1)}ing`;
}

/**
 * Splits passes into one block per Type verb, never by the Type slug: Manga and
 * Novel are both read, and they belong under one heading. Reading comes before
 * Playing; a verb this site has no copy for keeps its own block at the end. A
 * block with nothing in it is not returned, so the page renders nothing for it.
 */
export function groupPassesByVerb<T extends { type: ShelfType }>(passes: T[]): PassGroup<T>[] {
  const byVerb = new Map<string, T[]>();
  for (const pass of passes) {
    const bucket = byVerb.get(pass.type.verbBase);
    if (bucket) {
      bucket.push(pass);
    } else {
      byVerb.set(pass.type.verbBase, [pass]);
    }
  }

  const verbs = [...byVerb.keys()].sort((a, b) => {
    const ia = VERB_BASE_ORDER.indexOf(a);
    const ib = VERB_BASE_ORDER.indexOf(b);
    if (ia === ib) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  return verbs.map((verbBase) => ({
    verbBase,
    label: verbLabel(verbBase),
    passes: byVerb.get(verbBase) ?? [],
  }));
}

/**
 * The Types present anywhere on the shelf, deduplicated by slug, in the order
 * tsundoku sent them. The cover wall filter is built from this rather than from
 * a hardcoded list, so a new Type needs no change here. A volume with no Type
 * contributes nothing to the filter: it is a gap in the catalogue, not a Type.
 * A Type counting zero volumes is dropped too: tsundoku sends every Type it
 * knows, so filtering on one of those would land on an empty wall.
 */
export function shelfTypes(document: ShelfDocument): ShelfType[] {
  const seen = new Map<string, ShelfType>();
  for (const { type, count } of document.shelf.byType) {
    if (count > 0 && !seen.has(type.slug)) seen.set(type.slug, type);
  }
  for (const volume of document.shelf.volumes) {
    if (volume.type && !seen.has(volume.type.slug)) seen.set(volume.type.slug, volume.type);
  }
  return [...seen.values()];
}
