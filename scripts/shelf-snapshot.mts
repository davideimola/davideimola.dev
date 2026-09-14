// Refresh src/content/shelf.fallback.json from the live tsundoku showcase.
//
// Run:  pnpm shelf:snapshot
//
// The committed snapshot is what /shelf publishes when tsundoku cannot be
// reached, so it has to be the owner's real library and nothing else. Taking it
// is a deliberate act: no build, no deploy and no revalidation ever runs this
// script, exactly like `pnpm cv:pdf`. Run it when the library has moved enough
// that a cold build would show something stale, then commit the diff.
//
// Credentials come from the environment, which the pnpm script loads out of
// .env.local:
//   TSUNDOKU_API_URL       origin of the tsundoku instance
//   TSUNDOKU_BEARER_TOKEN  read-only API token
//
// The response is validated through the same Zod schema the page reads the live
// document with (src/lib/shelf.ts), never a second copy of the shape, and the
// file is written only when it validates. A missing env var, an unreachable
// API, a non-2xx or a body that does not match the contract all exit non-zero
// with the reason on stderr and leave the existing snapshot untouched: a broken
// run must never replace a good snapshot with rubbish.
//
// Exit code 0 means src/content/shelf.fallback.json was rewritten.

import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { shelfDocumentSchema, showcaseEndpoint } from "../src/lib/shelf";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "src/content/shelf.fallback.json");
const BIOME_BIN = path.join(ROOT, "node_modules", ".bin", "biome");

const run = promisify(execFile);

function fail(reason: string): never {
  console.error(`✗ ${reason}`);
  console.error("  src/content/shelf.fallback.json was NOT written.");
  process.exit(1);
}

const baseUrl = process.env.TSUNDOKU_API_URL;
const token = process.env.TSUNDOKU_BEARER_TOKEN;

if (!baseUrl) fail("TSUNDOKU_API_URL is not set (expected in .env.local).");
if (!token) fail("TSUNDOKU_BEARER_TOKEN is not set (expected in .env.local).");

const endpoint = showcaseEndpoint(baseUrl);
console.log(`Reading the showcase from ${endpoint}`);

let response: Response;
try {
  response = await fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
  });
} catch (error) {
  fail(`${endpoint} could not be reached: ${(error as Error).message}`);
}

if (!response.ok) {
  fail(`${endpoint} answered ${response.status} ${response.statusText}.`);
}

let body: unknown;
try {
  body = await response.json();
} catch (error) {
  fail(`${endpoint} did not answer JSON: ${(error as Error).message}`);
}

// The one schema, imported rather than restated. A document the page could not
// render is a document this script refuses to commit.
const parsed = shelfDocumentSchema.safeParse(body);
if (!parsed.success) {
  console.error("✗ The showcase document does not match the contract in src/lib/shelf.ts:");
  for (const issue of parsed.error.issues) {
    console.error(`  - ${issue.path.join(".") || "(root)"}: ${issue.message}`);
  }
  fail("nothing validated, so nothing was written.");
}

const document = parsed.data;

await writeFile(OUTPUT_FILE, `${JSON.stringify(document, null, 2)}\n`, "utf-8");

// Biome owns the formatting of everything in this repo, so the snapshot is
// handed to it rather than guessed at: `pnpm lint` must pass on the file this
// script just wrote.
await run(BIOME_BIN, ["format", "--write", OUTPUT_FILE]);

console.log("\n✓ src/content/shelf.fallback.json rewritten from the live library.");
console.log(`  generatedAt  ${document.generatedAt}`);
console.log(`  now          ${document.now.length} open passes`);
console.log(`  finished     ${document.finished.recent.length} of ${document.finished.count}`);
console.log(`  pile         ${document.pile.recent.length} of ${document.pile.count}`);
console.log(`  shelf        ${document.shelf.volumes.length} of ${document.shelf.total}`);
console.log("\n  Review the diff and commit it: the fallback is published content.");
