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
