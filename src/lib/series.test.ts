import { describe, expect, it } from "vitest";
import { getAllSeries, partLabel, resolveSeries, type SeriesEntry, seriesOfPost } from "./series";

const entry: SeriesEntry = {
  slug: "four-boundaries",
  title: "Agent Security at the Four Boundaries",
  parts: [
    { title: "Planned one", short: "One", date: "2026-12-03", post: "part-one" },
    { title: "Planned two", short: "Two", date: "2026-12-17", post: "part-two" },
    { title: "Planned three", short: "Three", date: "2027-01-14" },
  ],
};

const published = [{ slug: "part-one", title: "Part One, as published", date: "2026-12-04" }];
const exists = (slug: string) => ["part-one", "part-two"].includes(slug);

describe("resolveSeries", () => {
  it("takes a published part's title and date from the post, keeping the short line", () => {
    const [series] = resolveSeries([entry], published, exists);
    expect(series.parts[0]).toEqual({
      number: 1,
      title: "Part One, as published",
      short: "One",
      date: "2026-12-04",
      slug: "part-one",
    });
  });

  it("keeps a part upcoming while its post is a draft or not written yet", () => {
    const [series] = resolveSeries([entry], published, exists);
    expect(series.parts[1]).toMatchObject({ number: 2, title: "Planned two", slug: null });
    expect(series.parts[2]).toMatchObject({ number: 3, date: "2027-01-14", slug: null });
  });

  it("throws on a part naming a post that does not exist", () => {
    expect(() => resolveSeries([entry], published, () => false)).toThrow(/unknown post "part-one"/);
  });

  it("throws when one post is claimed by two parts", () => {
    const twice: SeriesEntry = {
      ...entry,
      parts: [entry.parts[0], { ...entry.parts[1], post: "part-one" }],
    };
    expect(() => resolveSeries([twice], published, exists)).toThrow(/more than one part/);
  });

  it("throws on a duplicate series slug", () => {
    expect(() => resolveSeries([entry, entry], published, exists)).toThrow(/duplicate series/);
  });
});

describe("seriesOfPost", () => {
  const all = resolveSeries([entry], published, exists);

  it("finds the part and the one after it, published or not", () => {
    const found = seriesOfPost(all, "part-one");
    expect(found?.part.number).toBe(1);
    expect(found?.next).toMatchObject({ number: 2, slug: null });
    expect(found && partLabel(found)).toBe("Part 1 of 3");
  });

  it("is null for a post outside every series", () => {
    expect(seriesOfPost(all, "something-else")).toBeNull();
  });

  it("has no next part on the last one", () => {
    const last = resolveSeries(
      [{ ...entry, parts: [entry.parts[2], entry.parts[0]] }],
      published,
      exists
    );
    expect(seriesOfPost(last, "part-one")?.next).toBeNull();
  });
});

describe("src/content/series.json", () => {
  it("parses and resolves against the real posts", () => {
    expect(() => getAllSeries()).not.toThrow();
  });
});
