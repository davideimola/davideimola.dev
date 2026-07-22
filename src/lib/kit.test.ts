import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createBroadcastDraft, createSubscriber } from "./kit";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

// A successful Kit response for both calls in the two-call double-opt-in flow.
function okSubscriber(state = "inactive") {
  return {
    ok: true,
    status: 200,
    json: async () => ({
      subscriber: { id: 123, email_address: "jane@example.com", state },
    }),
  };
}

beforeEach(() => {
  vi.stubEnv("KIT_API_KEY", "test-key");
  vi.stubEnv("KIT_FORM_ID", "999");
  fetchMock.mockReset().mockResolvedValue(okSubscriber());
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createSubscriber", () => {
  it("creates the subscriber as inactive, then associates it with the opt-in form", async () => {
    await createSubscriber("jane@example.com");

    expect(fetchMock).toHaveBeenCalledTimes(2);

    // 1. create as inactive (no confirmation email yet)
    const [createUrl, createInit] = fetchMock.mock.calls[0];
    expect(createUrl).toBe("https://api.kit.com/v4/subscribers");
    expect(createInit.method).toBe("POST");
    expect(createInit.headers["X-Kit-Api-Key"]).toBe("test-key");
    expect(JSON.parse(createInit.body)).toEqual({
      email_address: "jane@example.com",
      state: "inactive",
    });

    // 2. associate with the double-opt-in form → this is what sends the confirm email
    const [formUrl, formInit] = fetchMock.mock.calls[1];
    expect(formUrl).toBe("https://api.kit.com/v4/forms/999/subscribers");
    expect(formInit.method).toBe("POST");
    expect(formInit.headers["X-Kit-Api-Key"]).toBe("test-key");
    expect(JSON.parse(formInit.body)).toEqual({ email_address: "jane@example.com" });
  });

  it("returns the created subscriber", async () => {
    const subscriber = await createSubscriber("jane@example.com");

    expect(subscriber).toMatchObject({ email_address: "jane@example.com", state: "inactive" });
  });

  it("surfaces an API error from the create call as a thrown error", async () => {
    fetchMock.mockReset().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ errors: ["Email address is invalid"] }),
    });

    await expect(createSubscriber("bad")).rejects.toThrow();
    // The form association must not run if the create failed.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("surfaces an API error from the form-association call as a thrown error", async () => {
    fetchMock
      .mockReset()
      .mockResolvedValueOnce(okSubscriber())
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ errors: ["Not Found"] }),
      });

    await expect(createSubscriber("jane@example.com")).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws a clear error when Kit env vars are missing", async () => {
    vi.stubEnv("KIT_API_KEY", "");
    vi.stubEnv("KIT_FORM_ID", "");

    await expect(createSubscriber("jane@example.com")).rejects.toThrow(/KIT_/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

function okBroadcast(id = 25108320) {
  return { ok: true, status: 201, json: async () => ({ broadcast: { id } }) };
}

describe("createBroadcastDraft", () => {
  it("creates a draft (public:false) and returns its id", async () => {
    fetchMock.mockReset().mockResolvedValue(okBroadcast(42));

    const id = await createBroadcastDraft({ subject: "July digest", html: "<p>hi</p>" });

    expect(id).toBe(42);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.kit.com/v4/broadcasts");
    expect(init.method).toBe("POST");
    expect(init.headers["X-Kit-Api-Key"]).toBe("test-key");
    expect(JSON.parse(init.body)).toEqual({
      subject: "July digest",
      content: "<p>hi</p>",
      public: false,
    });
  });

  it("surfaces an API error as a thrown error", async () => {
    fetchMock.mockReset().mockResolvedValue({
      ok: false,
      status: 422,
      json: async () => ({ errors: ["bad"] }),
    });

    await expect(createBroadcastDraft({ subject: "x", html: "<p>x</p>" })).rejects.toThrow();
  });

  it("throws when KIT_API_KEY is missing", async () => {
    vi.stubEnv("KIT_API_KEY", "");

    await expect(createBroadcastDraft({ subject: "x", html: "<p>x</p>" })).rejects.toThrow(
      /KIT_API_KEY/
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
