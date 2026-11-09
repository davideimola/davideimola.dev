// Reading time of a post, from its MDX body (frontmatter already removed).
//
// Only what a reader reads as prose is counted as words: fenced code, link
// URLs, image and figure alt text (a screen reader's stand-in for the
// picture, not something a sighted reader reads) and MDX syntax are not.
// Code and pictures cost time of their own instead, because they are looked
// at rather than read word by word.

/** Adult silent reading of English non-fiction (Brysbaert, 2019). */
export const WORDS_PER_MINUTE = 238;
/** A picture or a drawn figure: about what Medium gives an image. */
export const SECONDS_PER_PICTURE = 12;
/** A line of code is skimmed, not read. */
export const SECONDS_PER_CODE_LINE = 1;

const FENCE = /^(`{3,}|~{3,})[^\n]*\n([\s\S]*?)^\1[ \t]*$/gm;
// A self-closing component is a figure (DrawnFigure): its caption is read,
// its alt is not. It may span several lines.
const SELF_CLOSING_JSX = /<([A-Z][\w.]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)\/>/g;
const CAPTION = /\bcaption=(?:"([^"]*)"|'([^']*)')/;
const JSX_TAG = /<\/?[A-Za-z][\w.]*\b(?:[^>"']|"[^"]*"|'[^']*')*>/g;
const IMAGE = /!\[[^\]]*\]\([^)]*\)/g;
const LINK = /\[([^\]]*)\]\([^)]*\)/g;
const COMMENTS = /\{\/\*[\s\S]*?\*\/\}|<!--[\s\S]*?-->/g;
const ESM = /^(?:import|export)\s.*$/gm;
const BARE_URL = /\bhttps?:\/\/\S+/g;

export function readingMinutes(body: string): number {
  let seconds = 0;
  let text = body.replace(FENCE, (_, _fence: string, code: string) => {
    const lines = code.split("\n").filter((line) => line.trim() !== "").length;
    seconds += lines * SECONDS_PER_CODE_LINE;
    return "\n";
  });

  text = text
    .replace(COMMENTS, " ")
    .replace(ESM, " ")
    .replace(SELF_CLOSING_JSX, (_, _name: string, attributes: string) => {
      seconds += SECONDS_PER_PICTURE;
      const caption = CAPTION.exec(attributes);
      return ` ${caption?.[1] ?? caption?.[2] ?? ""} `;
    })
    .replace(IMAGE, () => {
      seconds += SECONDS_PER_PICTURE;
      return " ";
    })
    .replace(LINK, " $1 ")
    .replace(JSX_TAG, " ")
    .replace(BARE_URL, " ");

  const words = text.split(/\s+/).filter((token) => /[\p{L}\p{N}]/u.test(token)).length;
  return words / WORDS_PER_MINUTE + seconds / 60;
}

export function readingTimeLabel(body: string): string {
  return `${Math.max(1, Math.round(readingMinutes(body)))} min read`;
}
