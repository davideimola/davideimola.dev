// Post covers are SVG illustrations, each shipped with a PNG sibling at the
// same path (cover.svg, cover.png). Crawlers and social cards want a raster,
// so anything that hands a cover to a machine (JSON-LD, OG, feeds) goes
// through here.
export function rasterCover(heroImage: string): string {
  return heroImage.replace(/\.svg(\?.*)?$/i, ".png$1");
}
