// Thin, typed wrapper over the Kit (formerly ConvertKit) v4 REST API. The only place
// in the app that talks to Kit. Server-side only: it reads KIT_API_KEY, which must
// never reach the client bundle.
//
// The double opt-in flow is deliberately TWO calls (verified by the #71 spike, see
// docs/research/kit-api-verification-spike.md): the v4 API has no single-call
// double-opt-in. Creating a subscriber alone yields an `active` (or silently
// `inactive`) record with no confirmation email; the confirmation email is a *form*
// behaviour. So we create the subscriber `inactive`, then associate it with a
// double-opt-in-enabled Kit Form, which is what makes Kit send the confirmation email.

const KIT_BASE_URL = "https://api.kit.com/v4";

export interface KitSubscriber {
  id: number;
  email_address: string;
  state: string;
}

export interface KitBroadcast {
  id: number;
}

/**
 * Subscribe an email via Kit's double opt-in flow. Returns the created (pending)
 * subscriber. Throws if the Kit env is missing or the API rejects either call; the
 * caller (subscribe action) turns that into an error state.
 */
export async function createSubscriber(email: string): Promise<KitSubscriber> {
  const apiKey = process.env.KIT_API_KEY;
  // Must be the NUMERIC form id (e.g. 9713978), not the embed uid from the form URL;
  // the v4 forms endpoint 404s on the uid (see the #71 spike).
  const formId = process.env.KIT_FORM_ID;
  if (!apiKey || !formId) {
    throw new Error("Missing KIT_API_KEY or KIT_FORM_ID environment variables.");
  }

  // 1. Create the subscriber as inactive (no email yet).
  const created = await kitPost("/subscribers", apiKey, {
    email_address: email,
    state: "inactive",
  });

  // 2. Associate with the double-opt-in form → triggers Kit's confirmation email.
  await kitPost(`/forms/${formId}/subscribers`, apiKey, { email_address: email });

  return (created.subscriber ?? created) as KitSubscriber;
}

/**
 * Create a Kit broadcast as a DRAFT (never sends) and return its id. The HTML is the
 * fully-rendered issue email; the "read on web" link lives inside that HTML. Sending is
 * always a manual, human-triggered step in the Kit dashboard (ADR-0002). Throws if the
 * env is missing or the API rejects the call.
 */
export async function createBroadcastDraft(input: {
  subject: string;
  html: string;
}): Promise<number> {
  const apiKey = process.env.KIT_API_KEY;
  if (!apiKey) {
    throw new Error("Missing KIT_API_KEY environment variable.");
  }
  const data = await kitPost("/broadcasts", apiKey, {
    subject: input.subject,
    content: input.html,
    public: false,
  });
  const id = ((data.broadcast ?? data) as KitBroadcast)?.id;
  if (!id) {
    throw new Error("Kit broadcast create returned no id.");
  }
  return id;
}

async function kitPost(
  path: string,
  apiKey: string,
  body: Record<string, unknown>
): Promise<Record<string, unknown>> {
  const res = await fetch(`${KIT_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "X-Kit-Api-Key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Kit API error (${res.status}) for POST ${path}`);
  }
  return res.json();
}
