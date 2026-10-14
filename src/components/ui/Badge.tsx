// Status pills: categories, status labels (Featured, Coming soon) and type
// classifications (Conference, Meetup). Section labels are tapes, not badges,
// and tags are never badges (they render as `#tag` in mono). No red: the
// strongest pill is filled ink.
type BadgeVariant = "default" | "active" | "coming-soon" | "category" | "outline" | "accent";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "text-fg-muted bg-surface-inline",
  active: "text-fg-muted bg-surface-inline",
  // Ink outline: a status that should be noticed, still not red
  "coming-soon": "text-fg border border-fg",
  category: "text-fg-muted bg-surface-inline",
  // Hollow sibling of `category`: secondary classifications (e.g. session format)
  outline: "text-fg-muted border border-border",
  // Filled ink: personal role labels (e.g. Organizer, MC)
  accent: "text-bg bg-fg",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "font-mono text-[11px] font-medium tracking-[0.06em] uppercase leading-normal",
        "rounded-[3px] px-2 py-0.5 inline-block",
        variantClasses[variant],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
