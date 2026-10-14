# ADR-0005: Retire /terminal and the shell jokes in search

- **Status:** Accepted
- **Date:** 2026-10-14
- **Amends:** ADR-0004, decision 4

## Context

ADR-0004 dropped the terminal aesthetic site-wide but kept `/terminal`, the interactive shell, as a feature "inside the new chrome". Its pitch was "every page on this site pretends to be a terminal; this one actually answers". After the rebrand no page pretends to be a terminal any more, so the joke has nothing to land on: the page read as a leftover of the old site, and so did the shell easter eggs in the ⌘K search (`sudo rm -rf /`, `vim`, `git push --force`).

## Decision

1. `/terminal` is removed with its command engine (`src/lib/terminal.ts`), the `InteractiveTerminal` component and their tests and story. `/terminal` redirects permanently to `/`; the footer, the 404 page, the sitemap and the search index no longer link it.
2. The ⌘K palette is search only: pages, posts, projects and talks, grouped with the NavBar's names. No commands, no easter eggs.
3. No page keeps terminal content: `/links`, the other exception ADR-0004 named, had already shed it in its redesign.

## Consequences

- The `rate` command is gone; the rating link lives on `/links` (the conference-day card) and in the material column of `/sharing`.
- The library is read by `/shelf`, `/now` and `/links` only.
- Old shared links to `/terminal` land on the home page instead of a 404.
