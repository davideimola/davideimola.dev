"use client";

import { type ReactNode } from "react";

interface PageHeroProps {
  readonly kanji?: string;
  readonly title: string;
  readonly subtitle: string;
  readonly additionalContent?: ReactNode;
  readonly backgroundPattern?: boolean;
  readonly centered?: boolean;
}

export function PageHero({
  kanji,
  title,
  subtitle,
  additionalContent,
  backgroundPattern = true,
  centered = true,
}: PageHeroProps) {
  return (
    <section className="relative px-6 py-24 sm:py-32 lg:px-8">
      {backgroundPattern && (
        <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
      )}
      <div className={`mx-auto max-w-4xl ${centered ? "text-center" : ""}`}>
        <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
          {kanji && (
            <>
              <span className="text-5xl text-[#C91F37]">{kanji}</span>{" "}
            </>
          )}
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          {subtitle}
        </p>
        {additionalContent && <div className="mt-6">{additionalContent}</div>}
      </div>
    </section>
  );
}
