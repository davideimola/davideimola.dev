"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(scrollProgress);
    };

    // Update on scroll
    window.addEventListener("scroll", updateProgress);
    
    // Update on resize
    window.addEventListener("resize", updateProgress);
    
    // Initial update
    updateProgress();

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-[#C91F37] to-[#D3381C] transition-all duration-150 ease-out shadow-lg shadow-[#C91F37]/50"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

