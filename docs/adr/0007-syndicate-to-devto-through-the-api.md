# ADR-0007: Syndicate posts to dev.to through its API, not its RSS import

- **Status:** Accepted
- **Date:** 2026-11-11

## Context

dev.to was importing posts from `/rss.xml`, and the copies came out broken: the feed carried raw MDX instead of HTML, root-relative links and figures pointed at dev.to, there was no cover, the tags broke dev.to's rules (at most four, lowercase, alphanumeric), and `title="…"` code fences, GitHub alerts and `<DrawnFigure>` meant nothing there. dev.to is still worth being on: it reaches readers the site does not.

## Decision

1. A post reaches dev.to as a **Syndicated copy** (see `CONTEXT.md`): the post's own words, adapted only to what dev.to can display, with `canonical_url` pointing at the post and a fixed footer naming the original and inviting the reader to the newsletter. It holds no words of its own, so it is generated, never edited on dev.to.
2. Copies are made through the dev.to (Forem) API, not the RSS import, which is switched off in dev.to's settings. The import cannot set a cover, normalise tags or join a series, and it imports a post once, so a later fix never reaches the copy.
3. A daily GitHub Action publishes the copy directly, three days after the post's `publishDate`, so search engines meet the original first. It only considers posts dated from the day the Action was switched on; older posts are brought over by hand with the same code, one at a time, so the archive never floods dev.to in a day. A post opts out with `syndicate: false` in its frontmatter.
4. The Action keeps no state. Each run lists the account's articles, matches them to posts by `canonical_url`, and creates a missing copy or rewrites one whose title, description, body, tags or published state differ from what the post generates. A published copy is kept in step whatever its post's date; a draft left by the old import is touched only once its post is due. A state file would mean a commit, and so a deploy, for every copy.
5. Copies are published under the Playful Programming organisation, not the personal profile: its followers are the reach, and the copies the RSS import left were already there.
6. Tags are the post's first four, normalised, unless the frontmatter names `devtoTags`. Figures go over as PNG renders of their SVG, with the caption under them.

## Consequences

- A manual edit on dev.to is overwritten on the next run that finds the body changed: correct the post instead.
- `/rss.xml` is fixed in the same change to carry HTML with absolute URLs, for every feed reader, but dev.to no longer reads it.
- dev.to is not tracked as a channel in Trilium.
