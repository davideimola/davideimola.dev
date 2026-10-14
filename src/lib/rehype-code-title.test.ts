import { describe, expect, it } from "vitest";
import { rehypeCodeTitle } from "./rehype-code-title";

function codeNode(meta: string | null) {
  return {
    type: "element",
    tagName: "code",
    properties: { className: ["language-console"] } as Record<string, unknown>,
    data: { meta },
    children: [],
  };
}

function run(node: ReturnType<typeof codeNode>) {
  const tree = {
    type: "root",
    children: [{ type: "element", tagName: "pre", children: [node] }],
  };
  rehypeCodeTitle()(tree);
  return node.properties;
}

describe("rehypeCodeTitle", () => {
  it("copies title from the fence meta onto the code element", () => {
    expect(run(codeNode('title="~/blog-examples/adk"'))).toEqual({
      className: ["language-console"],
      dataTitle: "~/blog-examples/adk",
    });
  });

  it("leaves a fence without a title untouched", () => {
    expect(run(codeNode("{1,3}"))).toEqual({ className: ["language-console"] });
    expect(run(codeNode(null))).toEqual({ className: ["language-console"] });
  });
});
