import fs from "node:fs";
import path from "node:path";

// Every content file in this repo lives under src/content and is read at build
// time from a cwd-relative path. Keeping the directory here means the join and
// the JSON.parse exist once instead of once per accessor.
export const CONTENT_DIR = path.join(process.cwd(), "src/content");

// Reads and parses a JSON content file. `fileName` is relative to src/content,
// e.g. "talks.json".
export function readContentJson<T>(fileName: string): T {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, fileName), "utf-8");
  return JSON.parse(raw) as T;
}
