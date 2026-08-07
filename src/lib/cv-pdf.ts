// The rules the generated CV PDF has to satisfy, kept apart from the machinery
// that generates it. `scripts/cv-pdf.mts` drives Playwright, a Next server and a
// PDF text extractor; everything in here is pure string work over the text that
// comes back out, so it is unit-testable without any of that.
//
// The refusal list is the regression guard for the incident that started this
// work: a committed cv.pdf carried a home address and a mobile number in a
// public repo. It is checked against the *extracted* text rather than against
// the CV Record, because the PDF is the last thing downstream of every
// Rendering: whatever reaches it is what got published.

/** Where the generated PDF is served from, and so what /cv links to. */
export const CV_PDF_URL_PATH = "/cv.pdf";

/** The file the generator writes, relative to `public/`, which Next serves at the path above. */
export const CV_PDF_PUBLIC_FILE = CV_PDF_URL_PATH.slice(1);

/**
 * Greenhouse stops parsing above this: "Greenhouse Recruiting can't parse
 * resumes larger than 2.5MB". Their upload ceiling is 100 MB, so a PDF can be
 * accepted and still silently fail to parse.
 */
export const MAX_PDF_BYTES = 2.5 * 1024 * 1024;

/**
 * The saved copy is named after the person, so `cv.pdf` never lands anonymously
 * in a stranger's Downloads. Deliberately not `content.ts`'s private `slugify`,
 * which reproduces rehype-slug's heading-anchor rules: this has to fold
 * diacritics away, because the output is a filename rather than a URL fragment.
 */
export function downloadFileName(name: string): string {
  const slug = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-cv.pdf`;
}

/**
 * A PDF extractor reports the text as it is laid out, so a phrase can arrive
 * broken across lines or padded with the gaps between text runs. Collapsing all
 * whitespace (and dropping the soft hyphens a break can introduce) puts both
 * sides of every comparison in the same shape.
 */
export function normaliseExtractedText(text: string): string {
  return text
    .replace(/\u00ad/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface PrivateDataHit {
  /** The name reported to whoever has to fix it. */
  pattern: string;
  /** Why this shape is refused. */
  reason: string;
  /** The text that matched, so the message points at the actual leak. */
  match: string;
}

interface PrivatePattern {
  name: string;
  reason: string;
  regex: RegExp;
}

// Deliberately shape-based rather than value-based: a guard that only knows
// today's phone number cannot catch tomorrow's.
const PRIVATE_PATTERNS: PrivatePattern[] = [
  {
    name: "phone-prefix",
    reason: "an Italian phone number, and no phone number belongs in a public Rendering",
    regex: /\+39/,
  },
  {
    name: "street-address",
    reason: "a street address, and this repo is public, so a home address here is a published one",
    // Capitalised and followed by a space: the Italian street prefix, not the
    // ordinary English word "via".
    regex: /\bVia\s/,
  },
  {
    name: "fiscal-code",
    reason: "an Italian fiscal code",
    // LLLLLL NN L NN LNNN L. The month letter is the real closed set, which is
    // what keeps an all-caps section heading from matching.
    regex: /\b[A-Z]{6}\d{2}[A-EHLMPR-T]\d{2}[A-Z]\d{3}[A-Z]\b/,
  },
  {
    name: "generator-host",
    reason:
      "the generator's own host, which is what a browser print header would stamp into the page margin",
    // Not private data, but the same failure: text in a page header is one of
    // the parsing failures ATS vendors document, and it would also pin the PDF
    // to the machine that made it. page.pdf() adds no header unless asked, so a
    // hit here means something changed. Matched as a URL or a host:port rather
    // than as the bare word, so a bullet that mentions localhost still passes.
    regex: /https?:\/\/(?:localhost|127\.0\.0\.1)|\b(?:localhost|127\.0\.0\.1):\d+/,
  },
];

/**
 * Every private-data pattern the text matches. Empty means the PDF is safe to
 * commit; anything else has to fail the command.
 */
export function findPrivateData(text: string): PrivateDataHit[] {
  const haystack = normaliseExtractedText(text);
  const hits: PrivateDataHit[] = [];

  for (const { name, reason, regex } of PRIVATE_PATTERNS) {
    const match = haystack.match(regex);
    if (match) hits.push({ pattern: name, reason, match: match[0].trim() });
  }

  return hits;
}

/**
 * The phrases the PDF has to carry, derived from the CV Record rather than
 * listed anywhere, so a new job cannot slip past unasserted the moment it is
 * added to the Record. Structurally typed on purpose: this module stays pure and
 * never reads the Record itself.
 */
export function requiredPhrases(
  identity: { name: string; headline: string },
  employments: { org: string }[]
): string[] {
  return [identity.name, identity.headline, ...employments.map((employment) => employment.org)];
}

/** The phrases the PDF was supposed to carry and does not. */
export function findMissingPhrases(text: string, phrases: string[]): string[] {
  const haystack = normaliseExtractedText(text);
  return phrases.filter((phrase) => !haystack.includes(normaliseExtractedText(phrase)));
}
