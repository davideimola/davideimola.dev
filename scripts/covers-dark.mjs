// Writes the dark-theme twin of every cover: public/images/blog/<slug>/cover.svg
// (and the pages' own, public/images/pages/<page>/cover.svg) becomes
// cover-dark.svg next to it, with the three brand colours swapped for
// their night counterparts (paper -> night, ink -> chalk, akane -> akane-night).
// Covers use those three colours and nothing else, so a swap is the whole job.
// Run after drawing or editing a cover: `pnpm covers:dark`.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

const require = createRequire(import.meta.url);
const { palette } = require("@davideimola/brand/tokens.json").color;

const SWAP = [
  [palette.paper, palette.night],
  [palette.ink, palette.chalk],
  [palette.akane, palette["akane-night"]],
];

const ROOTS = ["public/images/blog", "public/images/pages"].map((dir) => join(process.cwd(), dir));
let written = 0;

for (const root of ROOTS) {
  for (const slug of readdirSync(root)) {
    const light = join(root, slug, "cover.svg");
    if (!existsSync(light)) continue;
    let svg = readFileSync(light, "utf8");
    for (const [from, to] of SWAP) {
      svg = svg.replace(new RegExp(from, "gi"), to);
    }
    writeFileSync(join(root, slug, "cover-dark.svg"), svg);
    written++;
  }
}

console.log(`covers:dark wrote ${written} dark covers`);
