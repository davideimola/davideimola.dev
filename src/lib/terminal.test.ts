import { describe, expect, it } from "vitest";
import { completeInput, runCommand, type TerminalData, type TerminalShelfPass } from "./terminal";

const OPEN_PASSES: TerminalShelfPass[] = [
  { title: "Crimson Desert", type: "Videogame", medium: "PlayStation 5", verbBase: "play" },
  { title: "The Manager's Path", type: "Non-fiction", medium: "Paper", verbBase: "read" },
];

const DATA: TerminalData = {
  posts: [
    {
      slug: "stop-prompting-start-thinking",
      title: "Stop Prompting. Start Thinking.",
      date: "2026-04-20",
      category: "Technical",
    },
    {
      slug: "i-built-a-tool-i-dont-use",
      title: "I Built a Tool I Don't Use",
      date: "2026-07-08",
      category: "Personal",
    },
  ],
  talks: [
    {
      event: "reactjsday 2026",
      title: "AI Won't Design Your System. You Have To.",
      date: "2026-11-19",
      location: "Verona, Italy",
      upcoming: true,
    },
    {
      event: "GoLab 2024",
      title: "Go + DDD",
      date: "2024-11-11",
      location: "Florence, Italy",
      upcoming: false,
    },
  ],
  projects: [
    {
      title: "Argus",
      description: "AI security review agent",
      status: "active",
      href: "https://github.com/argusappsec/argus",
    },
  ],
  shelf: { now: OPEN_PASSES, pile: 40, volumes: 102 },
};

/** The same session with the library unreadable: no shelf, no shelf commands. */
const NO_SHELF: TerminalData = { ...DATA, shelf: undefined };

function flatten(result: ReturnType<typeof runCommand>): string {
  return result.lines.map((line) => line.map((token) => token.text).join("")).join("\n");
}

describe("runCommand", () => {
  it("returns nothing for empty input", () => {
    expect(runCommand("   ", DATA).lines).toEqual([]);
  });

  it("errors on unknown commands", () => {
    const out = flatten(runCommand("frobnicate", DATA));
    expect(out).toContain("command not found: frobnicate");
    expect(out).toContain("help");
  });

  it("help lists every documented command", () => {
    const out = flatten(runCommand("help", DATA));
    for (const cmd of ["whoami", "ls", "cat", "open", "clear", "exit", "shelf"]) {
      expect(out).toContain(cmd);
    }
  });

  it("help drops shelf when the library is unreadable", () => {
    expect(flatten(runCommand("help", NO_SHELF))).not.toContain("what I'm reading and playing");
  });

  it("whoami prints the bio with a link to /about", () => {
    const result = runCommand("whoami", DATA);
    expect(flatten(result)).toContain("Davide Imola");
    const hrefs = result.lines.flat().map((token) => token.href);
    expect(hrefs).toContain("/about");
  });

  it("ls lists the home directory", () => {
    const out = flatten(runCommand("ls", DATA));
    for (const entry of ["blog/", "projects/", "talks/", "shelf/", "now.md", "llms.txt"]) {
      expect(out).toContain(entry);
    }
  });

  it("ls hides shelf/ when the library is unreadable", () => {
    expect(flatten(runCommand("ls", NO_SHELF))).not.toContain("shelf/");
  });

  it("ls ./blog lists posts with links, newest metadata intact", () => {
    const result = runCommand("ls ./blog", DATA);
    const out = flatten(result);
    expect(out).toContain("Stop Prompting. Start Thinking.");
    expect(out).toContain("2026-07-08");
    const hrefs = result.lines.flat().map((token) => token.href);
    expect(hrefs).toContain("/blog/stop-prompting-start-thinking");
  });

  it("ls talks marks upcoming entries", () => {
    const result = runCommand("ls talks", DATA);
    const upcomingLine = result.lines.find((line) =>
      line.some((token) => token.text.includes("reactjsday"))
    );
    expect(upcomingLine?.[0].text).toBe("→ ");
  });

  it("ls on an unknown directory errors", () => {
    expect(flatten(runCommand("ls ./secrets", DATA))).toContain("No such file or directory");
  });

  it("cat blog/<slug>.md links to the raw markdown route", () => {
    const result = runCommand("cat blog/i-built-a-tool-i-dont-use.md", DATA);
    const hrefs = result.lines.flat().map((token) => token.href);
    expect(hrefs).toContain("/blog/i-built-a-tool-i-dont-use.md");
  });

  it("cat on a missing post errors", () => {
    expect(flatten(runCommand("cat blog/nope.md", DATA))).toContain("No such file or directory");
  });

  it("open navigates to known routes, normalizing the path", () => {
    expect(runCommand("open ./talks", DATA).navigate).toBe("/sharing");
    expect(runCommand("open blog/i-built-a-tool-i-dont-use", DATA).navigate).toBe(
      "/blog/i-built-a-tool-i-dont-use"
    );
  });

  it("open on an unknown path errors without navigating", () => {
    const result = runCommand("open narnia", DATA);
    expect(result.navigate).toBeUndefined();
    expect(flatten(result)).toContain("No such file or directory");
  });

  it("clear sets the clear flag", () => {
    expect(runCommand("clear", DATA).clear).toBe(true);
  });

  it("exit navigates home", () => {
    expect(runCommand("exit", DATA).navigate).toBe("/");
  });

  it("echo prints its arguments", () => {
    expect(flatten(runCommand("echo hello world", DATA))).toBe("hello world");
  });

  it("date uses the injected clock", () => {
    const now = new Date("2026-07-15T10:00:00Z");
    expect(flatten(runCommand("date", DATA, { now }))).toBe(now.toString());
  });

  it("history prints numbered past commands", () => {
    const out = flatten(runCommand("history", DATA, { history: ["ls", "whoami"] }));
    expect(out).toContain("1  ls");
    expect(out).toContain("2  whoami");
  });

  it("sudo is denied and reported", () => {
    expect(flatten(runCommand("sudo rm -rf /", DATA))).toContain("not in the sudoers file");
  });

  it("rm is denied", () => {
    expect(flatten(runCommand("rm -rf /", DATA))).toContain("permission denied");
  });

  it("shelf prints the open passes, the pile and the shelf total", () => {
    const result = runCommand("shelf", DATA);
    const out = flatten(result);
    expect(out).toContain("The Manager's Path");
    expect(out).toContain("Crimson Desert");
    expect(out).toContain("40 next up");
    expect(out).toContain("102 volumes");
    const hrefs = result.lines.flat().map((token) => token.href);
    expect(hrefs).toContain("/shelf");
  });

  it("shelf groups by the Type verb, reading before playing", () => {
    const lines = runCommand("shelf", DATA).lines.filter((line) =>
      line.some((token) => token.text === "Reading  " || token.text === "Playing  ")
    );
    expect(lines[0][0].text.trim()).toBe("Reading");
    expect(lines[1][0].text.trim()).toBe("Playing");
  });

  it("ls ./shelf lists the open passes", () => {
    const out = flatten(runCommand("ls ./shelf", DATA));
    expect(out).toContain("The Manager's Path");
    expect(out).toContain("Non-fiction");
  });

  it("reading and playing filter by the Type verb", () => {
    expect(flatten(runCommand("reading", DATA))).not.toContain("Crimson Desert");
    expect(flatten(runCommand("playing", DATA))).not.toContain("The Manager's Path");
  });

  it("a verb with nothing open says so instead of printing an empty block", () => {
    const noGames: TerminalData = {
      ...DATA,
      shelf: { now: OPEN_PASSES.filter((p) => p.verbBase === "read"), pile: 40, volumes: 102 },
    };
    const out = flatten(runCommand("playing", noGames));
    expect(out).toContain("nothing playing right now");
    expect(out).not.toContain("Crimson Desert");
  });

  it("pile prints a queue, and counts things rather than volumes", () => {
    const out = flatten(runCommand("pile", DATA));
    expect(out).toContain("40");
    // The pile holds a videogame as readily as a manga, so nothing here may
    // call it a stack of volumes.
    expect(out).toContain("things to read or play next");
    expect(out).not.toMatch(/volumes/);
    // It is a queue of what comes next, and it holds things the owner does not
    // own and things already started, so no copy may claim a purchase.
    expect(out).not.toMatch(/bought/);
  });

  it("the shelf commands do not exist when the library is unreadable", () => {
    for (const cmd of ["shelf", "reading", "playing", "pile"]) {
      expect(flatten(runCommand(cmd, NO_SHELF))).toContain(`command not found: ${cmd}`);
    }
  });

  it("nmap runs the fake scan and plugs argus", () => {
    const out = flatten(runCommand("nmap davideimola.dev", DATA));
    expect(out).toContain("443/tcp");
    expect(out).toContain("argus");
  });
});

describe("completeInput", () => {
  it("completes command names", () => {
    expect(completeInput("wh", DATA)).toEqual(["whoami "]);
  });

  it("completes ls directories", () => {
    expect(completeInput("ls ./b", DATA)).toEqual(["ls ./blog"]);
    expect(completeInput("ls ./s", DATA)).toEqual(["ls ./shelf"]);
    expect(completeInput("ls ./s", NO_SHELF)).toEqual([]);
  });

  it("completes shelf only while the library answers", () => {
    expect(completeInput("she", DATA)).toEqual(["shelf "]);
    expect(completeInput("she", NO_SHELF)).toEqual([]);
  });

  it("completes blog slugs for cat", () => {
    expect(completeInput("cat blog/i-", DATA)).toEqual(["cat blog/i-built-a-tool-i-dont-use.md"]);
  });

  it("returns multiple candidates when ambiguous", () => {
    const suggestions = completeInput("c", DATA);
    expect(suggestions).toContain("cat ");
    expect(suggestions).toContain("clear ");
  });

  it("returns nothing for empty input", () => {
    expect(completeInput("", DATA)).toEqual([]);
  });
});
