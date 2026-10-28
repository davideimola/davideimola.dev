import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { InvalidEmailError, saveIssue, subscribeEmail, testIssue } from "./newsletter-api";

const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

function respond(status: number, body: unknown = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

const issueState = {
  slug: "2026-11",
  subject: "November",
  status: "draft",
  tested: true,
  adminUrl: "https://news.example.com/admin/issues/2026-11",
};

beforeEach(() => {
  vi.stubEnv("NEWSLETTER_API_URL", "https://news.example.com/");
  vi.stubEnv("NEWSLETTER_API_KEY", "test-key");
  fetchMock.mockReset().mockResolvedValue(respond(202, { status: "check_your_inbox" }));
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("subscribeEmail", () => {
  it("posts the address with the API key as a bearer token", async () => {
    await subscribeEmail("jane@example.com");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://news.example.com/api/subscribers");
    expect(init.method).toBe("POST");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(JSON.parse(init.body)).toEqual({ email: "jane@example.com" });
  });

  it("throws InvalidEmailError when the service refuses the address", async () => {
    fetchMock.mockResolvedValue(respond(400, { error: "invalid_email" }));

    await expect(subscribeEmail("jane@example")).rejects.toBeInstanceOf(InvalidEmailError);
  });

  it("throws a plain error when the service fails", async () => {
    fetchMock.mockResolvedValue(respond(502, { error: "unavailable" }));

    const err = await subscribeEmail("jane@example.com").catch((e) => e);
    expect(err).toBeInstanceOf(Error);
    expect(err).not.toBeInstanceOf(InvalidEmailError);
  });

  it("throws without calling anything when the env is missing", async () => {
    vi.stubEnv("NEWSLETTER_API_KEY", "");

    await expect(subscribeEmail("jane@example.com")).rejects.toThrow(/NEWSLETTER_API_KEY/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("issues", () => {
  it("saves an issue with PUT and returns its state", async () => {
    fetchMock.mockResolvedValue(respond(200, issueState));

    const state = await saveIssue({ slug: "2026-11", subject: "November", html: "<p>x</p>" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://news.example.com/api/issues/2026-11");
    expect(init.method).toBe("PUT");
    expect(JSON.parse(init.body)).toEqual({ subject: "November", html: "<p>x</p>" });
    expect(state.adminUrl).toBe(issueState.adminUrl);
  });

  it("test-sends with a POST and no body", async () => {
    fetchMock.mockResolvedValue(respond(200, issueState));

    await testIssue("2026-11");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://news.example.com/api/issues/2026-11/test");
    expect(init.method).toBe("POST");
    expect(init.body).toBeUndefined();
  });

  it("says so when the issue has already been sent", async () => {
    fetchMock.mockResolvedValue(respond(409, { error: "already_sent" }));

    await expect(saveIssue({ slug: "2026-11", subject: "x", html: "x" })).rejects.toThrow(
      /already been sent/
    );
  });

  it("surfaces the service's reason on any other refusal", async () => {
    fetchMock.mockResolvedValue(respond(400, { error: "no_unsubscribe_url" }));

    await expect(saveIssue({ slug: "2026-11", subject: "x", html: "x" })).rejects.toThrow(
      /no_unsubscribe_url/
    );
  });
});
