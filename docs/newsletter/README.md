# Newsletter: Kit setup notes

Three things live in Kit's dashboard, not in code. They are separate fields: don't mix them.

> **Manual step after every change here.** Kit never reads this repo. When
> `kit-email-template.html`, the confirmation copy or the accent colour below change, they
> have to be re-pasted or re-set by hand in Kit, or the inbox keeps the old look. The 2026
> rebrand (ADR-0004) is one of those changes.

## 1. Email template (the wrapper)

`kit-email-template.html` is the account **email template**: the brand wrapper (header +
footer) with the `{{ message_content }}` merge tag where Kit injects the body. It wraps
**both** the double opt-in confirmation email and the monthly digest broadcast, so aligning
this one template makes both read as one brand.

- Paste the **whole** `kit-email-template.html` into Kit's **email template** editor.
  It is pure HTML (no comments) so a select-all copy is safe.
- Always light, on the brand's paper ground (`#F7F5F0`) with ink text (`#1C2233`) and rule
  hairlines (`#DEDCD5`): a dark body does not survive email rendering (iCloud strips it and
  auto-inverts), and the brand is light first anyway.
- The header is the brand lockup (mark plus wordmark) as a hosted image,
  `https://www.davideimola.dev/brand/lockup-1200.png` (copied from `@davideimola/brand` by
  `pnpm brand:sync`), shown at 180x35. Never retype the name as text: the wordmark is drawn.
- The footer carries the motto, the profiles in mono and the unsubscribe and privacy links.
- The red rule applies: nothing in the email is red at rest. The values are literals here
  because Kit needs them; they come from `@davideimola/brand/tokens.json` (light palette),
  the same source `src/emails/theme.ts` reads.

## 2. Confirmation email copy (a different field)

The confirmation email **copy** is edited in Kit's **form / confirmation** settings, NOT in
the template. Put only the text there (Kit adds the confirm button). Do **not** paste the
template HTML into this field.

- Subject: `Confirm your subscription to davideimola.dev`
- Before the button:
  > Thanks for signing up. One click and you're in.
  >
  > Once a month, what actually happened: what I found, tried, built and killed. One email
  > a month, and you can unsubscribe from any issue.
- Button label: `Confirm my subscription`
- After the button:
  > Didn't sign up? Ignore this email and nothing happens.
  >
  > Davide

## 3. Brand / accent colour

The confirm button colour comes from Kit's **brand/accent colour** setting (not the
template). Set it to ink, `#1C2233`. Not Akane red: since the rebrand red belongs to the
mark's knot and the one marker stroke, and buttons are ink.

## Digest

The monthly digest's `{{ message_content }}` is rendered in-repo by react-email
(`src/lib/newsletter-email.mts`, with the components in `src/emails/`) and pushed to Kit as
a broadcast draft. It is content-only, so it slots under this same wrapper without a second
header or footer. Its colours and fonts come from `src/emails/theme.ts`; preview it with
`pnpm email:dev`.
