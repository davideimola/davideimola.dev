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

  for (const slug of readdirSync(blog).filter((s) => existsSync(join(blog, s, "cover.svg")))) {
    it(`${slug}: light cover uses only the brand inks, with a matching dark twin`, () => {
      const cover = readFileSync(join(blog, slug, "cover.svg"), "utf8");
      for (const c of colours(cover)) expect(light).toContain(c);
      expect(existsSync(join(blog, slug, "cover-dark.svg")), "run pnpm covers:dark").toBe(true);
      const twin = readFileSync(join(blog, slug, "cover-dark.svg"), "utf8");
      for (const c of colours(twin)) expect(dark).toContain(c);
    });
  }
});
