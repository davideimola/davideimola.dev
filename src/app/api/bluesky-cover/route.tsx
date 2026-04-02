import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";

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

// 1500×500 — ratio 3:1 Bluesky, stesso stile della LinkedIn cover
export async function GET() {
  const [fontBold, fontRegular] = await getFonts();

  return new ImageResponse(
    <div
      style={{
        width: "1500px",
        height: "500px",
        background: "#080807",
        display: "flex",
        fontFamily: "'JetBrains Mono'",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(201,31,55,0.12) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.5,
        }}
      />

      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "2px",
          background: "#C91F37",
        }}
      />

      {/* ~/davideimola — top left */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "40px",
          display: "flex",
          alignItems: "center",
          fontSize: "26px",
          letterSpacing: "0.01em",
        }}
      >
        <span style={{ color: "#C91F37" }}>~/</span>
        <span style={{ color: "#9A948E" }}>davideimola</span>
      </div>

      {/* Contenuto principale — right-aligned */}
      <div
        style={{
          position: "absolute",
          left: "200px",
          top: "0",
          bottom: "0",
          right: "48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        {/* ❯ whoami */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "12px",
          }}
        >
          <span style={{ color: "#C91F37", fontSize: "16px", marginRight: "8px" }}>❯</span>
          <span style={{ color: "#9A948E", fontSize: "16px", letterSpacing: "0.04em" }}>
            whoami
          </span>
        </div>

        {/* Nome */}
        <div
          style={{
            color: "#EAE5DF",
            fontSize: "104px",
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            marginBottom: "16px",
          }}
        >
          Davide Imola
        </div>

        {/* Ruolo + # Schrodinger Hat sulla stessa riga */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
          }}
        >
          <span
            style={{
              color: "#9A948E",
              fontSize: "20px",
              letterSpacing: "0.04em",
            }}
          >
            Tech Lead · Speaker · Open Source
          </span>
          <div
            style={{
              width: "1px",
              height: "14px",
              background: "rgba(201,31,55,0.4)",
            }}
          />
          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ color: "#C91F37", fontSize: "16px", marginRight: "4px" }}>#</span>
            <span style={{ color: "#EAE5DF", fontSize: "16px", letterSpacing: "0.04em" }}>
              Schrodinger Hat
            </span>
          </div>
        </div>
      </div>

      {/* Corner accent — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "32px",
          right: "40px",
          width: "32px",
          height: "32px",
          borderBottom: "2px solid #C91F37",
          borderRight: "2px solid #C91F37",
        }}
      />
    </div>,
    {
      width: 1500,
      height: 500,
      fonts: [
        { name: "JetBrains Mono", data: fontBold, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: fontRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
