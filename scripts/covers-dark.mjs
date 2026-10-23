// Writes the dark-theme twin of every cover: public/images/blog/<slug>/cover.svg
// (and the pages' own, public/images/pages/<page>/cover.svg) becomes
// cover-dark.svg next to it, with the three brand colours swapped for
// their night counterparts (paper -> night, ink -> chalk, akane -> akane-night).
// A post's figures (public/images/blog/<slug>/figures/<name>.svg, drawn by
// DrawnFigure) get the same twin, <name>-dark.svg.
// Drawings use those three colours and nothing else, so a swap is the whole job.
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

function writeTwin(light, dark) {
  let svg = readFileSync(light, "utf8");
  for (const [from, to] of SWAP) {
    svg = svg.replace(new RegExp(from, "gi"), to);
  }
  writeFileSync(dark, svg);
  written++;
}

for (const root of ROOTS) {
  for (const slug of readdirSync(root)) {
    const light = join(root, slug, "cover.svg");
    if (existsSync(light)) writeTwin(light, join(root, slug, "cover-dark.svg"));

    const figures = join(root, slug, "figures");
    if (!existsSync(figures)) continue;
    for (const file of readdirSync(figures)) {
      if (!file.endsWith(".svg") || file.endsWith("-dark.svg")) continue;
      writeTwin(join(figures, file), join(figures, file.replace(/\.svg$/, "-dark.svg")));
    }
  }
}

console.log(`covers:dark wrote ${written} dark drawings`);
