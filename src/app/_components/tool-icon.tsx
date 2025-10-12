import { Icon } from "./icon";

interface ToolIconProps {
  name: string;
  icon?: string;
  emoji?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "accent" | "muted";
  inline?: boolean;
}

export function ToolIcon({
  name,
  icon,
  emoji,
  size = "md",
  variant = "accent",
  inline = false,
}: Readonly<ToolIconProps>) {
  // Determine the icon type and name to use
  if (icon) {
    // Use Simple Icons for brand logos
    return (
      <Icon
        name={icon}
        type="simple"
        size={size}
        variant={variant}
        inline={inline}
      />
    );
  }

  if (emoji) {
    // Try to map emoji to Lucide icon, fallback to emoji
    return (
      <Icon
        name={emoji}
        type="lucide"
        size={size}
        variant={variant}
        inline={inline}
      />
    );
  }

  // Fallback for unknown tools
  return (
    <Icon
      name="help"
      type="lucide"
      size={size}
      variant="muted"
      inline={inline}
    />
  );
}
