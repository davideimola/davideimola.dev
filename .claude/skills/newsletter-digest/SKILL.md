---
name: newsletter-digest
description: >
  Drafts the monthly newsletter digest for davideimola.dev for the author to review. Harvests the month's window (blog posts published, upcoming talks, optional projects) via harvestWindow plus the content-os MCP cross-channel view, writes a frozen .mdx issue file (harvested sections snapshotted + a suggested intro to rewrite), generates the email HTML, and creates a Kit broadcast DRAFT (never sends) with the on-site "read on web" link, then stops for human review and a manual send. Same philosophy as write-blog-post / social-post: it drafts, Davide reviews the intro and triggers the send by hand. Use when Davide wants to draft, assemble, or prepare the monthly newsletter issue ("prepara la newsletter del mese", "draft the digest", "newsletter di luglio").
---

You assemble Davide's monthly newsletter digest for davideimola.dev. The model is a **harvest**: an issue is ~90% auto-assembled from content that already exists in the repo (blog posts in the window, upcoming talks, optionally projects) plus a short hand-written intro. So an issue costs minutes and is worth publishing even at a small list. You **draft**; Davide rewrites the intro in his own voice, reviews, and triggers the send himself from Kit. You never send.

Architecture (ADR-0002): the site owns the content, the archive, and the subscribe form; Kit owns delivery + double opt-in + unsubscribe. Each issue is a **frozen** `.mdx` in `src/content/newsletter/` - the single source for both the sent email and the on-site archive page, snapshotted at draft time ("photograph, not mirror").

You orchestrate three things that already exist and are tested:
- `harvestWindow({ from, to, posts, talks, projects? })` in `src/lib/harvest.ts` - the selection engine.
- `renderIssueEmail(issue)` / `draftIssueBroadcast(issue)` in `src/lib/newsletter-email.mts` - compiles the issue MDX with the email component map and creates the Kit draft. Runnable as `pnpm newsletter:draft [slug]`.
- The Kit wrapper template (`docs/newsletter/kit-email-template.html`) supplies the header, footer, and unsubscribe - so the issue body stays content-only.

## Arguments

```
/newsletter-digest [month, optional: YYYY-MM]
```

Examples:
```
/newsletter-digest 2026-07
/newsletter-digest
```

---

## Step 1 - Pick the window

Confirm the month being reported. Default to the **month just closing** (send near the end of the month, covering that month). Turn it into an inclusive window:
- `from` = first day of the month (`YYYY-MM-01`)
- `to` = last day of the month (the send date)

State the window and the slug (`YYYY-MM`) and confirm with Davide before harvesting.

If an issue file already exists for that month (`src/content/newsletter/YYYY-MM.mdx`), say so and ask whether to regenerate it or pick a different month - never silently overwrite a frozen issue.

---

## Step 2 - Harvest

Gather the raw material, then let the engine select:

1. **From the repo** - read `getAllPosts()`, `getAllTalks()` (and `getAllProjects()` if you want the optional projects highlight) from `src/lib/content.ts`. Pass the **full** lists to `harvestWindow({ from, to, posts, talks, projects })` and let it do the windowing. Use `getAllTalks()`, not `getUpcomingTalks()`: the engine selects talks relative to the window end (`to`), so passing an already-now-filtered list would drop talks when back-drafting a past month. It returns:
   - `posts` - published within the window, newest-first.
   - `upcomingTalks` - scheduled after the window end, soonest-first.
   - `projects` - featured active projects (optional highlight).
   - `skippable` - true when there are no posts AND no upcoming talks.
2. **From content-os (MCP)** - read the cross-channel view for context: `list_calendar` and `list_proposals` (what shipped or is scheduled this month across channels), `list_ideas` (live sparks), and `get_metrics` if useful. This is context to enrich the intro and to cross-reference (e.g. a talk announced, a companion social post), not content to dump in.

**Empty month = skippable.** If `harvestWindow` reports `skippable`, do **not** produce a hollow issue. Tell Davide plainly: "No new posts and no upcoming talks for `<month>` - I'd skip this issue rather than send a thin one." Stop there unless he insists on sending anyway (e.g. a talk-only or announcement issue), in which case proceed with what exists.

---

## Step 3 - Assemble the frozen `.mdx`

Create the branch first: `git checkout -b newsletter/YYYY-MM`.

Compute the issue number: the next integer after the highest existing issue (`getAllIssues()` newest-first → `[0].issue + 1`, or `1` if none). Slug = `YYYY-MM`.

Write `src/content/newsletter/YYYY-MM.mdx` with this frontmatter:

```yaml
---
issue: <n>
subject: ""
previewText: ""
sendDate: "YYYY-MM-DD"   # the send date (end of the reported month)
---
```

The body is **MDX**: prose interleaved with inline components. The SAME components render on the on-site archive and in the email (see the component reference at the bottom), so you author once. Keep it a bit discursive - a line of prose between the component blocks is welcome, and the structure can vary month to month.

Body, in order:

1. **Intro (suggested, to rewrite).** Write 2-4 sentences of prose as a *starting point* and tell Davide clearly it's a draft to rewrite in his own voice. The intro is the non-negotiable minimum of voice - everything else is harvested. Keep the suggestion honest and specific, never "I'm excited to share".
2. **`<SectionHeader title="New on the blog" />`** then one **`<PostCard />`** per harvested post. Map from the post: `title`, `url="/blog/<slug>"` (root-relative; the email renderer absolutizes it), `category` (the post category), `description` (a one-line why-read-it you write), `meta="<Mon D, YYYY> · <readingTime>"` (from `post.date` + `post.readingTime`). Snapshot the real titles at draft time.
3. **`<SectionHeader title="Where to catch me" />`** then one **`<TalkRow />`** per upcoming talk: `event`, `date` (formatted), `location`, `type` (Conference/Meetup/...), optional `sessionTitle` (`talk.session.title`) and `url="/sharing#<slug>"`. Omit the whole section (header included) if there are no upcoming talks.
4. **(Optional) `<SectionHeader title="Also" />`** + a featured project/OSS highlight, only if it genuinely adds something. There is no ProjectCard: write it as prose with a Markdown link.
5. **A short close** - one or two lines of prose, in voice (again, a suggestion to rewrite). Optionally end with a **`<Cta href="/newsletter" variant="primary">Browse the archive →</Cta>`** and/or a ghost `<Cta>` inviting a reply.

Rules:
- Section breaks are **`<SectionHeader title="…" />`**, not Markdown `##`. Reserve `##`/`###` for sub-structure inside prose if ever needed (never `#`).
- **JSX attribute escaping**: use double-quoted attributes. Apostrophes are fine inside them (`description="A tool I don't use"`). If a value needs a literal double quote, use `&quot;` or an expression: `description={'Why "AI review" is not a strategy'}`.
- Content in **English**, **no em dash** (use a colon, comma, or a new sentence), no AI tells ("dive into", "it's worth noting", "delve"). Write real specifics, not filler.

Example body:

```mdx
Prose intro, in voice, a bit discursive: what this month was about.

<SectionHeader title="New on the blog" />

<PostCard
  title="AI will not secure your codebase"
  url="/blog/ai-will-not-secure-your-codebase"
  category="Technical"
  description="Why 'we added an AI reviewer' is not a security strategy."
  meta="Jul 18, 2026 · 7 min read"
/>

A short line of connective prose, because I want a bit of narrative here.

<SectionHeader title="Where to catch me" />

<TalkRow
  event="reactjsday 2026"
  date="Oct 23, 2026"
  location="Verona, Italy"
  type="Conference"
  sessionTitle="Shipping AI you can actually trust"
  url="/sharing#reactjsday-2026"
/>

Short close, in voice.

<Cta href="/newsletter" variant="primary">Browse the archive →</Cta>
```

Propose the `subject` and `previewText` too, and iterate with Davide on the intro/subject the way write-blog-post does - this is a short collaboration on the voice, not a handoff. The harvested sections are factual and rarely need debate.

---

## Step 4 - Generate the email + Kit broadcast draft

Once the `.mdx` is written, its `subject` and `previewText` frontmatter are filled (not empty), and Davide is happy with the intro, produce the reviewable draft. The Kit broadcast subject IS `issue.subject`, so an empty subject ships an empty-subject draft:

```bash
pnpm newsletter:draft YYYY-MM
```

This renders the issue to content-only email HTML (`renderIssueEmail`) and creates a Kit **broadcast draft** (`createBroadcastDraft`, `public:false`) - it **never sends**. The "read on web" link is set automatically to `https://davideimola.dev/newsletter/YYYY-MM`, and the header/footer/unsubscribe come from the Kit account template. It prints the broadcast id.

If it errors on a missing key, `KIT_API_KEY` is not in `.env.local` (server-side only, never `NEXT_PUBLIC_`).

---

## Step 5 - Stop for review, commit, and hand off the send

You stop here. Tell Davide the three review actions that are his:
1. Rewrite the intro in his own voice in the `.mdx`. Re-running `pnpm newsletter:draft YYYY-MM` after edits creates a **new** draft each time (Kit has no update path), so delete the previous draft in Kit to avoid stale duplicates.
2. In Kit: open the broadcast draft, preview it (wrapped in the account template), and use "Send test email" to check it in his inbox.
3. Trigger the actual send from Kit by hand when he's ready. **The skill never sends.**

Commit the frozen issue and open the PR on this repo (the `.mdx` is a davideimola.dev artifact):

```bash
git add src/content/newsletter/YYYY-MM.mdx
git commit -m "content(newsletter): issue #<n> - <subject>"
git push -u origin newsletter/YYYY-MM
gh pr create --title "Newsletter issue #<n>: <subject>" --body "<one-line summary>"
```

The newsletter is a channel, but its editorial planning is optional on content-os (per ADR-0002 / #70). If a newsletter Piece exists on the Pipeline for this issue, hand the artifact back with `set_piece_artifact(<piece-id>, <pr-url>)`; otherwise the committed `.mdx` + the Kit draft are the deliverable.

---

## Reference

- **Issue file**: `src/content/newsletter/YYYY-MM.mdx` (frozen; loaded by `src/lib/newsletter.ts`).
- **Frontmatter**: `issue` (number), `subject`, `previewText`, `sendDate` (ISO). Optional `draft: true` while working (hidden outside dev), removed before the PR.
- **Body components** (authored inline in the `.mdx`; the same names render on the site archive and in the email, so author once):
  - `<SectionHeader title="…" />` - a section break.
  - `<PostCard title url description category? meta? />` - a blog post; `url` root-relative (`/blog/<slug>`).
  - `<TalkRow event date location type? sessionTitle? url? />` - an upcoming talk; `url` root-relative (`/sharing#<slug>`).
  - `<Cta href variant?>label</Cta>` - a button; `variant` is `"primary"` (default) or `"ghost"`.
  Web implementations live in `src/components/newsletter/`, email ones in `src/emails/components/`; the name→component wiring is `mdx-components.tsx` in each (web) / (`src/emails/`). Links are absolutized for email automatically.
- **Cadence**: monthly, near end of month, covering the month just closing. Assisted send only.
- **Tone**: Davide's voice for the intro/close (direct, first person, specific, self-aware); harvested sections are factual. English, no em dash, no AI tells. Same rules as write-blog-post / social-post.
