import { beforeEach, describe, expect, it, vi } from "vitest";
import { subscribe } from "./subscribe";

const createSubscriberMock = vi.hoisted(() => vi.fn());

vi.mock("../../lib/kit", () => ({
  createSubscriber: createSubscriberMock,
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
  createSubscriberMock.mockReset().mockResolvedValue({
    id: 1,
    email_address: "jane@example.com",
    state: "inactive",
  });
  // Default: Turnstile verification passes.
  fetchMock.mockReset().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
});

describe("subscribe", () => {
  it("silently accepts honeypot submissions without calling Kit", async () => {
    const state = await subscribe(idle, makeFormData({ website: "spam.example" }));

    expect(state.status).toBe("success");
    expect(createSubscriberMock).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("errors when the Turnstile token is missing", async () => {
    const fd = makeFormData();
    fd.delete("cf-turnstile-response");

    const state = await subscribe(idle, fd);

    expect(state.status).toBe("error");
    expect(createSubscriberMock).not.toHaveBeenCalled();
  });

  it("errors when Turnstile verification fails", async () => {
    fetchMock.mockReset().mockResolvedValue({ ok: true, json: async () => ({ success: false }) });

    const state = await subscribe(idle, makeFormData());

    expect(state.status).toBe("error");
    expect(createSubscriberMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid email without calling Kit", async () => {
    const state = await subscribe(idle, makeFormData({ email: "not-an-email" }));

    expect(state.status).toBe("error");
    expect(createSubscriberMock).not.toHaveBeenCalled();
  });

  it("creates the subscriber and returns success for a valid email", async () => {
    const state = await subscribe(idle, makeFormData());

    expect(state.status).toBe("success");
    expect(createSubscriberMock).toHaveBeenCalledWith("jane@example.com");
  });

  it("returns an error state when the Kit client throws", async () => {
    createSubscriberMock.mockReset().mockRejectedValue(new Error("Kit API error (422)"));

    const state = await subscribe(idle, makeFormData());

    expect(state.status).toBe("error");
  });
});
