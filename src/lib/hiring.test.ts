import { describe, expect, it } from "vitest";
import { readContentJson } from "./content-json";
import { type Hiring, openHiring, withUtm } from "./hiring";

const hiring: Hiring = {
  org: "RedCarbon",
  until: "2027-01-31",
  roles: [
    {
      title: "Backend engineer",
      hint: "Go services",
      url: "https://www.redcarbon.ai/careers/backend-engineer",
    },
  ],
};

describe("openHiring", () => {
  it("shows the roles up to and including the last day", () => {
    expect(openHiring(hiring, new Date("2027-01-31T23:00:00"))?.roles).toHaveLength(1);
  });

  it("disappears the day after", () => {
    expect(openHiring(hiring, new Date("2027-02-01T00:30:00"))).toBeNull();
  });

  it("disappears once every role is filled", () => {
    expect(openHiring({ ...hiring, roles: [] }, new Date("2026-11-01T10:00:00"))).toBeNull();
  });

  it("tags every link with where the click came from", () => {
    const [role] = openHiring(hiring, new Date("2026-11-01T10:00:00"))?.roles ?? [];
    expect(role.url).toBe(
      "https://www.redcarbon.ai/careers/backend-engineer?utm_source=davideimola.dev&utm_medium=links"
    );
  });
});

describe("withUtm", () => {
  it("keeps a query the URL already has", () => {
    expect(withUtm("https://example.com/job?ref=a")).toBe(
      "https://example.com/job?ref=a&utm_source=davideimola.dev&utm_medium=links"
    );
  });
});

describe("hiring.json", () => {
  it("is well formed", () => {
    const data = readContentJson<Hiring>("hiring.json");
    expect(data.until).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    for (const role of data.roles) expect(() => new URL(role.url)).not.toThrow();
  });
});
