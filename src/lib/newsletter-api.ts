// Thin, typed client for newsletter-svc (github.com/davideimola/newsletter-svc), the service
// on Davide's own server that keeps the subscribers and sends the issues through Kannon
// (ADR-0006). The only place in the app that talks to it. Server-side only: it reads
// NEWSLETTER_API_KEY, which must never reach the client bundle.
//
// The service owns the double opt-in, the unsubscribe links and the send. From here the site
// can only start a subscription, save an issue and test-send it to Davide: the real send to
// the list is a button on the service's admin pages, never an API call (ADR-0002 point 7).

export class InvalidEmailError extends Error {
  constructor() {
    super("newsletter-svc refused the address as invalid.");
  }
}

export interface IssueState {
  slug: string;
  subject: string;
  status: "draft" | "sending" | "sent";
  /** Whether the latest version was test-sent: the admin page's send unlocks only then. */
  tested: boolean;
  /** The issue's page on the service's admin, where the real send happens. */
  adminUrl: string;
}

/**
 * Start the double opt-in for an address: the service mails the confirmation link. It
 * answers the same whether the address is new, waiting or already subscribed, so this
 * never learns which. Throws InvalidEmailError for an address the service refuses, and a
 * plain Error when the service is missing or failing.
 */
export async function subscribeEmail(email: string): Promise<void> {
  const res = await call("POST", "/api/subscribers", { email });
  if (res.status === 400) {
    throw new InvalidEmailError();
  }
  if (res.status !== 202) {
    throw new Error(`newsletter-svc error (${res.status}) for POST /api/subscribers`);
  }
}

/**
 * Save the rendered issue as a draft on the service, replacing an earlier version. Its HTML
 * must carry `{{ unsubscribe_url }}`, where the service puts each reader's own link.
 */
export async function saveIssue(input: {
  slug: string;
  subject: string;
  html: string;
}): Promise<IssueState> {
  const res = await call("PUT", `/api/issues/${encodeURIComponent(input.slug)}`, {
    subject: input.subject,
    html: input.html,
  });
  return issueState(res, "PUT /api/issues");
}

/** Mail the saved issue to Davide only. */
export async function testIssue(slug: string): Promise<IssueState> {
  const res = await call("POST", `/api/issues/${encodeURIComponent(slug)}/test`);
  return issueState(res, "POST /api/issues/test");
}

async function issueState(res: Response, what: string): Promise<IssueState> {
  if (res.status === 409) {
    throw new Error("This issue has already been sent: newsletter-svc refuses to change it.");
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`newsletter-svc error (${res.status}) for ${what}: ${body.trim()}`);
  }
  return (await res.json()) as IssueState;
}

async function call(method: string, path: string, body?: unknown): Promise<Response> {
  const base = process.env.NEWSLETTER_API_URL;
  const key = process.env.NEWSLETTER_API_KEY;
  if (!base || !key) {
    throw new Error("Missing NEWSLETTER_API_URL or NEWSLETTER_API_KEY environment variables.");
  }
  return fetch(`${base.replace(/\/+$/, "")}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
