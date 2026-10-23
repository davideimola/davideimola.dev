// Figures that draw themselves inside a post body (`<DrawnFigure />` in MDX).
// A figure is a drawing in the covers' style, kept next to the post's cover
// at /images/blog/<slug>/figures/<name>.svg with a <name>-dark.svg night twin
// (`pnpm covers:dark`). Pure and import-free, so the page, the feeds and the
// Markdown builders can all read it.

const FIGURE_PATH = /^\/images\/blog\/[a-z0-9-]+\/figures\/[a-z0-9-]+\.svg$/;

export function isFigurePath(src: string): boolean {
  return FIGURE_PATH.test(src) && !src.endsWith("-dark.svg");
}

const attr = (attrs: string, name: string) => attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];

// The surfaces that hand a post to a machine (/blog/<slug>.md, llms-full.txt,
// the RSS feed) carry the raw MDX, where a component tag means nothing. There
// a figure becomes a plain Markdown image with its alt, and its caption on the
// line below.
export function figuresToMarkdown(markdown: string): string {
  return markdown.replace(/<DrawnFigure\b([^>]*?)\/>/g, (_tag, attrs: string) => {
    const src = attr(attrs, "src") ?? "";
    const alt = attr(attrs, "alt") ?? "";
    const caption = attr(attrs, "caption");
    return caption ? `![${alt}](${src})\n\n*${caption}*` : `![${alt}](${src})`;
  });
}
