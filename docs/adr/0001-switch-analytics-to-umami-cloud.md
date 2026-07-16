# ADR-0001: Switch web analytics from Vercel Web Analytics to Umami Cloud

- **Status:** Accepted
- **Date:** 2026-07-16
- **Research:** [Free-tier analytics comparison](../research/analytics-free-tier-comparison.md) (all numbers verified against primary sources on 2026-07-16)

## Context

The site runs on Vercel's Hobby plan and uses Vercel Web Analytics (`@vercel/analytics`) plus Vercel Speed Insights (`@vercel/speed-insights`), both mounted in the root layout. Vercel Web Analytics on Hobby is limited to 50K events/month shared across all account projects, a 1-month reporting window, and no custom events.

Site analytics serve two roles: a human dashboard today (which posts perform, where traffic comes from), and a data reserve for the planned Content OS (measuring how LinkedIn posts convert into site traffic, via UTM parameters). The Content OS has no programmatic-access requirement yet; a 1-month window makes post-performance comparison over time impossible either way (Vercel's API cannot reach past the reporting window on Hobby).

The zero-cost constraint rules out paid tiers. Researched alternatives (Plausible CE, GoatCounter, Cloudflare Web Analytics, self-hosted Umami) were each ruled out in the linked research doc — respectively: needs a paid VPS, cannot distinguish the two site domains in one property, aggregates data to ~10% after 7 days, operationally fragile on free database tiers.

## Decision

Switch to **Umami Cloud, Hobby tier ($0)**: 100K events/month, 6-month retention, custom events and CSV export included, cookieless (no consent banner needed). One Umami website property covers both `davideimola.dev` and `links.davideimola.dev` via the hostname filter.

Specifics settled with the decision:

1. **Clean cut, no parallel period.** `@vercel/analytics` is removed in the same deploy that adds Umami (one deploy total, per the grouped-commits constraint). `@vercel/speed-insights` stays — it is a separate product, unaffected.
2. **First-party proxy from day one.** The Umami script and collect endpoint are proxied through the site's own domain via `next.config.ts` rewrites (officially documented by Umami) under a neutral, non-obvious path, since the third-party `cloud.umami.is` origin is on ad-blocker blocklists and the site's audience (developers) blocks at above-average rates. The proxy path must be excluded from the `links.davideimola.dev` deep-path redirect (as `/_next/` already is) so tracking works on the subdomain.
3. **Minimal scope: pageviews + UTM only.** Custom events (terminal commands, /links block clicks, share buttons) are a separate future decision — note that on Umami each stored event property counts against the event budget.
4. **No export of Vercel history.** The last month of aggregated data (the only guaranteed window on Hobby) is knowingly discarded.

## Consequences

- Retention grows from 1 to 6 months, making time-based post-performance comparison possible; the event budget doubles and is no longer shared with other Vercel projects on the account.
- Analytics moves out of the Vercel dashboard into a second tool, and requires a Umami Cloud account with the website ID exposed to the app (public env var).
- Umami's free tier has **no API access**. If the Content OS later needs programmatic reads, the exit paths are Umami Pro ($20/month) or self-hosting with full DB ownership (Cloud → self-host migration is supported via the free tier's data export). This decision explicitly defers that choice.
- Ad-blocker loss cannot be measured against a baseline (no parallel period), which is why the first-party proxy is mandatory, not optional.
- Umami Hobby's over-limit behavior is undocumented (flagged UNVERIFIED in the research); at current traffic levels the 100K budget is not a realistic concern.
