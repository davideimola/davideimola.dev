// Reads a post's SVG cover and its night twin from public/ and prepares both
// to draw themselves (src/lib/cover-draw.ts). Server only: it reads the
// filesystem. A raster cover, or a missing file, returns null and the page
// falls back to the plain PostCover.
import { readFileSync } from "node:fs";
import path from "node:path";
import tokens from "@davideimola/brand/tokens.json";
import { prepareCoverSvg } from "./cover-draw";
import { darkCover } from "./covers";

const { palette } = tokens.color;
const ACCENTS = [palette.akane, palette["akane-night"]];

export interface DrawableCover {
  light: string;
  dark: string | null;
}

function read(publicPath: string): string | null {
  try {
    return readFileSync(path.join(process.cwd(), "public", publicPath.split("?")[0]), "utf8");
  } catch {
    return null;
  }
}

export function loadDrawableCover(heroImage: string): DrawableCover | null {
  if (!/\.svg(\?.*)?$/i.test(heroImage)) return null;
  const light = read(heroImage);
  if (!light) return null;
  const darkPath = darkCover(heroImage);
  const dark = darkPath ? read(darkPath) : null;
  return {
    light: prepareCoverSvg(light, ACCENTS, palette.paper),
    dark: dark ? prepareCoverSvg(dark, ACCENTS, palette.night) : null,
  };
}
