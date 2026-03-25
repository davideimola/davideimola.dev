import { type ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-accent text-white border border-accent",
    "hover:bg-accent-hover hover:border-accent-hover",
  ].join(" "),
  ghost: [
    "text-text-2 border border-border-mid bg-transparent",
    "hover:border-text-3 hover:text-text-1",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-[11px] px-3 py-1.5",
  md: "text-[12px] px-5 py-2.5",
  lg: "text-[13px] px-6 py-3",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={[
          "font-mono font-medium rounded-[3px] transition-all duration-150",
          "inline-flex items-center gap-2 letter-spacing-[0.02em]",
          "cursor-pointer select-none",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
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
      className={[
        "font-mono font-medium rounded-[3px] transition-all duration-150",
        "inline-flex items-center gap-2",
        "no-underline",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </a>
  );
}
