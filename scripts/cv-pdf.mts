// Regenerate public/cv.pdf from the real /cv page, and refuse to write it if
// private data reached it.
//
// Run:  pnpm cv:pdf
//
// One command does the whole job: it builds the site, starts a production server
// on a free port, drives Playwright's Chromium over /cv, checks the result, then
// shuts the server down again (including when anything above fails). There is no
// "start the dev server in another terminal first" step, and this is deliberately
// NOT part of `pnpm build`: regenerating an identical file would drag a headless
// browser through every Vercel deploy. See docs/adr/0003-cv-pdf-rendered-by-playwright-in-ci.md.
//
// Environment escape hatches, both optional:
//   CV_PDF_BASE_URL=http://localhost:3000  reuse a server that is already
//                                          serving /cv; nothing is built,
//                                          started or stopped.
//   CV_PDF_SKIP_BUILD=1                    reuse the existing .next output and
//                                          only start the server. For iterating
//                                          on the print Rendering.
//
// Exit code 0 means public/cv.pdf was written and every check passed. Any other
// code means the file was NOT written: the reason is on stderr and the rejected
// PDF is left in the temp directory so it can be opened and inspected.

import { spawn } from "node:child_process";
import { writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import os from "node:os";
import path from "node:path";
import { chromium, type Page } from "playwright";
import { extractText, getDocumentProxy } from "unpdf";
import { getEngagementsByType, getIdentity } from "../src/lib/cv";
import {
  CV_PDF_PUBLIC_FILE,
  findMissingPhrases,
  findPrivateData,
  MAX_PDF_BYTES,
} from "../src/lib/cv-pdf";
import { SITE_URL } from "../src/lib/llms";

const ROOT = process.cwd();
const OUTPUT_FILE = path.join(ROOT, "public", CV_PDF_PUBLIC_FILE);
const NEXT_BIN = path.join(ROOT, "node_modules", ".bin", "next");

// unpdf's pdf.js reaches for Math.sumPrecise, which V8 only shipped after the
// Node 22 this repo pins in .mise.toml. Without it every page logs a TypeError
// and the extractor degrades instead of failing, which is the one outcome a
// guard must never have.
const math = Math as typeof Math & { sumPrecise?: (values: Iterable<number>) => number };
math.sumPrecise ??= (values) => [...values].reduce((total, value) => total + value, 0);

// The two brand families, renamed so they cannot be confused with the
// identically named @font-face sets next/font emits for the screen. A distinct
// name is what makes "the PDF used the repo's own TTFs" provable rather than
// probable: if a face below fails to load, nothing silently falls back to a
// same-named web font.
const SANS = "CV IBM Plex Sans";
const MONO = "CV JetBrains Mono";

// Exactly the faces /cv renders text with, measured off the page rather than
// guessed: mono 400 (body labels and the terminal prompt), 500 (section
// headings), 700 (the name); sans 400 (every prose line). `font-semibold` (600)
// on the organisation names has no 600 face on screen either, so it resolves to
// 700 in the PDF exactly as it does in the browser.
const FONT_FACES = [
  { family: SANS, weight: 400, file: "IBMPlexSans-Regular.ttf" },
  { family: MONO, weight: 400, file: "JetBrainsMono-Regular.ttf" },
  { family: MONO, weight: 500, file: "JetBrainsMono-Medium.ttf" },
  { family: MONO, weight: 700, file: "JetBrainsMono-Bold.ttf" },
];

// Redefining the two font tokens re-types the whole page with no second copy of
// the markup, the same way `print:light-ground` re-themes it: globals.css
// declares them with `@theme inline`, so every `font-mono` / `font-sans` utility
// compiles down to `var(--font-mono)` / `var(--font-sans)`. This block is
// unlayered and arrives after the stylesheet, so it wins on :root.
const FONT_CSS = `
${FONT_FACES.map(
  ({ family, weight, file }) => `@font-face {
  font-family: "${family}";
  src: url("/fonts/${file}") format("truetype");
  font-weight: ${weight};
  font-style: normal;
  font-display: block;
}`
).join("\n")}

:root {
  --font-sans: "${SANS}", sans-serif;
  --font-mono: "${MONO}", monospace;
}
`;

// ── The running /cv ────────────────────────────────────────────────────────

interface RunningSite {
  baseUrl: string;
  stop: () => Promise<void>;
}

// Runs a command to completion, inheriting its output, and rejects on a non-zero exit.
function runToCompletion(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(bin, args, { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(`\`${path.basename(bin)} ${args.join(" ")}\` exited with code ${code}`))
    );
  });
}

// Ask the OS for a port instead of picking one: the whole point is that this
// command never collides with a dev server the author left running.
function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const address = probe.address();
      const port = typeof address === "object" && address ? address.port : 0;
      probe.close(() => (port ? resolve(port) : reject(new Error("Could not find a free port."))));
    });
  });
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function startSite(): Promise<RunningSite> {
  const reused = process.env.CV_PDF_BASE_URL?.replace(/\/+$/, "");
  if (reused) {
    console.log(`→ Reusing the server at ${reused} (CV_PDF_BASE_URL).`);
    return { baseUrl: reused, stop: async () => {} };
  }

  if (process.env.CV_PDF_SKIP_BUILD === "1") {
    console.log("→ Skipping the build (CV_PDF_SKIP_BUILD=1): serving the existing .next output.");
  } else {
    console.log("→ Building the site…");
    await runToCompletion(NEXT_BIN, ["build"]);
  }

  const port = await freePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  console.log(`→ Starting the production server on ${baseUrl}…`);

  // Its own process group, so stop() can take the server and anything it forked
  // down together rather than orphaning a listener on that port.
  const child = spawn(NEXT_BIN, ["start", "--hostname", "127.0.0.1", "--port", String(port)], {
    stdio: ["ignore", "inherit", "inherit"],
    detached: true,
  });

  const stop = async () => {
    const pid = child.pid;
    if (child.exitCode !== null || pid === undefined) return;
    const exited = new Promise<void>((resolve) => child.once("exit", () => resolve()));
    // The negated pid addresses the whole group; falling back to the child alone
    // if the platform refuses is better than not killing anything.
    const kill = (signal: NodeJS.Signals) => {
      try {
        process.kill(-pid, signal);
      } catch {
        child.kill(signal);
      }
    };
    kill("SIGTERM");
    const hard = setTimeout(() => kill("SIGKILL"), 5_000);
    await exited;
    clearTimeout(hard);
    console.log("→ Server stopped.");
  };

  // Ctrl-C during a two-minute build-and-render should not leave a server behind.
  const onSignal = () => {
    void stop().then(() => process.exit(130));
  };
  process.once("SIGINT", onSignal);
  process.once("SIGTERM", onSignal);

  const deadline = Date.now() + 90_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`\`next start\` exited with code ${child.exitCode} before serving /cv.`);
    }
    try {
      const response = await fetch(`${baseUrl}/cv`);
      if (response.ok) return { baseUrl, stop };
    } catch {
      // Not listening yet.
    }
    await delay(300);
  }

  await stop();
  throw new Error(`The server did not serve ${baseUrl}/cv within 90s.`);
}

// ── The Rendering ──────────────────────────────────────────────────────────

interface FontProof {
  /** The faces the PDF will embed, as `family weight`. */
  embedded: string[];
  /** Every (family, weight) the page actually asks for, so drift is visible. */
  requested: string[];
}

// Proves the assertion the ticket actually cares about: that the PDF's glyphs
// came from the TTFs in public/fonts and from nothing else. Three things have to
// hold, and each one is a way of embedding the wrong outlines:
//
//   1. every visible run of text resolves to one of the two families above;
//   2. every face declared above actually loaded;
//   3. no family is asked for bold it has no face for, because CSS then
//      synthesises the bold and the PDF embeds a mechanically distorted outline
//      rather than the designed one.
async function assertLocalFontsAreUsed(page: Page): Promise<FontProof> {
  const report = await page.evaluate(
    ({ families, faces }) => {
      const requested = new Map<string, { family: string; weight: number }>();
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        if (!node.textContent?.trim()) continue;
        const element = node.parentElement;
        if (!element?.checkVisibility()) continue;
        const style = getComputedStyle(element);
        const family = style.fontFamily
          .split(",")[0]
          .trim()
          .replace(/^["']|["']$/g, "");
        const weight = Number(style.fontWeight);
        requested.set(`${family} ${weight}`, { family, weight });
      }

      // next/font's own faces stay "loaded" from the screen render, so this is
      // narrowed to the families declared for the PDF.
      const loaded = new Set(
        [...document.fonts]
          .filter((face) => face.status === "loaded" && families.includes(face.family))
          .map((face) => `${face.family} ${face.weight}`)
      );

      // CSS applies a synthetic bold when the asked-for weight is 600 or more and
      // the face it matched is lighter than that.
      const boldest = new Map<string, number>();
      for (const { family, weight } of faces) {
        boldest.set(family, Math.max(boldest.get(family) ?? 0, weight));
      }

      const asked = [...requested.values()];
      return {
        embedded: [...loaded],
        requested: [...requested.keys()],
        stray: asked.filter(({ family }) => !families.includes(family)).map(({ family }) => family),
        unloaded: faces
          .map(({ family, weight }) => `${family} ${weight}`)
          .filter((face) => !loaded.has(face)),
        synthesised: asked
          .filter(({ family, weight }) => weight >= 600 && (boldest.get(family) ?? 0) < 600)
          .map(({ family, weight }) => `${family} ${weight}`),
      };
    },
    { families: [SANS, MONO], faces: FONT_FACES.map(({ family, weight }) => ({ family, weight })) }
  );

  if (report.stray.length > 0) {
    throw new Error(
      `These text runs did not render with the repo's own fonts: ${[...new Set(report.stray)].join(", ")}. ` +
        "The PDF would embed whatever the machine happened to have."
    );
  }
  if (report.unloaded.length > 0) {
    throw new Error(
      `These local faces never loaded: ${report.unloaded.join(", ")}. ` +
        "Check that the files exist in public/fonts and that /cv still renders those weights."
    );
  }
  if (report.synthesised.length > 0) {
    throw new Error(
      `The page asks for a bold no local face provides: ${report.synthesised.join(", ")}. ` +
        "Chromium would synthesise it and the PDF would embed a distorted outline. Add the TTF."
    );
  }

  return { embedded: report.embedded.sort(), requested: report.requested.sort() };
}

// A single-column PDF is the one thing every ATS vendor documents, so it is
// asserted rather than trusted. Checked generically (no class names): in print
// media no visible element may lay its content out in more than one column.
// Flex rows are fine, they put two items on one line, not text in two columns.
async function assertSingleColumn(page: Page): Promise<void> {
  const offenders = await page.evaluate(() => {
    const found: string[] = [];
    for (const element of document.querySelectorAll<HTMLElement>("body *")) {
      if (!element.checkVisibility()) continue;
      const style = getComputedStyle(element);
      const tracks = style.gridTemplateColumns;
      const gridColumns =
        style.display.includes("grid") && tracks !== "none" ? tracks.trim().split(/\s+/).length : 1;
      const textColumns = style.columnCount === "auto" ? 1 : Number(style.columnCount);
      if (gridColumns > 1 || textColumns > 1) {
        // getAttribute, not `.className`: on an SVG node that is an
        // SVGAnimatedString and stringifies to "[object SVGAnimatedString]".
        found.push(
          `<${element.tagName.toLowerCase()} class="${element.getAttribute("class") ?? ""}">`
        );
      }
    }
    return found;
  });

  if (offenders.length > 0) {
    throw new Error(`The print Rendering is not single column: ${offenders.join(", ")}`);
  }
}

// The PDF is read long after this server is gone, and on someone else's machine,
// so a relative href is not just wrong there: Chromium resolves it against the
// generator's own ephemeral origin and writes that into the PDF's link
// annotation, which pins the document to the port it happened to be built on.
// Repointing every same-origin link at the canonical site is what makes the
// annotations mean the same thing as the text next to them.
async function absolutiseLinks(page: Page, baseUrl: string): Promise<void> {
  const repointed = await page.evaluate(
    ({ from, to }) => {
      let count = 0;
      for (const anchor of document.querySelectorAll("a[href]")) {
        // Reading .href rather than the attribute: the DOM has already resolved
        // it, so a relative href arrives here wearing the generator's origin.
        const resolved = (anchor as HTMLAnchorElement).href;
        if (!resolved.startsWith(from)) continue;
        (anchor as HTMLAnchorElement).href = to + resolved.slice(from.length);
        count++;
      }
      return count;
    },
    { from: baseUrl, to: SITE_URL }
  );
  console.log(`→ Repointed ${repointed} same-origin link(s) at ${SITE_URL}.`);
}

async function renderPdf(baseUrl: string): Promise<{ bytes: Uint8Array; fonts: FontProof }> {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const response = await page.goto(`${baseUrl}/cv`, { waitUntil: "networkidle" });
    if (!response?.ok()) {
      throw new Error(`GET ${baseUrl}/cv returned ${response?.status() ?? "no response"}.`);
    }

    // page.pdf() prints with print media anyway; emulating it here means the
    // assertions below see the same layout the PDF will.
    await page.emulateMedia({ media: "print" });
    await page.addStyleTag({ content: FONT_CSS });
    await page.evaluate(
      async (specs) => {
        await Promise.all(specs.map((spec) => document.fonts.load(spec)));
        await document.fonts.ready;
      },
      FONT_FACES.map(({ family, weight }) => `${weight} 16px "${family}"`)
    );

    const fonts = await assertLocalFontsAreUsed(page);
    await assertSingleColumn(page);
    await absolutiseLinks(page, baseUrl);

    const bytes = await page.pdf({
      format: "A4",
      // Playwright drops backgrounds by default, which would take the aside's
      // card fill and every rule with it.
      printBackground: true,
      // The sheet margin belongs to the print stylesheet's @page rule, so it is
      // stated once in globals.css instead of again here.
      preferCSSPageSize: true,
      // Free with a normal Chromium build (unlike a serverless one), and it
      // helps a screen-reader user. Not a PDF/UA conformance claim: nothing here
      // validates the structure tree.
      tagged: true,
      // Left off on purpose: displayHeaderFooter would stamp the title and the
      // generation URL into the page margins, and text in a page header is one
      // of the parsing failures ATS vendors document.
      displayHeaderFooter: false,
    });

    return { bytes: new Uint8Array(bytes), fonts };
  } finally {
    await browser.close();
  }
}

// ── The checks ─────────────────────────────────────────────────────────────

interface Rejection {
  reason: string;
  details: string[];
}

const megabytes = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

type Pdf = Awaited<ReturnType<typeof getDocumentProxy>>;

// A link annotation carries a URL that never appears in the text layer, so every
// check reading the extracted text is blind to it. This is the only place those
// URLs are visible, and the refusal list has to see them: a loopback link is the
// same failure as a loopback string, just hidden one level down.
async function annotationUrls(pdf: Pdf): Promise<string[]> {
  const urls: string[] = [];

  for (let number = 1; number <= pdf.numPages; number++) {
    const page = await pdf.getPage(number);
    for (const annotation of await page.getAnnotations()) {
      // unsafeUrl is the raw authored value; url is pdf.js's vetted one. A
      // guard wants whichever is present, not the safe subset.
      const url = annotation.unsafeUrl ?? annotation.url;
      if (typeof url === "string") urls.push(url);
    }
  }

  return urls;
}

async function checkPdf(bytes: Uint8Array): Promise<{ pages: number; rejections: Rejection[] }> {
  // Never allowed to silently pass: an extractor that throws is a guard that did
  // not run, which is the same risk the guard exists to remove.
  //
  // pdf.js takes ownership of the buffer it is handed and detaches it, so it gets
  // a copy: `bytes` still has to be writable to public/ afterwards.
  const pdf = await getDocumentProxy(new Uint8Array(bytes));
  const { totalPages, text } = await extractText(pdf, { mergePages: true });

  const rejections: Rejection[] = [];

  if (text.trim().length < 1_000) {
    rejections.push({
      reason: "the PDF has no real text layer",
      details: [
        `Only ${text.trim().length} characters could be extracted, which is what a page of images looks like.`,
      ],
    });
  }

  const leaks = findPrivateData(text);
  if (leaks.length > 0) {
    rejections.push({
      reason: "private data reached the PDF",
      details: leaks.map((leak) => `${leak.pattern}: matched "${leak.match}" (${leak.reason})`),
    });
  }

  const links = await annotationUrls(pdf);
  const linkLeaks = findPrivateData(links.join("\n"));
  if (linkLeaks.length > 0) {
    rejections.push({
      reason: "a link in the PDF carries data the text layer never shows",
      details: linkLeaks.map((leak) => `${leak.pattern}: matched "${leak.match}" (${leak.reason})`),
    });
  }

  // Derived from the CV Record, never listed here: a new job has to be asserted
  // the moment it is added to the Record.
  const identity = getIdentity();
  const employers = getEngagementsByType("employment").map((engagement) => engagement.org);
  const missing = findMissingPhrases(text, [identity.name, identity.headline, ...employers]);
  if (missing.length > 0) {
    rejections.push({
      reason: "the PDF is missing facts the CV Record holds",
      details: missing.map((phrase) => `not found in the extracted text: "${phrase}"`),
    });
  }

  if (bytes.byteLength > MAX_PDF_BYTES) {
    rejections.push({
      reason: "the PDF is too large to be parsed",
      details: [
        `${megabytes(bytes.byteLength)}, over the ${megabytes(MAX_PDF_BYTES)} ceiling above which Greenhouse stops parsing resumes.`,
      ],
    });
  }

  return { pages: totalPages, rejections };
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  let site: RunningSite | undefined;
  let rendered: { bytes: Uint8Array; fonts: FontProof };
  try {
    site = await startSite();
    console.log("→ Rendering /cv to PDF…");
    rendered = await renderPdf(site.baseUrl);
  } finally {
    await site?.stop();
  }

  const { bytes, fonts } = rendered;
  console.log("→ Checking the PDF…");
  const { pages, rejections } = await checkPdf(bytes);

  if (rejections.length > 0) {
    // The rejected file goes to the temp directory, never to public/: a PDF that
    // failed the guard must not be one `git add public` can pick up.
    const rejected = path.join(os.tmpdir(), `cv-rejected-${Date.now()}.pdf`);
    await writeFile(rejected, bytes);
    console.error("\n✗ Refusing to write public/cv.pdf.\n");
    for (const rejection of rejections) {
      console.error(`  ${rejection.reason}:`);
      for (const detail of rejection.details) console.error(`    - ${detail}`);
    }
    console.error(`\n  The rejected PDF is at ${rejected} if you need to look at it.`);
    throw new Error("The generated PDF did not pass its checks.");
  }

  await writeFile(OUTPUT_FILE, bytes);
  console.log(`\n✓ public/${CV_PDF_PUBLIC_FILE}`);
  console.log(
    `  ${(bytes.byteLength / 1024).toFixed(0)} KB, ${pages} page${pages === 1 ? "" : "s"}`
  );
  console.log(`  fonts embedded: ${fonts.embedded.join(", ")}`);
  console.log(`  weights asked for: ${fonts.requested.join(", ")}`);
  console.log("  selectable text layer, single column, no private data, no page headers.");
}

try {
  await main();
} catch (error) {
  console.error(`\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
