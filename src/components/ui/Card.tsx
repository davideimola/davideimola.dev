interface CardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hoverable?: boolean;
}

const baseClasses = [
  "bg-bg-card border border-border rounded-md p-6",
  "relative overflow-hidden",
].join(" ");

const hoverClasses = [
  "transition-[border-color,background] duration-200",
  "hover:border-border-hover hover:bg-bg-hover",
  "after:absolute after:inset-0 after:bg-accent-glow after:opacity-0",
  "after:transition-opacity after:duration-200 hover:after:opacity-100",
].join(" ");

export function Card({ children, className = "", href, hoverable = true }: CardProps) {
  const classes = [baseClasses, hoverable ? hoverClasses : "", className].join(" ");

  if (href) {
    return (
      <a href={href} className={`block no-underline ${classes}`}>
        <div className="relative z-10 h-full">{children}</div>
      </a>
    );
  }

  return (
    <div className={classes}>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
