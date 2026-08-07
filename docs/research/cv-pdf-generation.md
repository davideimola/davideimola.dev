# Generating a CV/résumé PDF from this repo

**Research date: 2026-08-07.** Every limit and API detail below was verified against the primary source linked next to it on this date. Library versions and Vercel plan limits move fast (Vercel's Hobby function duration changed from 60s to 300s in 2025, and `@sparticuz/chromium` breaks compatibility at the patch level by design), so re-verify before acting on this months from now.

Scope: davideimola.dev, Next.js 16.3.0 App Router, TypeScript strict, Tailwind CSS v4, Vercel **Hobby** plan, pnpm, Biome, Node 22 locally (`.mise.toml`), Node 24.x default on Vercel. Constraint: zero cost, one source of truth for the data, brand consistency with the site.

## The question

How to programmatically generate a CV/résumé PDF **from this repo**, driven by structured data kept in the repo, staying consistent with the site's brand, and also producing a web / machine-readable version. Candidates compared: `@react-pdf/renderer`; headless Chromium on Vercel (`puppeteer-core` + `@sparticuz/chromium`); Playwright/Chromium in GitHub Actions; Typst compiled in CI. Cross-cutting: build-time generation vs an on-demand route handler. Then: is the resulting PDF actually readable by ATS software and by LLMs, and is a Markdown/semantic-HTML sibling the better answer for machines?

## TL;DR / Recommendation

**Build the CV as a real page on the site (`/cv`) with a print stylesheet, render the PDF with Playwright in GitHub Actions, and commit the PDF back to `public/`. Keep `src/content/cv.json` as the single source of truth, and ship a Markdown sibling at `/cv.md` alongside the existing `/llms.txt` machinery.**

Reasoning, in the order that the facts constrain the decision:

1. **Only two of the four candidates can produce a *tagged* (accessible) PDF at all, and only one of them can do it for free with the site's real CSS.** Playwright exposes `tagged` on `page.pdf()` since v1.42 ([Playwright API source](https://github.com/microsoft/playwright/blob/main/docs/src/api/class-page.md)), and Typst "will always write _Tagged PDF_" by default ([Typst PDF reference](https://typst.app/docs/reference/pdf/)). `@react-pdf/renderer` has no structure-tree support (four open issues, oldest from 2021). The serverless Chromium build **cannot** produce tagged PDFs: its own README says so and hands you a Chromium build patch to fix it ([`@sparticuz/chromium` README, "I need accessible PDF files"](https://github.com/Sparticuz/chromium#i-need-accessible-pdf-files)).
2. **GitHub Actions is free for public repositories with standard runners** ([GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)), Playwright is already a devDependency in this repo (`playwright@^1.61.1`), and a full non-headless-shell Chromium is available there. So the tagging capability, the real Tailwind v4 CSS, and the cost constraint all line up on approach 3.
3. **Layout duplication is the real cost, and only the browser-based approaches avoid it.** `@react-pdf/renderer` uses its own `StyleSheet` with a flexbox-only property subset ([react-pdf styling](https://react-pdf.org/styling)); Typst is a separate markup and layout language. Both mean writing the CV layout twice and drifting from the design tokens in `src/app/globals.css`. Tailwind v4's `print:` variant maps straight to `@media print` ([Tailwind docs](https://tailwindcss.com/docs/hover-focus-and-other-states)), so one component tree can serve both screen and paper.
4. **ATS readability does not depend on tagging; it depends on there being a text layer and simple structure.** No ATS vendor documents a tagged-PDF or PDF/UA requirement (see [ATS readability](#ats-readability-what-vendors-actually-document)). What they do document is the opposite of the site's visual identity: Workday says "For best results, use resumes that don't have images or image-based styles" and Greenhouse lists "graphics, photos, or word art" and "Complex resumes with tables, headers, and footers" as parse failure causes. This is the single strongest argument for **two PDF variants from the same data**: a branded one for humans and a plain one for parsers.
5. **LLMs read the Markdown sibling far better and far cheaper than the PDF.** Claude converts every PDF page to an image *and* extracts its text, costing 1,500 to 3,000 text tokens per page plus image tokens ([Claude PDF support](https://platform.claude.com/docs/en/docs/build-with-claude/pdf-support)), while plain `.md` can be used directly in a document block. This repo already has the pattern (`src/lib/llms.ts`, `/llms.txt`, `/blog/<slug>.md`), so the marginal cost of a `/cv.md` route is close to zero.

**What not to do:** do not run headless Chromium in a Vercel Hobby function for this. It is the most operationally fragile option (a 62 MB brotli blob, a 130 MB extraction into `/tmp`, a Chromium build that cannot tag PDFs, a version scheme that breaks at the patch level), it burns Hobby's 4 CPU-hours/month of Active CPU on a document that changes a handful of times a year, and it buys nothing that a build-time or CI-time render does not already give you.

**Fallback if the tagged-PDF requirement is dropped:** `@react-pdf/renderer` at build time is the simplest thing that works (31 MB installed, already in Next.js's `serverExternalPackages` default list, local TTF embedding supported), at the price of maintaining a second layout.

---

## What is already in the repo (and why it matters)

Grounding facts, read directly from the working tree on 2026-08-07:

| Thing | State | Relevance |
|---|---|---|
| `public/fonts/` | `JetBrainsMono-Regular.ttf` (264 KB), `JetBrainsMono-Bold.ttf` (268 KB). **No IBM Plex Sans files.** | Any PDF pipeline that embeds the brand sans needs IBM Plex Sans TTFs added to the repo. |
| Font loading | `src/app/layout.tsx` uses `next/font/google` for both `IBM_Plex_Sans` and `JetBrains_Mono`. | The Plex files exist only inside `.next` build output, not as repo assets. |
| `src/app/og/route.tsx` | `runtime = "nodejs"`, reads TTFs with `readFile(path.join(process.cwd(), "public", "fonts", …))`, module-level cache, passes `ArrayBuffer`s to `ImageResponse`. | **Working precedent that a Vercel function on this project can read local TTFs from `public/fonts` at runtime.** Verified live on 2026-08-07: `GET https://davideimola.dev/og?title=CV%20test&category=Technical` returns `200 image/png`, a 1200x630 PNG. Any PDF renderer can reuse exactly this font-loading shape. |
| `src/content/*.json` | `talks.json` (382 lines), `projects.json` (56), `oss-contributions.json` (22), typed by interfaces in `src/lib/content.ts`. | The established convention for structured content. A `cv.json` typed by a `CvData` interface fits without inventing anything. |
| `src/lib/llms.ts` | Builds `/llms.txt`, `/llms-full.txt`, per-post Markdown; `absolutizeUrls`, `postToMarkdown`. `next.config.ts` has an `afterFiles` rewrite `/blog/:slug.md` to `/blog-md/:slug`. | The machine-readable sibling pattern already exists; a `/cv.md` route is a copy of it. |
| Print styles | `grep -rn "@media print\|print:" src/` returns nothing. | There is no print stylesheet yet. Approaches 2 and 3 require writing one. |
| `package.json` | `playwright@^1.61.1` and `@vitest/browser-playwright@4.1.10` already in devDependencies; `sharp`, `tsx` present. | Approach 3 needs no new production dependency. |
| Font licences | JetBrains Mono and IBM Plex are both SIL OFL 1.1 ([JetBrains OFL.txt](https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt), [IBM Plex LICENSE.txt](https://github.com/IBM/plex/blob/master/LICENSE.txt)). | Embedding in a PDF is explicitly allowed "either in full or a subset", and "does not change the license of the document itself" ([OFL FAQ 1.12, 1.13](https://openfontlicense.org/documents/OFL-FAQ.txt)). No licence blocker for any approach. |

### Vercel Hobby limits that bound every server-side option

All from [Vercel Functions Limits](https://vercel.com/docs/functions/limitations) and [Limits](https://vercel.com/docs/limits), read 2026-08-07:

- **Bundle size:** "For Vercel Functions, the maximum uncompressed size is **250 MB** including layers". Overflow error text: `Serverless Function has exceeded the unzipped maximum size of 250 MB` ([KB troubleshooting guide](https://vercel.com/kb/guide/troubleshooting-function-250mb-limit)).
- **Large functions:** "Large functions let you deploy uncompressed bundles up to **5 GB**", opt in with `VERCEL_SUPPORT_LARGE_FUNCTIONS=1`, requires "fluid compute with Active CPU enabled". The docs state no plan restriction, but they also never confirm Hobby eligibility. Treat as **UNVERIFIED for Hobby**.
- **Memory:** Hobby "2 GB / 1 vCPU" as both default and maximum. Pro/Enterprise can reach 4 GB / 2 vCPU.
- **Max duration (fluid compute):** Hobby "300s default and maximum". For projects "deployed to Vercel before April 23rd 2025 and **not using Fluid compute**", Hobby was 10s default / 60s max.
- **Filesystem:** "Read-only filesystem with writable `/tmp` scratch space up to 500 MB" ([Runtimes](https://vercel.com/docs/functions/runtimes)).
- **Hobby monthly usage:** Active CPU 4 CPU-hrs, Provisioned Memory 360 GB-hrs, Invocations 1 million, Fast Data Transfer 100 GB.
- **Node.js versions:** 24.x (default), 22.x, 20.x ([Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)).
- **Build:** 45 minutes max per deployment; 100 deployments/day on Hobby; build cache max 1 GB.
- **Runtime logs** are kept **1 hour** on Hobby, which makes debugging a flaky serverless PDF route unpleasant.

---

## Approach 1: `@react-pdf/renderer`

**Version checked:** `4.5.1`, published 2026-04-15 ([npm registry metadata](https://registry.npmjs.org/@react-pdf/renderer)). Peer dependency `react: ^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`, so React 19.2.7 in this repo is in range. No `engines` field.

**Bundle size and Vercel Hobby fit.** Measured on 2026-08-07 with `npm install --omit=dev @react-pdf/renderer@4.5.1` into an empty scratch project: **31 MB on disk across 67 packages** (largest contributors: `hyphen` 9.3 MB, `fontkit` 5.6 MB, `@react-pdf/*` 2.8 MB, `@noble/*` 2.8 MB). That is roughly 12% of the 250 MB uncompressed function budget, so it fits comfortably. No native binaries, no `/tmp` extraction, no cold-start download. Rendering is pure CPU in-process, so the relevant Hobby constraint is the 4 CPU-hours/month Active CPU budget, which a once-in-a-while document render will not dent.

**Next.js 16 integration.** `@react-pdf/renderer` is already on Next.js's built-in `serverExternalPackages` list, so it is auto-opted-out of Server Component bundling with zero config ([serverExternalPackages, docs version 16.3.0](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)). Node-side entry points are `renderToFile`, `renderToBuffer`, `renderToString`, `renderToStream` ([react-pdf advanced](https://react-pdf.org/advanced)).

**Typographic fidelity and custom fonts.** `Font.register` accepts "Valid URLs" or an "absolute path if you're using react-pdf on Node" ([react-pdf fonts](https://react-pdf.org/fonts)), so `path.join(process.cwd(), "public", "fonts", "JetBrainsMono-Regular.ttf")` works exactly like the existing `/og` route. Constraints from the same page:
- "Only TTF and WOFF fonts files are supported."
- OpenType **variable** fonts "don't work properly due to PDF 2.0 specification limitations".
- Emoji requires `Font.registerEmojiSource()` and "react-pdf will need a internet connection to download emoji's images at render time". Avoid emoji entirely.
- Custom hyphenation via `Font.registerHyphenationCallback()`.

Text is laid out by `fontkit` and drawn as real text operators by the `@react-pdf/pdfkit` fork, so the output has a genuine selectable text layer. Fidelity is good but it is *its own* typesetting engine, not the browser's: expect small differences in line breaking, letter-spacing and optical alignment versus the site.

**Real CSS support: no.** react-pdf "ships a powerful styling solution using CSS and Flexbox" but it is a bespoke `StyleSheet.create()` API, not CSS. Supported properties are an explicit allowlist covering flexbox, position/display/overflow/z-index, sizing, text, colors, spacing, borders and transforms, plus media queries and `pt/in/mm/cm/%/vw/vh` units ([react-pdf styling](https://react-pdf.org/styling)). There is **no** cascade, no selectors, no CSS files, no Tailwind, and the docs do not list CSS Grid. Practically: you cannot reuse `src/app/globals.css` or a single Tailwind class. You would hand-port the design tokens (`#080807`, `#C91F37`, `#EAE5DF`, …) into a JS style object.

**Layout duplication: total.** The PDF is a second, independent component tree (`Document`/`Page`/`View`/`Text`) with its own styles. Two layouts to maintain, and the risk that the printed CV and the `/cv` page drift.

**Tagged / accessible PDF: no.** `Document` props are metadata only (`title`, `author`, `subject`, `keywords`, `creator`, `producer`, `language`, `pageMode`, `pageLayout`, `pdfVersion`, passwords, permissions) with **`pdfVersion` defaulting to `1.3`** ([react-pdf components](https://react-pdf.org/components)). Tagged PDF was introduced in PDF 1.4 ([W3C, PDF Techniques for WCAG 2.0](https://www.w3.org/TR/WCAG20-TECHS/pdf.html)), so the default output predates the feature. The vendored PDFKit fork *does* contain the plumbing (`packages/pdfkit/src/mixins/markings.js` with `markStructureContent`, `addStructure`, plus `packages/pdfkit/src/structure_element.js`), but the renderer does not drive it: a code search across the repo finds structure usage only inside the pdfkit fork and `packages/pdfkit/src/table/accessibility.js`. Confirmed by four open issues: [#1115](https://github.com/diegomura/react-pdf/issues/1115) (2021, "Add options to validate WCAG 2.0 a11y requirements"), [#1288](https://github.com/diegomura/react-pdf/issues/1288) (2021, "Feature: Be able to provide structural information to improve accessiblity"), [#1790](https://github.com/diegomura/react-pdf/issues/1790) (2022, "Example Pdf has Accessibility Issues in Adobe"), [#3179](https://github.com/diegomura/react-pdf/issues/3179) (2025, "WCAG / Pdf-Tagging"). Bookmarks (a document outline) are supported, which is not the same thing as a structure tree.

**Version fragility.** Open [issue #3223](https://github.com/diegomura/react-pdf/issues/3223) ("Compatibility with React 19 - TypeError: Cannot read properties of null (reading 'props') and Reconciler Incompatibility", opened 2025-10-06, still open) reports console errors on React 19.0 through 19.2.x. The reports are all about the **browser** components (`PDFViewer`, `PDFDownloadLink`); a commenter states that with renderer 4.3.2's new reconciler "all functionality of React PDF is working in React 19.2.3 as far as I can tell, but there is still a console error on first render". Server-side `renderToBuffer` is the safer path and is what a build-time or route-handler pipeline would use anyway. Also worth noting: [#3247](https://github.com/diegomura/react-pdf/issues/3247) is an open font-weight regression ("Regression in v4.3.1: Noto Sans fontWeight 700 triggers 'Unknown font format' error").

---

## Approach 2: Headless Chromium serverless on Vercel (`puppeteer-core` + `@sparticuz/chromium`)

**Versions checked (2026-08-07):** `@sparticuz/chromium@149.0.0` (published 2026-05-27), `@sparticuz/chromium-min@149.0.0`, `puppeteer-core@25.5.0` (published 2026-08-04, `engines: node >=22.12.0`).

**Vercel officially documents this path**, which is the strongest argument in its favour: [Deploying Puppeteer with Next.js on Vercel](https://vercel.com/kb/guide/deploying-puppeteer-with-nextjs-on-vercel) (Vercel Knowledge Base, 3 Nov 2025). Verbatim: "To successfully run Puppeteer in a Vercel Function, you must address the function bundle size limitation (250MB). The standard `puppeteer` package is too large. The solution involves two key packages: `puppeteer-core` […] `@sparticuz/chromium-min`: A minimal, community-maintained version of Chromium that is small enough to fit within Vercel's limits." The guide then points at a template, [`gabenunez/puppeteer-on-vercel`](https://github.com/gabenunez/puppeteer-on-vercel).

**Bundle size, measured.** `npm install --omit=dev @sparticuz/chromium@149.0.0 puppeteer-core@25.5.0` into an empty project on 2026-08-07 produced **104,360 KB (about 102 MiB) of `node_modules` across 43 packages**, of which `@sparticuz` alone is 68,680 KB. The brotli payloads inside `node_modules/@sparticuz/chromium/bin/`: `chromium.br` **62 MB**, `swiftshader.tar.br` 3.4 MB, `al2023.tar.br` 1.0 MB, `fonts.tar.br` 179 KB. npm's own metadata reports `unpackedSize: 69678316` for the package. So the full (non-`-min`) package plus puppeteer-core consumes roughly **40% of the 250 MB budget before a single line of Next.js server code**, which is why Vercel's guide reaches for `-min`.

The README states the trade-off plainly: "If your vendor does not allow large deployments (since `chromium.br` is over 50 MB), you will need to host the `chromium-v#-pack.tar` separately and use the `@sparticuz/chromium-min` package." `@sparticuz/chromium-min@149.0.0` has `unpackedSize: 46031` (about 45 KB).

With `-min` you must host the tar somewhere. The Vercel template's answer is to generate it at install time into `public/` and download it back over HTTP at runtime: its `scripts/postinstall.mjs` runs `tar -cf public/chromium-pack.tar -C <chromium>/bin .`, and the route resolves `chromium.executablePath(\`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/chromium-pack.tar\`)`. Note this puts a roughly 66 MB static asset in the deployment (Hobby CLI source uploads are capped at 100 MB, per [Limits](https://vercel.com/docs/limits)) and adds a cold-start download plus brotli decompression.

**Runtime footprint.** The README's compression table gives uncompressed `chromium` as **136,964,856 bytes (130.62 MiB)**, decompressed into `/tmp` on first invocation (brotli level 11 inflation measured at 0.712s in the README's own table, on their build machine, not on Vercel). Vercel's writable `/tmp` is 500 MB, so it fits, but a cold start pays download plus extraction plus browser launch. Memory guidance from the README: "You should allocate at least 512 MB of RAM to your instance; however, 1600 MB (or more) is recommended." Hobby's ceiling is 2 GB / 1 vCPU, which satisfies that, with no room to go higher.

**Config in Next.js 16.** `@sparticuz/chromium`, `@sparticuz/chromium-min`, `puppeteer-core` and `puppeteer` are all on the framework's default `serverExternalPackages` list ([Next.js 16.3.0 docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages)), so no config is strictly required, though the Vercel template still declares `serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"]` explicitly. The README warns independently: "When using a bundler […] `@sparticuz/chromium` must be marked as **external**. The package relies on relative path resolution to locate its binary files, which breaks when bundled. […] If you see the error `The input directory "/var/task/bin" does not exist`, this almost certainly means the package was not externalized." For anything the tracer cannot see statically, `outputFileTracingIncludes` is the Next.js escape hatch, keyed by route glob ([Next.js output config](https://nextjs.org/docs/app/api-reference/config/next-config-js/output)); Vercel's own KB adds that "the Next.js runtime does not read `excludeFiles` from `vercel.json`".

**Typographic fidelity and custom fonts: good, with a gotcha.** This is a real Chromium, so text rendering, hyphenation and line breaking match the browser. But: "The AWS Lambda runtime is not provisioned with any font faces. Because of this, this package ships with Open Sans". Fonts are discovered via a `fontconfig` file inside `bin/fonts.tar.br` that searches `/var/task/.fonts`, `/var/task/fonts`, `/opt/fonts`, `/tmp/fonts`. Since the CV page would be served over HTTP by the same deployment, the cleanest route is to let Chromium fetch the fonts as `@font-face` web fonts rather than fight fontconfig, but you must then `await page.waitForFunction(() => document.fonts.ready)` or you will silently ship a fallback-font PDF.

**Real CSS support: full.** This is the approach's whole point. The site's Tailwind v4 output, the design tokens, the `print:` variant, `@page` rules, everything. `page.pdf()` renders with `print` media by default; `page.emulateMedia({ media: 'screen' })` switches it ([Playwright](https://github.com/microsoft/playwright/blob/main/docs/src/api/class-page.md); Puppeteer's API is equivalent).

**Layout duplication: near zero.** One React component tree plus a `@media print` / `print:` layer.

**Tagged / accessible PDF: NO, and this is disqualifying if tagging matters.** `puppeteer-core`'s `PDFOptions` declares `tagged?: boolean` with `@defaultValue true` and `@experimental` ([puppeteer source](https://github.com/puppeteer/puppeteer/blob/main/packages/puppeteer-core/src/common/PDFOptions.ts)), which maps to CDP `Page.printToPDF`'s `generateTaggedPDF` ("Whether or not to generate tagged (accessible) PDF. Defaults to embedder choice.", Experimental) ([Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/tot/Page/)). But the binary in `@sparticuz/chromium` is compiled without it. Verbatim from the README FAQ, "I need accessible PDF files":

> This is due to the way @sparticuz/chromium is built. If you require accessible PDFs, you'll need to recompile Chromium yourself with the following patch. You can then use that binary with @sparticuz/chromium-min.

with the patch adding `enable_pdf = true` and `enable_tagged_pdf = true` to the GN args. It also notes: "This will increase the time required to generate a PDF." Additionally the build is `headless_shell` ("purpose-built version of Chromium specifically for headless purposes […] does not include a GUI"), and "From what I can tell, `headless_shell` does not seem to include support for the 'new' headless mode." So: **a Vercel-serverless Chromium gives an untagged PDF unless you build and host your own Chromium**, which is well outside a zero-cost personal-site budget.

**Version fragility: high.** "Because this package follows Chromium's release cycle, it does NOT follow semantic versioning. **Breaking changes may occur at the 'patch' level.**" You must match the Chromium major to the puppeteer-core version yourself via the [Puppeteer Chromium Support page](https://pptr.dev/chromium-support). `@sparticuz/chromium@149.0.0` declares `engines: { node: "^22.17.0 || >=24.0.0" }`; local Node is v22.22.2 and Vercel's default is 24.x, so both are fine today, but note that plain `node = "22"` in `.mise.toml` would break on any 22.x below 22.17. Also: the npm package "includes only x64 binaries", so Apple Silicon local development needs the documented `IS_LOCAL` branch, and "The Chromium binary included in this package is compiled for **Linux only** and will not work on macOS or Windows."

**Stale documentation to watch out for.** The official template's README says: "Note that Vercel functions have a 10-second timeout on the Hobby plan. If screenshots are taking too long, consider upgrading to Pro for higher limits." That contradicts the current [Functions Limits](https://vercel.com/docs/functions/limitations) doc (Hobby: "300s default and maximum" with fluid compute; 10s/60s applies only to pre-2025-04-23 projects not on fluid compute). Trust the docs over the template README, but it is a reminder that this corner of the ecosystem carries a lot of stale guidance.

---

## Approach 3: Playwright/Chromium in GitHub Actions (recommended)

**Versions checked:** `playwright@^1.61.1` already in this repo's devDependencies. `page.pdf()` exists since v1.8; `tagged` and `outline` options since **v1.42**.

**Cost and limits.** "GitHub Actions usage is **free** for **self-hosted runners** and for **public repositories** that use standard GitHub-hosted runners" ([GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)). If this repo were private, the Free plan gives 2,000 minutes/month and 500 MB of artifact storage. Job limit is 6 hours of execution time on GitHub-hosted runners; a workflow run can span up to 35 days ([Actions limits](https://docs.github.com/en/actions/reference/limits)). None of these bind for a CV render measured in seconds.

**Bundle size: not a constraint at all.** Nothing ships to Vercel. `npx playwright install chromium` downloads a browser onto a throwaway runner. This is the single biggest structural advantage: the 250 MB function limit, the `/tmp` budget, the cold start and the Active CPU quota all become irrelevant.

**Typographic fidelity and custom fonts: the best of the four.** Full Chromium with a real font stack. Two clean options: serve the CV page from a locally started `next start` (or `next dev`) inside the job and let Chromium load the fonts as web fonts; or install the TTFs into the runner's font directories. Either way the PDF matches what a visitor sees. Same caveats as approach 2 apply and are worth encoding in the script: wait for `document.fonts.ready`, set `printBackground: true` (Playwright default is `false`), and note Playwright's own warning: "By default, `page.pdf()` generates a pdf with modified colors for printing. Use the `-webkit-print-color-adjust` property to force rendering of exact colors." For a dark-background brand PDF that property is mandatory.

**Real CSS support: full.** `page.pdf()` "generates a pdf of the page with `print` css media"; `preferCSSPageSize` gives "any CSS `@page` size declared in the page priority over what is declared in width and height or format options"; `format` accepts `A4` (8.27in x 11.7in) and friends; `margin` and dimension values accept `px/in/cm/mm`. So `@page { size: A4; margin: 18mm }` plus Tailwind `print:` utilities is the whole layout language.

**Layout duplication: near zero.** One `/cv` page. This is the same win as approach 2, without approach 2's runtime baggage.

**Tagged / accessible PDF: YES.** `page.pdf({ tagged: true })`, "Whether or not to generate tagged (accessible) PDF. Defaults to `false`." (since v1.42), plus `outline: true`, "Whether or not to embed the document outline into the PDF. Defaults to `false`." Both are surfaced in the Playwright API docs ([class-page.md](https://github.com/microsoft/playwright/blob/main/docs/src/api/class-page.md)) and map to CDP's `generateTaggedPDF` / `generateDocumentOutline`. **Crucially this works because the runner's Chromium is a normal build, not `headless_shell` compiled without `enable_tagged_pdf`.** Two honest caveats: (a) both CDP parameters are marked Experimental, and (b) `tagged: true` produces tags derived from HTML semantics, which is a baseline, not automatic PDF/UA conformance. Quality of the structure tree therefore depends entirely on the CV page using real `<h1>/<h2>/<ul>/<time>` semantics rather than a soup of `div`s.

Also note Playwright's hard constraint, from the source: `throw new Error('PDF generation is only supported for Headless Chromium')` ([`pageDispatcher.ts`](https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/dispatchers/pageDispatcher.ts)). Not a problem here, but it rules out Firefox/WebKit for cross-checking.

**Commit back vs artifact.** Both are viable and they answer different questions:

- **Commit the PDF into `public/cv.pdf`.** Gives a stable public URL (`https://davideimola.dev/cv.pdf`), zero runtime cost, and the PDF is served as a plain static asset by Vercel's CDN. It also makes the artifact reviewable in a PR diff (size changes at least) and versioned. The workflow needs `permissions: contents: write`. Important behavioural note: "events triggered by the `GITHUB_TOKEN` will not create a new workflow run, with the following exceptions: `workflow_dispatch` and `repository_dispatch`" ([GitHub docs](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)), which conveniently prevents a commit loop. Vercel's git integration deploys on the push regardless. Downside: a binary in git history, and it consumes one of Hobby's 100 deployments/day.
- **Publish as an Actions artifact.** No binary in git, but "artifacts and log files generated by workflows are retained for 90 days before they are automatically deleted"; for public repositories the retention is configurable "anywhere between 1 day or 90 days" ([retention config docs](https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization)). Artifacts are also behind the Actions UI, so there is no clean public link to put on a CV. **Unsuitable as the primary distribution channel**; useful for PR previews of the generated PDF.

Recommended shape: build on PRs and upload as an artifact for review; on merge to `main`, regenerate and commit to `public/`.

---

## Approach 4: Typst compiled in CI

**Version checked:** Typst `v0.15.1`, released 2026-07-17 ([GitHub releases](https://github.com/typst/typst/releases/latest)). Licence Apache-2.0.

**Size and install.** `typst-x86_64-unknown-linux-musl.tar.xz` is 17,462,992 bytes (about 16.7 MB) in the release assets. Install paths per the [project README](https://github.com/typst/typst): `brew install typst`, `winget install --id Typst.Typst`, `cargo install --locked typst-cli`, prebuilt release binaries, or the first-party container `docker run ghcr.io/typst/typst:latest`. In GitHub Actions the container or a downloaded binary both work; cost is $0 on a public repo.

Note: **Typst cannot run inside a Vercel Node function** (it is a Rust binary; Vercel does have a Rust runtime, but that would mean a separate function in a separate language, not a library call from Next.js). Typst is a CI-time tool here, full stop.

**Typographic fidelity: excellent, arguably the best of the four.** It is a purpose-built typesetting engine with proper justification and micro-typography. Custom fonts: "Adds additional directories to search for fonts: `typst compile --font-path path/to/fonts file.typ`", with `typst fonts --font-path …` to list what was discovered and `TYPST_FONT_PATHS` as an environment alternative. So pointing it at `public/fonts/` (plus the IBM Plex TTFs, once added) is a one-flag operation.

**Real CSS support: none.** Typst has its own markup and scripting language. This is the largest divergence from the site: no Tailwind, no design-token reuse, no shared components. The design tokens would be re-declared as Typst variables.

**Layout duplication: total, and in a different language.** Worse than approach 1 in the sense that it is not even TypeScript, so the CV layout leaves the repo's toolchain (no Biome, no TS types, no Vitest). Better than approach 1 in that Typst is genuinely good at documents, so the layout code is short. The data path is fine: Typst can read JSON, so `src/content/cv.json` stays the single source of truth.

**Tagged / accessible PDF: YES, and the best story of the four.** From the [Typst PDF reference](https://typst.app/docs/reference/pdf/): "By default, Typst will always write _Tagged PDF_ to provide a baseline level of accessibility", disableable with `--no-pdf-tags`. Supported export standards via `--pdf-standard`: "Valid standards are `1.4`, `1.5`, `1.6`, `1.7`, `2.0`, `a-1b`, `a-1a`, `a-2b`, `a-2u`, `a-2a`, `a-3b`, `a-3u`, `a-3a`, `a-4`, `a-4f`, `a-4e`, and `ua-1`." That `ua-1` is PDF/UA-1 conformance, which no other candidate here can claim. Default output is PDF 1.7 with tagging on.

**Web sibling: not from the same source, today.** Typst's HTML export exists but the docs are unambiguous: "The feature is still very incomplete and only available for experimentation behind a feature flag. Do not use this feature for production use cases." It requires `--format html` plus `--features html`, emits no CSS ("No CSS stylesheets are currently emitted, only semantic markup"), and always produces standalone files. So the "one Typst source produces both the PDF and the web page" idea does **not** hold in 0.15.1. The web version stays a Next.js page, which means the duplication is real.

**When Typst wins:** if PDF/UA-1 conformance, or PDF/A archival conformance, becomes a hard requirement. Then it is the only free, scriptable option that gets there without compiling a browser.

---

## Cross-cutting: build time vs on-demand route handler

**Route handlers in Next.js 16 default to dynamic.** The version history on the [`route.js` reference](https://nextjs.org/docs/app/api-reference/file-conventions/route) (doc version 16.3.0) records: "`v15.0.0-RC` | The default caching for `GET` handlers was changed from static to dynamic". Segment config available: `dynamic`, `dynamicParams`, `revalidate`, `fetchCache`, `runtime`. So an on-demand `/cv.pdf` route handler would run per request unless you force it static (`export const dynamic = 'force-static'`) or give it a `revalidate` window, exactly as `/links` already does with daily ISR in this repo.

The trade-off table for this specific document:

| | Build time (or CI) | On-demand route handler |
|---|---|---|
| Runtime cost on Hobby | Zero. Static asset from the CDN. | Every uncached request burns Active CPU against the 4 CPU-hr/month budget, and each cold start pays library init (or Chromium download plus extraction). |
| Latency | Instant. | Cold start plus render; for Chromium, seconds. |
| Fits Chromium? | Yes, trivially (no 250 MB limit in CI). | Only with `-min` plus hosted tar, and never tagged. |
| Data freshness | Regenerated on push (data lives in the repo, so this is exactly right). | Freshness gained is illusory: the source data is a committed JSON file, so it cannot change between deploys. |
| Debuggability | Full logs in CI, artifact you can download. | Hobby runtime logs are kept **1 hour** ([Limits](https://vercel.com/docs/limits)). |
| Personalised variants (`?role=`, `?lang=`) | Needs a variant matrix at build time. | The one genuine argument for on-demand. |

**Conclusion: build/CI time, unless per-request personalisation is actually wanted.** Since the CV data is a file in the repo, on-demand generation adds cost and fragility while buying no freshness. If a `?lang=it` variant is wanted, generate the finite set at build time (`cv.pdf`, `cv-it.pdf`) rather than reaching for a dynamic route.

A third option worth naming: **generate during `next build`** via a `prebuild`/`postbuild` script (the repo already runs Node scripts this way: `scripts/optimize-images.mjs`, `scripts/generate-brand-pngs.mjs`, `scripts/newsletter-draft.mts`). This works for approach 1 (`renderToFile` into `public/`) but is awkward for approaches 2 to 4 on Vercel's build container (downloading a browser or a Rust binary inside a 45-minute build, on every deploy, with a 1 GB build cache). CI is the better home for those.

---

## Comparison table

| | 1. `@react-pdf/renderer` | 2. Chromium on Vercel | 3. Playwright in GH Actions | 4. Typst in CI |
|---|---|---|---|---|
| Version checked | 4.5.1 (2026-04-15) | `@sparticuz/chromium` 149.0.0 + `puppeteer-core` 25.5.0 | `playwright` 1.61.x (already a devDep) | 0.15.1 (2026-07-17) |
| Installed size (measured 2026-08-07) | **31 MB**, 67 pkgs | **102 MiB**, 43 pkgs (`chromium.br` alone 62 MB); `-min` variant 45 KB + hosted ~66 MB tar | 0 in the deployment; browser downloaded on the runner | 16.7 MB binary in CI |
| Fits Vercel Hobby 250 MB function | Yes, comfortably | Only with `-min` + externally hosted tar | N/A (nothing deployed) | N/A (cannot run in a Node function) |
| Hobby memory / duration adequate | Yes (2 GB / 300s ample) | Marginal: README wants "1600 MB (or more)", Hobby caps at 2 GB / 1 vCPU | N/A | N/A |
| Cold start / `/tmp` | None | Download + brotli-decompress 130.62 MiB into `/tmp` (500 MB cap) | None | None |
| Embed local TTFs | Yes (`Font.register` absolute path; TTF/WOFF only; no variable fonts) | Yes, but Lambda ships no fonts (only Open Sans bundled); use web fonts and wait for `document.fonts.ready` | Yes, best case | Yes (`--font-path`) |
| Reuse the site's Tailwind v4 CSS | **No** (bespoke StyleSheet, flexbox subset) | **Yes, fully** | **Yes, fully** | **No** (own language) |
| Layout duplication | Full second tree in TS | Near zero (`print:` layer) | Near zero (`print:` layer) | Full second layout, in Typst |
| Selectable text layer | Yes | Yes | Yes | Yes |
| Tagged / accessible PDF | **No** (default `pdfVersion` 1.3; 4 open issues since 2021) | **No** (binary built without `enable_tagged_pdf`; requires recompiling Chromium) | **Yes** (`tagged: true`, since v1.42; Experimental in CDP) | **Yes by default**, plus `--pdf-standard ua-1` |
| PDF/A or PDF/UA conformance mode | No | No | No | **Yes** (a-1b…a-4e, ua-1) |
| Cost | $0 | $0 within Hobby quotas | $0 (free for public repos) | $0 |
| Version fragility | Medium (React 19 reconciler issues, font-weight regressions) | **High** ("Breaking changes may occur at the 'patch' level"; x64-only npm binaries; must hand-match Chromium/puppeteer) | Low | Low (pre-1.0 language, but the CLI contract is stable and pinned in CI) |
| Runs inside Next.js | Yes (already in `serverExternalPackages`) | Yes (already in `serverExternalPackages`) | No (CI only) | No (CI only) |

---

## ATS readability: what vendors actually document

The honest headline: **primary ATS documentation talks about file formats, file size, and visual complexity. It does not talk about tagged PDF, PDF/UA, or ISO 32000 structure trees at all.** I searched the official documentation domains of Greenhouse, Lever, Workday, Oracle, SmartRecruiters, Ashby and SAP for tagged-PDF/parsing statements and found none. Absence of evidence, not evidence of absence, but it does mean **no primary source supports "tag your CV PDF so ATS can read it"**. Confidence: high that the claim is undocumented; unknown whether any parser secretly benefits.

What vendors do document:

**Greenhouse.** Accepted formats: ".doc, .docx, .pdf, .rtf, .txt", "up to 100 MB" ([Supported formats for resumes, cover letters and other candidate uploads](https://support.greenhouse.io/hc/en-us/articles/360052218132-Supported-formats-for-resumes-cover-letters-and-other-candidate-uploads)). Parsing constraints, verbatim from [Unsuccessful resume parse](https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse): "Greenhouse Recruiting can't parse resumes larger than 2.5MB"; failures are attributed to "Resumes that include graphics, photos, or word art", "Complex resumes with tables, headers, and footers", and resumes "uploaded as an image, rather than a document (such as a .docx or .pdf)". Note the 2.5 MB parsing ceiling is 40x smaller than the 100 MB upload ceiling: a hero-image-heavy branded PDF can be accepted and still fail to parse.

**Workday.** From the [Recruiting admin guide, Concept: Resume Parsing](https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/candidates/set-up-prospects-and-candidates/hdc1552497830785.html), verbatim: "For best results, use resumes that don't have images or image-based styles." and "Resume parsing results can vary based on resume format and order of words." The doc also notes some fields are not auto-populated (Languages, Skills). Workday's HiredScore layer documents formats: "HiredScore supports these file types for resume attachments: DOC, DOCX, PDF, RTF, and TXT" and "You can only view smart resumes when candidates attach resumes with their applications in a supported format" ([Concept: Candidate Profiles](https://doc.workday.com/hiredscore/en-us/workday-hiredscore/recruiter-productivity-/concept--candidate-profiles.html)).

**SAP SuccessFactors.** From [KB 2081576](https://userapps.support.sap.com/sap/support/knowledge/en/2081576), verbatim and unusually explicit about the text layer: "PDF documents that were scanned in or were previously images will not parse as expected. A PDF that was previously a text document will parse as designed."

**Oracle (Recruiting / Taleo).** Oracle's docs surfaced a format list (Word, WordPerfect, txt, rtf, html/htm, pdf, xls/xlsx, odt) and a "cannot exceed 100 kilobytes or the size defined by the system administrator" limit in search results over `docs.oracle.com`, but **I could not verify either verbatim on a page I read end to end** (the specific Redwood 25C page I fetched does not contain them). Marked **UNVERIFIED, low confidence**. Do not lean on Oracle's numbers without re-checking [Implementing Recruiting: attachments](https://docs.oracle.com/en/cloud/saas/taleo-enterprise/21d/otrcg/c-attachment.html) and [Using Recruiting: candidate management](https://docs.oracle.com/en/cloud/saas/talent-acquisition/19c/otrec/candidate-management.html).

**Lever.** Lever's help centre ([Understanding Resume Parsing](https://help.lever.co/hc/en-us/articles/20087345054749-Understanding-Resume-Parsing)) is a JavaScript-rendered Salesforce Experience Cloud page; every fetch attempt returned only a "CSS Error / Refresh" shell. Search snippets suggest "image files are not supported and will not be successfully parsed for information, though they can still be uploaded" and that PDF is the default supported format, but **this is a search snippet, not a page I read. UNVERIFIED, low confidence.**

### What this means for the design

1. **A selectable text layer is the actual requirement, and all four approaches produce one.** Chromium's `printToPDF`, PDFKit (via react-pdf) and Typst all draw text with real text-showing operators and embedded fonts. Nothing here rasterises text. The failure mode the vendors warn about (scanned/image PDFs) is not reachable by any of these pipelines unless you deliberately render text into an image.
2. **Reading order is the real fidelity risk, and the site's brand is the enemy.** For an untagged PDF, extraction order is determined by content-stream order, which for a browser-printed page follows DOM order, not visual order. So a two-column CSS grid can extract as a coherent stream *or* as interleaved nonsense depending on how the DOM is arranged. Tagged PDF makes this explicit: "The reading order of a PDF document is determined primarily by the tag order of document elements" ([W3C, PDF Techniques for WCAG 2.0](https://www.w3.org/TR/WCAG20-TECHS/pdf.html)). **Design implication: a single-column DOM whose visual order equals its source order, even if the print layout looks columned.**
3. **Tagging is worth doing for accessibility, not for ATS.** Tagged PDF is "a stylized use of PDF that builds on PDF's logical structure framework" defining "standard structure types and attributes" so content can be extracted and reused; the structure tree is "a hierarchy of structure elements" (same W3C source). PDF/UA-1 is ISO 14289-1:2014 and requires, among other things, that all fonts used be embedded (Oracle's own accessibility docs restate this: [Generating Accessible PDF Output](https://docs.oracle.com/cd/E96933_01/bisuite/BIPRD/GUID-2447AD55-840D-430A-BDAD-09E21206A3B3.htm)). W3C is careful to add that "tool vendors are the source of authoritative information about their support for PDF accessibility". So: turn `tagged: true` on because it is one boolean and it helps screen-reader users, not because it will move an ATS needle.
4. **Ship two PDFs from one `cv.json`.** `cv.pdf` (branded, dark, hero-ish, for humans and for the site) and `cv-ats.pdf` (single column, black on white, no images, no icon fonts, no tables, no header/footer, under 2.5 MB). This directly answers Greenhouse's and Workday's documented failure modes without compromising the brand artefact. A third `.docx` would hedge further, since every vendor above lists DOC/DOCX first, but nothing in the four approaches produces one.

---

## LLM readability, and whether Markdown is the better answer

**Yes: a Markdown/semantic-HTML sibling is the better machine-readable artefact, and this repo is already set up for it.**

**How an LLM actually consumes a PDF.** From [Claude's PDF support documentation](https://platform.claude.com/docs/en/docs/build-with-claude/pdf-support), verbatim on the pipeline: "The system converts each page of the document into an image. The text from each page is extracted and provided alongside each page's image." Cost: "Each page typically uses 1,500 to 3,000 tokens per page depending on content density" for text, "Because each page is converted into an image, the same image-based cost calculations are applied" on top. Limits: 32 MB max request size, "600 [pages] (100 when the request's context window is under 1M tokens)", "Standard PDF (no passwords/encryption)". Best-practice list includes "Use standard fonts" and "Ensure text is clear and legible". Note also that the AWS Bedrock Converse path silently degrades: "Provides basic text extraction from PDFs / Cannot analyze images, charts, or visual layouts within PDFs" unless citations are enabled.

Two consequences: a 2-page branded CV PDF is roughly 3,000 to 6,000 text tokens plus two full-page images, versus a few hundred tokens for the same content as Markdown. And a heavily styled dark-background PDF is precisely the case where "clear and legible" and "standard fonts" stop being satisfied.

**Plain text is a first-class input.** Same doc: "Plain text files such as .txt, .csv, or .md can be used directly in document blocks". So there is no format penalty for serving Markdown.

**This repo already has the machinery.** `src/lib/llms.ts` exports `buildLlmsTxt`, `buildLlmsFullTxt`, `postToMarkdown`, `absolutizeUrls`; the `afterFiles` rewrite in `next.config.ts` maps `/blog/:slug.md` to `/blog-md/:slug`. The natural extension:

- `src/content/cv.json` as the source of truth, typed in `src/lib/content.ts` next to `Talk`/`Project`/`OssContribution`. Worth aligning the field names with **JSON Resume**, "an open-source, community-driven standard for representing a résumé as a single structured JSON document" with canonical `basics`, `work`, `education`, `skills`, `projects` sections, MIT-licensed ([resume-schema, now archived and moved into the jsonresume.org monorepo `packages/schema`](https://github.com/jsonresume/resume-schema)). Adopting the field names costs nothing and buys interoperability with existing themes and validators, without adopting the tooling.
- A `cvToMarkdown()` builder in `src/lib/llms.ts`, plus a `/cv.md` route via the same rewrite pattern, and a line for the CV in `buildLlmsTxt`'s `## Pages` section (`PAGES` in `src/lib/llms.ts`).
- `alternates.types` on the `/cv` page metadata pointing at `/cv.md`, mirroring what blog posts already do.
- JSON-LD on `/cv` using the existing `<JsonLd>` component, with `schema.org/Person`: `jobTitle` ("The job title of the person"), `worksFor` ("Organizations that the person works for"), `alumniOf`, `knowsAbout` ("to indicate a topic that is known about, suggesting possible expertise but not implying it"), `hasOccupation`, `affiliation`, `award`, `sameAs` ([schema.org/Person](https://schema.org/Person)). This is the machine-readable web version, and it costs one component call.

**Division of labour, then:** the PDF is for humans and for upload forms; the Markdown and JSON-LD are for machines. Do not try to make one artefact do both jobs, and specifically do not compromise the branded PDF's design in the hope of pleasing a parser when a purpose-built `cv-ats.pdf` and a `/cv.md` exist.

---

## Open questions research could not settle

These are genuinely unresolved and each one is a decision only the human can make.

1. **Is a tagged/PDF-UA CV actually a goal, or just a nice-to-have?** The whole recommendation pivots on this. If tagging matters, approach 2 is out and Typst becomes a serious contender. If it does not, `@react-pdf/renderer` at build time is the least machinery. **No primary source found** that any ATS benefits from tagging, so the only defensible reason to want it is accessibility for human readers using screen readers.
2. **Is the CV meant to be brand-loud or parse-safe?** Every vendor doc above pushes toward plain, single-column, image-free. The site's identity is dark, dot-gridded, Akane Red. The two-PDF proposal assumes both matter; if the CV is mainly a link on a portfolio site and never uploaded to a job portal, the ATS variant is wasted work.
3. **How does `tagged: true` output actually score?** Playwright's `tagged` maps to a CDP parameter marked *Experimental*, and produces tags derived from HTML. Nobody has told us how a real validator (PAC, veraPDF) rates a Chromium-tagged PDF, or whether it would pass PDF/UA-1. **UNVERIFIED.** Settling it requires generating a PDF and running a checker, which is a spike, not a docs question.
4. **Is Vercel's "large functions" 5 GB path available on Hobby?** The [limitations doc](https://vercel.com/docs/functions/limitations) describes eligibility in terms of fluid compute and Active CPU, never in terms of plan. If Hobby is eligible, the 250 MB constraint on approach 2 largely evaporates (though the tagging problem does not). **UNVERIFIED.**
5. **Do Lever and Oracle document anything that contradicts the above?** Lever's help centre is JS-only and could not be read; Oracle's format and size limits are only in search snippets. Both are marked low confidence. If a specific ATS matters (because a specific employer uses it), that vendor's docs should be read directly.
6. **Where do the IBM Plex Sans font files come from?** The repo has no local Plex TTFs (only JetBrains Mono), because Plex is loaded via `next/font/google`. Approaches 1, 3 and 4 all need real files. Adding `IBMPlexSans-Regular.ttf` / `-SemiBold.ttf` to `public/fonts/` is trivial and OFL-clean, but it means two more binary assets in the repo and a decision about which weights the print design uses.
7. **How often does the CV change, and does it need to be in the PR diff?** This decides commit-back vs artifact, and whether the render should run on every push to `main` or only on a `workflow_dispatch` / on changes to `src/content/cv.json`. A path filter is probably right, but it is a preference.
8. **Should a `.docx` variant exist?** Every ATS vendor lists DOC/DOCX before PDF. None of the four approaches produces one, so this would be a fifth tool. Out of scope for this research, but it is the obvious next question if job-portal uploads are the real use case.
9. **Language variants.** Italian and English CVs are plausible given the audience mix. This is the only requirement found that would justify an on-demand route, and even then a small build-time matrix is probably better. Not enough information to decide.

---

## Sources

All consulted 2026-08-07.

**Vercel**
- https://vercel.com/docs/functions/limitations
- https://vercel.com/docs/limits
- https://vercel.com/docs/functions/runtimes
- https://vercel.com/docs/functions/runtimes/node-js
- https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
- https://vercel.com/kb/guide/deploying-puppeteer-with-nextjs-on-vercel
- https://vercel.com/kb/guide/troubleshooting-function-250mb-limit
- https://vercel.com/templates/next.js/puppeteer-on-vercel
- https://github.com/gabenunez/puppeteer-on-vercel (the template the Vercel KB guide links to: `next.config.ts`, `package.json`, `app/api/screenshot/route.ts`, `scripts/postinstall.mjs`, `README.md`)

**Next.js (docs version 16.3.0)**
- https://nextjs.org/docs/app/api-reference/config/next-config-js/serverExternalPackages
- https://nextjs.org/docs/app/api-reference/config/next-config-js/output
- https://nextjs.org/docs/app/api-reference/file-conventions/route

**@react-pdf/renderer**
- https://react-pdf.org/fonts
- https://react-pdf.org/styling
- https://react-pdf.org/components
- https://react-pdf.org/advanced
- https://registry.npmjs.org/@react-pdf/renderer (version 4.5.1, peer deps, publish date)
- https://github.com/diegomura/react-pdf/issues/1115
- https://github.com/diegomura/react-pdf/issues/1288
- https://github.com/diegomura/react-pdf/issues/1790
- https://github.com/diegomura/react-pdf/issues/3179
- https://github.com/diegomura/react-pdf/issues/3223
- https://github.com/diegomura/react-pdf/issues/3247
- https://github.com/diegomura/react-pdf/blob/master/packages/pdfkit/src/mixins/markings.js (structure-marking plumbing that the renderer does not drive)

**Headless Chromium**
- https://github.com/Sparticuz/chromium (README, read as raw Markdown: versioning policy, `-min` package, memory guidance, fonts, compression table, "I need accessible PDF files" FAQ, bundler externals, macOS/arm64 notes)
- https://registry.npmjs.org/@sparticuz/chromium and https://registry.npmjs.org/@sparticuz/chromium-min (version 149.0.0, `engines`, `unpackedSize`)
- https://registry.npmjs.org/puppeteer-core (version 25.5.0, `engines`)
- https://github.com/puppeteer/puppeteer/blob/main/packages/puppeteer-core/src/common/PDFOptions.ts (`tagged`, default `true`, `@experimental`)
- https://pptr.dev/chromium-support (version matching, referenced by the sparticuz README)
- https://chromedevtools.github.io/devtools-protocol/tot/Page/ (`Page.printToPDF`: `generateTaggedPDF`, `generateDocumentOutline`)

**Playwright**
- https://github.com/microsoft/playwright/blob/main/docs/src/api/class-page.md (`Page.pdf` since v1.8; `tagged` and `outline` since v1.42; `preferCSSPageSize`; print-media and `-webkit-print-color-adjust` notes; formats and units)
- https://github.com/microsoft/playwright/blob/main/packages/playwright-core/src/server/dispatchers/pageDispatcher.ts (`'PDF generation is only supported for Headless Chromium'`)
- https://playwright.dev/docs/api/class-page

**Typst**
- https://typst.app/docs/reference/pdf/ (PDF versions, PDF/A variants, `ua-1`, "always write _Tagged PDF_", `--no-pdf-tags`)
- https://typst.app/docs/reference/html/ (HTML export is experimental, "Do not use this feature for production use cases", no CSS emitted)
- https://github.com/typst/typst (install methods, `--font-path`, Apache-2.0)
- https://api.github.com/repos/typst/typst/releases/latest (v0.15.1, 2026-07-17, asset sizes)

**GitHub Actions**
- https://docs.github.com/en/billing/concepts/product-billing/github-actions (free for public repositories with standard runners; Free-plan private allowances)
- https://docs.github.com/en/actions/reference/limits (6-hour job limit, 35-day run limit)
- https://docs.github.com/en/actions/how-tos/manage-workflow-runs/download-workflow-artifacts (90-day default retention)
- https://docs.github.com/en/organizations/managing-organization-settings/configuring-the-retention-period-for-github-actions-artifacts-and-logs-in-your-organization (1 to 90 days public, 1 to 400 days private)
- https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow (`GITHUB_TOKEN` events do not create new workflow runs)

**ATS vendors**
- https://support.greenhouse.io/hc/en-us/articles/360052218132-Supported-formats-for-resumes-cover-letters-and-other-candidate-uploads
- https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse
- https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/candidates/set-up-prospects-and-candidates/hdc1552497830785.html
- https://doc.workday.com/hiredscore/en-us/workday-hiredscore/recruiter-productivity-/concept--candidate-profiles.html
- https://userapps.support.sap.com/sap/support/knowledge/en/2081576 (SAP SuccessFactors: scanned/image PDFs will not parse)
- https://docs.oracle.com/en/cloud/saas/readiness/hcm/25c/recr-25c/25C-recruiting-wn-f38002.htm (read; does **not** contain the format/size limits attributed to Oracle elsewhere)
- https://docs.oracle.com/en/cloud/saas/taleo-enterprise/21d/otrcg/c-attachment.html (**not read verbatim**, cited as the likely home of Oracle's format list; UNVERIFIED)
- https://help.lever.co/hc/en-us/articles/20087345054749-Understanding-Resume-Parsing (**inaccessible**: JS-rendered, returns a "CSS Error" shell to every fetch; UNVERIFIED)
- https://docs.oracle.com/cd/E96933_01/bisuite/BIPRD/GUID-2447AD55-840D-430A-BDAD-09E21206A3B3.htm (Oracle on accessible PDF output: PDF/UA-1 = ISO 14289-1:2014, fonts must be embedded)

**PDF accessibility and standards**
- https://www.w3.org/TR/WCAG20-TECHS/pdf.html (Tagged PDF is "a stylized use of PDF that builds on PDF's logical structure framework"; reading order determined by tag order; "tool vendors are the source of authoritative information about their support for PDF accessibility")
- https://www.iso.org/standard/64599.html and https://www.iso.org/standard/75839.html (ISO catalogue entries for ISO 14289; **both blocked by a JS/anti-bot interstitial**, so the ISO abstracts were not read directly. https://pdfa.org/resource/iso-14289-pdfua/ returned HTTP 403.)

**LLM consumption**
- https://platform.claude.com/docs/en/docs/build-with-claude/pdf-support (page-to-image plus text extraction pipeline; 32 MB / 600-page limits; 1,500 to 3,000 tokens per page plus image tokens; `.md` usable directly in document blocks; Bedrock Converse degrades to text-only without citations)
- https://llmstxt.org (the convention this repo already follows via `src/lib/llms.ts`)
- https://schema.org/Person (`jobTitle`, `worksFor`, `alumniOf`, `knowsAbout`, `hasOccupation`, `affiliation`, `award`, `sameAs`)
- https://github.com/jsonresume/resume-schema (JSON Resume standard, MIT; archived 2026-06-12, now `packages/schema` in the jsonresume.org monorepo)

**Fonts**
- https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt (SIL OFL 1.1)
- https://github.com/IBM/plex/blob/master/LICENSE.txt (SIL OFL 1.1)
- https://openfontlicense.org/documents/OFL-FAQ.txt (Q1.10, Q1.12, Q1.13: embedding in documents, in full or subset, does not change the document's licence)

**Tailwind CSS v4**
- https://tailwindcss.com/docs/hover-focus-and-other-states (`print:` variant maps to `@media print`)

**Measurements taken locally on 2026-08-07** (macOS, `npm install --omit=dev` into empty scratch projects, sizes via `du -sk`):
- `@react-pdf/renderer@4.5.1`: 31,628 KB across 67 packages.
- `@sparticuz/chromium@149.0.0` + `puppeteer-core@25.5.0`: 104,360 KB across 43 packages; `bin/chromium.br` 62 MB, `bin/swiftshader.tar.br` 3.4 MB, `bin/al2023.tar.br` 1.0 MB, `bin/fonts.tar.br` 179 KB.
- Live check of the existing OG route: `curl -L "https://davideimola.dev/og?title=CV%20test&category=Technical"` returned `200 image/png`, PNG 1200x630, 28,245 bytes, confirming that a Vercel function on this project reads local TTFs from `public/fonts/` at runtime.
- Repo state: `public/fonts/` contains only `JetBrainsMono-Regular.ttf` (264 KB) and `JetBrainsMono-Bold.ttf` (268 KB); `grep -rn "@media print\|print:" src/` returns no matches; local Node is v22.22.2.
