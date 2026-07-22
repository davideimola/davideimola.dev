// Cloudflare Turnstile server-side verification, shared by the contact and subscribe
// actions. Callers keep their own "token missing" guard (so they can word that case
// their own way) and call this only to verify a present token.

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Verify a Turnstile token against Cloudflare. Returns true only on a confirmed pass. */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const res = await fetch(SITEVERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  });
  const data = (await res.json()) as { success: boolean };
  return data.success === true;
}
