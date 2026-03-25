"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { SearchItem } from "../../lib/search";

const TYPE_LABELS: Record<SearchItem["type"], string> = {
  page: "Pages",
  post: "Blog",
  talk: "Talks",
  project: "Projects",
};

const TYPE_ORDER: SearchItem["type"][] = ["page", "post", "project", "talk"];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  items: SearchItem[];
}

export function CommandPalette({ open, onClose, items }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Group items by type
  const grouped = TYPE_ORDER.reduce<Record<string, SearchItem[]>>((acc, type) => {
    acc[type] = items.filter((item) => item.type === type);
    return acc;
  }, {});

  function navigate(href: string) {
    onClose();
    if (href.startsWith("http")) {
      window.open(href, "_blank", "noopener noreferrer");
    } else {
      router.push(href);
    }
  }

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
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
        <Command
          className="bg-bg-card font-mono"
          loop
        >
          {/* Input */}
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <span className="text-accent text-[13px] shrink-0">❯</span>
            <Command.Input
              ref={inputRef}
              placeholder="search..."
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
