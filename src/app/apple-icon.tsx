import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// The brand mark: "di" + red bar cursor — the hero typing animation's
// end state. Mirrors public/brand/mark.svg (see docs/brand.md).
export default async function AppleIcon() {
  const fontPath = path.join(process.cwd(), "public", "fonts", "JetBrainsMono-Bold.ttf");
  const fontData = await readFile(fontPath);

  return new ImageResponse(
    <div
      style={{
        width: 180,
        height: 180,
        background: "#080807",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'JetBrains Mono'",
      }}
    >
      <span
        style={{
          color: "#EAE5DF",
          fontSize: "96px",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        di
      </span>
      <div
        style={{
          width: "17px",
          height: "84px",
          background: "#C91F37",
          marginLeft: "11px",
        }}
      />
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "JetBrains Mono",
          data: fontData.buffer as ArrayBuffer,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
