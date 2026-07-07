"""Generate outlined brand SVG assets from JetBrains Mono Bold.

Mark: "di" + red bar cursor (variant D — the hero typing animation's end state).
Wordmark: "davide imola" + cursor. Domain lockup: "davideimola" + red ".dev".
All text converted to paths so the assets have no font dependency.
"""

import os

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform
from fontTools.ttLib import TTFont

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(REPO, "public/fonts/JetBrainsMono-Bold.ttf")
OUT = os.path.join(REPO, "public/brand")

ACCENT = "#C91F37"
INK_LIGHT = "#EAE5DF"   # ink for dark surfaces
INK_DARK = "#1A1816"    # ink for light surfaces
BG_DARK = "#080807"
BG_LIGHT = "#F0EDE9"

font = TTFont(FONT)
upm = font["head"].unitsPerEm
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font["hmtx"]

ADV = hmtx[cmap[ord("d")]][0]  # monospace advance in font units
print(f"upm={upm} advance={ADV}")


def glyph_path(ch: str, x: float, baseline: float, fs: float) -> str:
    """Return SVG path data for `ch` at pen position (x, baseline), font-size fs."""
    gname = cmap[ord(ch)]
    spen = SVGPathPen(glyph_set)
    scale = fs / upm
    tpen = TransformPen(spen, Transform(scale, 0, 0, -scale, x, baseline))
    glyph_set[gname].draw(tpen)
    return spen.getCommands()


def text_path(text: str, x: float, baseline: float, fs: float) -> str:
    """Path data for a run of monospace text starting at x."""
    parts = []
    adv = ADV / upm * fs
    cx = x
    for ch in text:
        if ch != " ":
            parts.append(glyph_path(ch, cx, baseline, fs))
        cx += adv
    return " ".join(parts)


def text_ymax(text: str) -> float:
    """Tallest glyph top (font units, y-up) across a run."""
    top = 0.0
    for ch in text:
        if ch == " ":
            continue
        bpen = BoundsPen(glyph_set)
        glyph_set[cmap[ord(ch)]].draw(bpen)
        if bpen.bounds:
            top = max(top, bpen.bounds[3])
    return top


def svg(viewbox: str, body: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}">\n{body}\n</svg>\n'
    )


os.makedirs(OUT, exist_ok=True)

# ── Mark geometry (designed in a 64 box, scaled per asset) ──────────────────
# fs 22, "di" starts at x 15.8, baseline 39.5, cursor 3.8×19.2 at (44.6, 22.4)


def mark_body(scale: float, ink: str, accent: str = ACCENT) -> str:
    fs = 22 * scale
    d = text_path("di", 15.8 * scale, 39.5 * scale, fs)
    cur = (
        f'<rect fill="{accent}" x="{44.6 * scale:g}" y="{22.4 * scale:g}" '
        f'width="{3.8 * scale:g}" height="{19.2 * scale:g}"/>'
    )
    return f'  <path fill="{ink}" d="{d}"/>\n  {cur}'


def mark_tile(bg: str, ink: str) -> str:
    s = 8  # 512 box
    body = f'  <rect fill="{bg}" width="512" height="512"/>\n{mark_body(s, ink)}'
    return svg("0 0 512 512", body)


with open(os.path.join(OUT, "mark.svg"), "w") as f:
    f.write(mark_tile(BG_DARK, INK_LIGHT))
with open(os.path.join(OUT, "mark-light.svg"), "w") as f:
    f.write(mark_tile(BG_LIGHT, INK_DARK))
with open(os.path.join(OUT, "mark-mono.svg"), "w") as f:
    # single-color version: inherits `color` from the embedding context
    f.write(svg("0 0 512 512", mark_body(8, "currentColor", "currentColor")))

# ── Site favicon: tighter cut of the mark, with light-mode media query ──────
# The tile keeps air for circular avatar crops; the favicon is square and
# uncropped, so the mark fills ~80% of the width to stay legible at 16 px.
# Same geometry as the tile scaled by 34/22, centered in the 64 box.
icon = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <style>
    .bg  {{ fill: {BG_DARK}; }}
    .ink {{ fill: {INK_LIGHT}; }}
    @media (prefers-color-scheme: light) {{
      .bg  {{ fill: {BG_LIGHT}; }}
      .ink {{ fill: {INK_DARK}; }}
    }}
  </style>
  <rect class="bg" width="64" height="64"/>
  <path class="ink" d="{text_path('di', 6.8, 43.55, 34)}"/>
  <rect fill="{ACCENT}" x="51.3" y="17.15" width="5.9" height="29.7"/>
</svg>
"""
with open(os.path.join(REPO, "src/app/icon.svg"), "w") as f:
    f.write(icon)

# ── Wordmark: "davide imola" + cursor, transparent background ───────────────
FS = 100
adv = ADV / upm * FS


def lockup(text: str, ink: str, red_suffix: str = "", cursor: bool = False) -> str:
    pad = 4
    top = text_ymax(text + red_suffix) / upm * FS
    baseline = pad + top
    # cursor mirrors the hero: ~0.85em tall, slightly crossing the baseline
    cur_h = 0.86 * FS
    cur_top = baseline - 0.78 * FS
    height = max(baseline + 0.10 * FS, cur_top + cur_h) + pad
    x = pad
    parts = []
    parts.append(f'<path fill="{ink}" d="{text_path(text, x, baseline, FS)}"/>')
    x += adv * len(text)
    if red_suffix:
        parts.append(f'<path fill="{ACCENT}" d="{text_path(red_suffix, x, baseline, FS)}"/>')
        x += adv * len(red_suffix)
    if cursor:
        gap, w = 0.10 * FS, 0.14 * FS
        parts.append(
            f'<rect fill="{ACCENT}" x="{x + gap:g}" y="{cur_top:g}" '
            f'width="{w:g}" height="{cur_h:g}"/>'
        )
        x += gap + w
    width = x + pad
    body = "\n".join(f"  {p}" for p in parts)
    return svg(f"0 0 {width:g} {height:g}", body)


with open(os.path.join(OUT, "wordmark.svg"), "w") as f:
    f.write(lockup("davide imola", INK_LIGHT, cursor=True))
with open(os.path.join(OUT, "wordmark-dark.svg"), "w") as f:
    f.write(lockup("davide imola", INK_DARK, cursor=True))
with open(os.path.join(OUT, "domain.svg"), "w") as f:
    f.write(lockup("davideimola", INK_LIGHT, red_suffix=".dev"))
with open(os.path.join(OUT, "domain-dark.svg"), "w") as f:
    f.write(lockup("davideimola", INK_DARK, red_suffix=".dev"))

for name in sorted(os.listdir(OUT)):
    path = os.path.join(OUT, name)
    print(f"{name}: {os.path.getsize(path)} bytes")
print("icon.svg:", os.path.getsize(os.path.join(REPO, "src/app/icon.svg")), "bytes")
