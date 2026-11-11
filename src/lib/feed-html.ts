import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkGithubAlerts from "remark-github-alerts";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { postBodyMarkdown, SITE_URL } from "./llms";

// A post's body as HTML for `<content:encoded>` in the RSS feed, which feed
// readers read as HTML: the raw MDX showed up there as unformatted text.
// Links and images point at the site, and figures at their PNG render, since
// many readers do not show an SVG.

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkGithubAlerts)
  .use(remarkRehype)
  .use(rehypeStringify);

export function postToFeedHtml(content: string, baseUrl = SITE_URL): string {
  return String(processor.processSync(postBodyMarkdown(content, baseUrl, true)));
}
