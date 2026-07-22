# ADR-0002: Monthly newsletter — hybrid model with Kit for delivery, content owned in-repo

- **Status:** Accepted
- **Date:** 2026-07-22
- **Research:** [Free-tier newsletter/email tool comparison](../research/newsletter-free-tier-comparison.md) (all numbers and API surfaces verified against primary sources on 2026-07-22)

## Context

The site has no newsletter. The goal is a **monthly digest** — a harvest of what was published (blog posts, talks, projects/OSS) plus a short personal intro and an "upcoming talks" section — with an on-site archive of past issues. Hard constraints: **zero cost at this stage** (the list may be tiny for a long time, so any recurring fee is waste), the tool must be **code-manageable and skill-drivable**, the on-site presence must match the site's branding, and the archive must live on the site.

The initial framing was "collect emails now, keep the newsletter dormant until subscribers arrive". This was rejected: a dormant list **decays** (subscribers who hear nothing for months mark the first send as spam), and — specific to this setup — the domain already sends **transactional** mail (the contact form) through Resend, so newsletter spam complaints would poison deliverability for real mail. The counter-fear (maintaining a newsletter for zero readers) is only valid if each issue is new writing; it is defused by the **harvest** model, where an issue is ~90% auto-assembled from content that already exists in the repo, costing minutes per month and producing a durable archive artifact regardless of audience size.

The research compared Kit, Buttondown, Resend, beehiiv, MailerLite, EmailOctopus, Listmonk, and Ghost. Kit won on paper for its free-tier archive API. But once the decision was made to **own the content in-repo** (the harvest sources — `src/content/blog`, `talks.json`, etc. — already live here), the provider's archive API became irrelevant, which reshaped the tool choice. MailerLite and EmailOctopus were eliminated outright (no issue HTML by API and no free-tier API sending); beehiiv gates its Send API to paid; Ghost requires paid Mailgun; Listmonk is free software but needs a paid/fragile host + Postgres + SMTP relay.

## Decision

Build a **hybrid** newsletter: the **site owns content, form, archive, and the "read on web" link**; a provider owns **subscriber storage, double opt-in, unsubscribe, and delivery**. Because the provider's archive API is no longer needed, the provider is chosen on free ceiling + double opt-in + HTML-send via API — the winner is **Kit (formerly ConvertKit), free "Newsletter" plan** ($0 to 10,000 subscribers, unlimited sends, API keys on all plans).

Specifics settled with the decision:

1. **Start now, no open dormancy.** Publish-then-collect: issue #1 goes out at the end of the first month the form is live, to whoever subscribed, with Davide as the first subscriber (validating the full pipeline end-to-end). An empty month (no new posts or talks) is **skipped**, not padded.
2. **Content = harvest, owned in-repo.** Each issue is a short hand-written intro + auto-assembled sections (blog posts in the window, upcoming talks, optional projects/OSS) + optional per-issue curation. The intro is the non-negotiable minimum of voice.
3. **One frozen `.mdx` file per issue** in `src/content/newsletter/` (e.g. `2026-07.mdx`), mirroring the blog. Content is **snapshotted at generation time** ("photograph, not mirror"): the archive shows what was actually sent and never rewrites itself if source content changes later. The same file is the single source for both the email HTML and the archive page, so they cannot diverge.
4. **Kit's role is delivery + compliance only.** The site's own subscribe form POSTs to a server action that creates the subscriber via the Kit API, triggering Kit's double opt-in. Issue HTML is generated in-repo and sent via Kit's broadcast API. The email's "read on web" link points at the site's own `/newsletter/[slug]`, not Kit's hosted archive.
5. **Resend stays for transactional only** (contact form). Separating transactional (Resend) from marketing (Kit) is also good deliverability hygiene.
6. **On-site footprint:** a `/newsletter` page (pitch + form + archive index + `[slug]` detail), a text-only link in the footer, a compact subscribe form at the end of each blog post, compact CTAs on Home and Sharing (the Sharing pitch framed around "upcoming talks"), and a post-confirmation landing page. One reusable form component with `full` and `compact` modes. Other pages get nothing, to keep the site's sober tone.
7. **Cadence:** monthly, end of month, **assisted** send — a dedicated skill drafts the issue, Davide reviews/edits the intro and triggers the send by hand. No automated cron send at this stage.
8. **A dedicated newsletter skill** orchestrates: read the month's window from the repo (`src/content/blog` by date, `talks.json` for upcoming) **and the content-os MCP** (Calendar / published Pieces / metrics) for the cross-channel view → draft the frozen `.mdx` (harvest + suggested intro + upcoming) → generate email HTML → create a Kit broadcast **draft** with the on-site "read on web" URL → stop for human review. Same philosophy as `write-blog-post` / `social-post`.
9. **Email HTML via react-email** (React components → email-safe HTML, provider-agnostic), styled toward the site brand within the limits of email clients (custom fonts are commonly stripped, so approximate).
10. **Compliance:** double opt-in (the EU consent-proof standard, effectively required), plus Kit-managed unsubscribe / `List-Unsubscribe` header and a conforming sender footer.

## Consequences

- **Cost is $0** and stays there until the list is large enough to justify paying (well past MVP): Kit free covers 10,000 subscribers with unlimited sends; react-email, the content-os MCP, and the in-repo content are already free.
- **Two email systems on the domain** (Resend transactional + Kit marketing) — accepted, and a deliverability positive rather than a negative.
- **Full front-end ownership** of form, archive, branding, and the "read on web" link, at the cost of building those (a known, one-time build; the contact-form + Turnstile pattern is reusable for the subscribe form).
- **The frozen-snapshot model** means the generation skill must copy source content into the issue file at draft time; editing a blog post later will not retro-change a past issue (intended).
- **Two pre-build verifications** flagged by the research, each a ~2-minute live test with a free Kit API key: (a) that broadcast **sending** via API works on the free Newsletter plan (Kit's docs confirm unrestricted API keys but never state free-tier sending explicitly, unlike MailerLite which explicitly forbids it — so this is verified-by-inference); (b) that a subscriber **created via the API** triggers Kit's double opt-in confirmation email (vs. having to route through a Kit Form).
- **Deferred to v2, explicitly out of MVP:** automated cron send, own open/click analytics, a preference center, segments/tags, and RSS-to-email automation.
- If Kit's free tier ever stops fitting, the exit is cheap: content and archive already live in-repo, so only the delivery/subscriber layer would need swapping (Buttondown was the research runner-up; its 100-subscriber free cap is the only reason it lost).
