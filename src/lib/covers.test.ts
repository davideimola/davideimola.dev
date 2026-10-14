import { describe, expect, it } from "vitest";
import { rasterCover } from "./covers";

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
