"use server";

import { isValidEmail } from "../../lib/email";
import { InvalidEmailError, subscribeEmail } from "../../lib/newsletter-api";
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
  // never call newsletter-svc for them.
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
    // newsletter-svc mails the confirmation link; the address stays pending until it is
    // clicked, then lands on /newsletter/confirmed.
    await subscribeEmail(email);
    return { status: "success" };
  } catch (err) {
    // The service checks addresses more strictly than isValidEmail (no display names, a
    // dotted domain), so a few that pass here are refused there.
    if (err instanceof InvalidEmailError) {
      return { status: "error", message: "Please enter a valid email address." };
    }
    return {
      status: "error",
      message: "That did not go through, and it is on my side. Try again in a moment.",
    };
  }
}
