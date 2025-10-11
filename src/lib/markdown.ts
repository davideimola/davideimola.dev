import gfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(gfm) // GitHub Flavored Markdown
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML
    .use(rehypePrism, {
      // Add syntax highlighting
      ignoreMissing: true,
      showLineNumbers: true,
    })
    .use(rehypeStringify, { allowDangerousHtml: true }) // Stringify
    .process(markdown);

  return result.toString();
}
