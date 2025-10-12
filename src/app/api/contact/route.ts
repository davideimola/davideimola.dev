import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  company?: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ContactRequest;
    const { name, email, subject, company, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields" },
        { status: 400 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Check for environment variables
    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL ?? "hello@davideimola.dev";

    if (!resendApiKey) {
      console.error("Missing Resend API key");
      return NextResponse.json(
        {
          error:
            "Contact form is not configured. Please email me directly at hello@davideimola.dev",
        },
        { status: 500 },
      );
    }

    // Format subject for display
    const subjectMap: Record<string, string> = {
      general: "General Inquiry",
      speaking: "Speaking Engagement",
      consulting: "Consulting / Collaboration",
      community: "Community / Open Source",
      feedback: "Feedback",
      other: "Other",
    };
    const formattedSubject = subjectMap[subject] ?? subject;

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: "Davide Imola Website<contact@davideimola.dev>",
      to: toEmail,
      replyTo: email,
      subject: `[Website Contact] ${formattedSubject} - ${name}`,
      html: generateEmailHtml({
        name,
        email,
        subject: formattedSubject,
        company,
        message,
      }),
      text: generateEmailText({
        name,
        email,
        subject: formattedSubject,
        company,
        message,
      }),
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        {
          error:
            error.message ?? "Failed to send message. Please try again later.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 },
    );
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function generateEmailHtml(data: {
  name: string;
  email: string;
  subject: string;
  company?: string;
  message: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #C91F37 0%, #D3381C 100%); padding: 30px; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 24px;">New Contact Form Submission</h1>
  </div>
  
  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e0e0e0; border-top: none;">
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
      <h2 style="color: #C91F37; margin-top: 0; font-size: 18px; border-bottom: 2px solid #C91F37; padding-bottom: 10px;">Contact Details</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #666; width: 120px;">Name:</td>
          <td style="padding: 10px 0;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #666;">Email:</td>
          <td style="padding: 10px 0;"><a href="mailto:${data.email}" style="color: #C91F37; text-decoration: none;">${data.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #666;">Subject:</td>
          <td style="padding: 10px 0;">${data.subject}</td>
        </tr>
        ${
          data.company
            ? `
        <tr>
          <td style="padding: 10px 0; font-weight: bold; color: #666;">Company:</td>
          <td style="padding: 10px 0;">${data.company}</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>
    
    <div style="background: white; padding: 20px; border-radius: 8px;">
      <h2 style="color: #C91F37; margin-top: 0; font-size: 18px; border-bottom: 2px solid #C91F37; padding-bottom: 10px;">Message</h2>
      <div style="white-space: pre-wrap; color: #333; line-height: 1.8;">${escapeHtml(data.message)}</div>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #666; font-size: 14px;">
      <p style="margin: 0;">This message was sent from the contact form on <a href="https://davideimola.dev" style="color: #C91F37; text-decoration: none;">davideimola.dev</a></p>
      <p style="margin: 10px 0 0 0;">Reply directly to this email to respond to ${data.name}</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

function generateEmailText(data: {
  name: string;
  email: string;
  subject: string;
  company?: string;
  message: string;
}): string {
  return `
New Contact Form Submission
===========================

Contact Details:
---------------
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}
${data.company ? `Company: ${data.company}` : ""}

Message:
--------
${data.message}

---
This message was sent from the contact form on davideimola.dev
Reply directly to this email to respond to ${data.name}
  `.trim();
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
}
