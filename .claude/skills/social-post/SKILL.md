---
name: social-post
description: >
  Creates LinkedIn promotion content for any piece of content on davideimola.dev. Takes a LinkedIn Piece note from Davide's Obsidian vault, a blog post slug/URL, or free text description as input. Generates a native LinkedIn post, validates it with the user, builds a single branded image or (rarely) a carousel with mkcr, commits the final copy and assets in this repo, and records the artifact URL on the Piece note in the vault. Use when the user wants to promote a blog post, talk, project, event, or any content, even if they just say "prepare social for the latest post" or "write a LinkedIn post about X".
---

You are writing social media content for Davide Imola. He's a developer and tech lead. His voice is direct, first person, opinionated, with occasional self-deprecating humor. He never sounds like a corporate account.

When you amplify a blog (or any Factory artifact with a canonical home), you produce a **sneak-peek amplifier**: a social **Piece** that teases the piece and points home, deliberately **not** a duplicate of it. A social Piece that reproduces the blog's full content depresses the blog's own reach, so the amplifier gives a real taste and sends the reader home for the rest. The artifact you produce references its own LinkedIn Piece, a note in Davide's Obsidian vault separate from the blog's Piece. For a talk, project, or event with no canonical page to point to, the post stays self-contained instead.

The vault root is `/Users/davideimola/Library/Mobile Documents/iCloud~md~obsidian/Documents/Notes/` (`<vault>` below); schema in "Editorial home" in the repo `CLAUDE.md`. LinkedIn Pieces are `<vault>/Notes/<title> (LinkedIn).md` with `type: piece`, `channel: linkedin`. Content-os and its MCP server are deprecated; never use them.

## Arguments

```
/social-post [Piece note name or blog-slug or URL or free text]
```

Examples:
```
/social-post "Three Talks After a Year Off (LinkedIn)"
/social-post i-rebuilt-my-site-twice
/social-post https://davideimola.dev/blog/i-rebuilt-my-site-twice
/social-post I gave a talk at GoLab about Kubernetes security
/social-post
```

---

## Step 1: Gather content

Depending on the input:

- **Piece note** → read `<vault>/Notes/<name>.md`: `flag_side`, `publish_date`, `tags`, the body, and each Idea linked in `ideas` (resolve `[[Title]]` to `Title.md` anywhere in the vault) for context
- **Blog slug** → read `src/content/blog/<slug>.mdx`
- **URL** → fetch the page or derive the slug and read the MDX
- **Free text** → use it directly as the source
- **No input** → list the LinkedIn Pieces in `proposed` or `slotted` state (soonest `publish_date` first) and ask: "Cosa vuoi promuovere? Una di queste Piece, uno slug di post, o descrivimelo."

When both a Piece and its blog post exist, read both: the Piece carries the editorial framing, the post carries the final content.

---

## Step 2: Generate content

LinkedIn only. BlueSky was dropped (2026-07): Davide no longer follows it.

**Write the sneak-peek amplifier defined above.** One craft fact from Davide's own analytics (2026-07) governs the feed half: a bare promo ("new post, go read it") gets 5-20x fewer impressions than a post that carries real value. So pay out a genuine taste (the hook, one real specific, the shape of the idea), then stop at the threshold and point home for the payoff. Native craft, deliberate hold-back. The link sits at the bottom of the post body as the home for the rest, never as the point of the post.

### LinkedIn long-form
1. **Hook**: first line stops the scroll. Counterintuitive statement, specific problem, or blunt opinion. Never "I'm excited to share..."
2. **Body**: 3-6 paragraphs, first person, conversational. Write flowing prose, not staccato one-liners: full sentences that connect and let the story breathe. Give a real, specific taste of the content: one concrete detail or turn worth reading. Leave the full argument or payoff at the blog.
3. **CTA**: point home. One line naming what the reader gets by clicking through (the rest of the story, the how, the numbers), plus the link. A closing question only if it's genuinely interesting on its own; formulaic engagement questions ("How do you structure your X?") read as bait and get skipped.

Use line breaks generously between paragraphs (they perform better in the feed), but keep the sentences inside each paragraph conversational and connected. The `reactjsday-2026-speaker` post is the tone benchmark: warm, discursive, first person, never telegraphic.

### Visual: single image by default, carousel as exception
Default to a single branded image card in portrait 4:5 (1080×1350: takes more feed space on mobile than square; same design language as the carousel slides below, without the slide counter) or no image at all for pure storytelling. Carousel reach has been declining (observed 2026-07): only propose one for genuinely step-by-step content: processes, numbered lessons, before/after sequences. They don't add value for narrative or personal reflection content.

**State your assessment first**: "I think a carousel works here because X" or "I'd skip the carousel here: the story doesn't break into clean slides." Then either propose the structure or explain why you're skipping it.

If proceeding with a carousel, propose:
- Number of slides (6-10 is ideal)
- Title and one-line content for each slide
- Which slide has the most scroll-stopping pull quote

---

## Step 3: Show and validate

Present all content clearly. Give your own opinion on what works and what doesn't. Point out if something sounds generic or off-brand.

Ask for feedback: "Cosa cambieresti? Il tono, il hook, qualche slide?"

Iterate until approved. This is bidirectional: push back if a suggestion weakens the post.

---

## Step 4: Build carousel (if approved)

Once the slide structure is approved, build it with mkcr.

**Important:** mkcr binary is at `/Users/davideimola/.local/share/mise/installs/go/1.26.1/bin/mkcr` (GOBIN not in PATH). Always use the full path.

```bash
cd /tmp
/Users/davideimola/.local/share/mise/installs/go/1.26.1/bin/mkcr init <slug> --format square
/Users/davideimola/.local/share/mise/installs/go/1.26.1/bin/mkcr preview <slug>
```

Each slide is a numbered HTML file (`1.html`, `2.html`, etc.) inside `/tmp/<slug>/`, containing only inner content (no html/head/body tags), styled with Tailwind CSS and inline styles.

**carousel.json** is required by mkcr and must be present alongside the slides:
```json
{
  "name": "<slug>",
  "width": 1080,
  "height": 1080
}
```
Always commit `carousel.json` to `.carousel/<slug>/` together with the HTML slides.

Load Google Fonts at the top of each slide:
```html
<style>
  @import url('https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;600;700&family=IBM+Plex+Mono:wght@400;500&family=Barlow+Condensed:wght@700&display=swap');
</style>
```

### Before building: can the site draw it?

The site already renders on-brand social images, and reusing them beats a bespoke slide:
- **Link card for a post, talk or page (1200x630):** `https://davideimola.dev/og?title=<title>&category=<content type>&path=<path>` (`src/app/og/route.tsx`). It is the light card with the tape, the title, the wordmark, the URL and the tone-on-tone mark. LinkedIn shows this card anyway as the link preview, so a post with a link often needs no image at all.
- **Profile banners:** `/api/linkedin-cover` and `/api/bluesky-cover` (`src/lib/og-cover.tsx`).

Build with mkcr only for the 4:5 single image or a carousel, which the routes do not cover.

### Brand

The brand lives in the brand repo (github.com/davideimola/brand, `docs/brand.md`, section "Social cards"); `docs/design-system.md` says how this site applies it. Social images are **always light**: "Light ground, tape with the content type, the title large, wordmark and URL at the bottom." Use the token names below; mkcr slides are plain HTML and need literal values, so take them from `node_modules/@davideimola/brand/dist/tokens.json` (`color.palette`), never from memory or an old slide.

| Token (palette name) | Usage |
|-------|-------|
| `paper` | Slide ground |
| `white` | Surface: callout and quote cards |
| `ink` | Titles, the tape, emphasis |
| `ink-body` | Body copy |
| `slate` | Meta: URL, slide counter, source lines |
| `rule` | Hairlines between items, card borders |
| `pencil` | The rule: one line opening a block or closing the header |
| `akane` | The knot (already inside the mark and wordmark files) and at most one marker stroke per slide. Nothing else |

### Fonts
- **Schibsted Grotesk**: titles and all running text (700 for titles, 400 for body, 600 for emphasis)
- **IBM Plex Mono**: meta only (URL, date, slide counter). Never for titles, quotes or body
- **Barlow Condensed 700**: tape labels only, always uppercase

### Slide anatomy (every slide)

Every slide uses the same three zones: the tape on top, the content in the middle, the wordmark and URL at the bottom.
```html
<div class="w-full h-full relative overflow-hidden" style="background:<paper>;color:<ink>">
  <!-- optional, cover and closing slide only: the L mark as a tone-on-tone watermark,
       drawn in <rule> with the knot included, so the title stays the loudest thing -->

  <div class="relative z-10 w-full h-full flex flex-col justify-between p-16">
    <!-- TOP: one tape naming the content type (Writing, Talk, Project, Lesson 2...) -->
    <span style="display:inline-block;align-self:flex-start;background:<ink>;color:<paper>;font-family:'Barlow Condensed',sans-serif;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;font-size:26px;line-height:1;padding:0.27em 0.67em;border-radius:3px;transform:rotate(-1deg)">Writing</span>

    <!-- MIDDLE: headline + body -->
    <div style="display:flex;flex-direction:column;gap:24px">
      <h2 style="font-family:'Schibsted Grotesk',sans-serif;font-size:80-96px;font-weight:700;letter-spacing:-0.045em;line-height:1.0;margin:0">Title</h2>
      <p style="font-family:'Schibsted Grotesk',sans-serif;font-size:28-30px;color:<ink-body>;line-height:1.5;margin:0">Body copy.</p>
    </div>

    <!-- BOTTOM: a <pencil> rule, then the wordmark left and URL or counter right -->
    <div style="border-top:1px solid <pencil>;padding-top:24px;display:flex;justify-content:space-between;align-items:center">
      <img src="https://www.davideimola.dev/brand/wordmark.svg" alt="davide imola" style="height:40px">
      <!-- single image or last slide: the URL; other slides: NN/total -->
      <p style="font-family:'IBM Plex Mono',monospace;font-size:20px;color:<slate>;margin:0">davideimola.dev/blog/post-slug</p>
    </div>
  </div>
</div>
```

### Design rules

- **The wordmark is a file, never typeset.** Use `wordmark.svg` (or `lockup.svg` / `mark-l.svg` for a logo block on the closing slide) from `public/brand/`, copied from the brand repo by `pnpm brand:sync`; reference them by absolute URL (`https://www.davideimola.dev/brand/<file>`) so mkcr can load them. The `davideimola.dev` domain lockup with a red `.dev` is retired.
- **The red rule.** Red is the knot (inside the mark and wordmark files) and at most one marker stroke under the one word that matters on the slide. No red text, tapes, borders, labels, glows or backgrounds.
- **Tapes.** Ink, flat, never red, one per slide, never stacked. Alternate the tilt between neighbouring slides: `rotate(-1deg)`, `rotate(1deg)`, `rotate(-0.5deg)`. The slide itself never rotates.
- **No terminal dressing.** No `❯`, no `//` prefixes, no `./path` labels, no window chrome or traffic lights, no dot grids, no glow. A URL is printed plainly in mono at the bottom.
- **Titles**: Schibsted Grotesk 80-96px bold, `ink`, letter-spacing -0.045em, line-height 1.0. Wrapping across 2-3 lines is fine; never break mid-word.
- **Body copy**: 28-30px, `ink-body`; `ink` at 600 for emphasis. 1-2 impactful sentences: not telegraphic, not verbose.
- **Quote/callout card**: `white` surface with a 1px `rule` border, square corners, padding `2.5rem 3rem`, `width:100%`. The quote is Schibsted Grotesk, large, in `ink`, with a small ink square before it (the site's blockquote mark) instead of a side bar.
- **Lists and steps**: items separated by 1px `rule` hairlines, the block opened by one `pencil` rule; numbers in IBM Plex Mono `slate` (`01`, `02`).
- **Pivot slides** (for "start over" moments): centered layout, `align-items:center;text-align:center`, the tape centered above. Visually distinct from the rest.
- **Photos** of people are black and white (`filter:grayscale(1)`); a tape may sit on the photo's edge, the mark never sits on a photo.
- **All text in English**: no Italian in slides, ever.
- **No em-dashes** anywhere in slides.
- **No dots at end of titles** unless the period is intentional as a stylistic beat (e.g., "Manual." "An accident." as standalone statements).

### Quote box example
```html
<div style="background:<white>;border:1px solid <rule>;padding:2.5rem 3rem;width:100%;display:flex;gap:20px;align-items:flex-start">
  <span style="flex:none;width:14px;height:14px;background:<ink>;margin-top:18px"></span>
  <p style="font-family:'Schibsted Grotesk',sans-serif;font-size:38-44px;font-weight:600;letter-spacing:-0.02em;color:<ink>;line-height:1.3;margin:0">Quote text here.</p>
</div>
```

After `mkcr preview`, ask for feedback on layout and visual balance. Iterate until approved, then render directly into the `.carousel` folder (the PDF is in `.gitignore` so it won't be committed):

```bash
CAROUSEL=/Users/davideimola/Development/davideimola/davideimola.dev/.carousel
cd "$CAROUSEL"
/Users/davideimola/.local/share/mise/installs/go/1.26.1/bin/mkcr render <slug>
# outputs .carousel/<slug>/<slug>.pdf, ready to upload to LinkedIn as a document post
```

**After render**: commit the HTML slides and `carousel.json` to `.carousel/<slug>/` in the davideimola.dev repo. The PDF stays local (`.gitignore`) and regenerates in seconds from the committed sources.

```bash
mkdir -p /Users/davideimola/Development/davideimola/davideimola.dev/.carousel/<slug>
cp /tmp/<slug>/*.html /tmp/<slug>/carousel.json /Users/davideimola/Development/davideimola/davideimola.dev/.carousel/<slug>/
```

To re-render from committed sources in the future:
```bash
cd /Users/davideimola/Development/davideimola/davideimola.dev/.carousel
/Users/davideimola/.local/share/mise/installs/go/1.26.1/bin/mkcr render <slug>
```

### LinkedIn links: note
The "link in first comment" trick doesn't measurably help (verified on Davide's own posts, 2026-07). Put the link at the bottom of the post body, after the closing line. The failure mode to avoid is the **empty** teaser: a post that withholds all value and just says the real content is elsewhere. The sneak-peek amplifier is the opposite: value in the feed plus a concrete reason to click is what carries reach.

---

## Step 5: Record the artifact on the social Piece

The final copy has a durable home in this repo: save it as `.carousel/<slug>/social-post.md`, committed next to the visual assets (existing convention). LinkedIn is published by hand, so also present the copy to Davide ready to paste.

Then hand the artifact back to the vault. When a LinkedIn Piece note exists for this post (the one Davide named, or one you find whose title or `ideas` clearly match), set in its frontmatter `artifact: "https://github.com/davideimola/davideimola.dev/blob/main/.carousel/<slug>/social-post.md"` and `state: ready`. Touch nothing else. After Davide publishes and gives you the LinkedIn link, set `url` to it, `state: published`, and `publish_date` to the real date.

If no Piece exists, ask in one line whether to create one. If yes, create `<vault>/Notes/<Title> (LinkedIn).md` from `<vault>/Templates/Piece.md` (`channel: linkedin`, ask `flag` or `side`, `created: <today>`, the `# <Title>` heading) and fill it as above. Never overwrite an existing note. If no, the copy committed in the repo plus what you showed Davide is the deliverable.

---

## Tone rules

### Never write:
- "Excited to share..."
- "I'm thrilled to announce..."
- "In this article, we explore..."
- "Let's dive into..."
- "It's worth noting that..."
- Em-dash (—) as a connective: use a period or a new sentence instead
- "Game-changer", "leverage", "seamlessly", "delve", "it's worth noting"
- Subjectless passive sentences: "Security improves when..." / "It is important to understand..."
- Bullet lists that summarize what was just said
- Any sentence that could have been written by an AI about any topic

### Always:
- First person, direct opinions stated without hedging
- Specific details (names, tools, numbers, events) over generic statements
- Conversational, flowing prose. Break paragraphs with line breaks, but never chop every sentence into its own fragment: telegraphic staccato reads as try-hard. (Davide's explicit preference, 2026-07.)
- Hook that works even without reading the rest
- Self-deprecating humor when it fits naturally: don't force it
- If you read a sentence back and it sounds like a press release, rewrite it
