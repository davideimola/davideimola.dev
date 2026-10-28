import { OG_COLORS, OgCard, OgMarker, ogImageResponse } from "../../../lib/og";

export const runtime = "nodejs";

const TITLE_SIZE = 58;

// The card of the home page and of every page that sets none of its own. The
// home hero says who this is through the line, so the card does too: the line
// with its marker on "security", the lead under it, the name in the tape.
export async function GET() {
  return ogImageResponse(
    <OgCard tape="Davide Imola" url="davideimola.dev">
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            columnGap: `${Math.round(TITLE_SIZE * 0.24)}px`,
            fontSize: `${TITLE_SIZE}px`,
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: "-0.045em",
            maxWidth: "980px",
          }}
        >
          {"I build AI agents for".split(" ").map((w) => (
            <span key={w}>{w}</span>
          ))}
          <OgMarker fontSize={TITLE_SIZE}>security,</OgMarker>
          {"and the tools I need along the way.".split(" ").map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: "26px", color: OG_COLORS["fg-muted"] }}>
          Tech Lead at RedCarbon. I write mostly Go, and I share everything I learn.
        </div>
      </div>
    </OgCard>
  );
}
