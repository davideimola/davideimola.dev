// Rasterize the brand SVGs in public/brand/ to PNG at distribution sizes.
// Run with: pnpm brand:png (requires the SVGs from scripts/generate-brand.py)
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const repo = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dir = path.join(repo, "public", "brand");

// [source svg, [output name, target width in px][]]
const jobs = [
  [
    "mark.svg",
    [
      ["mark-512.png", 512],
      ["mark-1024.png", 1024],
    ],
  ],
  [
    "mark-light.svg",
    [
      ["mark-light-512.png", 512],
      ["mark-light-1024.png", 1024],
    ],
  ],
  ["wordmark.svg", [["wordmark-1200.png", 1200]]],
  ["wordmark-dark.svg", [["wordmark-dark-1200.png", 1200]]],
  ["domain.svg", [["domain-1200.png", 1200]]],
  ["domain-dark.svg", [["domain-dark-1200.png", 1200]]],
];

for (const [src, outputs] of jobs) {
  const svgPath = path.join(dir, src);
  const svg = await readFile(svgPath, "utf8");
  const viewBoxWidth = Number(svg.match(/viewBox="0 0 ([\d.]+)/)?.[1]);
  for (const [out, width] of outputs) {
    // Oversample the SVG rasterization so the resize never upscales
    const density = Math.ceil((72 * width) / viewBoxWidth) + 1;
    await sharp(svgPath, { density }).resize({ width }).png().toFile(path.join(dir, out));
    console.log(`${out} (${width}px)`);
  }
}
