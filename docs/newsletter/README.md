# Newsletter — Kit setup notes

Two things live in Kit's dashboard (not in code). They are separate fields — don't mix them.

## 1. Email template (the wrapper)

`kit-email-template.html` is the account **email template**: the brand wrapper (header +
footer) with the `{{ message_content }}` merge tag where Kit injects the body. It wraps
**both** the double opt-in confirmation email and the monthly digest broadcast, so aligning
this one template makes both read as one brand.

- Paste the **whole** `kit-email-template.html` into Kit's **email template** editor.
  It is pure HTML (no comments) so a select-all copy is safe.
- Light by design: a dark body background does not survive email rendering (iCloud strips
  it and auto-inverts), so the template is a light surface + dark ink + Akane Red cursor.
- Current brand (docs/brand.md): the `davideimola` + red cursor wordmark, warm brand grays.

## 2. Confirmation email copy (a different field)

The confirmation email **copy** is edited in Kit's **form / confirmation** settings, NOT in
the template. Put only the text there (Kit adds the confirm button). Do **not** paste the
template HTML into this field.

- Subject: `Confirm your subscription to davideimola.dev`
- Before the button:
  > Thanks for signing up. One click and you're in.
  >
  > Once you confirm, you'll get a short digest once a month: what I published, upcoming
  > talks, and the occasional project. No spam, unsubscribe anytime.
- Button label: `Confirm my subscription`
- After the button:
  > Didn't sign up? Ignore this email and nothing happens.
  >
  > Davide

## 3. Brand / accent colour

The confirm button colour comes from Kit's **brand/accent colour** setting (not the
template). Set it to `#C91F37` (Akane Red).

## Digest

The monthly digest's `{{ message_content }}` is rendered in-repo by react-email
(`src/lib/newsletter-email.tsx`) and pushed to Kit as a broadcast draft. It is (being made)
content-only so it slots under this same wrapper without a second header/footer.
