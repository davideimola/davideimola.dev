import { describe, expect, it } from "vitest";
import { formatDayMonth, formatDayMonthYear } from "./dates";

describe("day-first labels", () => {
  it("print September as Sep, like every other month", () => {
    expect(formatDayMonth("2026-09-26")).toBe("26 Sep");
    expect(formatDayMonthYear("2026-09-26")).toBe("26 Sep 2026");
  });

  it("keep the day without a leading zero", () => {
    expect(formatDayMonth("2026-11-01")).toBe("1 Nov");
  });
});
