// Command engine for the interactive /terminal page. Pure functions, no React
// and no browser APIs, so the whole command surface is unit-testable.

// ── Types ──────────────────────────────────────────────────────────────────

export interface TerminalPost {
  slug: string;
  title: string;
  date: string;
  category: string;
}

export interface TerminalTalk {
  event: string;
  title: string;
  date: string;
  location: string;
  upcoming: boolean;
}

export interface TerminalProject {
  title: string;
  description: string;
  status: string;
  href: string;
}

/**
 * One open pass out of the personal library. `verbBase` is the Type's bare verb
 * ("read", "play"), the only thing a block may be grouped by: Manga and Novel
 * are both read, and the slug would split them.
 */
export interface TerminalShelfPass {
  title: string;
  type: string;
  medium: string;
  verbBase: string;
}

export interface TerminalShelf {
  now: TerminalShelfPass[];
  pile: number;
  volumes: number;
}

export interface TerminalData {
  posts: TerminalPost[];
  talks: TerminalTalk[];
  projects: TerminalProject[];
  /**
   * Absent when the library could not be read. The shelf commands are then not
   * registered at all: `help` does not list them, `ls` does not show the
   * directory, and typing one lands on "command not found". A shell that
   * answers with an apology is worse than one that never had the command.
   */
  shelf?: TerminalShelf;
}

export interface TerminalToken {
  text: string;
  href?: string;
  variant?: "accent" | "muted" | "error";
}

export type TerminalLine = TerminalToken[];

export interface CommandResult {
  lines: TerminalLine[];
  clear?: boolean;
  navigate?: string;
}

export interface CommandContext {
  history?: string[];
  now?: Date;
}

// ── Token helpers ──────────────────────────────────────────────────────────

const t = (text: string): TerminalToken => ({ text });
const muted = (text: string): TerminalToken => ({ text, variant: "muted" });
const accent = (text: string): TerminalToken => ({ text, variant: "accent" });
const error = (text: string): TerminalToken => ({ text, variant: "error" });
const link = (text: string, href: string): TerminalToken => ({ text, href });

// ── Static content ─────────────────────────────────────────────────────────

const WHOAMI_LINES: TerminalLine[] = [
  [accent("Davide Imola"), muted(" - Tech Lead @ RedCarbon")],
  [t("I build AI agents for cybersecurity, and I share everything I learn building them.")],
  [muted("Co-founder @ Schrödinger Hat · Co-organizer @ Open Source Day")],
  [muted("Based in Verona, Italy · "), link("/about", "/about")],
];

const HELP_COMMANDS: { name: string; args: string; description: string }[] = [
  { name: "help", args: "", description: "show this help" },
  { name: "whoami", args: "", description: "who is Davide" },
  { name: "ls", args: "[dir]", description: "list contents (try ./blog, ./talks, ./shelf)" },
  { name: "cat", args: "<file>", description: "read a file (try now.md or blog/<slug>.md)" },
  { name: "open", args: "<path>", description: "go to a page" },
  { name: "echo", args: "<text>", description: "print text" },
  { name: "date", args: "", description: "current date" },
  { name: "history", args: "", description: "command history" },
  { name: "shelf", args: "", description: "what I'm reading and playing" },
  { name: "clear", args: "", description: "clear the terminal" },
  { name: "exit", args: "", description: "close the session" },
];

// Static "files" living in the home directory. Directories resolve from data.
const ROOT_FILES = ["about.md", "llms.txt", "now.md", "uses.md"];
const ROOT_DIRS = ["blog", "projects", "talks"];

/** The directories that exist for this session. "shelf" needs the library. */
function rootDirs(data: TerminalData): string[] {
  return data.shelf ? [...ROOT_DIRS, "shelf"] : ROOT_DIRS;
}

const OPEN_ROUTES: Record<string, string> = {
  "~": "/",
  home: "/",
  about: "/about",
  "about.md": "/about",
  blog: "/blog",
  contact: "/contact",
  links: "/links",
  "llms.txt": "/llms.txt",
  now: "/now",
  "now.md": "/now",
  projects: "/projects",
  sharing: "/sharing",
  shelf: "/shelf",
  talks: "/sharing",
  uses: "/uses",
  "uses.md": "/uses",
};

// ── Helpers ────────────────────────────────────────────────────────────────

/** Strip a leading "./" and any trailing slashes: "./blog/" → "blog". */
function normalizePath(arg: string): string {
  return arg.replace(/^\.\//, "").replace(/\/+$/, "");
}

function notFound(cmd: string, path: string): CommandResult {
  return { lines: [[error(`${cmd}: ${path}: No such file or directory`)]] };
}

// ── Command implementations ────────────────────────────────────────────────

function cmdHelp(data: TerminalData): CommandResult {
  const lines: TerminalLine[] = [[muted("Available commands:")], []];
  const commands = data.shelf ? HELP_COMMANDS : HELP_COMMANDS.filter((c) => c.name !== "shelf");
  for (const c of commands) {
    lines.push([accent(c.name.padEnd(9)), muted(c.args.padEnd(9)), t(c.description)]);
  }
  lines.push([]);
  lines.push([muted("A few commands are not listed. Explore.")]);
  return { lines };
}

function cmdLs(arg: string | undefined, data: TerminalData): CommandResult {
  if (!arg) {
    const entries: TerminalLine = [];
    for (const dir of rootDirs(data)) {
      entries.push({ text: `${dir}/`, href: OPEN_ROUTES[dir], variant: "accent" });
      entries.push(t("  "));
    }
    for (const file of ROOT_FILES) {
      entries.push(link(file, OPEN_ROUTES[file]));
      entries.push(t("  "));
    }
    return { lines: [entries] };
  }

  const path = normalizePath(arg);
  if (path === "blog") {
    const lines: TerminalLine[] = data.posts.map((p) => [
      muted(`${p.date.slice(0, 10)}  `),
      link(p.title, `/blog/${p.slug}`),
      muted(`  #${p.category.toLowerCase().replace(/\s+/g, "-")}`),
    ]);
    lines.push([]);
    lines.push([muted(`${data.posts.length} posts · index at `), link("/blog", "/blog")]);
    return { lines };
  }
  if (path === "talks") {
    const lines: TerminalLine[] = data.talks.map((talk) => [
      talk.upcoming ? accent("→ ") : t("  "),
      muted(`${talk.date.slice(0, 10)}  `),
      link(`${talk.event} - ${talk.title}`, "/sharing"),
      muted(`  · ${talk.location}`),
    ]);
    lines.push([]);
    lines.push([muted("full archive at "), link("/sharing", "/sharing")]);
    return { lines };
  }
  if (path === "shelf" && data.shelf) {
    return cmdShelfPasses(data.shelf, null);
  }
  if (path === "projects") {
    const lines: TerminalLine[] = data.projects.map((p) => [
      muted(`[${p.status}]`.padEnd(14)),
      link(p.title, p.href),
      muted(`  - ${p.description}`),
    ]);
    return { lines };
  }
  return { lines: [[error(`ls: cannot access '${arg}': No such file or directory`)]] };
}

function cmdCat(arg: string | undefined, data: TerminalData): CommandResult {
  if (!arg) return { lines: [[error("cat: missing operand")]] };
  const path = normalizePath(arg);

  if (path === "about.md") return { lines: WHOAMI_LINES };
  if (path === "now.md") {
    return {
      lines: [
        [muted("# now - this file changes often. The live version:")],
        [link("davideimola.dev/now", "/now")],
      ],
    };
  }
  if (path === "uses.md") {
    return {
      lines: [
        [muted("# uses - hardware, software, and tools. The live version:")],
        [link("davideimola.dev/uses", "/uses")],
      ],
    };
  }
  if (path === "llms.txt") {
    return {
      lines: [
        [muted("# Plain-Markdown index of this site for LLM consumers (llmstxt.org):")],
        [link("davideimola.dev/llms.txt", "/llms.txt")],
      ],
    };
  }

  const blogMatch = path.match(/^blog\/(.+?)(\.md)?$/);
  if (blogMatch) {
    const slug = blogMatch[1];
    const post = data.posts.find((p) => p.slug === slug);
    if (!post) return notFound("cat", `blog/${slug}.md`);
    return {
      lines: [
        [muted("# "), t(post.title)],
        [muted("raw markdown: "), link(`davideimola.dev/blog/${slug}.md`, `/blog/${slug}.md`)],
      ],
    };
  }

  return notFound("cat", arg);
}

function cmdOpen(arg: string | undefined, data: TerminalData): CommandResult {
  if (!arg) return { lines: [[error("open: missing operand (try 'open blog')")]] };
  const path = normalizePath(arg);

  if (arg.startsWith("http")) {
    return { lines: [[muted(`opening ${arg} …`)]], navigate: arg };
  }

  const blogMatch = path.match(/^blog\/(.+?)(\.md)?$/);
  if (blogMatch) {
    const post = data.posts.find((p) => p.slug === blogMatch[1]);
    if (!post) return notFound("open", path);
    return { lines: [[muted(`opening /blog/${post.slug} …`)]], navigate: `/blog/${post.slug}` };
  }

  const route = OPEN_ROUTES[path] ?? (arg.startsWith("/") ? arg : undefined);
  if (!route) return notFound("open", arg);
  return { lines: [[muted(`opening ${route} …`)]], navigate: route };
}

function cmdHistory(ctx: CommandContext): CommandResult {
  const history = ctx.history ?? [];
  if (history.length === 0) return { lines: [[muted("history: empty")]] };
  return {
    lines: history.map((entry, i) => [muted(`${String(i + 1).padStart(4)}  `), t(entry)]),
  };
}

// ── The library ────────────────────────────────────────────────────────────

// The headings the shell has copy for, keyed by the Type's bare verb. The
// library speaks in past participles ("read", "played"), and no heading can be
// bent out of those, so the pairing is stated here the way /shelf states it.
const SHELF_VERB_LABELS: Record<string, string> = {
  read: "Reading",
  play: "Playing",
};

const SHELF_VERB_ORDER = ["read", "play"];

function shelfVerbLabel(verbBase: string): string {
  return SHELF_VERB_LABELS[verbBase] ?? verbBase;
}

function passLine(pass: TerminalShelfPass): TerminalLine {
  return [
    muted(`${shelfVerbLabel(pass.verbBase).padEnd(9)}`),
    link(pass.title, "/shelf"),
    muted(`  · ${pass.type} · ${pass.medium}`),
  ];
}

/** Reading before playing, and a verb this shell has no copy for goes last. */
function orderedPasses(passes: TerminalShelfPass[]): TerminalShelfPass[] {
  return [...passes].sort((a, b) => {
    const ia = SHELF_VERB_ORDER.indexOf(a.verbBase);
    const ib = SHELF_VERB_ORDER.indexOf(b.verbBase);
    if (ia === ib) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

/**
 * The open passes, either all of them or only those of one bare verb. A verb
 * with nothing open says so in one line rather than printing an empty block:
 * there are months with no game running, and that is not an error.
 */
function passLines(passes: TerminalShelfPass[], what: string): TerminalLine[] {
  if (passes.length === 0) return [[muted(`nothing ${what} right now.`)]];
  return orderedPasses(passes).map(passLine);
}

function cmdShelfPasses(shelf: TerminalShelf, verbBase: string | null): CommandResult {
  const passes = verbBase ? shelf.now.filter((p) => p.verbBase === verbBase) : shelf.now;
  const what = verbBase ? shelfVerbLabel(verbBase).toLowerCase() : "open";
  return {
    lines: [
      ...passLines(passes, what),
      [],
      [muted("verdicts and the pile at "), link("/shelf", "/shelf")],
    ],
  };
}

function cmdShelf(shelf: TerminalShelf): CommandResult {
  return {
    lines: [
      [accent("~/shelf"), muted(" - the library I run at home")],
      [],
      ...passLines(shelf.now, "open"),
      [],
      [
        muted("pile: "),
        t(`${shelf.pile} next up`),
        muted("  ·  shelf: "),
        t(`${shelf.volumes} volumes`),
      ],
      [muted("all of it at "), link("/shelf", "/shelf")],
    ],
  };
}

function cmdPile(shelf: TerminalShelf): CommandResult {
  return {
    lines: [
      [accent(`${shelf.pile}`), t(" things to read or play next.")],
      [muted("tsundoku: the pile that keeps growing. what comes next, not what sits unread.")],
      [muted("some of it I pinned, the rest the library lines up for me.")],
      [muted("the whole pile lives at "), link("/shelf", "/shelf")],
    ],
  };
}

// ── Easter eggs ────────────────────────────────────────────────────────────

function cmdSudo(): CommandResult {
  return {
    lines: [
      [error("guest is not in the sudoers file.")],
      [muted("This incident will be reported.")],
    ],
  };
}

function cmdRm(): CommandResult {
  return { lines: [[error("rm: permission denied"), muted(" - nice try.")]] };
}

function cmdNmap(): CommandResult {
  return {
    lines: [
      [muted("Starting Nmap ( https://nmap.org )")],
      [t("Nmap scan report for davideimola.dev")],
      [],
      [t("PORT      STATE     SERVICE")],
      [t("22/tcp    filtered  ssh       "), muted("# you shall not pass")],
      [t("80/tcp    open      http      "), muted("# redirects to 443, obviously")],
      [t("443/tcp   open      https     "), muted("# you are here")],
      [],
      [
        muted("Nmap done: 1 host up. Nothing to see, "),
        accent("argus"),
        muted(" already reviewed this host."),
      ],
    ],
  };
}

function cmdArgus(): CommandResult {
  return {
    lines: [
      [accent("Argus"), muted(" - AI-driven security review agent, written in Go")],
      [t("Wraps real scanners and reasons about their findings with context.")],
      [link("github.com/argusappsec/argus", "https://github.com/argusappsec/argus")],
    ],
  };
}

function cmdPing(): CommandResult {
  return {
    lines: [
      [t("PING davideimola.dev: pong.")],
      [muted("The contact form answers faster → "), link("/contact", "/contact")],
    ],
  };
}

function cmdSsh(): CommandResult {
  return {
    lines: [
      [error("ssh: connection refused")],
      [muted("Try the contact form instead → "), link("/contact", "/contact")],
    ],
  };
}

function cmdEditor(name: string): CommandResult {
  if (name === "emacs") {
    return {
      lines: [
        [
          error("emacs: not installed."),
          muted(" This is a vim household. (still read-only, though)"),
        ],
      ],
    };
  }
  return { lines: [[error(`${name}: read-only filesystem.`), muted(" Also, you'd never exit.")]] };
}

// ── Entry point ────────────────────────────────────────────────────────────

function unknownCommand(cmd: string): CommandResult {
  return {
    lines: [[error(`command not found: ${cmd}`)], [muted("Type 'help' for available commands.")]],
  };
}

export function runCommand(
  input: string,
  data: TerminalData,
  ctx: CommandContext = {}
): CommandResult {
  const trimmed = input.trim();
  if (!trimmed) return { lines: [] };
  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd) {
    case "help":
      return cmdHelp(data);
    case "whoami":
      return { lines: WHOAMI_LINES };
    case "pwd":
      return { lines: [[t("/home/guest")]] };
    case "ls":
    case "ll":
      return cmdLs(args[0], data);
    case "cat":
      return cmdCat(args[0], data);
    case "open":
    case "cd":
      return cmdOpen(args[0], data);
    case "echo":
      return { lines: [[t(args.join(" "))]] };
    case "date":
      return { lines: [[t((ctx.now ?? new Date()).toString())]] };
    case "history":
      return cmdHistory(ctx);
    case "clear":
      return { lines: [], clear: true };
    case "exit":
    case "logout":
      return {
        lines: [[muted("logout")], [muted("Connection to davideimola.dev closed.")]],
        navigate: "/",
      };
    // The library commands exist only while the library answers: with no data
    // they fall through to "command not found", like any command this shell
    // never had.
    case "shelf":
      return data.shelf ? cmdShelf(data.shelf) : unknownCommand(cmd);
    case "reading":
      return data.shelf ? cmdShelfPasses(data.shelf, "read") : unknownCommand(cmd);
    case "playing":
      return data.shelf ? cmdShelfPasses(data.shelf, "play") : unknownCommand(cmd);
    case "pile":
      return data.shelf ? cmdPile(data.shelf) : unknownCommand(cmd);
    case "sudo":
      return cmdSudo();
    case "rm":
      return cmdRm();
    case "nmap":
      return cmdNmap();
    case "argus":
      return cmdArgus();
    case "ping":
      return cmdPing();
    case "ssh":
      return cmdSsh();
    case "vim":
    case "vi":
    case "nano":
    case "emacs":
      return cmdEditor(cmd);
    default:
      return unknownCommand(cmd);
  }
}

// ── Tab completion ─────────────────────────────────────────────────────────

const COMPLETABLE_COMMANDS = [
  "cat",
  "clear",
  "date",
  "echo",
  "exit",
  "help",
  "history",
  "ls",
  "open",
  "pwd",
  "whoami",
];

/** The command names that can be completed in this session. */
function completableCommands(data: TerminalData): string[] {
  return data.shelf ? [...COMPLETABLE_COMMANDS, "shelf"].sort() : COMPLETABLE_COMMANDS;
}

function pathCandidates(cmd: string, data: TerminalData): string[] {
  switch (cmd) {
    case "ls":
      return rootDirs(data).map((d) => `./${d}`);
    case "cat":
      return [...ROOT_FILES, ...data.posts.map((p) => `blog/${p.slug}.md`)];
    case "open":
    case "cd":
      return Object.keys(OPEN_ROUTES).filter((k) => !k.includes(".") && k !== "~");
    default:
      return [];
  }
}

/** Complete the current input. Returns full-input suggestions (0, 1, or many). */
export function completeInput(input: string, data: TerminalData): string[] {
  const parts = input.split(/\s+/);
  if (parts.length <= 1) {
    const prefix = parts[0] ?? "";
    if (!prefix) return [];
    return completableCommands(data)
      .filter((c) => c.startsWith(prefix))
      .map((c) => `${c} `);
  }
  const last = parts[parts.length - 1];
  return pathCandidates(parts[0], data)
    .filter((c) => c.startsWith(last))
    .map((c) => [...parts.slice(0, -1), c].join(" "));
}
