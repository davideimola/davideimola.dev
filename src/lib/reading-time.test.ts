import { describe, expect, it } from "vitest";
import {
  readingMinutes,
  readingTimeLabel,
  SECONDS_PER_CODE_LINE,
  SECONDS_PER_PICTURE,
  WORDS_PER_MINUTE,
} from "./reading-time";

const words = (n: number) => Array.from({ length: n }, () => "word").join(" ");

describe("readingMinutes", () => {
  it("reads prose at WORDS_PER_MINUTE", () => {
    expect(readingMinutes(words(WORDS_PER_MINUTE * 2))).toBeCloseTo(2);
  });

  it("skims a code block by its lines instead of counting its words", () => {
    const body = ["```go", "func main() {", "", '  fmt.Println("hello world")', "}", "```"].join(
      "\n"
    );
    expect(readingMinutes(body)).toBeCloseTo((3 * SECONDS_PER_CODE_LINE) / 60);
  });

  it("counts a link's text, not its URL", () => {
    expect(readingMinutes("see [the docs](https://example.com/a/b c d)")).toBeCloseTo(
      3 / WORDS_PER_MINUTE
    );
  });

  it("gives an image time of its own and drops its alt", () => {
    expect(readingMinutes("![a long alt text here](/x.png)")).toBeCloseTo(SECONDS_PER_PICTURE / 60);
  });

  it("reads a figure's caption but not its alt", () => {
    const body = [
      "<DrawnFigure",
      '  src="/images/blog/x/figures/y.svg"',
      '  alt="a very long description only a screen reader hears"',
      '  caption="two words"',
      "/>",
    ].join("\n");
    expect(readingMinutes(body)).toBeCloseTo(2 / WORDS_PER_MINUTE + SECONDS_PER_PICTURE / 60);
  });

  it("ignores comments, imports and markup", () => {
    const body = [
      'import X from "./x";',
      "{/* a note to myself */}",
      "<!-- another one -->",
      "## Title here",
      "**bold** - and `code`",
    ].join("\n");
    expect(readingMinutes(body)).toBeCloseTo(5 / WORDS_PER_MINUTE);
  });
});

describe("readingTimeLabel", () => {
  it("rounds to whole minutes, never under one", () => {
    expect(readingTimeLabel("hi")).toBe("1 min read");
    expect(readingTimeLabel(words(Math.round(WORDS_PER_MINUTE * 4.4)))).toBe("4 min read");
  });
});
