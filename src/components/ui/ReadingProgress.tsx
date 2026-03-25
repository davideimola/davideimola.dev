"use client";

import { useEffect, useState } from "react";

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

  return (
    <div className="fixed top-[52px] left-0 right-0 z-40 h-[2px] bg-border">
      <div
        className="h-full bg-accent transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
