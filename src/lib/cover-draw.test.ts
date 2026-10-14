import { describe, expect, it } from "vitest";
import { prepareCoverSvg } from "./cover-draw";

const INK = "#1C2233";
const RED = "#C91F37";
const PAPER = "#F7F5F0";
const prep = (svg: string) => prepareCoverSvg(svg, [RED], PAPER);

describe("prepareCoverSvg", () => {
  it("leaves the paper ground alone", () => {
    expect(prep(`<svg><rect width="1600" height="900" fill="${PAPER}"/></svg>`)).toBe(
      `<svg><rect width="1600" height="900" fill="${PAPER}"/></svg>`
    );
  });

  it("makes the shapes of a stroked group drawable", () => {
    const out = prep(
      `<svg><g fill="none" stroke="${INK}"><path d="M0 0 L1 1"/><circle r="3"/></g></svg>`
    );
    expect(out).toContain('<path d="M0 0 L1 1" pathLength="1" data-draw=""/>');
    expect(out).toContain('<circle r="3" pathLength="1" data-draw=""/>');
    expect(out).not.toContain("data-accent");
  });

  it("sends the red detail last, filled or stroked", () => {
    const out = prep(
      `<svg><circle r="15" fill="${RED}"/><g fill="none" stroke="${RED}"><path d="M1 1"/></g></svg>`
    );
    expect(out).toContain(`<circle r="15" fill="${RED}" data-fill="" data-accent=""/>`);
    expect(out).toContain('<path d="M1 1" pathLength="1" data-draw="" data-accent=""/>');
  });

  it("keeps a paper fill as a mask but still draws its outline", () => {
    const out = prep(
      `<svg><rect width="9" fill="${PAPER}"/><g stroke="${INK}"><rect width="4" fill="${PAPER}"/></g></svg>`
    );
    expect(out).toContain(`<rect width="4" fill="${PAPER}" pathLength="1" data-draw=""/>`);
    expect(out).not.toContain(`fill="${PAPER}" pathLength="1" data-draw="" data-fill`);
  });

  it("matches colours whatever their case", () => {
    expect(prep(`<svg><circle fill="#c91f37"/></svg>`)).toContain("data-accent");
  });
});
