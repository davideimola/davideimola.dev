// The URL of a social card served by /og. Every page builds it here, so the
// cache version lives in one place.
//
// Telegram, LinkedIn and the other unfurlers cache the card by its image URL,
// not by the page: a card redrawn under an unchanged URL keeps showing the old
// picture wherever it was fetched before. Bump OG_VERSION whenever the cards
// change look, and every page hands out a URL nobody has cached yet.
export const OG_VERSION = "2026-10";

/** The card's layout size. Every card is drawn on this grid and rasterised at OG_SCALE. */
export const OG_CARD = { width: 1200, height: 630 } as const;

// Unfurlers keep a downscaled, recompressed copy of the card and blow it up
// again on a Retina screen, which is where a 1200px card goes soft: the
// wordmark's thin strokes and the mono URL go first. Rasterising the same
// layout at twice the size gives them more to throw away.
export const OG_SCALE = 2;

/** The pixel size of every card as served, for the `og:image:width/height` tags. */
export const OG_SIZE = {
  width: OG_CARD.width * OG_SCALE,
  height: OG_CARD.height * OG_SCALE,
} as const;

/** The home card (/og/home): the line with its marker, for every page without a card of its own. */
export const HOME_OG_IMAGE = `https://davideimola.dev/og/home?v=${OG_VERSION}`;

export function ogImageUrl({
  title,
  category,
  path,
}: {
  title: string;
  category?: string;
  path?: string;
}): string {
  // URLSearchParams would write spaces as `+`, which some unfurlers re-encode
  // as a literal plus ("Davide+Imola" on the card): spell them %20 instead.
  const params = [
    `title=${encodeURIComponent(title)}`,
    category && `category=${encodeURIComponent(category)}`,
    path && `path=${encodeURIComponent(path)}`,
    `v=${OG_VERSION}`,
  ].filter(Boolean);
  return `https://davideimola.dev/og?${params.join("&")}`;
}
