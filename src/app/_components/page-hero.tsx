"use client";

import { type ReactNode } from "react";

interface PageHeroProps {
  readonly kanji?: string;
  readonly title: string;
  readonly subtitle: string;
  readonly additionalContent?: ReactNode;
  readonly backgroundPattern?: boolean;
  readonly centered?: boolean;
  readonly breadcrumbs?: ReactNode;
}

export function PageHero({
  kanji,
  title,
  subtitle,
  additionalContent,
  backgroundPattern = true,
  centered = true,
  breadcrumbs,
}: PageHeroProps) {
  return (
    <section className="relative px-6 py-24 sm:py-32 lg:px-8">
      {backgroundPattern && (
        <>
          <div className="absolute top-0 right-0 -z-20 h-[500px] w-[500px] rounded-full bg-[#C91F37]/20 opacity-50 mix-blend-screen blur-[120px]" />
          <div className="absolute bottom-0 left-0 -z-20 h-[500px] w-[500px] rounded-full bg-[#a39e98]/10 opacity-50 mix-blend-screen blur-[120px]" />
        </>
      )}
      <div className={`mx-auto max-w-4xl`}>
        {breadcrumbs && <div className="mb-8">{breadcrumbs}</div>}
        <div className={centered ? "text-center" : ""}>
          <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
            {kanji && (
              <>
                <span className="text-5xl text-[#C91F37]">{kanji}</span>{" "}
              </>
            )}
            {title}
          </h1>
          {/* Decorative accent line */}
          <div className="mx-auto mt-6 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a39e98]">
            {subtitle}
          </p>
          {additionalContent && <div className="mt-6">{additionalContent}</div>}
        </div>
      </div>
    </section>
  );
}
