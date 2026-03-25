"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ButtonLink } from "../ui";

const FULL_NAME = "Davide Imola";
const TYPING_SPEED = 80;

export function HeroSection() {
  const [displayedName, setDisplayedName] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayedName(FULL_NAME.slice(0, i));
      if (i >= FULL_NAME.length) {
        clearInterval(timer);
        setTypingDone(true);
      }
    }, TYPING_SPEED);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-[1024px] mx-auto px-4 sm:px-8 pt-24 pb-20 md:pt-32 md:pb-24">
      <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-12 md:gap-8">
        {/* Text block */}
        <div className="flex-1 animate-[fadeUp_0.5s_ease_both]">
          {/* Prompt */}
          <p className="font-mono text-[13px] text-text-3 mb-4 tracking-[0.04em]">
            <span className="text-accent mr-2">❯</span>whoami
          </p>

          {/* Name with typing animation */}
          <h1 className="font-mono font-bold text-[clamp(36px,7vw,64px)] text-text-1 leading-none tracking-[-0.03em] mb-4">
            {displayedName}
            <span
              className={`inline-block w-[3px] h-[0.85em] bg-accent ml-1 align-middle ${typingDone ? "animate-[blink_1.1s_step-end_infinite]" : ""}`}
            />
          </h1>

          {/* Role */}
          <p className="font-mono text-[13px] text-text-3 tracking-[0.04em] mb-2 animate-[fadeUp_0.5s_ease_0.2s_both]">
            Tech Lead · Speaker · Open Source
          </p>

          {/* Location */}
          <p className="font-sans text-[14px] text-text-2 mb-8 animate-[fadeUp_0.5s_ease_0.3s_both]">
            Software Engineer based in Verona, Italy
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 animate-[fadeUp_0.5s_ease_0.4s_both]">
            <ButtonLink variant="primary" href="/about">
              About me →
            </ButtonLink>
            <ButtonLink variant="ghost" href="/blog">
              Read the blog →
            </ButtonLink>
          </div>
        </div>

        {/* Photo */}
        <div className="relative w-[180px] sm:w-[220px] md:w-[260px] shrink-0 mx-auto md:mx-0 animate-[fadeUp_0.5s_ease_0.1s_both]">
          <Image
            src="/images/davide-speaking-profile.webp"
            alt="Davide Imola speaking at a conference"
            width={260}
            height={310}
            className="grayscale rounded-sm object-cover w-full h-auto"
            priority
          />
          {/* Akane corner accent */}
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent translate-x-2 translate-y-2" />
        </div>
      </div>
    </section>
  );
}
