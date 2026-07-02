import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "./contact";

const sendMock = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendMock };
  },
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const idle = { status: "idle" as const };

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fields: Record<string, string> = {
    "cf-turnstile-response": "test-token",
    name: "Jane Doe",
    email: "jane@example.com",
    message: "I would love to invite you to speak at our conference next spring.",
    _t: String(Date.now() - 10_000),
    ...overrides,
  };
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}

beforeEach(() => {
  sendMock.mockReset().mockResolvedValue({});
  fetchMock.mockReset().mockResolvedValue({
    json: async () => ({ success: true }),
  });
});

describe("sendContactEmail", () => {
  it("silently drops honeypot submissions without sending", async () => {
    const state = await sendContactEmail(idle, makeFormData({ website: "spam.example" }));

    expect(state.status).toBe("success");
    expect(sendMock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("errors when the Turnstile token is missing", async () => {
    const fd = makeFormData();
    fd.delete("cf-turnstile-response");

    const state = await sendContactEmail(idle, fd);

    expect(state.status).toBe("error");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects messages containing links with a visible error", async () => {
    const state = await sendContactEmail(
      idle,
      makeFormData({ message: "Check out our SEO offer at https://spam.example/offer" })
    );

    expect(state.status).toBe("error");
    expect(state.message).toMatch(/links/i);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("rejects protocol-less www links too", async () => {
    const state = await sendContactEmail(
      idle,
      makeFormData({ message: "Visit www.spam.example for a great deal on backlinks" })
    );

    expect(state.status).toBe("error");
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("delivers fast submissions flagged as suspect instead of dropping them", async () => {
    const state = await sendContactEmail(idle, makeFormData({ _t: String(Date.now()) }));

    expect(state.status).toBe("success");
    expect(sendMock).toHaveBeenCalledTimes(1);
    expect(sendMock.mock.calls[0][0].subject).toMatch(/^\[Suspect\]/);
  });

  it("delivers normal submissions with a clean subject", async () => {
    const state = await sendContactEmail(idle, makeFormData());

    expect(state.status).toBe("success");
    expect(sendMock).toHaveBeenCalledTimes(1);
    const email = sendMock.mock.calls[0][0];
    expect(email.subject).toBe("New message from Jane Doe");
    expect(email.replyTo).toBe("jane@example.com");
  });

  it("escapes HTML in the email body", async () => {
    await sendContactEmail(
      idle,
      makeFormData({
        name: '<img src=x onerror="alert(1)">',
        message: "Hello <script>alert('xss')</script> this is long enough.",
      })
    );

    const email = sendMock.mock.calls[0][0];
    expect(email.html).not.toContain("<script>");
    expect(email.html).toContain("&lt;script&gt;");
    expect(email.html).not.toContain('<img src=x onerror="alert(1)">');
  });
});
