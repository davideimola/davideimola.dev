import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

afterEach(() => {
  vi.restoreAllMocks();
});

function makeRequest(headers: Record<string, string>, body = '{"type":"event"}') {
  return new Request("https://davideimola.dev/relay/api/send", {
    method: "POST",
    headers,
    body,
  });
}

describe("POST /relay/api/send", () => {
  it("forwards the real client IP (first x-forwarded-for hop) and the browser UA to Umami", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("token", { status: 200 }));

    await POST(
      makeRequest({
        "x-forwarded-for": "203.0.113.7, 10.0.0.1",
        "user-agent": "TestBrowser/1.0",
        "content-type": "application/json",
      })
    );

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://cloud.umami.is/api/send");
    const headers = init?.headers as Record<string, string>;
    // The visitor's IP, not the proxy's, is what Umami must geolocate.
    expect(headers["x-forwarded-for"]).toBe("203.0.113.7");
    expect(headers["x-real-ip"]).toBe("203.0.113.7");
    // UA must be the visitor's, or browser/OS/device detection breaks.
    expect(headers["user-agent"]).toBe("TestBrowser/1.0");
  });

  it("relays the Umami session cache token when present", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("token", { status: 200 }));

    await POST(makeRequest({ "user-agent": "x", "x-umami-cache": "cached-session" }));

    const headers = fetchMock.mock.calls[0][1]?.headers as Record<string, string>;
    expect(headers["x-umami-cache"]).toBe("cached-session");
  });

  it("relays Umami's status and body back to the caller", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok-token", { status: 200 }));

    const res = await POST(makeRequest({ "user-agent": "x" }));

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("ok-token");
  });
});
