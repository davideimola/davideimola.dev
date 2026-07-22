# Kit free-tier verification spike — API contract + findings

**Issue:** [#71](https://github.com/davideimola/davideimola.dev/issues/71) (parent PRD [#70](https://github.com/davideimola/davideimola.dev/issues/70)) · **ADR:** [ADR-0002](../adr/0002-newsletter-hybrid-kit-in-repo-content.md) · **Research:** [newsletter-free-tier-comparison](./newsletter-free-tier-comparison.md)

> **Live-run status: RUN 2026-07-22** against a real free-tier account (plan `free`,
> 10,000-subscriber limit). Auth, subscriber-create, form-associate, broadcast-create, and
> broadcast **send** are confirmed below. **The double opt-in assumption FAILED** — the v4
> API has no confirmation-email flow; a fallback is required (see the verdict). Re-run
> `scripts/verify-kit-free-tier.mjs` to reproduce.

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
KIT_FORM_ID=<form id OR uid, optional> \
node scripts/verify-kit-free-tier.mjs            # draft only, no email sent

# add --send to perform a REAL scheduled broadcast send (5 min out, cancellable)
# add --cleanup to delete created drafts (and cancel a scheduled send)
# add --json findings.json to write a machine-readable summary
```

The harness prints every request/response verbatim (API key redacted). It can only observe
subscriber **state** via the API — whether a confirmation/broadcast email actually **lands**
is a manual inbox check.

## Authentication — CONFIRMED

- **Mechanism:** a **v4** API key in the `X-Kit-Api-Key` request header. A single key (not
  the v3 `api_key` + `api_secret` pair — see the double-opt-in note, where v3 matters).
  Generate at Kit → Settings → Developer. Free accounts don't support OAuth; API keys are
  unrestricted on every plan including free.
- **Base URL:** `https://api.kit.com/v4`
- **Server-side only:** consumed by the subscribe server action and the digest skill; never
  reaches the client. Env var `KIT_API_KEY` (no `NEXT_PUBLIC_` prefix).

`GET /v4/account` → `200`. Confirms the key, and that this account is on `plan_type: "free"`
with `subscriber_limit: 10000` and a verified sending address (`is_verified: true`).

## Subscriber creation

### Path A — direct: `POST /v4/subscribers` — CONFIRMED, no double opt-in

```
POST /v4/subscribers    { "email_address": "reader@example.com" }
```

Response `200/201`:

```jsonc
{
  "subscriber": {
    "id": 4219670893,
    "first_name": null,
    "email_address": "reader@example.com",
    "state": "active",        // ← created ACTIVE with NO confirmation email
    "created_at": "2026-07-22T…Z",
    "fields": {}
  }
}
```

Accepts `first_name`, `email_address` (required), `state` (`active` | `inactive` | `cancelled`
| `bounced` | `complained`, **defaults to `active`**), and `fields`. You _can_ pass
`state: "inactive"`, but the endpoint **sends no confirmation email** and its own docs warn
"Updating the subscriber state with this endpoint is not supported" — so an `inactive`
subscriber created this way has no way to self-confirm. **This path never triggers double
opt-in.**

### Path B — associate with a Form: `POST /v4/forms/{id}/subscribers` — CONFIRMED, not an opt-in flow

Two gotchas confirmed live:

1. **id vs uid.** The API path wants the numeric form **`id`** (e.g. `9713978`). The embed
   URL/JS uses the string **`uid`** (e.g. `2484145147`). Passing the uid returns `404`. The
   harness resolves either form of `KIT_FORM_ID` against `GET /v4/forms` to the numeric id.
2. **The subscriber must already exist.** Per the v4 docs, this endpoint _associates an
   existing subscriber with a form_ — it does **not** create one. Posting an unknown email
   returns `404 "Not Found"`. Posting an **existing** subscriber returns `201` with an
   `added_at` timestamp — and the subscriber's `state` is unchanged (stays `active`). **No
   confirmation email is sent; this is not a double opt-in trigger.**

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
    "created_at": "2026-07-22T…Z",
    "subject": "…",
    "preview_text": null,
    "description": null,
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

Note the default `subscriber_filter` is **all_subscribers** — a send with no narrower filter
goes to the entire list. (At spike time the account had exactly **1** subscriber, so a test
send only reaches the author.)

### Send / schedule: `send_at` on `POST /v4/broadcasts` — CONFIRMED

`POST /v4/broadcasts` with a `send_at` ISO-8601 timestamp **schedules the send** (no separate
"send" verb). Live result: the free plan **accepted** the scheduled send — `201`, no plan
restriction (no `402`/`403`):

```
POST /v4/broadcasts   { "subject": "…", "content": "<p>…</p>", "public": false, "send_at": "…Z" }
```

```jsonc
{ "broadcast": { "id": 25109796, "send_at": "2026-07-22T15:57:55Z", "status": "scheduled", … } }
```

So programmatic sending is available on the free Newsletter plan — the MailerLite-style
paywall the research warned about does **not** apply to Kit. (Delivery reaches the list per
the `subscriber_filter`; the test send went to the sole subscriber, the author.)

## Verdicts

| Assumption | Verdict | Evidence |
|---|---|---|
| Auth via `X-Kit-Api-Key` works on free tier | ✅ **CONFIRMED** | `GET /v4/account` → 200, `plan_type: free` |
| Broadcast **create** works on free tier | ✅ **CONFIRMED** | `POST /v4/broadcasts` → 201, `status: draft` |
| Broadcast **send** works on free tier | ✅ **CONFIRMED** | `POST /v4/broadcasts` + `send_at` → 201, `status: scheduled`, no plan block |
| API-created subscriber triggers **double opt-in** | ❌ **FAILED** | direct → `active`, no email; form-associate → state unchanged, no email |
| **Fallback needed?** (route via Kit Form) | ⚠️ **YES — required** | see below |

### Double opt-in: the assumption is false — fallback required

The v4 API has **no double-opt-in / confirmation-email flow**. Neither creating a subscriber
(`POST /v4/subscribers`) nor associating one with a form (`POST /v4/forms/{id}/subscribers`)
sends a confirmation email; the first creates an `active` subscriber outright, the second
leaves the state as-is. Kit's confirmation email belongs to the **form-submission** flow,
not the admin API. Options for a compliant double opt-in, to decide before building #74:

1. **Legacy v3 form-subscribe API** — `POST /v3/forms/{form_id}/subscribe` (needs a separate
   **v3** API key; the v4 key returns `401` there). Historically triggers the confirmation
   email when the form has opt-in enabled, keeping our own React form. **Risk:** v3 is
   marked legacy/deprecated — building a new integration on it is fragile.
2. **Kit embedded/hosted form** — Kit's JS embed or hosted page does native double opt-in,
   but puts Kit's form UI in play, conflicting with ADR-0002's "site owns the form".
3. **Single opt-in via v4 + logged consent** — `POST /v4/subscribers` (active immediately),
   paired with an explicit consent checkbox + stored proof. Simpler and all-v4, but diverges
   from ADR-0002's deliberate double-opt-in choice; revisit the ADR before choosing this.

**This needs a decision (and likely an ADR-0002 update) before issue #74 is built.** It does
not block #72/#73/#75/#77, which don't touch the subscribe path.

## Env vars (added by this spike)

Added to `.env.local.example`, **server-side only** (never `NEXT_PUBLIC_`):

- `KIT_API_KEY` — v4 API key (`X-Kit-Api-Key` header).
- `KIT_FORM_ID` — a Kit Form id (or uid; the harness resolves either). Whether it is used at
  all depends on the double-opt-in decision above; if option 1 is chosen, a `v3` API key env
  var would also be needed.

## What this unblocks

Auth, broadcast create, and broadcast send are all proven, so the digest→email→broadcast
path (#75, #77) and the archive/loader work (#72) can proceed against this contract. The
**subscribe capability (#74) is gated** on the double-opt-in decision above — that is the
one open item this spike surfaced.
