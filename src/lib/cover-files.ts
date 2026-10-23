// Reads a drawing (a post's SVG cover, or a figure in a post body) and its
// night twin from public/ and prepares both to draw themselves with the
// brand's prepareDrawSvg (@davideimola/brand/draw). Server only: it reads the
// filesystem.
import { readFileSync } from "node:fs";
import path from "node:path";
import { prepareDrawSvg } from "@davideimola/brand/draw";
import tokens from "@davideimola/brand/tokens.json";
import { darkCover } from "./covers";
import { isFigurePath } from "./figures";

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

function prepare(light: string, darkPath: string | null): DrawableCover {
  const dark = darkPath ? read(darkPath) : null;
  return {
    light: prepareDrawSvg(light, ACCENTS, palette.paper),
    dark: dark ? prepareDrawSvg(dark, ACCENTS, palette.night) : null,
  };
}

// A raster cover, or a missing file, returns null and the page falls back to
// the plain PostCover.
export function loadDrawableCover(heroImage: string): DrawableCover | null {
  if (!/\.svg(\?.*)?$/i.test(heroImage)) return null;
  const light = read(heroImage);
  return light ? prepare(light, darkCover(heroImage)) : null;
}

// A figure is named by the post that carries it, so a wrong path, a missing
// file or a missing night twin breaks the build instead of leaving a hole in
// the post.
export function loadFigure(src: string): DrawableCover {
  if (!isFigurePath(src)) {
    throw new Error(`DrawnFigure: "${src}" is not /images/blog/<slug>/figures/<name>.svg`);
  }
  const light = read(src);
  if (!light) throw new Error(`DrawnFigure: no file at public${src}`);
  const figure = prepare(light, darkCover(src));
  if (!figure.dark) throw new Error(`DrawnFigure: ${src} has no night twin, run pnpm covers:dark`);
  return figure;
}
