import { OG_COLORS, OG_SIZE, OgCard, ogImageResponse } from "../../lib/og";

export const runtime = "nodejs";
export const alt = "Davide Imola · Links";
export const size = OG_SIZE;
export const contentType = "image/png";

// The link-in-bio card, in the same anatomy as /og: tape, title, wordmark and
// URL on a light ground.
export default async function Image() {
  return ogImageResponse(
    <OgCard tape="Links" url="links.davideimola.dev">
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
    </OgCard>
  );
}
