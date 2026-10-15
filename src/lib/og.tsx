// Shared pieces for every ImageResponse route (OG cards, social covers):
// the brand's fonts as TTF files, the light palette, and satori-friendly
// versions of the tape, the mark and the wordmark. Satori takes inline styles
// and explicit SVG attributes only, so these cannot reuse the site's
// Tailwind components; the geometry still comes from the one shared module.
//
// Social cards are always light (docs/brand.md, "Social cards"): light ground,
// a tape with the content type, the title large, the wordmark and the URL at
// the bottom, and at most a tone-on-tone mark as a watermark.
import { readFile } from "node:fs/promises";
import path from "node:path";
import tokens from "@davideimola/brand/tokens.json";
import type { ReactNode } from "react";
import {
  MARK_CUTS,
  MARK_VIEWBOX,
  type MarkCut,
  WORDMARK_KNOT_LIFT,
  WORDMARK_KNOTS,
  WORDMARK_STROKE,
  WORDMARK_STROKES,
  WORDMARK_VIEWBOX,
  type WordmarkWeight,
} from "../components/ui/brand-geometry";

export const OG_COLORS = {
  ...tokens.color.light,
  akane: tokens.color.palette.akane,
} as const;

type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700;
  style: "normal";
};

let fontCache: OgFont[] | null = null;

async function loadFont(filename: string): Promise<ArrayBuffer> {
  const data = await readFile(path.join(process.cwd(), "public", "fonts", filename));
  return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) as ArrayBuffer;
}

/** The brand's three families, static TTFs from google/fonts (OFL), cached per instance. */
export async function loadOgFonts(): Promise<OgFont[]> {
  if (!fontCache) {
    const [sans, sansBold, mono, label] = await Promise.all([
      loadFont("SchibstedGrotesk-Regular.ttf"),
      loadFont("SchibstedGrotesk-Bold.ttf"),
      loadFont("IBMPlexMono-Regular.ttf"),
      loadFont("BarlowCondensed-Bold.ttf"),
    ]);
    fontCache = [
      { name: "Schibsted Grotesk", data: sans, weight: 400, style: "normal" },
      { name: "Schibsted Grotesk", data: sansBold, weight: 700, style: "normal" },
      { name: "IBM Plex Mono", data: mono, weight: 400, style: "normal" },
      { name: "Barlow Condensed", data: label, weight: 700, style: "normal" },
    ];
  }
  return fontCache;
}

/** Flat ink tape with paper letters, slightly tilted. Never red. */
export function OgTape({ children, fontSize = 20 }: { children: ReactNode; fontSize?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignSelf: "flex-start",
        transform: "rotate(-1deg)",
        background: OG_COLORS["tape-bg"],
        color: OG_COLORS["tape-fg"],
        borderRadius: "3px",
        padding: `${Math.round(fontSize * 0.27)}px ${Math.round(fontSize * 0.67)}px`,
        fontFamily: "Barlow Condensed",
        fontWeight: 700,
        fontSize: `${fontSize}px`,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        lineHeight: 1,
      }}
    >
      {children}
    </div>
  );
}

/** The mark. `tonal` paints the knot in the strokes' colour, for watermarks only. */
export function OgMark({
  cut = "l",
  size,
  color = OG_COLORS.fg,
  tonal = false,
}: {
  cut?: MarkCut;
  size: number;
  color?: string;
  tonal?: boolean;
}) {
  const g = MARK_CUTS[cut];
  return (
    <svg viewBox={MARK_VIEWBOX} width={size} height={size} aria-hidden="true">
      <path d={g.i} fill="none" stroke={color} strokeWidth={g.stroke} strokeLinecap="round" />
      <path d={g.stem} fill="none" stroke={color} strokeWidth={g.stroke} strokeLinecap="round" />
      <circle
        cx={g.bowl.cx}
        cy={g.bowl.cy}
        r={g.bowl.r}
        fill="none"
        stroke={color}
        strokeWidth={g.stroke}
      />
      {g.tail && (
        <path
          d={g.tail.d}
          fill="none"
          stroke={color}
          strokeWidth={g.tail.width}
          strokeLinecap="round"
        />
      )}
      <rect
        x={g.knot.x}
        y={g.knot.y}
        width={g.knot.w}
        height={g.knot.h}
        rx={g.knot.rx}
        transform={`rotate(${g.knot.rotate})`}
        fill={tonal ? color : OG_COLORS.akane}
      />
    </svg>
  );
}

/** The wordmark, drawn from the brand geometry: never typeset. */
export function OgWordmark({
  width,
  weight = "regular",
  color = OG_COLORS.fg,
}: {
  width: number;
  weight?: WordmarkWeight;
  color?: string;
}) {
  const viewBox = WORDMARK_VIEWBOX[weight];
  const [, , vw, vh] = viewBox.split(" ").map(Number);
  const stroke = WORDMARK_STROKE[weight];
  const lift = WORDMARK_KNOT_LIFT[weight];
  return (
    <svg viewBox={viewBox} width={width} height={Math.round((width * vh) / vw)} aria-hidden="true">
      {WORDMARK_STROKES.map((s) =>
        "circle" in s ? (
          <circle
            key={`c${s.circle.cx}`}
            cx={s.circle.cx}
            cy={s.circle.cy}
            r={s.circle.r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
          />
        ) : (
          <path
            key={s.d}
            d={s.d}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      )}
      <g transform={`translate(0 ${lift})`}>
        {WORDMARK_KNOTS.map((k) => (
          <rect
            key={k.x}
            x={k.x}
            y={k.y}
            width={k.w}
            height={k.h}
            rx={k.rx}
            transform={`rotate(${k.rotate})`}
            fill={OG_COLORS.akane}
          />
        ))}
      </g>
    </svg>
  );
}

// The marker's stroke (components/ui/Marker.tsx) as a filled outline. The
// renderer breaks the site's turbulence filter into dashes, so the roughness is
// drawn into the edges instead: the same curve, 16 units thick, both edges
// jittered by a fixed seed so every render is identical.
function markerOutline(): string {
  let seed = 11;
  const jitter = () => {
    seed = (seed * 16807) % 2147483647;
    return ((seed / 2147483647) * 2 - 1) * 1.6;
  };
  // M10 18 C110 8 270 8 370 13, sampled.
  const at = (t: number) => {
    const u = 1 - t;
    return {
      x: u ** 3 * 10 + 3 * u * u * t * 110 + 3 * u * t * t * 270 + t ** 3 * 370,
      y: u ** 3 * 18 + 3 * u * u * t * 8 + 3 * u * t * t * 8 + t ** 3 * 13,
    };
  };
  const steps = 36;
  const top: string[] = [];
  const bottom: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const p = at(i / steps);
    top.push(`${p.x.toFixed(1)} ${(p.y - 8 + jitter()).toFixed(1)}`);
    bottom.push(`${p.x.toFixed(1)} ${(p.y + 8 + jitter()).toFixed(1)}`);
  }
  bottom.reverse();
  return `M${top.join(" L")} A8 8 0 0 1 ${bottom[0]} L${bottom.join(" L")} A8 8 0 0 1 ${top[0]} Z`;
}

const MARKER_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 34" preserveAspectRatio="none"><path d="${markerOutline()}" fill="${OG_COLORS.akane}"/></svg>`
);

/**
 * The marker under one word. Skip-ink: the word wears a halo in the ground
 * colour, so the letters cut through the red. One per image, like one per page.
 */
export function OgMarker({ children, fontSize }: { children: ReactNode; fontSize: number }) {
  const halo = Math.max(1, Math.round(fontSize * 0.06));
  const shadow = [
    [halo, 0],
    [-halo, 0],
    [0, halo],
    [0, -halo],
    [halo, halo],
    [-halo, halo],
    [halo, -halo],
    [-halo, -halo],
  ]
    .map(([x, y]) => `${x}px ${y}px 0 ${OG_COLORS.bg}`)
    .join(", ");
  return (
    <div style={{ display: "flex", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          left: `${-0.08 * fontSize}px`,
          right: `${-0.08 * fontSize}px`,
          bottom: `${-0.2 * fontSize}px`,
          height: `${0.42 * fontSize}px`,
          backgroundImage: `url("data:image/svg+xml,${MARKER_SVG}")`,
          backgroundSize: "100% 100%",
        }}
      />
      <div style={{ display: "flex", textShadow: shadow }}>{children}</div>
    </div>
  );
}

/** Title size for a 1200px card: long titles step down so they stay on three lines. */
export function ogTitleSize(title: string): number {
  if (title.length > 70) return 52;
  if (title.length > 45) return 60;
  return 68;
}
