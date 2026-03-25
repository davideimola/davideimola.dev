type BadgeVariant = "default" | "active" | "coming-soon" | "category";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "text-text-3 bg-border",
  active: "text-text-3 bg-border",
  "coming-soon": "text-accent bg-accent-glow border border-[rgba(201,31,55,0.2)]",
  category: "text-text-3 bg-border",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "font-mono text-[10px] font-medium tracking-[0.08em] uppercase",
        "rounded-[2px] px-2 py-0.5 inline-block",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
