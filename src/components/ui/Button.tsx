import { type ButtonHTMLAttributes, forwardRef } from "react";

// primary: the filled ink button, one per view at most.
// ghost:   the outlined ink button, for the second action when a link is too quiet.
// link:    the text link with an ink underline that turns red on hover.
type ButtonVariant = "primary" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-fg text-bg border border-fg hover:bg-fg-body hover:border-fg-body",
  ghost: "bg-transparent text-fg border border-fg hover:bg-fg hover:text-bg",
  link: "bg-transparent text-fg border-b border-fg hover:text-accent hover:border-accent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-[14px] px-3 py-1.5",
  md: "text-[15px] px-[18px] py-3",
  lg: "text-[16px] px-[22px] py-[14px]",
};

// A text link has no box: it keeps the type size and drops the padding.
const linkSizeClasses: Record<ButtonSize, string> = {
  sm: "text-[14px] pb-0.5",
  md: "text-[15px] pb-0.5",
  lg: "text-[16px] pb-0.5",
};

function classesFor(variant: ButtonVariant, size: ButtonSize, className: string): string {
  return [
    "font-sans font-semibold leading-tight transition-colors duration-150",
    "inline-flex items-center gap-2 no-underline cursor-pointer select-none",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    variantClasses[variant],
    variant === "link" ? linkSizeClasses[size] : sizeClasses[size],
    className,
  ].join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        // A control does nothing on paper, so every design-system button opts
        // out of print here rather than at each call site. See the print
        // Rendering section of globals.css.
        data-print-hide=""
        className={classesFor(variant, size, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

/** Link-styled button for anchor tags */
interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <a
      // Same as Button: a button-shaped control is screen-only. It matters here
      // too because this one renders an <a>, so the `button` rule in globals.css
      // would never reach it.
      data-print-hide=""
      className={classesFor(variant, size, className)}
      {...props}
    >
      {children}
    </a>
  );
}
