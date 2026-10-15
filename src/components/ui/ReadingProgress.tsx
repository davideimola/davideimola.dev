"use client";

import { useEffect, useState } from "react";

// A hairline of ink under the NavBar that runs with the article, and ties the
// brand's knot at its end once the reader reaches the last line.
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const article = document.getElementById("article-content");
      if (!article) return;
      const { top, height } = article.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, -top);
      const total = height - windowHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // The last line read ties the knot at the end of the ink line.
  const done = progress >= 99.5;

  return (
    <div className="fixed top-16 md:top-[76px] left-0 right-0 z-40 h-[2px] bg-border">
      <div
        className="h-full bg-fg transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
      {done && (
        <span aria-hidden="true" className="progress-knot absolute right-1.5 -top-1 block">
          {/* Rotated inside the animated wrapper, whose scale() would replace it */}
          <span className="block w-2.5 h-[9px] rounded-[2px] bg-accent -rotate-6" />
        </span>
      )}
    </div>
  );
}
