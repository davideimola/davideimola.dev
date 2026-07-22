"use server";

import { isValidEmail } from "../../lib/email";
import { createSubscriber } from "../../lib/kit";
import { verifyTurnstile } from "../../lib/turnstile";

export interface SubscribeState {
  status: "idle" | "success" | "error";
  message?: string;
}

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData
): Promise<SubscribeState> {
  // Honeypot: bots fill this, humans don't. Pretend success so bots move on, and
  // never call Kit for them.
  const honeypot = formData.get("website")?.toString();
  if (honeypot) {
    return { status: "success" };
  }

  // Cloudflare Turnstile verification (shared with the contact action).
  const turnstileToken = formData.get("cf-turnstile-response")?.toString();
  if (!turnstileToken) {
    return { status: "error", message: "Please complete the security check." };
  }
  if (!(await verifyTurnstile(turnstileToken))) {
    return { status: "error", message: "Security check failed. Please try again." };
  }

  const email = formData.get("email")?.toString().trim();
  if (!email || !isValidEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  try {
    // Triggers Kit's double opt-in confirmation email; the subscriber stays pending
    // until they click it, then lands on /newsletter/confirmed.
    await createSubscriber(email);
    return { status: "success" };
  } catch {
    return { status: "error", message: "Something went wrong. Please try again in a moment." };
  }
}
