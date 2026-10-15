import { describe, expect, it } from "vitest";
import { rehypeEndMark } from "./rehype-end-mark";

type Node = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: Node[];
  value?: string;
};

const text = (value: string): Node => ({ type: "text", value });
const el = (tagName: string, children: Node[] = [], properties = {}): Node => ({
  type: "element",
  tagName,
  properties,
  children,
});

function run(children: Node[]) {
  const tree: Node = { type: "root", children };
  rehypeEndMark()(tree);
  return tree.children ?? [];
}

const isMark = (node?: Node) =>
  node?.tagName === "span" &&
  (node.properties?.className as string[] | undefined)?.includes("end-mark");

describe("rehypeEndMark", () => {
  it("ends the last paragraph with the mark, after its last word", () => {
    const [, last] = run([el("p", [text("First.")]), text("\n"), el("p", [text("Last.")])]).filter(
      (n) => n.type === "element"
    );
    expect(last.children?.[0]).toEqual(text("Last."));
    expect(isMark(last.children?.[1])).toBe(true);
  });

  it("skips the footnotes and marks the body's last paragraph", () => {
    const children = run([
      el("p", [text("Body.")]),
      text("\n"),
      el("section", [el("ol")], { dataFootnotes: true }),
    ]);
    expect(isMark(children[0].children?.[1])).toBe(true);
    expect(children[2].children).toHaveLength(1);
  });

  it("gives the mark a line of its own when the body ends on a list", () => {
    const children = run([el("p", [text("Intro.")]), el("ul", [el("li", [text("one")])])]);
    expect(children).toHaveLength(3);
    expect(children[2].tagName).toBe("p");
    expect(isMark(children[2].children?.[0])).toBe(true);
    expect(isMark(children[0].children?.[1])).toBe(false);
  });

  it("leaves an empty body alone", () => {
    expect(run([text("\n")])).toEqual([text("\n")]);
  });
});
