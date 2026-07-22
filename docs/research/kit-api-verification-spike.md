# Kit free-tier verification spike — API contract + findings

**Issue:** [#71](https://github.com/davideimola/davideimola.dev/issues/71) (parent PRD [#70](https://github.com/davideimola/davideimola.dev/issues/70)) · **ADR:** [ADR-0002](../adr/0002-newsletter-hybrid-kit-in-repo-content.md) · **Research:** [newsletter-free-tier-comparison](./newsletter-free-tier-comparison.md)

> **Live-run status: RUN 2026-07-22** against a real free-tier account (plan `free`,
> 10,000-subscriber limit). **All four assumptions verified.** Auth, subscriber-create,
> broadcast-create, and broadcast **send** work on the free plan; **double opt-in is
> achievable via the v4 API** (create-inactive → associate with an opt-in Kit Form triggers
> the confirmation email). One deliverability prerequisite surfaced (domain authentication).
> Re-run `scripts/verify-kit-free-tier.mjs` to reproduce.

## Why this spike

The research recommended Kit's free "Newsletter" plan, but two load-bearing facts were
only **verified-by-inference**:

1. Creating **and sending** a broadcast via the API works on the free Newsletter plan.
2. A subscriber **created via the API** triggers Kit's double opt-in confirmation email —
   rather than requiring the subscribe flow to route through a Kit **Form**.

If either fails, the fallback must be known before any integration code is written (issue
#74's subscribe capability in particular). This document is that pre-build gate.

## How to run the verification

```bash
KIT_API_KEY=<free-tier v4 key> \
KIT_TEST_EMAIL=<an inbox you control> \
KIT_FORM_ID=<double-opt-in form id OR uid> \
node scripts/verify-kit-free-tier.mjs            # draft only, no broadcast sent

# add --send to perform a REAL scheduled broadcast send (5 min out, cancellable)
# add --cleanup to delete created drafts (and cancel a scheduled send)
# add --json findings.json to write a machine-readable summary
```

The harness prints every request/response verbatim (API key redacted). It can only observe
subscriber **state** via the API — whether a confirmation/broadcast email actually **lands**
is a manual inbox check.

## Authentication — CONFIRMED

- **Mechanism:** a **v4** API key in the `X-Kit-Api-Key` request header. A single key (not
  the v3 `api_key` + `api_secret` pair; the v3 key is a different credential and is **not
  needed** — double opt-in works on v4, see below). Generate at Kit → Settings → Developer.
  Free accounts don't support OAuth; API keys are unrestricted on every plan including free.
- **Base URL:** `https://api.kit.com/v4`
- **Server-side only:** consumed by the subscribe server action and the digest skill; never
  reaches the client. Env var `KIT_API_KEY` (no `NEXT_PUBLIC_` prefix).

`GET /v4/account` → `200`. Confirms the key, and that this account is on `plan_type: "free"`
with `subscriber_limit: 10000` and a verified sending address (`is_verified: true`, but note
`is_dmarc_configured: false` — see the deliverability note).

## Subscriber creation & double opt-in — CONFIRMED (two-call flow)

Double opt-in **is achievable on v4**, but not through a single call. The confirmation email
is a **Form** behavior, so the flow is: create the subscriber `inactive`, then associate it
with a double-opt-in-enabled Kit Form, which sends Kit's "confirm your subscription" email.

### Step 1 — create the subscriber (as inactive): `POST /v4/subscribers`

```
POST /v4/subscribers    { "email_address": "reader@example.com", "state": "inactive" }
```

Response `201`:

```jsonc
{ "subscriber": { "id": 4219900293, "email_address": "reader@example.com", "state": "inactive", … } }
```

Accepts `first_name`, `email_address` (required), `state` (`active` | `inactive` | `cancelled`
| `bounced` | `complained`, **defaults to `active`**), and `fields`. **Creating a subscriber
alone sends no email** — with the default `active` state it silently subscribes them (no
double opt-in). Passing `state: "inactive"` creates a pending record, again with no email
yet; the confirmation email comes from step 2. (Note: this endpoint's docs warn "Updating the
subscriber state with this endpoint is not supported", so set the state at creation.)

### Step 2 — associate with a double-opt-in Form: `POST /v4/forms/{id}/subscribers`

```
POST /v4/forms/9713978/subscribers    { "email_address": "reader@example.com" }
```

Two gotchas confirmed live:

1. **id vs uid.** The API path wants the numeric form **`id`** (e.g. `9713978`). The embed
   URL/JS uses the string **`uid`** (e.g. `2484145147`). Passing the uid returns `404`. The
   harness resolves either form of `KIT_FORM_ID` against `GET /v4/forms` to the numeric id.
2. **The subscriber must already exist** (hence step 1). Posting an unknown email returns
   `404 "Not Found"`; posting an existing one returns `201` with `added_at`, preserving the
   subscriber's `state`.

**When the form has double opt-in enabled, this call triggers Kit's confirmation email** —
observed live: for the `inactive` subscriber created in step 1, Kit sent an
`"Important: confirm your subscription"` email from `hello@davideimola.dev` with a **"Confirm
your subscription"** button and a compliant `Unsubscribe · Privacy` footer, and the subscriber
stayed `inactive` (pending). Clicking the button confirms them → `active`. That is exactly the
double opt-in ADR-0002 requires, and it needs no v3 API and no embedded Kit form.

> The double-opt-in behavior lives in the **form's settings**, which the v4 `GET /v4/forms`
> list does not expose — so the target form must have double opt-in turned on in the Kit UI,
> and `KIT_FORM_ID` must point at it. Associating an already-`active` subscriber also sends the
> email but does not gate anything (they are already subscribed), so the `inactive`-first
> order matters.

## Broadcast creation + send

### Create (draft): `POST /v4/broadcasts` — CONFIRMED

```
POST /v4/broadcasts    { "subject": "…", "content": "<p>…</p>", "public": false }
```

Response `201`:

```jsonc
{
  "broadcast": {
    "id": 25108320,
    "publication_id": 21713461,
    "subject": "…",
    "preview_text": null,
    "public": false,
    "published_at": null,
    "send_at": null,
    "status": "draft",
    "content": "<p>…</p>",
    "public_url": "https://<account>.kit.com/posts/",
    "email_address": "hello@davideimola.dev",       // the account sending address
    "email_template": { "id": 4686515, "name": "Davide Imola Simple" },
    "subscriber_filter": [ { "all": [ { "type": "all_subscribers" } ] } ]  // ← default audience
  }
}
```

The default `subscriber_filter` is **all_subscribers** — a send with no narrower filter goes
to the whole list. The `email_template` is a pre-existing account template; it can be changed
later and is not a spike concern.

### Send / schedule: `send_at` on `POST /v4/broadcasts` — CONFIRMED

`POST /v4/broadcasts` with a `send_at` ISO-8601 timestamp **schedules the send** (no separate
"send" verb). Live result: the free plan **accepted** the scheduled send — `201`, no plan
restriction (no `402`/`403`):

```jsonc
{ "broadcast": { "id": 25109796, "send_at": "2026-07-22T15:57:55Z", "status": "scheduled", … } }
```

So programmatic sending is available on the free Newsletter plan — the MailerLite-style
paywall the research warned about does **not** apply to Kit.

#### Deliverability note — the test send landed in spam

The confirmed test send **delivered but landed in the Junk folder** (iCloud). Two causes,
one of them a real pre-build finding:

1. **Not representative content.** The test broadcast was a one-line, link-less body with an
   `[SPIKE TEST] … — ignore` subject — textbook thin/spammy mail. A real issue (intro +
   harvested sections + links + unsubscribe footer) starts from a much better baseline.
2. **The domain is not authenticated for Kit sending.** `GET /v4/account` reports the sending
   address as `is_verified: true` but **`is_dmarc_configured: false`**. A brand-new Kit sender
   on `davideimola.dev` with no DMARC alignment, into a strict provider (iCloud), reliably
   lands in spam. The domain already authenticates **Resend** (transactional), but **Kit's own
   domain authentication (DKIM CNAMEs from Kit, SPF include, DMARC alignment) must be set up
   before real issues go out.** This is separate from "can we send via API" (yes) — it governs
   inbox placement.

**Action for the build (before issue #1 ships):** complete Kit domain authentication for
`davideimola.dev` and re-test placement. Tracked as a deliverability prerequisite, not an API
limitation.

## Verdicts

| Assumption | Verdict | Evidence |
|---|---|---|
| Auth via `X-Kit-Api-Key` works on free tier | ✅ **CONFIRMED** | `GET /v4/account` → 200, `plan_type: free` |
| Broadcast **create** works on free tier | ✅ **CONFIRMED** | `POST /v4/broadcasts` → 201, `status: draft` |
| Broadcast **send** works on free tier | ✅ **CONFIRMED** | `POST /v4/broadcasts` + `send_at` → 201, `status: scheduled`, no plan block |
| API-created subscriber triggers **double opt-in** | ✅ **CONFIRMED (two-call)** | create `inactive` → associate with opt-in form → Kit sent the "confirm your subscription" email; subscriber stayed `inactive` |
| Deliverability / inbox placement | ⚠️ **NEEDS DOMAIN AUTH** | test send hit spam; `is_dmarc_configured: false` |

### Double opt-in verdict (corrected)

An earlier draft of this doc concluded double opt-in was impossible on v4 — **that was wrong**,
based on testing only an already-`active` subscriber. The correct finding: **double opt-in works
on v4** via the two-call flow (create `inactive` → `POST /v4/forms/{id}/subscribers` against a
double-opt-in form). The subscribe capability (#74) can therefore build a clean, all-v4 flow:

1. Our own React form → subscribe server action (honeypot + Turnstile, per the contact-form pattern).
2. `POST /v4/subscribers { email_address, state: "inactive" }`.
3. `POST /v4/forms/{KIT_FORM_ID}/subscribers { email_address }` → Kit sends the confirmation email.
4. The subscriber clicks "Confirm your subscription" → Kit flips them to `active` and (per the
   form's setting) can redirect to our on-site "you're in" landing page.

No v3 API (deprecated) and no embedded Kit form are needed.

## Env vars (added by this spike)

Added to `.env.local.example`, **server-side only** (never `NEXT_PUBLIC_`):

- `KIT_API_KEY` — v4 API key (`X-Kit-Api-Key` header).
- `KIT_FORM_ID` — the numeric id (or uid; the harness resolves either) of a Kit Form with
  **double opt-in enabled**, used in step 2 of the subscribe flow.

## What this unblocks

Auth, broadcast create + send, and the double-opt-in subscribe flow are all proven, so the
integration issues can proceed against this contract: the subscribe capability (#74, the
two-call flow above), the digest→email→broadcast path (#75, #77), and the archive/loader
work (#72). The one remaining prerequisite is **Kit domain authentication** for
`davideimola.dev` (deliverability), which should be completed before issue #1 ships.
