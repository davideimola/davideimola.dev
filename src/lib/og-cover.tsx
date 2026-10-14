import { OG_COLORS, OgMark, OgWordmark } from "./og";

// The profile banner shared by the LinkedIn and Bluesky covers. Both platforms
// lay the profile photo over the bottom-left corner, so everything sits on the
// right. Light ground, the lockup, the short line, the URL.
export function ProfileCover({ width, height }: { width: number; height: number }) {
  const scale = height / 500;
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
        <div style={{ display: "flex", alignItems: "center", gap: `${Math.round(28 * scale)}px` }}>
          <OgMark cut="l" size={Math.round(150 * scale)} />
          <OgWordmark width={Math.round(560 * scale)} />
        </div>
        <div
          style={{
            display: "flex",
            marginTop: `${Math.round(30 * scale)}px`,
            fontSize: `${Math.round(30 * scale)}px`,
            color: OG_COLORS["fg-muted"],
            letterSpacing: "-0.01em",
          }}
        >
          Builder. AI agents for security, mostly in Go. Learning in public.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: `${Math.round(14 * scale)}px`,
            fontFamily: "IBM Plex Mono",
            fontSize: `${Math.round(22 * scale)}px`,
            color: OG_COLORS["fg-subtle"],
          }}
        >
          davideimola.dev
        </div>
      </div>
    </div>
  );
}
