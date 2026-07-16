# Free-tier analytics comparison: stay on Vercel Web Analytics or switch?

**Research date: 2026-07-16.** Free-tier limits change often — every number below was verified against the primary source linked next to it on this date. Re-verify before acting on this months from now.

Scope: davideimola.dev (Next.js 16 App Router, Vercel Hobby plan) plus the `links.davideimola.dev` subdomain, which is served by the **same Vercel deployment** via a host-based rewrite. Constraint: zero cost.

## TL;DR / Recommendation

- **The strongest zero-cost upgrade is Umami Cloud (Hobby, $0):** 100K events/month vs Vercel's 50K, **6-month retention vs 1 month**, custom events included (Vercel Hobby has none), and CSV data export on the free tier ([Umami pricing](https://umami.is/pricing)). Main costs: a third-party script you should proxy through a Next.js rewrite to survive ad blockers ([official guide](https://docs.umami.is/docs/bypass-ad-blockers)), no API access on the free tier, and a second dashboard.
- **Staying is defensible only if a 1-month window is enough.** Vercel Hobby guarantees just 1 month of viewable data and no custom events; collection *pauses* when you hit 50K events/month ([Vercel limits](https://vercel.com/docs/analytics/limits-and-pricing)).
- **There is almost no lock-in penalty to switching:** on Hobby only ~1 month of history is guaranteed to exist anyway, and it can be saved as per-panel CSVs (max 250 rows each) before switching ([CSV export](https://vercel.com/docs/analytics/using-web-analytics#exporting-data-as-csv)). Speed Insights is a separate product and is unaffected either way.
- **Cheapest robust path: run both in parallel for a month** (both are cookieless, no banner needed), then remove `@vercel/analytics` if Umami holds up. Zero cost, zero data gap.
- Self-hosted Umami on free tiers is *possible* but operationally fragile (Neon auto-suspends compute after 5 min on the free plan); Plausible cloud has no free tier and its Community Edition needs a real VPS; GoatCounter is free but can't distinguish the two domains in one property; Cloudflare Web Analytics aggregates data down to ~10% after 7 days. Details per tool below.

## Comparison table (hard numbers)

| | Vercel WA (Hobby) | Umami Cloud (Hobby) | Umami self-hosted | Plausible CE | GoatCounter (hosted) | Cloudflare WA |
|---|---|---|---|---|---|---|
| Cost | $0 (included) [→](https://vercel.com/docs/analytics/limits-and-pricing) | $0 [→](https://umami.is/pricing) | $0 software; infra "free" only with caveats | $0 software; needs paid VPS in practice [→](https://github.com/plausible/community-edition) | $0 for "reasonable public usage" [→](https://www.goatcounter.com/help/terms) | $0, "available on all plans" [→](https://developers.cloudflare.com/web-analytics/) |
| Events/month | 50,000 (shared across all projects) [→](https://vercel.com/docs/analytics/limits-and-pricing) | 100,000 [→](https://umami.is/pricing) | unlimited (your DB) | unlimited (your DB) | no numeric limit; "millions of pageviews/day" excluded [→](https://www.goatcounter.com) | no documented event cap; 10-site soft limit [→](https://developers.cloudflare.com/web-analytics/faq/) |
| Retention | 1 month reporting window [→](https://vercel.com/docs/analytics/limits-and-pricing) | 6 months [→](https://umami.is/pricing) | unlimited | unlimited | not documented (UNVERIFIED) | 6 months; unsampled only 7 days [→](https://developers.cloudflare.com/web-analytics/faq/) |
| Custom events | No (Pro+) [→](https://vercel.com/docs/analytics/limits-and-pricing) | Yes [→](https://umami.is/pricing) | Yes | Yes | Yes (events) | No ("not yet supported") [→](https://developers.cloudflare.com/web-analytics/faq/) |
| Data export (free tier) | CSV per panel, ≤250 rows [→](https://vercel.com/docs/analytics/using-web-analytics#exporting-data-as-csv) | Yes [→](https://umami.is/pricing) | Full DB access | Full DB access | CSV + JSON API [→](https://www.goatcounter.com/help/faq) | Not documented (UNVERIFIED) |
| Script (gzip, measured 2026-07-16)¹ | 1.3 KB, first-party | 2.3 KB, third-party (proxyable) | 2.3 KB, first-party if same domain | 1.3 KB | 3.3 KB, third-party | 11.4 KB, third-party |
| Cookieless / no banner | Yes [→](https://vercel.com/docs/analytics/privacy-policy) | Yes [→](https://docs.umami.is/docs/faq) | Yes [→](https://docs.umami.is/docs/faq) | Yes [→](https://plausible.io) | Yes ("probably no consent needed") [→](https://www.goatcounter.com/help/gdpr) | Yes [→](https://www.cloudflare.com/web-analytics/) |
| Both domains in one property | Yes — Hostname panel [→](https://vercel.com/docs/analytics/using-web-analytics) | Yes — Hostname filter [→](https://docs.umami.is/docs/filters) | Yes — same | Yes (hostname property) — not verified in detail | **No** — domain not stored [→](https://www.goatcounter.com/help/domains) | Per-hostname sites; top-hostname metric exists [→](https://www.cloudflare.com/web-analytics/) |

¹ Script sizes measured directly on 2026-07-16 with `curl | gzip -9 | wc -c` against the live script URLs: Vercel `davideimola.dev/_vercel/insights/script.js` 2,495 B raw / 1,271 B gz; Umami `cloud.umami.is/script.js` 4,639 B raw / 2,264 B gz; Plausible `plausible.io/js/script.js` 2,855 B raw / 1,288 B gz; GoatCounter `gc.zgo.at/count.js` 9,213 B raw / 3,319 B gz; Cloudflare `static.cloudflareinsights.com/beacon.min.js` 31,612 B raw / 11,364 B gz.

## 1. Vercel Web Analytics on Hobby (incumbent)

Source: [Limits and pricing](https://vercel.com/docs/analytics/limits-and-pricing) (doc last updated 2026-06-26).

- **50,000 events/month included**, shared "across all projects under the same Vercel account". An event is a pageview or a custom event.
- **Reporting window: 1 month.** This is "the length of time that your analytics data is guaranteed to be stored and viewable". Vercel notes it "may store your data for longer periods to give you the option to upgrade to a bigger plan without losing any data" — i.e. older data *may* reappear if you upgrade to Pro, but that is explicitly not guaranteed.
- **Custom events are NOT included on Hobby** (Pro and up only; the [quickstart](https://vercel.com/docs/analytics/quickstart) confirms: "Users on Pro and Enterprise plans can also add custom events").
- **On hitting the limit:** Hobby teams cannot buy extra events. After a 3-day grace period, "collection will be paused" — either wait (docs say both "until the next billing cycle" and "wait 7 days"; the exact resume timing is stated inconsistently on the same page) or upgrade to Pro.
- **Sampling:** no sampling is documented anywhere in the Web Analytics docs; the documented over-limit behavior is pausing, not sampling. (Absence of sampling asserted from absence in docs — treat as UNVERIFIED-by-omission.)
- **Export:**
  - Dashboard CSV export exists on all plans ([changelog 2024-06-11](https://vercel.com/changelog/csv-export-in-web-analytics)) but is per-panel and capped: "The export will include up to 250 entries from the panel" ([Using Web Analytics](https://vercel.com/docs/analytics/using-web-analytics#exporting-data-as-csv)). It exports aggregated visitors/pageviews, not raw events.
  - A [Web Analytics REST API](https://vercel.com/docs/analytics/web-analytics-api) exists for programmatic queries; aggregate endpoints "query data within your plan's reporting window" — so on Hobby the API cannot reach past ~1 month either. The API docs state no plan gate for Hobby (UNVERIFIED whether fully available on Hobby).
  - Raw-event streaming export exists only via **Vercel Drains, Pro/Enterprise only** at $0.50/GB ([changelog](https://vercel.com/changelog/export-more-data-with-vercel-drains)).
- **Privacy:** cookieless; "end users are identified by a hash created from the incoming request" whose session lifespan "is automatically discarded after 24 hours"; no cross-site identifiers ([Privacy and Compliance](https://vercel.com/docs/analytics/privacy-policy)). Designed "to align with leading data protection authority guidance" — Vercel stops short of literally saying "no cookie banner needed", but there is nothing to consent to under ePrivacy (no client-side storage).
- **Integration:** already done — `<Analytics />` from `@vercel/analytics/next` in the root layout ([quickstart](https://vercel.com/docs/analytics/quickstart)).
- **Ad blockers:** script is served first-party (`/_vercel/insights/script.js`), and v2 of the package adds "Resilient Intake": a build-time random seed builds unpredictable script/intake URLs, which Vercel says makes collection "not depend on a single predictable URL path" ([privacy doc](https://vercel.com/docs/analytics/privacy-policy)). This is structurally the most blocker-resistant option here. (How much blocklists still catch it in practice: UNVERIFIED.)
- **Both domains:** yes, natively — the dashboard has a **Hostname** panel: "Use this to analyze traffic by specific domains" ([Using Web Analytics](https://vercel.com/docs/analytics/using-web-analytics)). Since links.davideimola.dev is the same deployment, its traffic already lands in the same 50K budget and is filterable by hostname.

## 2. Umami Cloud — Hobby (free) tier

Source: [umami.is/pricing](https://umami.is/pricing).² Plan card: "Hobby — $0/month — Up to 100K events per month, 1 website, 6 month data retention, Community support."

- **100,000 events/month.** Caveat on what counts: "Each website pageview counts as one event. If you save event properties, each data property stored counts as one event" (pricing page FAQ). Custom events with properties burn the budget faster.
- **Retention: 6 months.** **Websites: 1.** No teams / team members on Hobby.
- **Included on Hobby** (per the pricing feature matrix): custom events, event/session properties, all reports (Breakdown, Funnels, User Retention, UTM parameters, Goals, User Journey, Revenue, Attribution), realtime, custom dashboards, **data export**, "GDPR compliant / CCPA compliant / No cookie banners required".
- **Gated to paid:** API access, teams, email reports, data import, session replays/heatmaps (Business+), additional events ($0.00003/event starts on Pro, $20/month, 1M events).
- **Over-limit behavior on Hobby: UNVERIFIED.** The pricing FAQ says "If you exceed the events included in your plan, additional events are billed at a per-event rate. Your data collection will not be interrupted" — but Hobby has no per-event billing, and no doc states what happens on Hobby overage. The [Cloud FAQ](https://docs.umami.is/docs/cloud/faq) only confirms "Umami Cloud's Hobby plan is completely free."
- **Privacy:** "Umami does not use any cookies in the tracking code" and "does not collect any personally identifiable information and anonymizes all data collected" ([docs FAQ](https://docs.umami.is/docs/faq)).
- **Next.js integration:** plain script tag or `next/script`; the tracker "automatically detects client-side navigation" in SPAs, so App Router route changes are tracked out of the box ([Track SPAs guide](https://docs.umami.is/docs/guides/track-single-page-apps)). Load it once in the root layout.
- **Ad blockers:** `cloud.umami.is/script.js` is third-party and blockable. Umami's own docs recommend proxying: with Next.js "you can use their rewrites feature" so both the script and the collect endpoint are served from your domain — "Even if the ad blocker blocks the cloud.umami.is domain, your own domain would be safe" ([Bypass ad blockers](https://docs.umami.is/docs/bypass-ad-blockers)). This fits `next.config.ts` cleanly alongside the existing rewrites.
- **Both domains on 1 website:** yes. One website ID can receive events from multiple hostnames (the `data-domains` attribute exists precisely to *restrict* that, matching `window.location.hostname` — [Tracker configuration](https://docs.umami.is/docs/tracker-configuration)), and the dashboard has a **Hostname** filter: "The domain where the page was accessed" ([Filters](https://docs.umami.is/docs/filters)). So the 1-website Hobby cap is not a problem for davideimola.dev + links.

² The pricing page is fully client-rendered; the numbers above were extracted from the pricing page's own JavaScript bundle (`umami.is/_next/static/chunks/0d1860ab5a1a4e2f.js`, fetched 2026-07-16), which is the exact data the page renders. Treat it as the pricing page itself.

## 3. Umami self-hosted

- **Requirements** ([install docs](https://docs.umami.is/docs/install)): "A server with Node.js version 18.18 or newer" and "a database. Umami supports PostgreSQL (minimum v12.14)". Note: current docs list **PostgreSQL only** — MySQL is no longer listed as supported.
- **Official Vercel deployment path exists** ([Running on Vercel](https://docs.umami.is/docs/guides/running-on-vercel)): fork the repo, import into Vercel, set `DATABASE_URL`, deploy. The guide suggests the Vercel Postgres integration or external managed Postgres.
- **Free database options (verified):**
  - **Neon free plan** ([plans doc](https://neon.com/docs/introduction/plans)): 0.5 GB storage/project, 100 CU-hours/month compute, **auto-suspend after 5 minutes of inactivity and you cannot disable it** on the free tier, 5 GB egress/month.
  - **Supabase free plan** ([pricing](https://supabase.com/pricing)): 500 MB database, max 2 active projects, **"Free projects are paused after 1 week of inactivity"**, 5 GB egress.
- **Honest assessment:** a genuinely $0 stack (Vercel Hobby app + Neon free Postgres) exists and is officially documented, but for a low-traffic personal site it is the worst of both worlds operationally:
  - Every pageview triggers a serverless function + DB write; with Neon suspending after 5 idle minutes, a large share of beacons on a low-traffic site hit a **cold-starting database**, risking slow or dropped collection. (Cold-start impact on beacon loss: inference, UNVERIFIED.)
  - 0.5 GB storage is plenty for this traffic level, but you own migrations, Umami version upgrades (fork syncing), and the DB lifecycle forever.
  - You also spend your single Vercel Hobby account's function/bandwidth budget on analytics ingestion for no dashboard benefit over Umami Cloud's free tier, which has the same features minus API access.
- Verdict: only worth it if data ownership or >6-month retention becomes a hard requirement. Umami supports migrating Cloud → self-host later (data export exists on the free Cloud tier per [pricing](https://umami.is/pricing)), so you can defer this decision.

## 4. Plausible Community Edition (short — not free in practice)

- **Cloud has no free tier:** "Sign up for 30-day free trial. No credit card required." Cheapest plan: "$9/month, up to 10k monthly pageviews" ([plausible.io](https://plausible.io)).
- **CE self-hosting requires:** "Docker and Docker Compose", a CPU supporting "SSE 4.2 or NEON instruction set" (ClickHouse requirement), and "At least 2 GB of RAM is recommended for running ClickHouse and Plausible" ([github.com/plausible/community-edition](https://github.com/plausible/community-edition)). ClickHouse + Docker means a real always-on VPS — there is no serverless/free-tier path. A 2 GB VPS is ~$5+/month, violating the zero-cost constraint. **Ruled out.**

## 5. GoatCounter (hosted, free)

- **Terms:** "GoatCounter.com is currently offered for free for reasonable public usage. Running your personal website or small-to-medium business on it is fine, but sending millions of pageviews/day isn't" ([goatcounter.com](https://www.goatcounter.com), [terms](https://www.goatcounter.com/help/terms)). Donation-supported; no hard numeric quota published.
- **Retention:** no retention period is documented anywhere on the site or in the FAQ — **UNVERIFIED**; do not assume unlimited.
- **Export:** CSV exports and a JSON API are documented ([FAQ/help index](https://www.goatcounter.com/help/faq)); "you can always export all data and cancel at any time" ([homepage](https://www.goatcounter.com)).
- **Custom domain:** free via CNAME, but explicitly cosmetic: "Custom domains will not prevent adblockers from recognizing GoatCounter; it's only intended as a 'vanity domain'" ([FAQ](https://www.goatcounter.com/help/faq)).
- **Ad blockers:** the author is blunt: "Most of them block goatcounter.com… By my estimate about a third of pageviews are missed due to adblockers" ([FAQ](https://www.goatcounter.com/help/faq)). No supported proxy workaround for the hosted service (self-hosting avoids it).
- **Privacy:** counts unique visits "without cookies or persistently storing any personal data" ([homepage](https://www.goatcounter.com)); "it should probably be safe to add GoatCounter without a GDPR consent notice" ([GDPR page](https://www.goatcounter.com/help/gdpr)).
- **Multi-domain — the dealbreaker for this site:** "GoatCounter doesn't store the domain a pageview belongs to; if you add GoatCounter to several (sub)domains then there's no way to distinguish between requests to `a.example.com/path` and `b.example.com/path`" ([help/domains](https://www.goatcounter.com/help/domains)). Workarounds are a second site code or manually prepending the host to the path via a JS callback. Combined with ~1/3 blocked pageviews and no documented retention, GoatCounter is a step down from both Vercel and Umami here.

## 6. Cloudflare Web Analytics (free)

- **Exists and accepts signups** for any site, including sites not proxied by Cloudflare: add a hostname in the dashboard, copy the JS beacon snippet before `</body>` ([get started](https://developers.cloudflare.com/web-analytics/get-started/)). "Available on all plans" ([product docs](https://developers.cloudflare.com/web-analytics/)); "Privacy-first, lightweight, accurate web analytics—for free" ([product page](https://www.cloudflare.com/web-analytics/)).
- **Retention & sampling — the catch** ([FAQ](https://developers.cloudflare.com/web-analytics/faq/)): "Currently, you can access data for the previous six months", BUT "We retain unsampled beacon data for the past 7 days, after this point data is aggregated down to around 10%", and queries apply dynamic sampling "between 0.0001% and 100%". For a low-traffic personal site, 10% aggregate of already-small numbers makes historical data statistically mushy.
- **Feature depth:** "UTM parameters" and "custom events" are "not yet supported" ([FAQ](https://developers.cloudflare.com/web-analytics/faq/)). Metrics are top hostnames, URLs, countries, status codes, plus Core-Web-Vitals-style performance data ([product page](https://www.cloudflare.com/web-analytics/)). Soft limit of 10 sites/account ([FAQ](https://developers.cloudflare.com/web-analytics/faq/)).
- **Privacy:** "does not use any client-side state, such as cookies or localStorage… We also don't 'fingerprint' individuals via their IP address, User Agent string, or any other data" ([product page](https://www.cloudflare.com/web-analytics/)).
- **Weight:** the beacon is by far the heaviest script measured: 31.6 KB raw / 11.4 KB gzip (measured 2026-07-16, see table footnote) — ~9x Vercel's script. Third-party origin (`static.cloudflareinsights.com`), commonly present in blocklists (blocklist presence: UNVERIFIED).
- Verdict: fine as a free *supplementary* RUM view, weak as the primary analytics for this site (no custom events, sampled history, heavy beacon, limited dashboard depth).

## What you lose / what you gain by switching (Vercel → Umami Cloud)

**Lost:**
- **Historical data continuity.** Vercel Hobby history is not meaningfully portable: dashboard CSV export is per-panel and capped at 250 rows of aggregated data ([docs](https://vercel.com/docs/analytics/using-web-analytics#exporting-data-as-csv)); the REST API only reaches back within the 1-month reporting window ([API docs](https://vercel.com/docs/analytics/web-analytics-api), [limits](https://vercel.com/docs/analytics/limits-and-pricing)); raw export via Drains is Pro-only ($0.50/GB, [changelog](https://vercel.com/changelog/export-more-data-with-vercel-drains)). Practical mitigation: since only ~1 month is guaranteed anyway, export the panels you care about as CSVs on switch day and the loss is bounded to that.
- **Zero-config first-party collection.** Vercel's script is same-origin with randomized intake paths ([Resilient Intake](https://vercel.com/docs/analytics/privacy-policy)); Umami requires you to add the documented Next.js rewrite proxy to get comparable ad-blocker resistance ([guide](https://docs.umami.is/docs/bypass-ad-blockers)).
- **One dashboard.** Analytics moves out of the Vercel dashboard where deployments already live.
- **Not lost: Speed Insights.** `@vercel/speed-insights` is a separate Vercel product with its own limits and stays regardless of the web-analytics choice (the [limits doc](https://vercel.com/docs/analytics/limits-and-pricing) treats them as separate scripts/products).

**Gained:**
- **2x the event budget** — 100K vs 50K/month ([Umami pricing](https://umami.is/pricing) vs [Vercel limits](https://vercel.com/docs/analytics/limits-and-pricing)) — and Vercel's 50K is shared across *all* projects on the account, while Umami's 100K is for the one website.
- **6x the retention** — 6 months vs 1 month (same sources). Year-over-year is still impossible on both free tiers.
- **Custom events on the free tier** (e.g. terminal-page command usage, `/links` block clicks) — completely unavailable on Vercel Hobby ([Vercel limits](https://vercel.com/docs/analytics/limits-and-pricing)).
- **Data export on the free tier** ([Umami pricing](https://umami.is/pricing)), plus an exit path: the same product can be self-hosted later with full DB ownership ([install docs](https://docs.umami.is/docs/install)).
- **Full report suite free** (funnels, UTM parameters, goals, journeys — [Umami pricing](https://umami.is/pricing)); on Vercel, UTM tracking requires the $10/month Web Analytics Plus add-on on top of Pro ([Vercel limits](https://vercel.com/docs/analytics/limits-and-pricing)).

**Net:** the switch trades ~1 month of aggregated history and a bit of setup (script + rewrites) for double the events, six times the retention, custom events, and an ownership/exit path — at the same $0. Running both side by side during a transition month removes even the data-gap risk, since both are cookieless and banner-free.

## Sources

All consulted 2026-07-16.

**Vercel**
- https://vercel.com/docs/analytics/limits-and-pricing
- https://vercel.com/docs/analytics/using-web-analytics
- https://vercel.com/docs/analytics/privacy-policy
- https://vercel.com/docs/analytics/quickstart
- https://vercel.com/docs/analytics/web-analytics-api
- https://vercel.com/changelog/csv-export-in-web-analytics
- https://vercel.com/changelog/export-more-data-with-vercel-drains

**Umami**
- https://umami.is/pricing (plan data extracted from the page's own JS bundle; see footnote 2)
- https://docs.umami.is/docs/cloud/faq
- https://docs.umami.is/docs/faq
- https://docs.umami.is/docs/install
- https://docs.umami.is/docs/guides/running-on-vercel
- https://docs.umami.is/docs/bypass-ad-blockers
- https://docs.umami.is/docs/tracker-configuration
- https://docs.umami.is/docs/filters
- https://docs.umami.is/docs/guides/track-single-page-apps

**Databases (for self-hosting)**
- https://neon.com/docs/introduction/plans
- https://supabase.com/pricing

**Plausible**
- https://plausible.io
- https://github.com/plausible/community-edition

**GoatCounter**
- https://www.goatcounter.com
- https://www.goatcounter.com/help/faq
- https://www.goatcounter.com/help/domains
- https://www.goatcounter.com/help/gdpr
- https://www.goatcounter.com/help/terms

**Cloudflare**
- https://developers.cloudflare.com/web-analytics/
- https://developers.cloudflare.com/web-analytics/get-started/
- https://developers.cloudflare.com/web-analytics/faq/
- https://www.cloudflare.com/web-analytics/

**Script sizes** — measured directly against live script URLs with `curl | gzip -9 | wc -c` on 2026-07-16 (values in footnote 1).
