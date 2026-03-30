import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: "#C91F37",
        }}
      />
      <span
        style={{
          fontSize: "52px",
          fontWeight: 700,
          lineHeight: 1,
          display: "flex",
        }}
      >
        <span style={{ color: "#C91F37" }}>~/</span>
        <span style={{ color: "#EAE5DF" }}>DI</span>
      </span>
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
