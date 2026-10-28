# ADR-0006: Send the newsletter from Davide's own server, without tracking

- **Status:** Accepted
- **Date:** 2026-10-28
- **Supersedes:** ADR-0002 on the delivery layer: the choice of Kit, and decisions 4, 8 and 10
- **Issue:** [#132](https://github.com/davideimola/davideimola.dev/issues/132)

## Context

The Italian DPA (Garante) published guidelines on tracking pixels in email on 17 April 2026 (GU n. 98, 29 April 2026). A pixel that measures the individual recipient (who opened, when, how often) needs prior consent, prior notice and a granular opt-out: a reader must be able to keep receiving the emails without the pixel.

Kit, the delivery layer ADR-0002 chose, cannot meet that. Every email carries a pixel unique to its recipient, every link goes through Kit's redirect, and no setting, plan or API parameter turns either off (checked on 2026-10-28). "Filter bot opens" drops the data but still ships the pixel. There is no way to offer one reader the newsletter without it.

ADR-0002 anticipated a swap: content and archive already live in the repo, so only the delivery and subscriber layer would change. It set Listmonk aside because it needed a paid host, Postgres and an SMTP relay. All three now exist: Davide runs a K3s VPS (davideimola/cluster) with CloudNativePG and backups, and its IP sends mail cleanly (port 25 open, not listed, reverse DNS set, SPF, DKIM and DMARC passing).

Moving the website to the VPS too was weighed and set aside. The VPS already carries every personal app, and the site is the one thing that has to stay up. The newsletter needs the VPS only for port 25.

## Decision

1. **[Kannon](https://github.com/kannon-email/kannon) sends**, on the VPS, from the Kannon Domain `news.davideimola.dev`, with `From: Davide Imola <hello@davideimola.dev>`. Its Tracking Policy is `off` for opens and links. In Kannon that is a ceiling no batch or recipient can raise, and every call states `off` again. Kannon's tracker component is not even running.
2. **[newsletter-svc](https://github.com/davideimola/newsletter-svc) owns the list**: a small Go service beside Kannon, on `news.davideimola.dev`. It handles the double opt-in, the confirmation and unsubscribe links (RFC 8058 one-click), the suppression of unsubscribed addresses, deletion on request, and one send per issue. Its admin pages sit behind Google sign-in limited to Davide's account.
3. **The site keeps what ADR-0002 gave it**: content, form, archive, the "read on web" link, react-email. It now renders the **whole** email, header and footer included, because no provider template wraps it any more (`src/emails/layout.tsx`). Where each reader's unsubscribe link goes it writes `{{ unsubscribe_url }}`, and the service refuses an issue without it.
4. **The site talks to the service only through `src/lib/newsletter-api.ts`**, server-side, with an API key. Postgres is never reachable from Vercel.
5. **The send still takes a person** (ADR-0002 decision 7). `pnpm newsletter:draft` saves the issue on the service and test-sends it to Davide. The real send is a button on the issue's admin page, unlocked only after a test of the latest version, and it asks for the slug to be typed out.
6. **No open or click measurement, now or later.** That makes the guidelines' consent and opt-out moot: there is nothing to consent to.

## Consequences

- Still $0: the VPS is already paid for.
- Davide runs the mail infrastructure. Deliverability (IP reputation, DNS records, blocklists) is his to watch, and so is the server. Bounces that arrive after the send are not processed yet: Kannon's inbound SMTP is off.
- The confirmation email's copy lives in newsletter-svc, not in a provider's dashboard. The email template lives in this repo.
- Existing subscribers move from Kit with their confirmation dates (#132, phase 4). The first issue sent from the new setup tells them about the change, then Kit's account and data are deleted.
- `docs/research/kit-api-verification-spike.md` and the free-tier comparison stay as the record of why Kit was chosen in the first place.
