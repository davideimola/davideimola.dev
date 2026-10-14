// Prepares a cover SVG (CLAUDE.md, "Blog covers") to draw itself: monoline ink
// strokes trace in, and the one red detail lands last. Pure and import-free,
// so it is tested on strings and safe anywhere.
//
// Each drawable element is tagged for the CSS in globals.css (`.cover-draw`):
//   data-draw    a stroked shape: gets pathLength="1" so its dash can run 0 to 1
//   data-fill    a shape filled with ink or red: fades in instead
//   data-accent  red, by its own colour or its group's: comes after the rest
// The background rect and the paper-coloured fills (they mask what is behind
// them) are left alone, so they are there from the first frame.

const SHAPES = new Set(["path", "circle", "ellipse", "rect", "line", "polyline", "polygon"]);

const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]?.toLowerCase();

export function prepareCoverSvg(svg: string, accents: string[], paper: string): string {
  const accent = new Set(accents.map((c) => c.toLowerCase()));
  const ground = paper.toLowerCase();
  // The stroke and fill a shape inherits from the <g> elements around it.
  const stack: { stroke?: string; fill?: string }[] = [];
  let backgroundSeen = false;

  return svg.replace(/<(\/?)([a-z]+)\b([^>]*?)(\/?)>/g, (tag, close, name, rest, selfClose) => {
    if (name === "g") {
      if (close) stack.pop();
      else if (!selfClose) stack.push({ stroke: attr(tag, "stroke"), fill: attr(tag, "fill") });
      return tag;
    }
    if (close || !SHAPES.has(name)) return tag;

    const inherited = (key: "stroke" | "fill") =>
      [...stack].reverse().find((g) => g[key] !== undefined)?.[key];
    const stroke = attr(tag, "stroke") ?? inherited("stroke");
    const fill = attr(tag, "fill") ?? inherited("fill");

    // The first full-bleed rect is the paper ground.
    if (name === "rect" && !backgroundSeen && !stroke) {
      backgroundSeen = true;
      return tag;
    }

    const marks: string[] = [];
    if (stroke && stroke !== "none") marks.push('pathLength="1" data-draw=""');
    if (fill && fill !== "none" && fill !== ground) marks.push('data-fill=""');
    if ((stroke && accent.has(stroke)) || (fill && accent.has(fill))) marks.push('data-accent=""');
    if (marks.length === 0) return tag;

    return `<${name}${rest} ${marks.join(" ")}${selfClose}>`;
  });
}
