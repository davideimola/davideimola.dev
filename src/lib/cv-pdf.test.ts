import { describe, expect, it } from "vitest";
import {
  downloadFileName,
  findMissingPhrases,
  findPrivateData,
  normaliseExtractedText,
  requiredPhrases,
} from "./cv-pdf";

// ── normaliseExtractedText ─────────────────────────────────────────────────

describe("normaliseExtractedText", () => {
  it("collapses line breaks and repeated spaces into single spaces", () => {
    expect(normaliseExtractedText("Davide\nImola   ·  Tech\n\nLead")).toBe(
      "Davide Imola · Tech Lead"
    );
  });

  it("trims the surrounding whitespace an extractor leaves behind", () => {
    expect(normaliseExtractedText("\n  Davide Imola \n")).toBe("Davide Imola");
  });

  it("drops the soft hyphens a line-broken word can carry", () => {
    expect(normaliseExtractedText("Tech\u00adnologies")).toBe("Technologies");
  });
});

// ── findMissingPhrases ─────────────────────────────────────────────────────

describe("findMissingPhrases", () => {
  const text = "Davide Imola Tech Lead · Speaker RedCarbon SA Milkman Technologies S.p.A.";

  it("returns nothing when every phrase is present", () => {
    expect(findMissingPhrases(text, ["Davide Imola", "RedCarbon SA"])).toEqual([]);
  });

  it("returns the phrases the text does not contain", () => {
    expect(findMissingPhrases(text, ["Davide Imola", "ASEM S.r.l."])).toEqual(["ASEM S.r.l."]);
  });

  it("finds a phrase the extractor broke across two lines", () => {
    expect(
      findMissingPhrases("Milkman\nTechnologies S.p.A.", ["Milkman Technologies S.p.A."])
    ).toEqual([]);
  });

  it("finds a phrase whose spacing the extractor widened", () => {
    expect(findMissingPhrases("Tech   Lead  ·  Speaker", ["Tech Lead · Speaker"])).toEqual([]);
  });
});

// ── findPrivateData ────────────────────────────────────────────────────────

describe("findPrivateData", () => {
  it("passes text that carries no private data", () => {
    expect(
      findPrivateData("Davide Imola · Tech Lead · hello@davideimola.dev · Verona, Italy · Remote")
    ).toEqual([]);
  });

  it("flags an Italian phone number by its country prefix", () => {
    const found = findPrivateData("Call me on +39 333 1234567");
    expect(found).toHaveLength(1);
    expect(found[0].pattern).toBe("phone-prefix");
    expect(found[0].match).toBe("+39");
  });

  it("flags a street address", () => {
    const found = findPrivateData("Via Roma 12, 37100 Verona");
    expect(found).toHaveLength(1);
    expect(found[0].pattern).toBe("street-address");
  });

  it("flags an Italian fiscal code", () => {
    const found = findPrivateData("Codice fiscale MLIDVD90A01L781K");
    expect(found).toHaveLength(1);
    expect(found[0].pattern).toBe("fiscal-code");
    expect(found[0].match).toBe("MLIDVD90A01L781K");
  });

  it("leaves the ordinary English word 'via' alone", () => {
    expect(findPrivateData("Shipped via GitOps, deployed via Kubernetes")).toEqual([]);
  });

  it("does not read an all-caps section heading as a fiscal code", () => {
    expect(findPrivateData("EXPERIENCE FREELANCE WORK CONFERENCES ORGANISED")).toEqual([]);
  });

  it("flags the generation server's own host, which is how a print header leaks in", () => {
    expect(findPrivateData("http://localhost:41234/cv").map((f) => f.pattern)).toEqual([
      "generator-host",
    ]);
    expect(findPrivateData("127.0.0.1:41234").map((f) => f.pattern)).toEqual(["generator-host"]);
  });

  it("lets a bullet that merely mentions localhost through", () => {
    expect(findPrivateData("Cut the localhost feedback loop from 40s to 3s")).toEqual([]);
  });

  // The first generated PDF shipped a link annotation pointing at the port it
  // was built on, because a relative href resolves against whatever origin
  // Chromium happens to be printing from. The generator now repoints those at
  // the canonical site and feeds the annotation URLs through here too, since
  // they never reach the text layer this list otherwise reads.
  it("flags a loopback link annotation, which the text layer never shows", () => {
    expect(findPrivateData("http://127.0.0.1:64882/sharing").map((f) => f.pattern)).toEqual([
      "generator-host",
    ]);
  });

  it("reports every pattern that matched, not only the first", () => {
    const found = findPrivateData("+39 333 1234567, Via Roma 12, MLIDVD90A01L781K");
    expect(found.map((f) => f.pattern).sort()).toEqual([
      "fiscal-code",
      "phone-prefix",
      "street-address",
    ]);
  });

  it("normalises before matching, so a line break cannot smuggle a pattern through", () => {
    expect(findPrivateData("Via\nRoma 12").map((f) => f.pattern)).toEqual(["street-address"]);
  });
});

// ── requiredPhrases ────────────────────────────────────────────────────────

describe("requiredPhrases", () => {
  const identity = { name: "Davide Imola", headline: "Tech Lead · Speaker" };

  it("asserts the name, the current headline and every employment organisation", () => {
    expect(requiredPhrases(identity, [{ org: "RedCarbon SA" }, { org: "ASEM S.r.l." }])).toEqual([
      "Davide Imola",
      "Tech Lead · Speaker",
      "RedCarbon SA",
      "ASEM S.r.l.",
    ]);
  });

  it("grows on its own when a new job joins the Record, so one cannot slip past", () => {
    const before = requiredPhrases(identity, [{ org: "RedCarbon SA" }]);
    const after = requiredPhrases(identity, [{ org: "Somewhere New" }, { org: "RedCarbon SA" }]);
    expect(after).toHaveLength(before.length + 1);
    expect(after).toContain("Somewhere New");
  });

  it("still asserts the identity when the Record holds no employment at all", () => {
    expect(requiredPhrases(identity, [])).toEqual(["Davide Imola", "Tech Lead · Speaker"]);
  });
});

// ── downloadFileName ───────────────────────────────────────────────────────

describe("downloadFileName", () => {
  it("names the downloaded copy after the person, not after the route", () => {
    expect(downloadFileName("Davide Imola")).toBe("davide-imola-cv.pdf");
  });

  it("folds diacritics away, because the output is a filename", () => {
    expect(downloadFileName("Zoë Müller")).toBe("zoe-muller-cv.pdf");
  });
});
