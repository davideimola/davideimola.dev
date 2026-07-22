# Kit free-tier verification spike — API contract + findings

**Issue:** [#71](https://github.com/davideimola/davideimola.dev/issues/71) (parent PRD [#70](https://github.com/davideimola/davideimola.dev/issues/70)) · **ADR:** [ADR-0002](../adr/0002-newsletter-hybrid-kit-in-repo-content.md) · **Research:** [newsletter-free-tier-comparison](./newsletter-free-tier-comparison.md)

> **Live-run status: PENDING.** The endpoint shapes below are pre-filled from the Kit v4
> documentation so the integration issues (#72–#77) have a contract to build against. The
> two assumptions this spike exists to prove — free-tier API **send** and API-created
> **double opt-in** — are marked `LIVE RESULT: pending` and must be filled from an actual
> run of `scripts/verify-kit-free-tier.mjs` against a real free-tier key **before** the
> integration code is written. Do not treat the pre-filled shapes as confirmed until the
> run output has been transcribed here.

## Why this spike

The research recommended Kit's free "Newsletter" plan, but two load-bearing facts were
only **verified-by-inference** (Kit's docs confirm unrestricted API keys but never state
free-tier sending outright, unlike MailerLite which explicitly forbids it):

1. Creating **and sending** a broadcast via the API works on the free Newsletter plan.
2. A subscriber **created via the API** triggers Kit's double opt-in confirmation email —
   rather than requiring the subscribe flow to route through a Kit **Form**.

If either fails, the fallback must be known before any integration code is written (issue
#74's subscribe capability in particular). This document is that pre-build gate.

## How to run the verification

```bash
KIT_API_KEY=<free-tier v4 key> \
KIT_TEST_EMAIL=<an inbox you control> \
KIT_FORM_ID=<double-opt-in form id, optional> \
node scripts/verify-kit-free-tier.mjs            # draft only, no email sent

# add --send to perform a REAL scheduled broadcast send (5 min out, cancellable)
# add --json findings.json to write a machine-readable summary
```

The harness prints every request/response verbatim (API key redacted). Transcribe the
observed shapes into the sections below and flip the verdicts. Note the harness can only
observe subscriber **state** via the API — whether the confirmation and broadcast emails
actually **land** is a manual inbox check.

## Authentication

- **Mechanism:** a **v4** API key in the `X-Kit-Api-Key` request header. This is a single
  key (not the v3 `api_key` + `api_secret` pair, which the integration does not use).
  Generate it at Kit → Settings → Developer. Free Kit accounts do not support OAuth, but
  API keys are unrestricted on every plan including free.
- **Base URL:** `https://api.kit.com/v4`
- **Server-side only:** the key is consumed by a server action and the digest skill and
  must never reach the client. Env var is `KIT_API_KEY` (no `NEXT_PUBLIC_` prefix).

```
GET https://api.kit.com/v4/account
X-Kit-Api-Key: <key>
Accept: application/json
```

> `LIVE RESULT: pending` — confirm the key is accepted (200) and record the account/plan
> fields returned.

## Subscriber creation

Two candidate paths. The spike determines which one the subscribe action must use.

### Path A — direct: `POST /v4/subscribers`

```
POST /v4/subscribers
X-Kit-Api-Key: <key>
Content-Type: application/json

{ "email_address": "reader@example.com" }
```

Expected response (from v4 docs — confirm shape against the run):

```jsonc
{
  "subscriber": {
    "id": 123456789,
    "email_address": "reader@example.com",
    "state": "active",          // ← the field that decides double opt-in
    "created_at": "2026-07-22T…",
    "fields": { }
  }
}
```

- If `state` is `active` immediately → **no double opt-in** on this path; Path B is required.
- If `state` is `inactive` → confirmation pending (double opt-in in effect).

> `LIVE RESULT: pending` — record the observed `state` for the direct path.

### Path B — via Form (double opt-in fallback): `POST /v4/forms/{form_id}/subscribers`

```
POST /v4/forms/<KIT_FORM_ID>/subscribers
X-Kit-Api-Key: <key>
Content-Type: application/json

{ "email_address": "reader@example.com" }
```

A subscriber added through a Form that has double opt-in enabled comes back `inactive`
and Kit sends the confirmation email; the subscriber becomes `active` only after they
click confirm. Discover available forms with `GET /v4/forms` (the harness lists them,
showing each form's `settings.opt_in_required`).

> `LIVE RESULT: pending` — record the observed `state` for the form path and whether the
> confirmation email arrived in the test inbox.

## Broadcast creation + send

### Create (draft): `POST /v4/broadcasts`

```
POST /v4/broadcasts
X-Kit-Api-Key: <key>
Content-Type: application/json

{
  "subject": "…",
  "content": "<p>email HTML…</p>",
  "public": false
}
```

Expected response (from v4 docs — confirm shape against the run):

```jsonc
{
  "broadcast": {
    "id": 987654321,
    "subject": "…",
    "content": "<p>email HTML…</p>",
    "preview_text": null,
    "public": false,
    "published_at": null,
    "send_at": null,
    "status": "draft"
  }
}
```

> `LIVE RESULT: pending` — confirm a draft is created (2xx) and record the returned `id`
> and `status`.

### Send / schedule: `send_at` on `POST /v4/broadcasts`

The free-tier send assumption is the whole point of the spike. Per the primary source
([newsletter-free-tier-comparison](./newsletter-free-tier-comparison.md)), `POST /v4/broadcasts`
with a `send_at` ISO-8601 timestamp **schedules the send** — there is no separate "send" verb.
The harness (with `--send`) creates a broadcast with `send_at` a few minutes out and reports
whether the free plan accepts it or returns a plan-restriction error (a `402`/`403` would be
the MailerLite-style hard block the research warned about).

```
POST /v4/broadcasts
{ "subject": "…", "content": "<p>…</p>", "public": false, "send_at": "2026-07-22T…Z" }
```

> `LIVE RESULT: pending` — confirm the free plan accepts a scheduled send (2xx) rather than
> returning a plan restriction, and record the response shape and any send-time gotchas.

## Verdicts

| Assumption | Verdict | Evidence |
|---|---|---|
| Auth via `X-Kit-Api-Key` works on free tier | `pending` | `GET /v4/account` status |
| Broadcast **create** works on free tier | `pending` | `POST /v4/broadcasts` status + id |
| Broadcast **send** works on free tier | `pending` | `--send` result (allowed / plan-restricted) |
| API-created subscriber triggers **double opt-in** | `pending` | direct vs form `state` + inbox check |
| **Fallback needed?** (route via Kit Form) | `pending` | true iff direct path returns `active` |

## Env vars (added by this spike)

Added to `.env.local.example`, **server-side only**:

- `KIT_API_KEY` — v4 API key (`X-Kit-Api-Key` header). Never `NEXT_PUBLIC_`.
- `KIT_FORM_ID` — id of the double-opt-in Kit Form subscribers are routed through, needed
  only if Path A does not trigger double opt-in (to be settled by the live run).

## What this unblocks

Once the verdicts are filled and green, the integration issues can proceed against this
contract: the Kit API client seam (#75's `createBroadcastDraft`, #74's `createSubscriber`),
the subscribe server action (#74), and the digest skill (#77). If the send assumption
fails, revisit ADR-0002 before building #75; if double opt-in requires a Form, #74's
subscribe action targets Path B with `KIT_FORM_ID`.
