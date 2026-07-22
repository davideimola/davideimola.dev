"use server";

import { Resend } from "resend";
import { isValidEmail } from "../../lib/email";
import { verifyTurnstile } from "../../lib/turnstile";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactEmail(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: bots fill this, humans don't — pretend success so bots move on
  const honeypot = formData.get("website")?.toString();
  if (honeypot) {
    return { status: "success" };
  }

  // Cloudflare Turnstile verification
  const turnstileToken = formData.get("cf-turnstile-response")?.toString();
  if (!turnstileToken) {
    return { status: "error", message: "Please complete the security check." };
  }
  if (!(await verifyTurnstile(turnstileToken))) {
    return { status: "error", message: "Security check failed. Please try again." };
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return { status: "error", message: "All fields are required." };
  }

  if (!isValidEmail(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (message.length < 10) {
    return { status: "error", message: "Message must be at least 10 characters." };
  }

  // Links are the most common spam pattern. Reject with an honest error so a
  // legitimate sender can rephrase and resend, instead of losing the message
  // to a fake success.
  const urlCount = (message.match(/https?:\/\/|www\./gi) ?? []).length;
  if (urlCount >= 1) {
    return {
      status: "error",
      message:
        "Links are not allowed in the message. Please remove them; you can share them once I reply.",
    };
  }

  // Time-based signal: humans take at least a few seconds to write. A fast
  // submission is still delivered, but flagged in the subject so it can be
  // filtered in the inbox — nothing real gets silently dropped.
  const loadTime = Number(formData.get("_t")?.toString() ?? "0");
  const elapsed = Date.now() - loadTime;
  const suspect = !loadTime || elapsed < 4000;

  const subject = suspect ? `[Suspect] New message from ${name}` : `New message from ${name}`;
  const suspectNote = "Flagged as suspect: submitted too fast after page load.";

  try {
    await resend.emails.send({
      from: "contact@davideimola.dev",
      to: "hello@davideimola.dev",
      replyTo: email,
      subject,
      text: `${suspect ? `${suspectNote}\n\n` : ""}Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        ${suspect ? `<p style="color:#a07a12;"><strong>⚠ ${suspectNote}</strong></p>` : ""}
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <hr />
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    });

    return { status: "success" };
  } catch {
    return { status: "error", message: "Failed to send message. Please try again." };
  }
}
