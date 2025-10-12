import { type ComponentProps } from "react";
import {
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Mic,
  Armchair,
  Table,
  Star,
  Code,
  Settings,
  type LucideIcon,
} from "lucide-react";

interface HardwareIconProps extends ComponentProps<"div"> {
  type: string;
  size?: "sm" | "md" | "lg";
}

// Map icon types to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  laptop: Laptop,
  monitor: Monitor,
  display: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  headphones: Headphones,
  microphone: Mic,
  chair: Armchair,
  desk: Table,
  software: Star,
  code: Code,
  tools: Settings,
};

export function HardwareIcon({
  type,
  size = "md",
  className,
  ...props
}: HardwareIconProps) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  };

  const iconSize = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const IconComponent = iconMap[type];

  if (!IconComponent) {
    // Fallback to a generic icon if type not found
    return (
      <div
        className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gray-800/50 text-[#C91F37] ${className}`}
        {...props}
      >
        <Settings size={iconSize[size]} />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-lg bg-gray-800/50 text-[#C91F37] ${className}`}
      {...props}
    >
      <IconComponent size={iconSize[size]} />
    </div>
  );
}
