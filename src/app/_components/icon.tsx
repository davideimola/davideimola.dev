import { type ComponentProps } from "react";
import {
  // Computing & Hardware
  Laptop,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Mic,
  Armchair,
  Table,
  // Development & Tools
  Code,
  Settings,
  Wrench,
  Hammer,
  Star,
  Zap,
  Rocket,
  Target,
  Lightbulb,
  // Communication & Social
  Mail,
  MessageCircle,
  Phone,
  Users,
  // Content & Media
  BookOpen,
  FileText,
  Image,
  Video,
  Music,
  // Business & Work
  Briefcase,
  Building,
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  // UI & Interface
  Home,
  Search,
  // Status & Feedback
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  // Cloud & Services
  Cloud,
  Database,
  Server,
  Globe,
  Wifi,
  // Misc
  Heart,
  Eye,
  Download,
  Upload,
  Link,
  Puzzle,
  MapPin,
  Gamepad2,
  Dice6,
  Beef,
  type LucideIcon,
} from "lucide-react";

interface IconProps extends ComponentProps<"div"> {
  name: string;
  type?: "lucide" | "simple" | "emoji";
  size?: "sm" | "md" | "lg";
  variant?: "default" | "accent" | "muted";
  /**
   * When true, uses <span> instead of <div> as container.
   * Use this when the icon needs to be inline with text or inside <p> tags.
   */
  inline?: boolean;
}

// Map common emoji/names to Lucide icons
const iconMap: Record<string, LucideIcon> = {
  // Hardware & Computing
  "💻": Laptop,
  laptop: Laptop,
  computer: Laptop,
  "🖥️": Monitor,
  monitor: Monitor,
  display: Monitor,
  "⌨️": Keyboard,
  keyboard: Keyboard,
  "🖱️": Mouse,
  mouse: Mouse,
  "🎧": Headphones,
  headphones: Headphones,
  "🎤": Mic,
  microphone: Mic,
  mic: Mic,
  "🪑": Armchair,
  chair: Armchair,
  desk: Table,

  // Development & Tools
  "🛠️": Wrench,
  tools: Wrench,
  wrench: Wrench,
  "🔧": Settings,
  settings: Settings,
  config: Settings,
  "⚙️": Settings,
  gear: Settings,
  "🔨": Hammer,
  hammer: Hammer,
  build: Hammer,
  code: Code,
  programming: Code,
  dev: Code,
  "⭐": Star,
  star: Star,
  favorite: Star,
  "⚡": Zap,
  zap: Zap,
  lightning: Zap,
  fast: Zap,
  "🚀": Rocket,
  rocket: Rocket,
  launch: Rocket,
  deploy: Rocket,
  "🎯": Target,
  target: Target,
  goal: Target,
  "💡": Lightbulb,
  lightbulb: Lightbulb,
  idea: Lightbulb,
  tip: Lightbulb,

  // Communication
  "📧": Mail,
  "📬": Mail,
  "📮": Mail,
  mail: Mail,
  email: Mail,
  contact: Mail,
  "💬": MessageCircle,
  message: MessageCircle,
  chat: MessageCircle,
  "📞": Phone,
  phone: Phone,
  call: Phone,
  "👥": Users,
  users: Users,
  team: Users,
  people: Users,

  // Content
  "📚": BookOpen,
  "📖": BookOpen,
  book: BookOpen,
  read: BookOpen,
  docs: BookOpen,
  "📄": FileText,
  "📝": FileText,
  file: FileText,
  document: FileText,
  text: FileText,
  image: Image,
  photo: Image,
  "🎥": Video,
  video: Video,
  "🎵": Music,
  music: Music,
  audio: Music,

  // Business
  "💼": Briefcase,
  briefcase: Briefcase,
  work: Briefcase,
  business: Briefcase,
  "🏢": Building,
  building: Building,
  company: Building,
  office: Building,
  "📅": Calendar,
  calendar: Calendar,
  schedule: Calendar,
  "🕐": Clock,
  clock: Clock,
  time: Clock,
  "📈": TrendingUp,
  trending: TrendingUp,
  growth: TrendingUp,
  "📊": BarChart3,
  chart: BarChart3,
  analytics: BarChart3,
  stats: BarChart3,

  // Cloud & Services
  "☁️": Cloud,
  cloud: Cloud,
  "🗄️": Database,
  database: Database,
  db: Database,
  server: Server,
  "🌐": Globe,
  globe: Globe,
  web: Globe,
  internet: Globe,
  "📶": Wifi,
  wifi: Wifi,
  network: Wifi,

  // UI Elements
  "🏠": Home,
  home: Home,
  "🔍": Search,
  search: Search,
  find: Search,
  "❤️": Heart,
  heart: Heart,
  love: Heart,
  like: Heart,
  "👁️": Eye,
  eye: Eye,
  view: Eye,
  see: Eye,
  "⬇️": Download,
  download: Download,
  "⬆️": Upload,
  upload: Upload,
  "🔗": Link,
  link: Link,
  url: Link,
  "🧩": Puzzle,
  puzzle: Puzzle,
  extension: Puzzle,
  plugin: Puzzle,
  "📍": MapPin,
  location: MapPin,
  pin: MapPin,
  place: MapPin,
  books: BookOpen,
  learning: BookOpen,
  study: BookOpen,
  "⚽": Target, // Football/Soccer - using Target as closest match
  football: Target,
  soccer: Target,
  "🍖": Beef,
  bbq: Beef,
  grill: Beef,
  cooking: Beef,
  "🎮": Gamepad2,
  gaming: Gamepad2,
  videogames: Gamepad2,
  "🎲": Dice6,
  boardgames: Dice6,
  dice: Dice6,
  "🐉": Star, // Dragon - using Star as fantasy/magical element
  dragon: Star,
  rpg: Star,
  dnd: Star,

  // Status
  "✅": Check,
  check: Check,
  success: Check,
  done: Check,
  "⚠️": AlertCircle,
  warning: AlertCircle,
  alert: AlertCircle,
  ℹ️: Info,
  info: Info,
  information: Info,
  "❓": HelpCircle,
  help: HelpCircle,
  question: HelpCircle,
};

export function Icon({
  name,
  type = "lucide",
  size = "md",
  variant = "default",
  inline = false,
  className,
  ...props
}: Readonly<IconProps>) {
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-14 w-14",
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  const simpleIconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-7 w-7",
  };

  const emojiSizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const variantClasses = {
    default: "text-gray-100",
    accent: "text-[#C91F37]",
    muted: "text-[#a39e98]",
  };

  const containerClass = `${sizeClasses[size]} flex items-center justify-center rounded-lg bg-[#2A2725]/50 ${variantClasses[variant]} ${className}`;
  const Container = inline ? "span" : "div";

  // Handle Lucide icons
  if (type === "lucide") {
    const IconComponent = iconMap[name];
    if (IconComponent) {
      return (
        <Container className={containerClass} {...props}>
          <IconComponent size={iconSizes[size]} />
        </Container>
      );
    }
  }

  // Handle Simple Icons (from CDN)
  if (type === "simple") {
    return (
      <Container className={containerClass} {...props}>
        <img
          src={`https://cdn.simpleicons.org/${name}/C91F37`}
          alt={`${name} logo`}
          className={simpleIconSizes[size]}
        />
      </Container>
    );
  }

  // Handle emoji fallback
  if (type === "emoji" || iconMap[name]) {
    // If it's a mapped emoji, use Lucide instead
    const IconComponent = iconMap[name];
    if (IconComponent) {
      return (
        <Container className={containerClass} {...props}>
          <IconComponent size={iconSizes[size]} />
        </Container>
      );
    }

    // Fallback to actual emoji
    return (
      <Container className={containerClass} {...props}>
        <span className={emojiSizes[size]}>{name}</span>
      </Container>
    );
  }

  // Fallback for unknown icons
  return (
    <Container className={containerClass} {...props}>
      <HelpCircle size={iconSizes[size]} />
    </Container>
  );
}

// Export the icon map for external use
export { iconMap };
