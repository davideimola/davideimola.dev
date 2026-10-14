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
} from "./brand-geometry";

// The mark and the wordmark, drawn inline. Strokes take currentColor so they
// follow the theme (ink on paper, chalk on night); the knots always take the
// accent token, which the brand lifts to akane-night on dark grounds. The red
// is the knot's and nobody else's, so these are the only components that may
// paint `fill-accent` outside the Marker.

interface MarkProps {
  /** S below 40px, M from 40 to 95px, L from 96px (docs/brand.md, "Three cuts"). */
  cut?: MarkCut;
  /** Rendered size in px (the mark is square). */
  size?: number;
  /** Accessible name. Omit when the mark sits next to text that names it. */
  title?: string;
  /**
   * Tone-on-tone watermark: the knot drops to the strokes' colour too. Only for
   * social cards, where the mark must never outshout the title.
   */
  tonal?: boolean;
  /**
   * Trace the graph and tie the knot last, once, as it mounts (globals.css,
   * "The mark draws itself"). For the NavBar on the first load of the home.
   */
  draw?: boolean;
  className?: string;
}

export function Mark({
  cut = "s",
  size = 32,
  title,
  tonal = false,
  draw = false,
  className = "",
}: MarkProps) {
  const g = MARK_CUTS[cut];
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
  // A stroke that draws needs a pathLength of 1 for its dash to run 0 to 1.
  const trace = draw ? { pathLength: 1, "data-trace": "" } : {};
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: titled when `title` is passed, aria-hidden otherwise (see a11y)
    <svg
      viewBox={MARK_VIEWBOX}
      width={size}
      height={size}
      className={`shrink-0 ${draw ? "mark-draw" : ""} ${className}`}
      {...a11y}
    >
      {title && <title>{title}</title>}
      <g fill="none" stroke="currentColor" strokeWidth={g.stroke} strokeLinecap="round">
        <path d={g.i} {...trace} />
        <path d={g.stem} {...trace} />
        <circle cx={g.bowl.cx} cy={g.bowl.cy} r={g.bowl.r} {...trace} />
        {g.tail && <path d={g.tail.d} strokeWidth={g.tail.width} {...trace} />}
      </g>
      {/* The knot animates on a wrapper: a CSS transform on the rect itself
          would replace its rotate() attribute. */}
      <g {...(draw ? { "data-knot": "" } : {})}>
        <rect
          x={g.knot.x}
          y={g.knot.y}
          width={g.knot.w}
          height={g.knot.h}
          rx={g.knot.rx}
          transform={`rotate(${g.knot.rotate})`}
          className={tonal ? "fill-current" : "fill-accent"}
        />
      </g>
    </svg>
  );
}

interface WordmarkProps {
  /** `bold` for nav bars and anything small, `regular` from about 300px wide. */
  weight?: WordmarkWeight;
  /** Rendered width in px; the height follows the drawing's proportions. */
  width?: number;
  title?: string;
  /**
   * The two knots on the i's land one after the other, right after a drawing
   * Mark ties its own: the name answering the mark. Pair with `Mark draw`.
   */
  echo?: boolean;
  className?: string;
}

export function Wordmark({
  weight = "bold",
  width = 160,
  title,
  echo = false,
  className = "",
}: WordmarkProps) {
  const viewBox = WORDMARK_VIEWBOX[weight];
  const [, , vw, vh] = viewBox.split(" ").map(Number);
  const height = Math.round((width * vh) / vw);
  const a11y = title ? { role: "img", "aria-label": title } : { "aria-hidden": true as const };
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: titled when `title` is passed, aria-hidden otherwise (see a11y)
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={`shrink-0 ${echo ? "wordmark-echo" : ""} ${className}`}
      {...a11y}
    >
      {title && <title>{title}</title>}
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth={WORDMARK_STROKE[weight]}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {WORDMARK_STROKES.map((s) =>
          "circle" in s ? (
            <circle key={`c${s.circle.cx}`} cx={s.circle.cx} cy={s.circle.cy} r={s.circle.r} />
          ) : (
            <path key={s.d} d={s.d} />
          )
        )}
      </g>
      <g className="fill-accent" transform={`translate(0 ${WORDMARK_KNOT_LIFT[weight]})`}>
        {WORDMARK_KNOTS.map((k) => (
          // Wrapped so the animation's transform leaves the rect's rotate() alone.
          <g key={k.x} {...(echo ? { "data-echo": "" } : {})}>
            <rect
              x={k.x}
              y={k.y}
              width={k.w}
              height={k.h}
              rx={k.rx}
              transform={`rotate(${k.rotate})`}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
