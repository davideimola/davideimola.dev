import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DrawnFigure, STEP_MS } from "./DrawnFigure";

const PLAIN = `<svg><path d="M0 0" pathLength="1" data-draw=""/></svg>`;
const STEPPED = `<svg><g data-step="1"><path d="M1 1"/></g><g data-step="0"><path d="M0 0"/></g></svg>`;

const steps = (container: HTMLElement, n: number) =>
  [...container.querySelectorAll(`g[data-step="${n}"]`)].map((g) => g.hasAttribute("data-drawn"));

describe("DrawnFigure", () => {
  afterEach(() => vi.useRealTimers());

  it("names the drawing and prints its caption", () => {
    render(<DrawnFigure light={PLAIN} dark={null} alt="Two clocks" caption="Same bug." />);
    expect(screen.getByRole("img", { name: "Two clocks" })).toBeTruthy();
    expect(screen.getByText("Same bug.")).toBeTruthy();
  });

  it("draws a drawing without steps all at once", () => {
    render(<DrawnFigure light={PLAIN} dark={null} alt="x" />);
    expect(screen.getByRole("img").hasAttribute("data-drawn")).toBe(true);
  });

  it("draws the steps in order, one after the other, in both twins", () => {
    vi.useFakeTimers();
    const { container } = render(<DrawnFigure light={STEPPED} dark={STEPPED} alt="x" />);
    expect(steps(container, 0)).toEqual([true, true]);
    expect(steps(container, 1)).toEqual([false, false]);
    act(() => vi.advanceTimersByTime(STEP_MS));
    expect(steps(container, 1)).toEqual([true, true]);
  });
});
