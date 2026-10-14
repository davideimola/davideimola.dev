import { ImageResponse } from "next/og";
import { loadOgFonts, OG_COLORS, OgMark, OgTape, OgWordmark } from "../../lib/og";

export const runtime = "nodejs";
export const alt = "Davide Imola · Links";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The link-in-bio card, in the same anatomy as /og: tape, title, wordmark and
// URL on a light ground.
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: OG_COLORS.bg,
        color: OG_COLORS.fg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "56px 64px 44px",
        fontFamily: "Schibsted Grotesk",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: "36px", right: "40px", display: "flex" }}>
        <OgMark cut="l" size={220} color={OG_COLORS.border} tonal />
      </div>
      <div style={{ display: "flex" }}>
        <OgTape>Links</OgTape>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.045em",
            maxWidth: "900px",
          }}
        >
          Every place you can find me, in one page.
        </div>
        <div style={{ display: "flex", fontSize: "26px", color: OG_COLORS["fg-muted"] }}>
          Latest writing, upcoming talks, the newsletter and the shelf.
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <OgWordmark width={290} />
        <span
          style={{ fontFamily: "IBM Plex Mono", fontSize: "18px", color: OG_COLORS["fg-subtle"] }}
        >
          links.davideimola.dev
        </span>
      </div>
    </div>,
    { ...size, fonts: await loadOgFonts() }
  );
}
