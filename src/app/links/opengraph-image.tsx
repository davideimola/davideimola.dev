import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Davide Imola · Links";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ASCII portrait of Davide — generated from a frontal photo on white
// background (bg threshold mask, luminance → " .:-=+*#%@" ramp, 64 cols).
const ASCII_FACE = `
                      %*=::...:-=+%
                   #-..            :=#
                 %:    ..             .+
                 #.  .                  .*
                 -                        -
                +   .:-======--::--:..     +
               %. .=+++++++++========--.    #
               - :++++++++++++===+====---:. .
              %..=++++++++++++++=+++===---:  =
              #.:+++++++++++++++++++===---:  .
              *.-+++++**+++++++++++===---:-. .
              *.=*+++******++++++++++===--:: :
              +.++=------=+++*++++===-----:: +
             #::*=----::::-=+*+==-::......:: %
             *==*+=-:--.:--=+**+-:-----::..: :#
             #-+++==-==----=+**=:.-=..:..:::. *
             %=*++++++++==+++++-.:=++=-::--:.-
              =+++++++++++++++=-.:-=====+=--:%
             %-++++****+++++++=-.:=++====--:-
             %:=++++**+++++**+==:.-+*++==--.:
              -:=+++++=-=-:=*++-..-+*+++=-: +
              #:--=*=:..    :=:    :=++=-: .
               +-:=+==+=----==-:.  ..-=-.   .:-=*%
             %#-.:--=++++---=-----==-=-..         ..-=+#
          %*-.   ..:-=++-:     .--=-::..                 .:=#
      %+-..       . .:-------:.:-::.                         .:+
   #=:.           .=:   .:..::        ..
#-.                .++=:.         ..:-=:
.                   .=*##*+=======++++-
 .                    :=+*********+++-`;

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const fontPath = path.join(process.cwd(), "public", "fonts", filename);
  const data = await readFile(fontPath);
  return data.buffer as ArrayBuffer;
}

export default async function Image() {
  const [fontBold, fontRegular] = await Promise.all([
    loadFont("JetBrainsMono-Bold.ttf"),
    loadFont("JetBrainsMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "1200px",
        height: "630px",
        background: "#080807",
        display: "flex",
        alignItems: "center",
        padding: "48px 72px",
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

      {/* ASCII portrait */}
      <div
        style={{
          display: "flex",
          whiteSpace: "pre",
          fontSize: "14px",
          lineHeight: 1.16,
          color: "#B8B2AB",
          position: "relative",
          zIndex: 1,
        }}
      >
        {ASCII_FACE}
      </div>

      {/* Identity */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginLeft: "56px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "22px" }}>
          <span style={{ color: "#C91F37" }}>❯</span>
          <span style={{ color: "#7E7874" }}>whoami</span>
        </div>
        <div
          style={{
            display: "flex",
            color: "#EAE5DF",
            fontSize: "60px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginTop: "28px",
          }}
        >
          Davide Imola
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#9A948E",
            fontSize: "21px",
            lineHeight: 1.6,
            marginTop: "20px",
          }}
        >
          <span>Tech Lead @ RedCarbon</span>
          <span>Co-founder @ Schrödinger Hat</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "22px",
            marginTop: "56px",
          }}
        >
          <span style={{ color: "#C91F37" }}>❯</span>
          <span style={{ color: "#7E7874" }}>links.davideimola.dev</span>
          <div style={{ width: "11px", height: "24px", background: "#C91F37" }} />
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "JetBrains Mono", data: fontBold, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: fontRegular, weight: 400, style: "normal" },
      ],
    }
  );
}
