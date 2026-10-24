// Refresh src/content/skills.fallback.json from the skills repos on GitHub.
//
// Run:  pnpm skills:snapshot
//
// The committed snapshot is what /skills publishes when GitHub cannot be read,
// so it holds the real skills and nothing else. Like `pnpm shelf:snapshot`, it
// is a deliberate act: no build, deploy or revalidation ever runs this script.
//
// GITHUB_TOKEN is optional (loaded from .env.local when present); without it
// the unauthenticated rate limit applies. Every repo named in
// src/content/skills.json is read through the same fetchRepoSkills() the page
// uses, and nothing is written unless every repo was read: a broken run must
// never replace a good snapshot with a partial one.
//
// Exit code 0 means src/content/skills.fallback.json was rewritten.

import { execFile } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import { fetchRepoSkills, getSkillCollectionEntries, type SkillsSnapshot } from "../src/lib/skills";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "src/content/skills.fallback.json");
const BIOME_BIN = path.join(ROOT, "node_modules", ".bin", "biome");

const run = promisify(execFile);

const snapshot: SkillsSnapshot = {};
for (const { repo } of getSkillCollectionEntries()) {
  try {
    snapshot[repo] = await fetchRepoSkills(repo);
  } catch (error) {
    console.error(`✗ ${(error as Error).message}`);
    console.error("  src/content/skills.fallback.json was NOT written.");
    process.exit(1);
  }
  console.log(`  ${repo}  ${snapshot[repo].map((s) => s.name).join(", ") || "(none)"}`);
}

await writeFile(OUTPUT_FILE, `${JSON.stringify(snapshot, null, 2)}\n`, "utf-8");
await run(BIOME_BIN, ["format", "--write", OUTPUT_FILE]);

console.log("\n✓ src/content/skills.fallback.json rewritten. Review the diff and commit it.");
