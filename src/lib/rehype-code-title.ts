interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  data?: { meta?: string | null };
  children?: HastNode[];
}

const TITLE_PATTERN = /title="([^"]*)"/;

/**
 * Copies `title="…"` from a fenced code block's meta string onto the `<code>`
 * element as `data-title`, so `CodeBlock` can read it as a prop. MDX drops the
 * meta string before rendering, which is why this has to happen in rehype.
 *
 * Keeping the title in the fence (```console title="~/repo") instead of in a
 * JSX component keeps the post plain Markdown for `/blog/<slug>.md`,
 * `llms-full.txt` and the newsletter email.
 */
export function rehypeCodeTitle() {
  return (tree: HastNode) => {
    const visit = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "code") {
        const title = node.data?.meta?.match(TITLE_PATTERN)?.[1];
        if (title) node.properties = { ...node.properties, dataTitle: title };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
