// Writes the PNG render of every figure: public/images/blog/<slug>/figures/<name>.svg
// becomes <name>.png next to it. The page draws the SVG itself; the PNG is for the
// places that will not show an SVG, dev.to's Syndicated copy and feed readers
// (`rasterFigures` in src/lib/figures.ts points them at it).
// The render sits on the paper ground, since a transparent PNG would put ink lines on
// a dark reader's background, and sets its labels in IBM Plex Mono, as the page does.
// Run after drawing or editing a figure: `pnpm figures:png`.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";

const require = createRequire(import.meta.url);
const { palette } = require("@davideimola/brand/tokens.json").color;

const ROOT = join(process.cwd(), "public/images/blog");
const FONTS = ["IBMPlexMono-Regular.ttf", "IBMPlexMono-Medium.ttf"].map((f) =>
  join(process.cwd(), "public/fonts", f)
);
const WIDTH = 1600;
let written = 0;

for (const slug of readdirSync(ROOT)) {
  const figures = join(ROOT, slug, "figures");
  if (!existsSync(figures)) continue;
  for (const file of readdirSync(figures)) {
    if (!file.endsWith(".svg") || file.endsWith("-dark.svg")) continue;
    const svg = readFileSync(join(figures, file), "utf8");
    const png = new Resvg(svg, {
      background: palette.paper,
      fitTo: { mode: "width", value: WIDTH },
      font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "IBM Plex Mono" },
    })
      .render()
      .asPng();
    writeFileSync(join(figures, file.replace(/\.svg$/, ".png")), png);
    written++;
  }
}

console.log(`figures:png wrote ${written} figure renders`);
