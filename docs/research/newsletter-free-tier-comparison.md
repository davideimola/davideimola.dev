# Free-tier newsletter/email tool comparison: which one gives a queryable archive API at $0?

**Research date: 2026-07-22.** Free-tier limits and API surfaces change often — every number and endpoint below was verified against the primary source linked next to it on this date. Re-verify before acting on this months from now.

Scope: davideimola.dev (Next.js 16 App Router, Vercel Hobby). Goal: pick one newsletter tool that (1) costs **nothing** at this stage — the newsletter may stay dormant until the first subscribers arrive, so any recurring fee is waste; (2) exposes a **queryable archive API on the free tier** — an endpoint to LIST sent issues AND fetch each issue's rendered HTML/content — so a `/newsletter` archive page can be built on the site; (3) is **code-manageable** (a real REST API/SDK, scriptable, integratable via skills); (4) supports **subscription capture + one monthly digest**. Constraint #2 is the decision-driver and eliminates most candidates.

Note on Resend: it is already wired into this repo (`RESEND_API_KEY` exists for the contact form) but was never used as a newsletter tool, so there is **zero lock-in** and it neither blocks nor privileges anything. It is evaluated on equal footing below.

## TL;DR / Recommendation

- **Winner: Kit (formerly ConvertKit), free "Newsletter" plan.** It is the only tool that satisfies all four constraints without a caveat that hurts: **$0 up to 10,000 subscribers with unlimited sends** ([Kit Newsletter plan](https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan)), API keys are **unrestricted on every plan including free** ([Kit API overview](https://help.kit.com/en/articles/9902901-kit-api-overview)), and — critically — both `GET /v4/broadcasts` and `GET /v4/broadcasts/{id}` return the broadcast's **`content` (HTML)** field directly ([list broadcasts](https://developers.kit.com/api-reference/broadcasts/list-broadcasts), [get a broadcast](https://developers.kit.com/api-reference/broadcasts/get-a-broadcast)). So the `/newsletter` archive page is buildable from the API on the free tier, Kit sends the email itself (no external SMTP), and broadcasts are created/scheduled via `POST /v4/broadcasts` with `send_at` ([create a broadcast](https://developers.kit.com/api-reference/broadcasts/create-a-broadcast)).
- **Runner-up: Buttondown.** The cleanest developer-first API and archive of the lot — API on all plans including free ([features/API FAQ](https://buttondown.com/features/api)), hosted archives free, `GET /emails` + `GET /emails/{id}` return the issue body ([listing emails](https://docs.buttondown.com/api-emails-list), [retrieving email](https://docs.buttondown.com/api-emails-retrieve)), and it auto-handles SPF/DKIM even on a custom domain for free ([custom-domain sending](https://buttondown.com/blog/deliverability)). **The trade-off is the free cap: 100 subscribers** ([Buttondown pricing](https://buttondown.com/pricing)) — fine to start a dormant list, but you outgrow it far sooner than Kit's 10,000.
- **Pragmatic in-repo option: Resend Broadcasts.** Already present, zero lock-in, real REST API on all plans, and `GET /broadcasts/{id}` returns `html` + `text` ([get broadcast](https://resend.com/docs/api-reference/broadcasts/get-broadcast)). But the list endpoint returns **metadata only** (no HTML), so the archive needs an N+1 fetch ([list broadcasts](https://resend.com/docs/api-reference/broadcasts/list-broadcasts)); the free audience caps at **1,000 contacts** ([pricing](https://resend.com/pricing)); it is a raw sending API with **no hosted subscription/archive pages** (you build all of it); and it needs a DNS-verified sending domain ([domains](https://resend.com/docs/dashboard/domains/introduction)).
- **The archive-API requirement is the hard blocker that eliminates the rest:**
  - **MailerLite** — `GET /api/campaigns/{id}` returns **`plain_text` only, no rendered HTML** ([campaigns API](https://developers.mailerlite.com/docs/campaigns.html)), and **sending via API is paid-only**: "On Free, API and MCP access is limited and doesn't include sending" ([pricing](https://www.mailerlite.com/pricing)). Double blocker.
  - **EmailOctopus** — API v2 can list/get campaigns but **cannot create or send them and does not expose campaign HTML** ([v2 API](https://emailoctopus.com/api-documentation/v2)). Blocked on both send-by-code and archive-HTML.
  - **beehiiv** — the read API (posts + rendered HTML via `expand`) IS free, but **the Send API is gated to paid**, so programmatic sending is not available on the free Launch plan ([pricing](https://www.beehiiv.com/pricing)). Good archive, no code-send at $0.
  - **Ghost (self-host)** — fails zero-cost: bulk newsletter sending **requires Mailgun, the only supported provider** ("bulk email can't be done with basic SMTP") ([Ghost newsletters](https://docs.ghost.org/newsletters)), and Mailgun no longer has a durable free tier; Ghost(Pro) has no free plan ([pricing](https://ghost.org/pricing/)).
  - **Listmonk (self-host)** — genuinely free OSS with a full archive API, but it is not zero-*ops*/zero-*cost* in practice: it needs a host + Postgres + a bring-your-own SMTP relay ([install](https://listmonk.app/docs/installation/), [homepage](https://listmonk.app/)).

## Comparison table (hard numbers)

Tools as rows (there are eight); attributes as columns. "Archive API" is split into the two things the `/newsletter` page needs: an endpoint to **list** sent issues, and an endpoint to fetch each issue's **rendered HTML**.

| Tool | Free cost | Max subs (free) | Sends/mo (free) | List sent issues (API) | Get rendered HTML (API) | Create/send via API on free | Sends email itself | Branding on free |
|---|---|---|---|---|---|---|---|---|
| **Kit** (Newsletter) | $0 [→](https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan) | 10,000 [→](https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan) | Unlimited [→](https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan) | Yes — `GET /v4/broadcasts` [→](https://developers.kit.com/api-reference/broadcasts/list-broadcasts) | **Yes — `content` (HTML)** [→](https://developers.kit.com/api-reference/broadcasts/get-a-broadcast) | Yes — API keys unrestricted on all plans [→](https://help.kit.com/en/articles/9902901-kit-api-overview) | Yes | UNVERIFIED |
| **Buttondown** | $0 [→](https://buttondown.com/pricing) | 100 [→](https://buttondown.com/pricing) | not numerically capped on free (UNVERIFIED) | Yes — `GET /emails` [→](https://docs.buttondown.com/api-emails-list) | **Yes — `GET /emails/{id}` body** [→](https://docs.buttondown.com/api-emails-retrieve) | Yes — API on all plans [→](https://buttondown.com/features/api) | Yes [→](https://buttondown.com/blog/deliverability) | No (UNVERIFIED) |
| **Resend** (Broadcasts) | $0 [→](https://resend.com/pricing) | 1,000 contacts [→](https://resend.com/pricing) | 3,000 (100/day cap) [→](https://resend.com/pricing) | Yes — `GET /broadcasts` (metadata only) [→](https://resend.com/docs/api-reference/broadcasts/list-broadcasts) | **Yes — `GET /broadcasts/{id}` `html`+`text`** [→](https://resend.com/docs/api-reference/broadcasts/get-broadcast) | Yes — API on all plans [→](https://resend.com/pricing) | Yes (needs verified domain) [→](https://resend.com/docs/dashboard/domains/introduction) | No (UNVERIFIED) |
| **beehiiv** (Launch) | $0 [→](https://www.beehiiv.com/pricing) | 2,500 [→](https://www.beehiiv.com/pricing) | Unlimited [→](https://www.beehiiv.com/pricing) | Yes — `GET /v2/publications/{id}/posts` [→](https://developers.beehiiv.com/api-reference/posts/index) | **Yes — `expand=free_email_content`** [→](https://developers.beehiiv.com/api-reference/posts/show) | **No — Send API paid** [→](https://www.beehiiv.com/pricing) | Yes | Yes (branding on free) [→](https://www.beehiiv.com/pricing) |
| **MailerLite** | $0 [→](https://www.mailerlite.com/pricing) | 250 [→](https://www.mailerlite.com/pricing) | 2,500 [→](https://www.mailerlite.com/pricing) | Yes — `GET /api/campaigns` [→](https://developers.mailerlite.com/docs/campaigns.html) | **No — `plain_text` only** [→](https://developers.mailerlite.com/docs/campaigns.html) | **No — sending via API is paid-only** [→](https://www.mailerlite.com/pricing) | Yes | Yes (logo on free) [→](https://www.mailerlite.com/pricing) |
| **EmailOctopus** | $0 [→](https://emailoctopus.com/pricing) | 2,500 [→](https://emailoctopus.com/pricing) | 10,000 [→](https://emailoctopus.com/pricing) | Yes — `GET /campaigns` (v2) [→](https://emailoctopus.com/api-documentation/v2) | **No — content not exposed** [→](https://emailoctopus.com/api-documentation/v2) | **No — v2 cannot create/send** [→](https://emailoctopus.com/api-documentation/v2) | Yes (on Amazon SES) | Yes (branding on free) [→](https://emailoctopus.com/pricing) |
| **Listmonk** (self-host) | $0 software; needs host + SMTP [→](https://listmonk.app/docs/installation/) | unlimited (your DB) | unlimited (your SMTP) | Yes — `GET /api/campaigns` [→](https://listmonk.app/docs/apis/campaigns/) | **Yes — `GET /api/campaigns/{id}/preview`** [→](https://listmonk.app/docs/apis/campaigns/) | Yes — full REST API [→](https://listmonk.app/docs/apis/campaigns/) | No — bring your own SMTP relay [→](https://listmonk.app/) | No |
| **Ghost** (self-host) | $0 software; needs host + Mailgun [→](https://docs.ghost.org/newsletters) | unlimited (your DB) | Mailgun-limited (not free) [→](https://docs.ghost.org/newsletters) | Content API posts [→](https://ghost.org/docs/content-api/) | Content API `html` (web posts) [→](https://ghost.org/docs/content-api/) | Admin API | No — Mailgun required (only provider) [→](https://docs.ghost.org/newsletters) | No |

## 1. Kit (formerly ConvertKit) — free "Newsletter" plan (recommended)

Sources: [Kit Newsletter plan](https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan), [Kit API overview](https://help.kit.com/en/articles/9902901-kit-api-overview), [developers.kit.com](https://developers.kit.com/api-reference/broadcasts/list-broadcasts).

- **Free tier: "Up to 10,000 active, unique subscribers" with "Unlimited email sends"** ([Newsletter plan](https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan)). Also free: unlimited forms/landing pages, a newsletter feed + creator profile, A/B testing, and "1 basic visual automation with 1 email sequence". Gated to the paid Creator plan ($39+/mo): unlimited visual automations/sequences, RSS campaigns, advanced rules/integrations ([same source](https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan)).
- **API on the free tier: yes.** "V3 and V4 API keys are not restricted. This means creators on any plan can generate API keys and use them" ([API overview](https://help.kit.com/en/articles/9902901-kit-api-overview)). Free accounts use an **API key** (`X-Kit-Api-Key` header); OAuth is only required for publicly-listed apps, and "Free Kit accounts don't support OAuth" — but the API-key path is exactly what a single-site integration/skill needs.
- **Archive API — list: `GET /v4/broadcasts`.** Returns per-broadcast `id`, `created_at`, `subject`, `preview_text`, `description`, **`content`**, `public`, `published_at`, `send_at`, `public_url`, `status`, etc. ([list broadcasts](https://developers.kit.com/api-reference/broadcasts/list-broadcasts)). Setting `slim=true` omits the expensive fields (`content`, `public_url`, …) for faster listing, so you can list cheaply and fetch bodies on demand.
- **Archive API — rendered HTML: `GET /v4/broadcasts/{id}`** returns the broadcast object including **`content` (HTML)** — the body of the email — plus `public`, `public_url`, `published_at` ([get a broadcast](https://developers.kit.com/api-reference/broadcasts/get-a-broadcast)). This is the single most important fact for this decision: **Kit hands you the rendered HTML directly on the free tier.** Filter by `status`/`published_at` to show only sent issues.
- **Send via API: `POST /v4/broadcasts`** creates a draft; providing a `send_at` ISO-8601 timestamp schedules the send, and `public: true` "publish[es] this broadcast to the web" newsletter feed ([create a broadcast](https://developers.kit.com/api-reference/broadcasts/create-a-broadcast)). So a monthly digest can be authored + scheduled from code/a skill. *Nuance:* Kit's docs confirm API keys are unrestricted on every plan, which implies broadcast creation/sending works on the free Newsletter plan; I did not find a sentence that literally says "sending broadcasts via API is allowed on Free" the way MailerLite explicitly *forbids* it, so treat free-tier API sending as **verified-by-inference, lightly UNVERIFIED** — worth a 2-minute live test with a free API key before committing.
- **Deliverability:** Kit sends the email itself; no external SMTP to wire up. Custom-domain DKIM/authentication is a Kit-managed feature.
- **Branding on free emails: UNVERIFIED** — the plan page does not state whether a "powered by Kit" footer appears on free-plan sends.
- **Fit:** best overall. Free ceiling (10,000 subs) is effectively irrelevant for a dormant list, the archive API returns HTML with no gymnastics, and it is fully code-drivable.

## 2. Buttondown — free plan (runner-up, cleanest API)

Source: [Buttondown pricing](https://buttondown.com/pricing), [API docs](https://docs.buttondown.com/api-emails-list), [features/API](https://buttondown.com/features/api).

- **Free tier: "your first 100 subscribers" at "Absolutely nothing"**, including "Hosted newsletter archives" ([pricing](https://buttondown.com/pricing)). The 100-subscriber cap is the only real constraint here.
- **API on the free tier: yes, explicitly.** "The API is available on all plans, including free" ([features/API FAQ](https://buttondown.com/features/api)). There is also an official Buttondown CLI for local/scripted use ([CLI docs](https://docs.buttondown.com/buttondown-cli)).
- **Archive API — list: `GET /emails`** lists "all of your emails, including drafts, scheduled, and sent emails" ([listing emails](https://docs.buttondown.com/api-emails-list)) — filter by `status` for sent issues.
- **Archive API — body: `GET /emails/{id}`** returns the single email ([retrieving email](https://docs.buttondown.com/api-emails-retrieve)); the email **`body` is stored as either HTML or Markdown** (Buttondown auto-detects the editor mode, overridable via a `buttondown-editor-mode` comment — [API email object](https://docs.buttondown.com/api-emails-introduction)). For a site archive you render the Markdown/HTML yourself, or link to Buttondown's hosted archive page. *(The rendered HTML vs. Markdown exact field shape returned by the API is thinly documented publicly — treat the precise field names as lightly UNVERIFIED and confirm against a live call; that the body is retrievable is confirmed.)*
- **Send via API: `POST /emails`** creates/sends emails ([creating an email](https://docs.buttondown.com/api-emails-create)); drafting/scheduling via API is documented ([drafting emails via the API](https://docs.buttondown.com/drafting-emails-via-the-api)).
- **Deliverability:** Buttondown sends the email itself and **auto-configures SPF/DKIM for you, even on a custom domain, on the free plan** — "basic deliverability features should never be paywalled" ([deliverability](https://buttondown.com/blog/deliverability), [custom-domain sending](https://docs.buttondown.com/sending-from-a-custom-domain)). Custom-domain setup adds a CNAME pointing at a Buttondown proxy subdomain.
- **Fit:** the nicest developer experience and the most "archive-native" of all hosted options (Markdown body + hosted archive + clean REST + CLI). Loses to Kit only on the 100-subscriber free ceiling.

## 3. Resend — Broadcasts + Audiences (already in the repo)

Source: [Resend pricing](https://resend.com/pricing), [Broadcasts API reference](https://resend.com/docs/api-reference/broadcasts/list-broadcasts).

- **Free tier:** "3,000" emails/month "limited to 100 emails per day", **1,000 contacts**, 1 domain, 30-day data retention; "RESTful API, SMTP relay, official SDKs" are on **all plans** ([pricing](https://resend.com/pricing)).
- **Archive API — list: `GET /broadcasts`** returns **metadata only** — `id`, `name`, `segment_id` (formerly `audience_id`), `status`, `created_at`, `scheduled_at`, `sent_at`. **No HTML in the list response** ([list broadcasts](https://resend.com/docs/api-reference/broadcasts/list-broadcasts)).
- **Archive API — rendered HTML: `GET /broadcasts/{broadcast_id}`** returns the full object **including `html` and `text`** (plus `subject`, `preview_text`, `status`, `sent_at`, …) ([get broadcast](https://resend.com/docs/api-reference/broadcasts/get-broadcast)). So the archive is buildable, but it costs **one extra GET per issue (N+1)** since the list omits bodies.
- **Send via API:** the Broadcast API has "6 endpoints for programmatically creating, updating, and sending broadcasts" ([Broadcast API](https://resend.com/blog/broadcast-api)); broadcasts send only to existing Audience contacts ([Audiences](https://resend.com/blog/manage-subscribers-using-resend-audiences)).
- **Deliverability:** requires a **DNS-verified sending domain** (SPF + DKIM records); `onboarding@resend.dev` is "only suitable for initial testing" ([managing domains](https://resend.com/docs/dashboard/domains/introduction)). davideimola.dev already sends contact-form mail through Resend, so the domain may already be verified.
- **The real gap:** Resend is a **sending API, not a newsletter product** — there is no hosted subscription page, no hosted archive, no unsubscribe/preference UI out of the box; you build subscription capture, the archive page, and compliance footers yourself. For a code-first owner that is acceptable, but it is materially more work than Kit or Buttondown, and the free **1,000-contact** ceiling is lower than Kit's 10,000.
- **Fit:** the zero-lock-in pragmatic choice if you want everything in-house and already trust Resend; otherwise Kit gives you the archive HTML plus hosted subscription/archive scaffolding for free.

## 4. beehiiv — free "Launch" plan (good archive, but no code-send at $0)

Source: [beehiiv pricing](https://www.beehiiv.com/pricing), [beehiiv API](https://developers.beehiiv.com/api-reference/posts/index).

- **Free Launch tier:** "up to 2,500 subscribers", "Unlimited Email Sends", and — per beehiiv's own pricing page — **"API Access (excluding Send API)"** ([pricing](https://www.beehiiv.com/pricing)). Removing beehiiv branding is a Max-tier feature, so **the free plan carries beehiiv branding**.
- **Archive API — list + HTML: yes, free.** `GET /v2/publications/{publicationId}/posts` and `GET /v2/publications/{publicationId}/posts/{postId}` return post metadata, and the **`expand` query param** yields rendered HTML: `free_email_content` ("the email HTML rendered to a free reader"), `free_web_content`, `free_rss_content` ([list posts](https://developers.beehiiv.com/api-reference/posts/index), [get post](https://developers.beehiiv.com/api-reference/posts/show)). This is a clean, free archive API.
- **Send via API: NOT on free.** Programmatic sending is the **Send API, which is excluded from Launch** ([pricing](https://www.beehiiv.com/pricing)). You can still author and send from beehiiv's dashboard on the free plan, but requirement #3 ("create/send campaigns programmatically") is **not met at $0** — sending would be dashboard-only.
- **Fit:** excellent free archive API, but it fails the "code-manageable sending" constraint on the free tier, and forces beehiiv branding. If dashboard-only sending were acceptable, beehiiv would be a strong archive source; given the code-first requirement, Kit is better.

## 5. MailerLite — blocked (no HTML in API, paid-only API sending)

Source: [MailerLite pricing](https://www.mailerlite.com/pricing), [Campaigns API](https://developers.mailerlite.com/docs/campaigns.html).

- **Free tier is small and shrinking:** "up to 250 subscribers", "2,500 monthly emails", "2 user seats", MailerLite logo on emails (removed only on Comfort+), max 3 active automations ([pricing](https://www.mailerlite.com/pricing)). *(This is materially smaller than the widely-quoted "1,000 subs / 12,000 emails" — that figure is stale; the current page says 250 / 2,500.)*
- **Blocker 1 — no rendered HTML in the API:** `GET /api/campaigns` and `GET /api/campaigns/{id}` return content-related fields `plain_text`, `screenshot_url`, `preview_url` — the get-campaign response **does not include rendered HTML**, and there is **no documented GET endpoint that returns campaign content HTML** (HTML can only be *uploaded* at create time on Advanced plans) ([campaigns API](https://developers.mailerlite.com/docs/campaigns.html)). You cannot build an HTML archive from the API.
- **Blocker 2 — no sending via API on free:** "Email sending via the API and MCP server is available on paid plans. On Free, API and MCP access is limited and doesn't include sending" ([pricing](https://www.mailerlite.com/pricing)).
- **Fit:** ruled out on constraints #2 and #3 simultaneously.

## 6. EmailOctopus — blocked (v2 can't send, content not exposed)

Source: [EmailOctopus pricing](https://emailoctopus.com/pricing), [API v2](https://emailoctopus.com/api-documentation/v2).

- **Free "Starter" tier:** "2,500 subscribers", "10,000 emails per month", **"EmailOctopus branding on emails"**, 30-day reports, 1 landing page, 1 form, 1 user ([pricing](https://emailoctopus.com/pricing)). Built on Amazon SES infrastructure.
- **Blocker — API v2 is retrieval/reporting only:** v2 exposes `GET /campaigns`, `GET /campaigns/{id}`, and report endpoints, but **"does not provide endpoints to create campaigns, send campaigns, or access/modify campaign HTML content"** — it "focuses on managing lists, contacts, fields, automations, and reporting" ([API v2](https://emailoctopus.com/api-documentation/v2)). The old v1 API is "legacy and no longer actively maintained" ([v1 docs](https://emailoctopus.com/api-documentation)).
- **Fit:** ruled out — cannot send by code and does not return issue HTML.

## 7. Listmonk — self-hosted OSS (genuine archive API, but not zero-cost/zero-ops)

Source: [listmonk.app](https://listmonk.app/), [install docs](https://listmonk.app/docs/installation/), [campaigns API](https://listmonk.app/docs/apis/campaigns/).

- **Software is genuinely free:** "free and open source software licensed under AGPLv3", shipped as "a single binary" ([homepage](https://listmonk.app/)).
- **Requirements:** "a simple binary application that requires a Postgres database instance to run" — "Postgres DB (⩾ 12)" ([install](https://listmonk.app/docs/installation/)). So you need somewhere to run a Go process **and** a Postgres instance.
- **Archive API — yes, and it renders HTML:** `GET /api/campaigns` lists campaigns; `GET /api/campaigns/{id}` returns the campaign incl. the raw `body`; and **`GET /api/campaigns/{id}/preview` returns "the HTML body with template variables substituted"** ([campaigns API](https://listmonk.app/docs/apis/campaigns/)). There is also `PUT /api/campaigns/{id}/archive` to "publish campaign to public archive", and listmonk ships **built-in public archive pages** ([homepage](https://listmonk.app/)). This is the most complete archive story of any option — you own the data and the endpoints.
- **Sending: bring your own SMTP relay.** Listmonk does not send mail itself; it drives "multi-SMTP e-mail queues" ([homepage](https://listmonk.app/)) and connects to any SMTP relay (Amazon SES, Postmark, etc.). You supply — and pay for — deliverability. SES is ~$0 at tiny volume but still an AWS account + DNS (SPF/DKIM) to manage.
- **Real cost:** the software is $0 but a production deployment is not. A genuinely-free host is possible but fragile — the same free-Postgres caveats from the analytics note apply (Neon free auto-suspends compute after 5 idle minutes; Supabase free pauses a project after 1 week idle), and a persistent Go process is not a fit for Vercel's serverless model, so you'd add a second host (Fly.io/Railway free allowances, a $4–5/mo VPS, etc.). **UNVERIFIED** whether any current free host runs listmonk + Postgres reliably for free long-term.
- **Fit:** the best answer *if* data ownership or an unlimited free ceiling becomes a hard requirement and you accept ongoing ops. For a dormant list that must cost nothing and require no babysitting, it is over-engineered versus Kit.

## 8. Ghost (self-host) — blocked on zero-cost (Mailgun required)

Source: [Ghost pricing](https://ghost.org/pricing/), [Ghost newsletters](https://docs.ghost.org/newsletters), [Content API](https://ghost.org/docs/content-api/).

- **No free hosted tier:** Ghost(Pro) starts at "$18 USD / mo" (billed yearly); self-hosting the open-source software is the only free-of-license path ([pricing](https://ghost.org/pricing/)).
- **Blocker — bulk email requires Mailgun:** "Delivering bulk email newsletters can't be done with basic SMTP. A bulk mail provider is a requirement" and **"At present, Mailgun is the only supported bulk email provider"** ([newsletters](https://docs.ghost.org/newsletters)). Mailgun no longer offers a durable free tier (its free allowance is a limited trial; paid Flex/Basic plans start around $15–35/mo — pricing figures are secondary/**UNVERIFIED** here, but the *requirement* to use Mailgun is primary). So self-hosted Ghost newsletters cannot run at $0.
- **Archive API:** Ghost's Content API exposes posts with `html`, so an archive of **web-published** posts is buildable ([Content API](https://ghost.org/docs/content-api/)); email-only posts are excluded from the public Content API by default (**UNVERIFIED** exact behavior on current version).
- **Fit:** ruled out on the zero-cost constraint (paid Mailgun) and on operational weight (self-host Node + MySQL).

## Decision

For "**free + queryable archive API on the free tier + code-manageable + monthly digest**", the archive-HTML requirement is what separates the field. Only **Kit**, **Buttondown**, **Resend**, **beehiiv**, and **Listmonk** expose rendered issue HTML by API at all; of those, **beehiiv can't send by code on free**, **Listmonk isn't truly free to run**, and **Resend needs an N+1 fetch and gives you no hosted newsletter scaffolding**. That leaves **Kit** (10,000-sub free ceiling, HTML `content` straight from the broadcasts API) as the winner and **Buttondown** (cleanest API/archive, but 100-sub free cap) as the runner-up. **MailerLite and EmailOctopus are eliminated outright** — neither returns issue HTML by API, and neither lets you send by code on the free tier.

## Sources

All consulted 2026-07-22.

**Kit (ConvertKit)**
- https://help.kit.com/en/articles/9053602-the-kit-newsletter-plan
- https://help.kit.com/en/articles/9902901-kit-api-overview
- https://developers.kit.com/api-reference/broadcasts/list-broadcasts
- https://developers.kit.com/api-reference/broadcasts/get-a-broadcast
- https://developers.kit.com/api-reference/broadcasts/create-a-broadcast

**Buttondown**
- https://buttondown.com/pricing
- https://buttondown.com/features/api
- https://docs.buttondown.com/api-emails-list
- https://docs.buttondown.com/api-emails-retrieve
- https://docs.buttondown.com/api-emails-introduction
- https://docs.buttondown.com/api-emails-create
- https://docs.buttondown.com/drafting-emails-via-the-api
- https://docs.buttondown.com/buttondown-cli
- https://buttondown.com/blog/deliverability
- https://docs.buttondown.com/sending-from-a-custom-domain

**Resend**
- https://resend.com/pricing
- https://resend.com/docs/api-reference/broadcasts/list-broadcasts
- https://resend.com/docs/api-reference/broadcasts/get-broadcast
- https://resend.com/blog/broadcast-api
- https://resend.com/blog/manage-subscribers-using-resend-audiences
- https://resend.com/docs/dashboard/domains/introduction

**beehiiv**
- https://www.beehiiv.com/pricing
- https://developers.beehiiv.com/api-reference/posts/index
- https://developers.beehiiv.com/api-reference/posts/show

**MailerLite**
- https://www.mailerlite.com/pricing
- https://developers.mailerlite.com/docs/campaigns.html

**EmailOctopus**
- https://emailoctopus.com/pricing
- https://emailoctopus.com/api-documentation/v2
- https://emailoctopus.com/api-documentation

**Listmonk**
- https://listmonk.app/
- https://listmonk.app/docs/installation/
- https://listmonk.app/docs/apis/campaigns/

**Ghost**
- https://ghost.org/pricing/
- https://docs.ghost.org/newsletters
- https://ghost.org/docs/content-api/
