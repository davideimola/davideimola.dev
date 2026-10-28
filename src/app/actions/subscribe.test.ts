import { beforeEach, describe, expect, it, vi } from "vitest";
import { InvalidEmailError } from "../../lib/newsletter-api";
import { subscribe } from "./subscribe";

const subscribeEmailMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/newsletter-api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../lib/newsletter-api")>()),
  subscribeEmail: subscribeEmailMock,
}));

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

const idle = { status: "idle" as const };

function makeFormData(overrides: Record<string, string> = {}): FormData {
  const fields: Record<string, string> = {
    "cf-turnstile-response": "test-token",
    email: "jane@example.com",
    ...overrides,
  };
  const fd = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value);
  }
  return fd;
}

beforeEach(() => {
  subscribeEmailMock.mockReset().mockResolvedValue(undefined);
  // Default: Turnstile verification passes.
  fetchMock.mockReset().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
});

describe("subscribe", () => {
  it("silently accepts honeypot submissions without calling newsletter-svc", async () => {
    const state = await subscribe(idle, makeFormData({ website: "spam.example" }));

    expect(state.status).toBe("success");
    expect(subscribeEmailMock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("errors when the Turnstile token is missing", async () => {
    const fd = makeFormData();
    fd.delete("cf-turnstile-response");

    const state = await subscribe(idle, fd);

    expect(state.status).toBe("error");
    expect(subscribeEmailMock).not.toHaveBeenCalled();
  });

  it("errors when Turnstile verification fails", async () => {
    fetchMock.mockReset().mockResolvedValue({ ok: true, json: async () => ({ success: false }) });

    const state = await subscribe(idle, makeFormData());

    expect(state.status).toBe("error");
    expect(subscribeEmailMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without calling newsletter-svc", async () => {
    const state = await subscribe(idle, makeFormData({ email: "not-an-email" }));

    expect(state.status).toBe("error");
    expect(subscribeEmailMock).not.toHaveBeenCalled();
  });

  it("creates the subscriber and returns success for a valid email", async () => {
    const state = await subscribe(idle, makeFormData());

    expect(state.status).toBe("success");
    expect(subscribeEmailMock).toHaveBeenCalledWith("jane@example.com");
  });

  it("returns an error state when newsletter-svc fails", async () => {
    subscribeEmailMock.mockReset().mockRejectedValue(new Error("newsletter-svc error (502)"));

    const state = await subscribe(idle, makeFormData());

    expect(state.status).toBe("error");
    expect(state.message).toMatch(/on my side/);
  });

  it("asks for a valid address when newsletter-svc refuses the one given", async () => {
    subscribeEmailMock.mockReset().mockRejectedValue(new InvalidEmailError());

    const state = await subscribe(idle, makeFormData({ email: "jane@localhost.example" }));

    expect(state.status).toBe("error");
    expect(state.message).toMatch(/valid email/);
  });
});
