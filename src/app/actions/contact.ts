"use server";

import { Resend } from "resend";

export interface ContactState {
  status: "idle" | "success" | "error";
  message?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  // Honeypot: bots fill this, humans don't
  const honeypot = formData.get("website")?.toString();
  if (honeypot) {
    return { status: "success" };
  }

  // Time-based check: bots submit instantly; humans take at least a few seconds
  const loadTime = Number(formData.get("_t")?.toString() ?? "0");
  const elapsed = Date.now() - loadTime;
  if (!loadTime || elapsed < 4000) {
    return { status: "success" };
  }

  // Cloudflare Turnstile verification
  const turnstileToken = formData.get("cf-turnstile-response")?.toString();
  if (!turnstileToken) {
    return { status: "error", message: "Please complete the security check." };
  }
  const turnstileRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    }
  );
  const turnstileData = (await turnstileRes.json()) as { success: boolean };
  if (!turnstileData.success) {
    return { status: "error", message: "Security check failed. Please try again." };
  }

  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  if (!name || !email || !message) {
    return { status: "error", message: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (message.length < 10) {
    return { status: "error", message: "Message must be at least 10 characters." };
  }

  // Reject messages with any URL — common spam pattern
  const urlCount = (message.match(/https?:\/\//gi) ?? []).length;
  if (urlCount >= 1) {
    return { status: "success" };
  }

  try {
    await resend.emails.send({
      from: "contact@davideimola.dev",
      to: "hello@davideimola.dev",
      replyTo: email,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <hr />
        <p>${message.replace(/\n/g, "<br />")}</p>
      `,
    });

    return { status: "success" };
  } catch {
    return { status: "error", message: "Failed to send message. Please try again." };
  }
}
