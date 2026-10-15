import { OG_COLORS, OgMark, OgMarker } from "./og";

// The profile banner shared by the LinkedIn and Bluesky covers. Both platforms
// lay the profile photo over the bottom-left corner, so everything sits on the
// right. The name is already printed under the banner, so the banner says what
// the headline cannot: the line, with the marker on the word that matters, then
// the S mark and the URL as the signature.
export function ProfileCover({ width, height }: { width: number; height: number }) {
  const scale = height / 500;
  const titleSize = Math.round(62 * scale);
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        background: OG_COLORS.bg,
        color: OG_COLORS.fg,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: `0 ${Math.round(96 * scale)}px`,
        fontFamily: "Schibsted Grotesk",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
        <div
          style={{
            display: "flex",
            fontSize: `${titleSize}px`,
            fontWeight: 700,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
          }}
        >
          <span>I build AI agents for&nbsp;</span>
          <OgMarker fontSize={titleSize}>cybersecurity</OgMarker>
          <span>.</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: `${Math.round(22 * scale)}px`,
            fontSize: `${Math.round(30 * scale)}px`,
            color: OG_COLORS["fg-muted"],
            letterSpacing: "-0.01em",
          }}
        >
          Mostly in Go. Everything I learn, I share.
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: `${Math.round(14 * scale)}px`,
            marginTop: `${Math.round(40 * scale)}px`,
            fontFamily: "IBM Plex Mono",
            fontSize: `${Math.round(22 * scale)}px`,
            color: OG_COLORS["fg-subtle"],
          }}
        >
          <OgMark cut="s" size={Math.round(44 * scale)} />
          davideimola.dev
        </div>
      </div>
    </div>
  );
}
