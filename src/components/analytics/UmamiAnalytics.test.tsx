import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UMAMI_PROXY_PATH, UmamiAnalytics } from "./UmamiAnalytics";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("UmamiAnalytics", () => {
  it("renders nothing when the website id env var is absent", () => {
    vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "");
    const { container } = render(<UmamiAnalytics />);
    expect(container.querySelector("script")).toBeNull();
  });

  it("renders a deferred, first-party-proxied script carrying the website id", () => {
    vi.stubEnv("NEXT_PUBLIC_UMAMI_WEBSITE_ID", "abc-123");
    const { container } = render(<UmamiAnalytics />);
    const script = container.querySelector("script");

    expect(script).not.toBeNull();
    expect(script).toHaveAttribute("defer");
    expect(script).toHaveAttribute("data-website-id", "abc-123");
    // src and collection endpoint both go through the first-party proxy path,
    // so cloud.umami.is never appears in a request the ad blocker can match.
    expect(script).toHaveAttribute("src", `${UMAMI_PROXY_PATH}/script.js`);
    expect(script).toHaveAttribute("data-host-url", UMAMI_PROXY_PATH);
  });
});
