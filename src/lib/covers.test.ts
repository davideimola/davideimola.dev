import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import brandTokens from "@davideimola/brand/tokens.json";
import { describe, expect, it } from "vitest";
import { darkCover, rasterCover } from "./covers";

describe("rasterCover", () => {
  it("points an SVG cover at its PNG sibling", () => {
    expect(rasterCover("/images/blog/x/cover.svg")).toBe("/images/blog/x/cover.png");
    expect(rasterCover("/images/blog/x/COVER.SVG")).toBe("/images/blog/x/COVER.png");
  });

  it("leaves raster covers alone", () => {
    expect(rasterCover("/images/blog/x/hero.webp")).toBe("/images/blog/x/hero.webp");
    expect(rasterCover("https://images.unsplash.com/photo?w=2")).toBe(
      "https://images.unsplash.com/photo?w=2"
    );
  });
});

describe("darkCover", () => {
  it("points an SVG cover at its night twin", () => {
    expect(darkCover("/images/blog/x/cover.svg")).toBe("/images/blog/x/cover-dark.svg");
  });

  it("has no twin for raster covers", () => {
    expect(darkCover("/images/blog/x/hero.webp")).toBeNull();
  });
});

describe.each(["blog", "pages"])("%s cover files", (dir) => {
  const blog = join(process.cwd(), "public/images", dir);
  const { palette } = brandTokens.color;
  const light = [palette.paper, palette.ink, palette.akane].map((c) => c.toUpperCase());
  const dark = [palette.night, palette.chalk, palette["akane-night"]].map((c) => c.toUpperCase());
  const colours = (svg: string) =>
    new Set((svg.match(/#[0-9a-f]{6}\b/gi) ?? []).map((c) => c.toUpperCase()));

  const drawings = readdirSync(blog).flatMap((slug) => {
    const covers = existsSync(join(blog, slug, "cover.svg")) ? [join(slug, "cover.svg")] : [];
    const dir = join(blog, slug, "figures");
    const figures = existsSync(dir)
      ? readdirSync(dir)
          .filter((f) => f.endsWith(".svg") && !f.endsWith("-dark.svg"))
          .map((f) => join(slug, "figures", f))
      : [];
    return [...covers, ...figures];
  });

  for (const file of drawings) {
    it(`${file}: uses only the brand inks, with a matching dark twin`, () => {
      const drawing = readFileSync(join(blog, file), "utf8");
      for (const c of colours(drawing)) expect(light).toContain(c);
      const twinPath = join(blog, file.replace(/\.svg$/, "-dark.svg"));
      expect(existsSync(twinPath), "run pnpm covers:dark").toBe(true);
      const twin = readFileSync(twinPath, "utf8");
      for (const c of colours(twin)) expect(dark).toContain(c);
    });
  }
});
