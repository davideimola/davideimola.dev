/**
 * Uses Page Content
 *
 * Hardware, software, and tools I use daily
 * Inspired by uses.tech
 */

export const usesData = {
  lastUpdated: "October 2025",

  hardware: {
    title: "Hardware",
    emoji: "💻",
    categories: [
      {
        name: "Computing",
        emoji: "🖥️",
        iconType: "laptop",
        items: [
          {
            name: 'MacBook Pro 14" (2021)',
            description:
              "M1 Pro chip, 16GB unified memory, 512GB SSD - My primary development machine",
            specs: "10-core CPU, 16-core GPU, 16-core Neural Engine",
            emoji: "💻",
            iconType: "laptop",
          },
        ],
      },
      {
        name: "Display & Video",
        emoji: "📺",
        iconType: "display",
        items: [
          {
            name: "Samsung LU28R550UQPXEN",
            description:
              '28" 4K UHD monitor with USB-C connectivity for extended workspace',
            specs: "3840×2160, 60Hz, HDR10, 99% sRGB",
            emoji: "🖥️",
            iconType: "monitor",
          },
        ],
      },
      {
        name: "Input Devices",
        emoji: "⌨️",
        iconType: "keyboard",
        items: [
          {
            name: "Kinesis Gaming Freestyle Edge",
            description: "Split mechanical keyboard for ergonomic typing",
            specs: "Cherry MX Brown switches, Blue backlighting",
            emoji: "⌨️",
            iconType: "keyboard",
          },
          {
            name: "Logitech MX Vertical",
            description:
              "Ergonomic wireless mouse with natural handshake position",
            specs: "4000 DPI, rechargeable, multi-device",
            emoji: "🖱️",
            iconType: "mouse",
          },
        ],
      },
      {
        name: "Audio Equipment",
        emoji: "🎧",
        iconType: "headphones",
        items: [
          {
            name: "Audio-Technica ATH-M50x",
            description:
              "Professional monitor headphones for development and music",
            specs: "45mm drivers, 15-28,000 Hz frequency response",
            emoji: "🎧",
            iconType: "headphones",
          },
          {
            name: "Elgato Wave:3",
            description:
              "USB condenser microphone for meetings and content creation",
            specs: "24-bit/96kHz recording, Clipguard technology",
            emoji: "🎙️",
            iconType: "microphone",
          },
        ],
      },
      {
        name: "Workspace",
        emoji: "🪑",
        iconType: "chair",
        items: [
          {
            name: "Secretlab Titan Evo 2022",
            description:
              "Ergonomic gaming chair optimized for long coding sessions",
            specs: "NEO Hybrid Leatherette, 4-way lumbar support",
            emoji: "🪑",
            iconType: "chair",
          },
          {
            name: "Flexispot E5 Pro Standing Desk",
            description:
              "Height-adjustable desk for alternating between sitting and standing",
            specs: "memory presets, IKEA top",
            emoji: "🏗️",
            iconType: "desk",
          },
        ],
      },
    ],
  },

  software: {
    title: "Software & Apps",
    emoji: "⚙️",
    items: [
      {
        name: "Cursor",
        description: "Primary code editor with custom extensions",
        category: "Editor",
        link: "https://cursor.com/",
        icon: "cursor",
      },
      {
        name: "iTerm2",
        description: "Terminal emulator with oh-my-zsh",
        category: "Terminal",
        link: "https://iterm2.com/",
        icon: "iterm2",
      },
      {
        name: "Arc Browser",
        description: "Modern browser for development and browsing",
        category: "Browser",
        link: "https://arc.net/",
        icon: "arc",
      },
      {
        name: "Notion",
        description: "Note-taking and project management",
        category: "Productivity",
        link: "https://notion.so/",
        icon: "notion",
      },
      {
        name: "GitKraken",
        description: "Git client for development",
        category: "Git",
        link: "https://www.gitkraken.com/",
        icon: "gitkraken",
      },
      {
        name: "Figma",
        description: "Design tool for development",
        category: "Design",
        link: "https://www.figma.com/",
        icon: "figma",
      },
    ],
  },

  devStack: {
    title: "Development Stack",
    emoji: "🛠️",
    items: [
      {
        name: "Go",
        description: "Primary language for backend and infrastructure tools",
        category: "Languages",
        link: "https://go.dev/",
        icon: "go",
      },
      {
        name: "TypeScript",
        description: "For web applications and tooling",
        category: "Languages",
        link: "https://www.typescriptlang.org/",
        icon: "typescript",
      },
      {
        name: "Python",
        description: "Scripting and automation",
        category: "Languages",
        link: "https://www.python.org/",
        icon: "python",
      },
      {
        name: "Next.js",
        description: "React framework for production applications",
        category: "Frameworks",
        link: "https://nextjs.org/",
        icon: "nextdotjs",
      },
      {
        name: "React",
        description: "UI library for building interfaces",
        category: "Frameworks",
        link: "https://react.dev/",
        icon: "react",
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        category: "Frameworks",
        link: "https://tailwindcss.com/",
        icon: "tailwindcss",
      },
      {
        name: "Kubernetes",
        description: "Container orchestration platform",
        category: "DevOps",
        link: "https://kubernetes.io/",
        icon: "kubernetes",
      },
      {
        name: "Flux",
        description: "GitOps continuous delivery",
        category: "DevOps",
        link: "https://fluxcd.io/",
        icon: "flux",
      },
      {
        name: "NATS",
        description: "Messaging system",
        category: "DevOps",
        link: "https://nats.io/",
        icon: "natsdotio",
      },
      {
        name: "GitHub Actions",
        description: "CI/CD automation",
        category: "DevOps",
        link: "https://github.com/features/actions",
        icon: "githubactions",
      },
      {
        name: "PostgreSQL",
        description: "Primary relational database",
        category: "Database",
        link: "https://www.postgresql.org/",
        icon: "postgresql",
      },
      {
        name: "GraphQL",
        description: "Query language for APIs",
        category: "API",
        link: "https://graphql.org/",
        icon: "graphql",
      },
    ],
  },

  services: {
    title: "Services & Platforms",
    emoji: "☁️",
    items: [
      {
        name: "Vercel",
        description: "Hosting for this website and other Next.js apps",
        category: "Hosting",
        link: "https://vercel.com/",
        icon: "vercel",
      },
      {
        name: "Google Cloud Platform",
        description: "Cloud infrastructure and services",
        category: "Cloud",
        link: "https://cloud.google.com/",
        icon: "googlecloud",
      },
      {
        name: "GitHub",
        description: "Code hosting and collaboration",
        category: "Development",
        link: "https://github.com/",
        icon: "github",
      },
      {
        name: "Kit (ConvertKit)",
        description: "Newsletter and email marketing",
        category: "Marketing",
        link: "https://kit.com/",
        icon: "kit",
      },
      {
        name: "Resend",
        description: "Transactional email API",
        category: "Email",
        link: "https://resend.com/",
        icon: "resend",
      },
    ],
  },

  extensions: {
    title: "Cursor Extensions",
    emoji: "🧩",
    items: [
      {
        name: "ESLint",
        description: "JavaScript/TypeScript linting",
        category: "Linting",
      },
      {
        name: "Prettier",
        description: "Code formatting",
        category: "Formatting",
      },
      {
        name: "GitLens",
        description: "Git supercharged",
        category: "Git",
      },
      {
        name: "Docker",
        description: "Docker container management",
        category: "DevOps",
      },
      {
        name: "Kubernetes",
        description: "Kubernetes cluster management",
        category: "DevOps",
      },
      {
        name: "Go",
        description: "Go language support",
        category: "Languages",
      },
      {
        name: "Tailwind CSS IntelliSense",
        description: "Tailwind class suggestions",
        category: "CSS",
      },
      {
        name: "Vim",
        description: "Vim language support",
        category: "Editor",
      },
      {
        name: "SonarQube for IDE",
        description: "Code quality and security",
        category: "Code Quality",
      },
      {
        name: "Material Icon Theme",
        description: "Material icons for VS Code",
        category: "Icons",
      },
      {
        name: "JetBrains Keymap",
        description: "JetBrains IDE keymap for VS Code",
        category: "Keymap",
      },
    ],
  },
};

export type UsesData = typeof usesData;
