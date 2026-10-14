"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "../../lib/content";

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -70% 0px", threshold: 0 }
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="font-mono text-[12px] text-fg-subtle tracking-[0.06em] uppercase mb-3.5">
        On this page
      </p>
      <ul className="flex flex-col gap-2.5 list-none m-0 p-0">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "pl-3.5" : ""}>
            <a
              href={`#${item.id}`}
              className={`flex items-baseline gap-2 font-sans text-[15px] leading-[1.45] no-underline transition-colors duration-150 ${
                activeId === item.id ? "text-fg font-semibold" : "text-fg-subtle hover:text-fg"
              }`}
            >
              {activeId === item.id && (
                <span
                  aria-hidden="true"
                  className="inline-block w-[7px] h-[7px] bg-fg rounded-[1.5px] shrink-0 -translate-y-px"
                />
              )}
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
