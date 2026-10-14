"use client";

import { IconSearch } from "@tabler/icons-react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { SearchItem } from "../../lib/search";
import { searchScore } from "../../lib/search-score";
import { Tape } from "../ui/Tape";

// Group names follow the NavBar, so a result is filed where the visitor
// would look for it on the site.
const TYPE_LABELS: Record<SearchItem["type"], string> = {
  page: "Pages",
  post: "Writing",
  project: "Built",
  talk: "Talks",
};

const TYPE_ORDER: SearchItem["type"][] = ["page", "post", "project", "talk"];

const groupClasses =
  "[&_[cmdk-group-heading]]:px-5 [&_[cmdk-group-heading]]:pt-4 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[13px] [&_[cmdk-group-heading]]:text-fg-subtle";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
}

// The ⌘K search: a straight paper block framed in ink with its tape on the
// edge, results grouped like the NavBar. Search only, no commands.
export function CommandPalette({ open, onClose, items }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState("");

  const grouped = TYPE_ORDER.reduce<Record<string, SearchItem[]>>((acc, type) => {
    acc[type] = items.filter((item) => item.type === type);
    return acc;
  }, {});

  // With a query, the group holding the best match comes first: a post with
  // "Go" in its title beats a page that only mentions it in passing. The
  // palette sorts items inside a group, not the groups themselves.
  const best = (type: SearchItem["type"]) =>
    Math.max(
      0,
      ...grouped[type].map((i) => searchScore(inputValue, i.title, i.description, i.meta ?? ""))
    );
  const order = inputValue.trim() ? [...TYPE_ORDER].sort((a, b) => best(b) - best(a)) : TYPE_ORDER;

  function navigate(href: string) {
    onClose();
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener noreferrer");
    } else {
      router.push(href);
    }
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) setInputValue("");
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] sm:pt-[18vh] px-4">
      {/* Backdrop: a real button so click-to-close is keyboard-accessible too */}
      <button
        type="button"
        tabIndex={-1}
        aria-label="Close search"
        onClick={onClose}
        className="absolute inset-0 bg-fg/30 cursor-default"
      />

      <div className="relative w-full max-w-[640px]">
        <Tape tilt={0} className="absolute -left-2 -top-3.5 z-10">
          Search
        </Tape>

        <Command
          className="bg-bg border border-fg font-sans"
          loop
          label="Search the site"
          filter={(_value, search, keywords = []) =>
            searchScore(search, keywords[0] ?? "", keywords[1], keywords[2])
          }
        >
          <div className="flex items-center gap-3 px-5 pt-3 border-b border-border">
            <IconSearch
              size={18}
              stroke={1.75}
              className="text-fg-subtle shrink-0"
              aria-hidden="true"
            />
            <Command.Input
              ref={inputRef}
              placeholder="Posts, talks, projects, pages"
              value={inputValue}
              onValueChange={setInputValue}
              className="flex-1 min-w-0 bg-transparent py-4 text-[18px] text-fg placeholder:text-fg-subtle outline-none"
              onKeyDown={(e) => {
                if (e.key === "Escape") onClose();
              }}
            />
            <kbd className="hidden sm:inline font-mono text-[12px] text-fg-subtle border border-border px-1.5 py-0.5 shrink-0">
              esc
            </kbd>
          </div>

          <Command.List className="max-h-[min(420px,55vh)] overflow-y-auto pb-2">
            <Command.Empty className="px-5 py-10 font-sans text-[16px] text-fg-muted">
              Nothing matches "{inputValue.trim()}".
            </Command.Empty>

            {order.map((type) => {
              const group = grouped[type];
              if (!group?.length) return null;
              return (
                <Command.Group key={type} heading={TYPE_LABELS[type]} className={groupClasses}>
                  {group.map((item) => (
                    <Command.Item
                      key={item.id}
                      // The id keeps two talks with the same title apart; the
                      // keywords are what searchScore matches against.
                      value={item.id}
                      keywords={[item.title, item.description, item.meta ?? ""]}
                      onSelect={() => navigate(item.href)}
                      className="flex items-baseline gap-4 px-5 py-2.5 cursor-pointer border-l-2 border-transparent data-[selected=true]:bg-surface data-[selected=true]:border-fg transition-colors duration-75"
                    >
                      <span className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <span className="truncate text-[16px] font-semibold text-fg">
                          {item.title}
                        </span>
                        <span className="truncate text-[14px] text-fg-subtle">
                          {item.description}
                        </span>
                      </span>
                      {item.meta && (
                        <span className="font-mono text-[12px] text-fg-subtle shrink-0">
                          {item.meta}
                        </span>
                      )}
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>

          <div className="hidden sm:flex border-t border-border px-5 py-2.5 items-center gap-5 font-mono text-[12px] text-fg-subtle">
            <span>
              <kbd className="border border-border px-1 py-0.5 mr-1.5">↑↓</kbd>
              move
            </span>
            <span>
              <kbd className="border border-border px-1 py-0.5 mr-1.5">↵</kbd>
              open
            </span>
            <span>
              <kbd className="border border-border px-1 py-0.5 mr-1.5">esc</kbd>
              close
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
