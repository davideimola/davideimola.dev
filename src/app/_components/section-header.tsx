"use client";

interface SectionHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly centered?: boolean;
  readonly showUnderline?: boolean;
  readonly className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  showUnderline = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <div
      className={`mx-auto mb-12 ${centered ? "max-w-2xl text-center" : "max-w-7xl"} ${className}`}
    >
      <h2 className="font-playfair mb-4 text-3xl font-bold tracking-tight text-gray-100">
        {title}
      </h2>
      {showUnderline && (
        <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
      )}
      {subtitle && (
        <p className="mt-4 text-lg leading-8 text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}
