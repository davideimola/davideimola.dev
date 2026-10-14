// How well a search query matches one result of the ⌘K palette. Import-free,
// so the client component can use it without pulling in the content readers.
//
// Every word of the query has to start a word somewhere in the result: "go"
// finds "Go" and "GoLab", never the "g" and "o" scattered through "how I got
// here", which is what the palette's default fuzzy matcher did. A hit in the
// title weighs twice one in the description or the meta, and a title that
// starts with the whole query wins outright.

const words = (text: string) =>
  text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(Boolean);

export function searchScore(query: string, title: string, description = "", meta = ""): number {
  const terms = words(query);
  if (terms.length === 0) return 1;

  const inTitle = words(title);
  const inRest = words(`${description} ${meta}`);
  let score = 0;
  for (const term of terms) {
    if (inTitle.some((w) => w.startsWith(term))) score += 2;
    else if (inRest.some((w) => w.startsWith(term))) score += 1;
    else return 0;
  }

  const best = terms.length * 2;
  const leads = title.toLowerCase().startsWith(query.trim().toLowerCase());
  // Scaled into (0, 1], the range the palette sorts on.
  return leads ? 1 : (score / best) * 0.9;
}
