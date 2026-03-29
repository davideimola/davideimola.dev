"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SearchItem } from "../../lib/search";

const TYPE_LABELS: Record<SearchItem["type"], string> = {
  page: "Pages",
  post: "Blog",
  talk: "Talks",
  project: "Projects",
};

const TYPE_ORDER: SearchItem["type"][] = ["page", "post", "project", "talk"];

interface EasterEgg {
  output: string;
  action?: "contact" | "projects" | "close";
}

const EASTER_EGGS: Record<string, EasterEgg> = {
  "sudo rm -rf /": {
    output: "Command accepted. Deleting all files on your computer... just kidding.",
  },
  "sudo rm -rf /*": {
    output: "Command accepted. Deleting all files on your computer... just kidding.",
  },
  "git push --force": {
    output: "⚠  Force push to main? Deploy is already running... good luck.",
  },
  "git push -f": {
    output: "⚠  Force push to main? Deploy is already running... good luck.",
  },
  "hire me": {
    output: "✓ Application accepted. Get in touch for details.",
    action: "contact",
  },
  "assumi davide": {
    output: "✓ Application accepted. Get in touch for details.",
    action: "contact",
  },
  hack: {
    output: "Hacking in progress......... access denied. (Points for trying.)",
  },
  whoami: {
    output: "davideimola — Tech Lead, OSS contributor, Speaker.",
  },
  "ls -la": {
    output: "drwxr-xr-x  blog/  projects/  talks/  about/  contact/",
  },
  "cat /etc/passwd": {
    output: "root:x:0:0:root:/root:/bin/zsh — nice try.",
  },
  "exit 1": {
    output: "Cannot exit. You are already here.",
    action: "close",
  },
  vim: {
    output: "Type :q! to exit. Or don't. You're stuck here forever.",
  },
  "ping localhost": {
    output: "64 bytes from davideimola.dev: icmp_seq=1 ttl=64 time=0.001ms",
  },
  "curl ifconfig.me": {
    output: "I know where you live. (just kidding, GDPR applies here)",
  },
  "docker ps": {
    output: "CONTAINER ID: you   STATUS: browsing portfolios   UP 2 hours",
  },
  "open source": {
    output: "→ Navigating to open source projects...",
    action: "projects",
  },
  "git log": {
    output:
      "a1b2c3d fix: finally fixed that bug   b2c3d4e feat: added dark mode (it was already dark)   c3d4e5f chore: removed console.log (added 3 more)",
  },
  "npm install": {
    output: "Please use pnpm.",
  },
  "yarn install": {
    output: "Please use pnpm.",
  },
  "42": {
    output: "The answer to life, the universe, and everything.",
  },
  please: {
    output: "Finally someone with manners. Unfortunately I still can't help you.",
  },
  "hello world": {
    output: "Hello, World!",
  },
};

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
}

export function CommandPalette({ open, onClose, items }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  // Group items by type
  const grouped = TYPE_ORDER.reduce<Record<string, SearchItem[]>>((acc, type) => {
    acc[type] = items.filter((item) => item.type === type);
    return acc;
  }, {});

  const activeEasterEgg = EASTER_EGGS[inputValue.trim().toLowerCase()] ?? null;

  function navigate(href: string) {
    onClose();
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener noreferrer");
    } else {
      router.push(href);
    }
  }

  function handleEasterEggSelect(egg: EasterEgg) {
    if (egg.action === "contact") {
      navigate("/contact");
    } else if (egg.action === "projects") {
      navigate("/projects");
    } else if (egg.action === "close") {
      onClose();
    }
  }

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  // Reset input when closed
  useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[rgba(8,8,7,0.80)] backdrop-blur-sm" />

      {/* Palette */}
      <div
        className="relative w-full max-w-[600px] border border-border rounded-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="bg-bg-card font-mono" loop>
          {/* Input */}
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <span className="text-accent text-[13px] shrink-0">❯</span>
            <Command.Input
              ref={inputRef}
              placeholder="search..."
              value={inputValue}
              onValueChange={setInputValue}
              className="flex-1 bg-transparent py-3.5 text-[13px] text-text-1 placeholder:text-text-3 outline-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
              }}
            />
            <kbd className="text-[10px] text-text-3 border border-border rounded px-1.5 py-0.5 shrink-0">
              esc
            </kbd>
          </div>

          {/* Results */}
          <Command.List className="max-h-[360px] overflow-y-auto py-2">
            <Command.Empty className="px-4 py-8 text-[12px] text-text-3 text-center">
              No results for this query.
            </Command.Empty>

            {activeEasterEgg && (
              <Command.Group
                heading="// system"
                className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-accent [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:font-mono"
              >
                <Command.Item
                  value={`__easter_egg__${inputValue}`}
                  onSelect={() => handleEasterEggSelect(activeEasterEgg)}
                  className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-[13px] text-text-2 data-[selected=true]:bg-bg-hover data-[selected=true]:text-text-1 transition-colors duration-75 group"
                >
                  <span className="text-accent text-[10px] opacity-0 group-data-[selected=true]:opacity-100 transition-opacity duration-75">
                    →
                  </span>
                  <span className="flex-1 font-mono">{activeEasterEgg.output}</span>
                </Command.Item>
              </Command.Group>
            )}

            {TYPE_ORDER.map((type) => {
              const group = grouped[type];
              if (!group?.length) return null;
              return (
                <Command.Group
                  key={type}
                  heading={TYPE_LABELS[type]}
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-text-3 [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:uppercase"
                >
                  {group.map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.title} ${item.description} ${item.meta ?? ""}`}
                      onSelect={() => navigate(item.href)}
                      className="flex items-center gap-3 px-4 py-2.5 cursor-pointer text-[13px] text-text-2 data-[selected=true]:bg-bg-hover data-[selected=true]:text-text-1 transition-colors duration-75 group"
                    >
                      <span className="text-accent text-[10px] opacity-0 group-data-[selected=true]:opacity-100 transition-opacity duration-75">
                        →
                      </span>
                      <span className="flex-1 truncate">{item.title}</span>
                      {item.meta && (
                        <span className="text-[10px] text-text-3 shrink-0">{item.meta}</span>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2 flex items-center gap-4">
            <span className="text-[10px] text-text-3">
              <kbd className="border border-border rounded px-1 py-0.5 mr-1">↑↓</kbd>
              navigate
            </span>
            <span className="text-[10px] text-text-3">
              <kbd className="border border-border rounded px-1 py-0.5 mr-1">↵</kbd>
              open
            </span>
            <span className="text-[10px] text-text-3">
              <kbd className="border border-border rounded px-1 py-0.5 mr-1">esc</kbd>
              close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
