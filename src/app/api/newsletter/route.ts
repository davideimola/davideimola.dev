import { type NextRequest, NextResponse } from "next/server";

interface NewsletterRequest {
  email: string;
  formId?: string;
}

interface KitApiResponse {
  subscription?: {
    id: number;
    state: string;
  };
  message?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as NewsletterRequest;
    const { email, formId } = body;

    // Validate email
    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    // Check for required environment variables
    const apiKey = process.env.CONVERTKIT_API_KEY;
    const defaultFormId = process.env.CONVERTKIT_FORM_ID;
    const targetFormId = formId ?? defaultFormId;

    if (!apiKey || !targetFormId) {
      console.error("Missing Kit configuration");
      return NextResponse.json(
        {
          error:
            "Newsletter service not configured. Please contact the site administrator.",
        },
        { status: 500 },
      );
    }

    // Subscribe to Kit (API endpoint remains api.convertkit.com)
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${targetFormId}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          email,
        }),
      },
    );

    const data = (await response.json()) as KitApiResponse;

    if (!response.ok) {
      console.error("Kit API error:", data);

      // Handle specific Kit API errors
      const messageText = data.message ?? data.error ?? "";
      if (messageText.includes("already subscribed")) {
        return NextResponse.json(
          { error: "This email is already subscribed to the newsletter." },
          { status: 400 },
        );
      }

      return NextResponse.json(
        { error: "Failed to subscribe. Please try again later." },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed! Please check your email to confirm.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
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
