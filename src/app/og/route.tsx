import { OgCard, ogImageResponse, ogTitleSize } from "../../lib/og";

export const runtime = "nodejs";

// The social card for every page: /og?title=…&category=…&path=…
// A tape with the content type, the title large, the wordmark and the URL at
// the bottom (docs/brand.md, "Social cards"). Pages build the URL through
// ogImageUrl() in src/lib/og-url.ts.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Davide Imola";
  const category = searchParams.get("category");
  const pathParam = searchParams.get("path");
  const url = `davideimola.dev${pathParam?.startsWith("/") ? pathParam : ""}`;

  return ogImageResponse(
    <OgCard tape={category} url={url}>
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
    </OgCard>
  );
}
