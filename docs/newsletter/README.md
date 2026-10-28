# Newsletter: how it is sent

The site writes and renders the newsletter. [newsletter-svc](https://github.com/davideimola/newsletter-svc),
on Davide's own server, keeps the subscribers and sends each issue through Kannon, with no
tracking pixel and no tracked links (ADR-0006). Nothing lives in a provider's dashboard any
more: the email template is in this repo and the confirmation email is in newsletter-svc.

```
SubscribeForm -> subscribe action -> newsletter-svc POST /api/subscribers -> confirmation email
                                                       /confirm -> /newsletter/confirmed
pnpm newsletter:draft -> PUT /api/issues/{slug} + POST /api/issues/{slug}/test -> Davide's inbox
news.davideimola.dev/admin/issues/{slug} -> "Send to everyone" (by hand) -> the list
```

## The email

`renderIssueEmail` (`src/lib/newsletter-email.mts`) renders the **whole** email with
react-email:

- `src/emails/layout.tsx`: the document, the lockup header, and the footer (motto, profiles,
  why you get this, Unsubscribe and Privacy).
- `src/emails/newsletter-issue.tsx`: the issue's own chrome (read on web, meta, subject).
- the issue's MDX, compiled with `src/emails/mdx-components.tsx`.

Rules it keeps:

- Always light, on the brand's paper, from `src/emails/theme.ts` (`@davideimola/brand`'s light
  palette). A dark body does not survive mail clients.
- The header is the hosted lockup, `https://www.davideimola.dev/brand/lockup-1200.png` (the www host, where the site is served: the apex redirects, and some mail clients do not follow a redirect for an image). It is the
  same file for every reader, so it says nothing about who opened what. It is the only image
  the layout adds; the test in `newsletter-email.test.ts` keeps it that way.
- The unsubscribe link is the literal `{{ unsubscribe_url }}`. newsletter-svc refuses an issue
  without it, and Kannon replaces it with each reader's own link at send time. Mail apps also
  get a one-click Unsubscribe button from the headers.
- Nothing is red at rest.

Preview it with `pnpm email:dev`.

## Sending an issue

1. Write the issue (`.claude/skills/newsletter-digest`), then `pnpm newsletter:draft YYYY-MM`.
   It saves the issue on newsletter-svc and mails a test to Davide. Re-running replaces the
   saved version and sends a new test.
2. Check the test in the inbox.
3. Open the admin URL the script prints, type the slug, and press **Send to everyone**. The
   button unlocks only after a test of the latest version, and an issue goes out once.

`NEWSLETTER_API_URL` and `NEWSLETTER_API_KEY` must be in `.env.local` (`.env.local.example`).

## The confirmation email

Its copy and look are in newsletter-svc (`internal/newsletter/confirmation.go`): change them
there. After confirming, the reader lands on `/newsletter/confirmed`.
