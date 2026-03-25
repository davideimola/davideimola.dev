import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

// Module-level cache — fonts are loaded once per server instance
let fontBoldCache: ArrayBuffer | null = null;
let fontRegularCache: ArrayBuffer | null = null;

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const fontPath = path.join(process.cwd(), "public", "fonts", filename);
  const data = await readFile(fontPath);
  return data.buffer as ArrayBuffer;
}

async function getFonts(): Promise<[ArrayBuffer, ArrayBuffer]> {
  if (!fontBoldCache || !fontRegularCache) {
    [fontBoldCache, fontRegularCache] = await Promise.all([
      loadFont("JetBrainsMono-Bold.ttf"),
      loadFont("JetBrainsMono-Regular.ttf"),
    ]);
  }
  return [fontBoldCache, fontRegularCache];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") ?? "Davide Imola";
  const category = searchParams.get("category");

  const [fontBold, fontRegular] = await getFonts();

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#080807",
        display: "flex",
        flexDirection: "column",
        padding: "72px 80px",
        fontFamily: "'JetBrains Mono'",
        position: "relative",
      }}
    >
      {/* Dot grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(201,31,55,0.12) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          opacity: 0.6,
        }}
      />

      {/* Accent top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#C91F37",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Terminal path */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
            <span style={{ color: "#C91F37" }}>~</span>
            <span style={{ color: "#7E7874" }}>/davideimola</span>
            {category && (
              <span style={{ color: "#7E7874" }}>
                /<span style={{ color: "#9A948E" }}>{category.toLowerCase()}</span>
              </span>
            )}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          <h1
            style={{
              color: "#EAE5DF",
              fontSize: title.length > 50 ? "44px" : title.length > 30 ? "52px" : "64px",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              margin: 0,
              maxWidth: "900px",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ color: "#9A948E", fontSize: "16px" }}>Davide Imola</span>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#C91F37", fontSize: "12px" }}>//</span>
            <span style={{ color: "#7E7874", fontSize: "14px" }}>
              Tech Lead · Speaker · Open Source
            </span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "JetBrains Mono", data: fontBold, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: fontRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
