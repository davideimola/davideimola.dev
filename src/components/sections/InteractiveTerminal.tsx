"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  completeInput,
  runCommand,
  type TerminalData,
  type TerminalLine,
  type TerminalToken,
} from "../../lib/terminal";

const MOTD: TerminalLine[] = [
  [
    { text: "davideimola.dev", variant: "accent" },
    { text: " — guest shell", variant: "muted" },
  ],
  [{ text: "Type 'help' to see what you can do here.", variant: "muted" }],
  [],
];

function tokenClass(token: TerminalToken): string {
  if (token.href) {
    return "text-text-1 underline decoration-border-mid underline-offset-4 hover:text-accent hover:decoration-accent transition-colors duration-150";
  }
  switch (token.variant) {
    case "accent":
      return "text-accent";
    case "error":
      return "text-accent";
    case "muted":
      return "text-text-3";
    default:
      return "text-text-2";
  }
}

function OutputLine({ line }: { line: TerminalLine }) {
  if (line.length === 0) return <div aria-hidden="true">&nbsp;</div>;
  return (
    <div className="whitespace-pre-wrap break-words">
      {line.map((token, i) =>
        token.href ? (
          <a
            // Tokens are static per line — index keys are safe here.
            // biome-ignore lint/suspicious/noArrayIndexKey: static content
            key={i}
            href={token.href}
            target={token.href.startsWith("http") ? "_blank" : undefined}
            rel={token.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className={tokenClass(token)}
          >
            {token.text}
          </a>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: static content
          <span key={i} className={tokenClass(token)}>
            {token.text}
          </span>
        )
      )}
    </div>
  );
}

interface InteractiveTerminalProps {
  data: TerminalData;
}

export function InteractiveTerminal({ data }: InteractiveTerminalProps) {
  const router = useRouter();
  const [lines, setLines] = useState<TerminalLine[]>(MOTD);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const draftRef = useRef("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on every output change
  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = useCallback(() => {
    const value = input;
    setInput("");
    setHistoryIndex(null);

    const echo: TerminalLine = [
      { text: "❯ ", variant: "accent" },
      { text: value, variant: value.trim() ? undefined : "muted" },
    ];

    const result = runCommand(value, data, { history });

    if (value.trim() && history[history.length - 1] !== value.trim()) {
      setHistory((prev) => [...prev, value.trim()]);
    }

    if (result.clear) {
      setLines([]);
    } else {
      setLines((prev) => [...prev, echo, ...result.lines, []]);
    }

    if (result.navigate) {
      const target = result.navigate;
      if (target.startsWith("http")) {
        window.open(target, "_blank", "noopener,noreferrer");
      } else {
        // Leave the output visible for a beat before navigating away.
        setTimeout(() => router.push(target), 400);
      }
    }
  }, [input, data, history, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        submit();
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length === 0) return;
        const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
        if (historyIndex === null) draftRef.current = input;
        setHistoryIndex(next);
        setInput(history[next]);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === null) return;
        if (historyIndex >= history.length - 1) {
          setHistoryIndex(null);
          setInput(draftRef.current);
        } else {
          const next = historyIndex + 1;
          setHistoryIndex(next);
          setInput(history[next]);
        }
        return;
      }
      if (e.key === "Tab") {
        e.preventDefault();
        const suggestions = completeInput(input, data);
        if (suggestions.length === 1) {
          setInput(suggestions[0]);
        } else if (suggestions.length > 1) {
          setLines((prev) => [
            ...prev,
            [{ text: suggestions.map((s) => s.trim()).join("  "), variant: "muted" }],
          ]);
        }
        return;
      }
      if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      }
    },
    [submit, history, historyIndex, input, data]
  );

  const focusInput = useCallback(() => {
    // Don't steal focus while the visitor is selecting output text.
    if (window.getSelection()?.toString()) return;
    inputRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: click-to-focus convenience; the input inside is the interactive element
    // biome-ignore lint/a11y/useKeyWithClickEvents: keyboard users interact with the input directly
    <div
      className="border border-border rounded-sm overflow-hidden bg-bg-card cursor-text"
      onClick={focusInput}
    >
      {/* Window chrome */}
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-border-mid" />
          <span className="w-2 h-2 rounded-full bg-border-mid" />
          <span className="w-2 h-2 rounded-full bg-border-mid" />
        </div>
        <span className="font-mono text-[10px] text-text-3 tracking-widest uppercase">
          guest@davideimola.dev — zsh
        </span>
      </div>

      {/* Output + prompt */}
      <div
        ref={outputRef}
        className="h-[55vh] min-h-[360px] overflow-y-auto px-4 py-4 font-mono text-[12px] sm:text-[13px] leading-relaxed"
      >
        <div role="log" aria-live="polite">
          {lines.map((line, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: append-only log
            <OutputLine key={i} line={line} />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-accent shrink-0">❯</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-0 bg-transparent text-text-1 outline-none caret-accent placeholder:text-text-3"
            placeholder={lines === MOTD ? "help" : undefined}
            aria-label="Terminal command input"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
