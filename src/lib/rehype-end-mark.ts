interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

const endMark = (): HastNode => ({
  type: "element",
  tagName: "span",
  properties: { className: ["end-mark"], ariaHidden: "true" },
  children: [],
});

const isFootnotes = (node: HastNode) =>
  node.tagName === "section" && node.properties?.dataFootnotes !== undefined;

/**
 * Ends a post the way a magazine ends a piece: with a small mark after the
 * last word, here the brand's red knot (`.end-mark` in globals.css). It goes
 * inside the last paragraph of the body, before the footnotes; when the body
 * ends on something else (a list, a code block) it gets a line of its own.
 *
 * Done in rehype, not in the MDX, so the post stays plain Markdown for
 * `/blog/<slug>.md`, `llms-full.txt` and the newsletter email.
 */
export function rehypeEndMark() {
  return (tree: HastNode) => {
    const children = tree.children ?? [];
    let index = children.length - 1;
    while (index >= 0 && (children[index].type !== "element" || isFootnotes(children[index]))) {
      index--;
    }
    if (index < 0) return;

    const last = children[index];
    if (last.tagName === "p") {
      last.children = [...(last.children ?? []), endMark()];
      return;
    }
    children.splice(index + 1, 0, {
      type: "element",
      tagName: "p",
      properties: { className: ["end-mark-line"] },
      children: [endMark()],
    });
  };
}
