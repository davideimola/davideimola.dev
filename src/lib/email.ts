// Minimal email shape check shared by the contact and subscribe server actions.
// Deliberately loose: a full RFC check is not worth it; the provider validates for real.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email);
}
