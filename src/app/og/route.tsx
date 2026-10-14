import { ImageResponse } from "next/og";
import { loadOgFonts, OG_COLORS, OgMark, OgTape, OgWordmark, ogTitleSize } from "../../lib/og";

export const runtime = "nodejs";

// The social card for every page: /og?title=…&category=…&path=…
// Light ground, a tape with the content type, the title large, the wordmark
// and the URL at the bottom, a tone-on-tone mark as the only decoration
// (docs/brand.md, "Social cards").
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Davide Imola";
  const category = searchParams.get("category");
  const pathParam = searchParams.get("path");
  const url = `davideimola.dev${pathParam?.startsWith("/") ? pathParam : ""}`;

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
      {/* Tone-on-tone watermark: the knot too, so the title stays the loudest thing */}
      <div style={{ position: "absolute", top: "36px", right: "40px", display: "flex" }}>
        <OgMark cut="l" size={220} color={OG_COLORS.border} tonal />
      </div>

      <div style={{ display: "flex", minHeight: "34px" }}>
        {category && <OgTape>{category}</OgTape>}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: `${ogTitleSize(title)}px`,
          fontWeight: 700,
          lineHeight: 1.02,
          letterSpacing: "-0.045em",
          maxWidth: "920px",
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <OgWordmark width={290} />
        <span
          style={{ fontFamily: "IBM Plex Mono", fontSize: "18px", color: OG_COLORS["fg-subtle"] }}
        >
          {url}
        </span>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: await loadOgFonts() }
  );
}
