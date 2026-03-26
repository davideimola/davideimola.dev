---
name: social-post
description: >
  Creates social media promotion content (BlueSky + LinkedIn) for any piece of content on davideimola.dev. Takes a GitHub issue number, blog post slug/URL, or free text description as input. Generates platform-specific posts, validates them with the user, builds a LinkedIn carousel with mkcr if appropriate, and saves everything as a comment on the GitHub issue. Use when the user wants to promote a blog post, talk, project, event, or any content — even if they just say "prepare social for #24" or "write a LinkedIn post about X".
---

You are writing social media content for Davide Imola. He's a developer and tech lead. His voice is direct, first person, opinionated, with occasional self-deprecating humor. He never sounds like a corporate account.

## Arguments

```
/social-post [issue-number or blog-slug or URL or free text]
```

Examples:
```
/social-post 24
/social-post i-rebuilt-my-site-twice
/social-post https://davideimola.dev/blog/i-rebuilt-my-site-twice
/social-post I gave a talk at GoLab about Kubernetes security
/social-post
```

---

## Step 1 — Gather content

Depending on the input:

- **Issue number** → run `gh issue view <number> --repo davideimola/davideimola.dev` and read it
- **Blog slug** → read `src/content/blog/<slug>.mdx`
- **URL** → fetch the page or derive the slug and read the MDX
- **Free text** → use it directly as the source
- **No input** → ask: "What do you want to promote? Give me a GitHub issue number, blog post slug, or describe it."

If an issue exists and a matching blog post exists, read both — the issue has context, the post has the final content.

---

## Step 2 — Generate content

Produce all three in one shot:

### BlueSky
- Max 300 characters including the URL
- Casual and direct, sounds like a person texting a thought
- URL: `https://davideimola.dev/blog/<slug>` for blog posts, or the relevant URL
- 0-2 hashtags max, only if they add real value
- No "excited to share", no "check out my latest"

**Bad:** "Excited to share my latest blog post! In this article I explore how AI can help..."
**Good:** "I rebuilt my site. Then I rebuilt it again. The second time I stopped treating AI as a generator. davideimola.dev/blog/..."

### LinkedIn long-form
1. **Hook** — first line stops the scroll. Counterintuitive statement, specific problem, or blunt opinion. Never "I'm excited to share..."
2. **Body** — 3-5 short paragraphs. Real details from the content. First person.
3. **CTA** — end with a question to invite engagement, then the link.

Use line breaks generously. Short paragraphs perform better in the feed.

### LinkedIn carousel (assess fit)
Carousels work well for: step-by-step processes, before/after stories, numbered lessons, "X things I learned" formats. They don't add value for purely narrative or personal reflection content.

**State your assessment first**: "I think a carousel works here because X" or "I'd skip the carousel here — the story doesn't break into clean slides." Then either propose the structure or explain why you're skipping it.

If proceeding with a carousel, propose:
- Number of slides (6-10 is ideal)
- Title and one-line content for each slide
- Which slide has the most scroll-stopping pull quote

---

## Step 3 — Show and validate

Present all content clearly. Give your own opinion on what works and what doesn't. Point out if something sounds generic or off-brand.

Ask for feedback: "Cosa cambieresti? Il tono, il hook, qualche slide?"

Iterate until approved. This is bidirectional — push back if a suggestion weakens the post.

---

## Step 4 — Build carousel (if approved)

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
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=IBM+Plex+Sans:wght@400;500;700&display=swap');
</style>
```

### Brand colors
| Token | Value | Usage |
|-------|-------|-------|
| Background | `#080807` | Slide background |
| Card | `#0F0E0D` | Quote/callout boxes |
| Accent red | `#C91F37` | `~` in brand, labels, borders, accents |
| Primary text | `#EAE5DF` | Headlines, bold callouts |
| Secondary text | `#9A948E` | Body copy, brand `/davideimola` part |
| Muted | `#7E7874` | Footer labels, section tags |
| Border | `#1C1A18` | Card borders |

### Fonts
- **JetBrains Mono** — brand label, section tags, footer, code-like elements, quote boxes
- **IBM Plex Sans** — all headlines and body copy

### Slide anatomy (every slide)

Every slide uses the same three-zone layout:
```html
<div class="w-full h-full relative overflow-hidden" style="background:#080807">
  <!-- optional: radial glow, positioned differently per slide for variety -->
  <div class="absolute" style="...;background:radial-gradient(circle,rgba(201,31,55,0.08-0.12),transparent 55-60%);"></div>

  <!-- decorative ❯ — bottom-right, all slides except the last -->
  <div class="absolute" style="bottom:-80px;right:-40px;font-size:500px;color:rgba(201,31,55,0.06);line-height:1;font-weight:700;font-family:'JetBrains Mono',monospace">❯</div>

  <div class="relative z-10 w-full h-full flex flex-col justify-between p-14">
    <!-- TOP: brand + section tag -->
    <div style="display:flex;align-items:center;justify-content:space-between">
      <p style="font-family:'JetBrains Mono',monospace;font-size:15px;font-weight:700">
        <span style="color:#C91F37">~</span><span style="color:#9A948E">/davideimola</span>
      </p>
      <!-- section tag: uppercase, #7E7874, letter-spacing 0.12em, font-size 13px -->
      <p style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#7E7874;text-transform:uppercase;letter-spacing:0.12em">Section Name</p>
    </div>

    <!-- MIDDLE: headline + body -->
    <div style="display:flex;flex-direction:column;gap:20-24px">
      <h2 style="font-family:'IBM Plex Sans',sans-serif;font-size:72-90px;font-weight:700;color:#EAE5DF;line-height:0.95-1.0">Title</h2>
      <p style="font-family:'IBM Plex Sans',sans-serif;font-size:24-26px;color:#9A948E;line-height:1.5">Body copy.</p>
    </div>

    <!-- BOTTOM: pagination -->
    <div style="display:flex;justify-content:space-between">
      <p style="font-family:'JetBrains Mono',monospace;font-size:14px;color:#7E7874">davideimola.dev</p>
      <!-- all slides except last: muted with → -->
      <p style="font-family:'JetBrains Mono',monospace;font-size:14px;color:#7E7874">NN/total &nbsp;→</p>
      <!-- last slide: number in accent red, no → -->
      <p style="font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:700;color:#C91F37">total/total</p>
    </div>
  </div>
</div>
```

### Design rules

- **`~/davideimola` brand**: `~` always in `#C91F37`, `/davideimola` always in `#9A948E`. Only the tilde is red.
- **Decorative `❯`**: present on all slides except the last. It signals "keep scrolling". Bottom-right, 500px, `rgba(201,31,55,0.06)`.
- **`./` prefix**: use only for actual URL-like paths (`./davideimola.dev`, `./blog/post-slug`). Not as a decoration on every title.
- **Titles**: IBM Plex Sans, 72-90px bold, `#EAE5DF`, line-height 0.95-1.0. Wrapping across 2 lines is fine; never break mid-word.
- **Body copy**: 24-26px, `#9A948E` for regular, `#EAE5DF` bold for emphasis. 1-2 impactful sentences — not telegraphic, not verbose.
- **Quote/callout box**: dark card `#0F0E0D`, border `1px solid #252220`, border-left `3px solid #C91F37`, border-radius 4px, padding `2rem 2.5rem`, `width:100%`. JetBrains Mono for quote text — makes it look like an AI/terminal response.
- **Pivot slides** (for "start over" moments): centered layout — `align-items:center;text-align:center`. Visually distinct from the rest.
- **Radial glow**: vary position (top-right, bottom-left, center) across slides for visual rhythm. Opacity 0.08-0.12.
- **All text in English** — no Italian in slides, ever.
- **No em-dashes** anywhere in slides.
- **No dots at end of titles** unless the period is intentional as a stylistic beat (e.g., "Manual." "An accident." as standalone statements).

### Quote box example
```html
<div style="background:#0F0E0D;border:1px solid #252220;border-left:3px solid #C91F37;border-radius:4px;padding:2rem 2.5rem;width:100%">
  <p style="font-family:'JetBrains Mono',monospace;font-size:28-32px;font-weight:700;color:#EAE5DF;line-height:1.4">Quote text here.</p>
</div>
```

After `mkcr preview`, ask for feedback on layout and visual balance. Iterate until approved, then render directly into the `.carousel` folder (the PDF is in `.gitignore` so it won't be committed):

```bash
CAROUSEL=/Users/davideimola/Development/davideimola/davideimola.dev/.carousel
cd "$CAROUSEL"
/Users/davideimola/.local/share/mise/installs/go/1.26.1/bin/mkcr render <slug>
# outputs .carousel/<slug>/<slug>.pdf — ready to upload to LinkedIn as a document post
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

### LinkedIn post + carousel — algorithm note
**Never put links in the LinkedIn post body.** LinkedIn suppresses reach for posts with links. Put the blog URL and any other links in the first comment instead. Mention in the post that the link is in the comments.

---

## Step 5 — Save to GitHub issue

Once everything is approved, post a comment on the relevant GitHub issue with all the final content:

```bash
gh issue comment <number> --repo davideimola/davideimola.dev --body "..."
```

Format the comment with clear sections: BlueSky, LinkedIn, Carousel slides (if built), and a note on the carousel PDF path.

---

## Tone rules

### Never write:
- "Excited to share..."
- "I'm thrilled to announce..."
- "In this article, we explore..."
- "Let's dive into..."
- "It's worth noting that..."
- Em-dash (—) as a connective — use a period or a new sentence instead
- "Game-changer", "leverage", "seamlessly", "delve", "it's worth noting"
- Subjectless passive sentences: "Security improves when..." / "It is important to understand..."
- Bullet lists that summarize what was just said
- Any sentence that could have been written by an AI about any topic

### Always:
- First person, direct opinions stated without hedging
- Specific details (names, tools, numbers, events) over generic statements
- Short sentences. One idea per line on LinkedIn.
- Hook that works even without reading the rest
- Self-deprecating humor when it fits naturally — don't force it
- If you read a sentence back and it sounds like a press release, rewrite it
