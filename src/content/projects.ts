/**
 * Projects Data
 *
 * Manage all your projects from this file.
 * Add new projects by adding objects to the array below.
 */

export type Project = {
  id: number;
  title: string;
  category: "Conference" | "Community" | "Open Source" | "SaaS";
  description: string;
  technologies: string[];
  links: {
    website?: string;
    github?: string;
    npm?: string;
    demo?: string;
    docs?: string;
  };
  status: "Active" | "Completed" | "Archived";
  year: string;
  featured?: boolean;
  highlights?: string[];
};

export const projects: Project[] = [
  {
    id: 1,
    title: "OSDay - Open Source Day",
    category: "Conference",
    description:
      "Annual international conference dedicated to open-source solutions, held in Florence, Italy. OSDay brings together developers, tech enthusiasts, and innovators for a full day of talks about open source trends and technologies.",
    technologies: [
      "Event Management",
      "Community Building",
      "Open Source",
      "Conference Organization",
    ],
    links: {
      website: "https://osday.dev",
    },
    status: "Active",
    year: "2023-Present",
    featured: true,
    highlights: [
      "Annual conference in Florence",
      "International speakers and attendees",
      "Focus on open source solutions",
      "Community-driven event",
    ],
  },
  {
    id: 2,
    title: "Schrodinger Hat",
    category: "Community",
    description:
      "Non-profit organization spreading the love for open-source software across Europe. Community manager role, organizing events, conferences, meetups, and contributing to open-source projects like ImageGoNord.",
    technologies: [
      "Community Management",
      "Events",
      "Open Source",
      "ImageGoNord",
    ],
    links: {
      website: "https://schroedinger-hat.org",
      github: "https://github.com/Schrodinger-Hat",
    },
    status: "Active",
    year: "2022-Present",
    featured: true,
    highlights: [
      "20k+ reach across events",
      "100+ industry speakers",
      "49 hours of content produced",
      "Active open source contributions",
    ],
  },
  {
    id: 3,
    title: "ImageGoNord",
    category: "Open Source",
    description:
      "SaaS tool to convert RGB images into color palettes inspired by NordTheme and Gruvbox. Part of Schrodinger Hat projects with 1,000+ stars on GitHub.",
    technologies: ["Image Processing", "NordTheme", "SaaS", "Open Source"],
    links: {
      github: "https://github.com/Schrodinger-Hat/ImageGoNord",
      website: "https://ign.schroedinger-hat.it/",
    },
    status: "Active",
    year: "2020-Present",
    featured: false,
  },
  {
    id: 4,
    title: "Infrastructure & GitOps Projects",
    category: "Open Source",
    description:
      "Various open-source contributions and projects focused on infrastructure automation, GitOps workflows, Kubernetes operators, and infrastructure as code.",
    technologies: ["Kubernetes", "Go", "GitOps", "Flux", "Infrastructure"],
    links: {
      github: "https://github.com/davideimola",
    },
    status: "Active",
    year: "2020-Present",
    featured: false,
  },
  {
    id: 5,
    title: "Conference Speaking",
    category: "Community",
    description:
      "Active speaker at international conferences covering topics like infrastructure, security, GitOps, Kubernetes, Go development, and sustainable operations (GreenOps).",
    technologies: [
      "Public Speaking",
      "Infrastructure",
      "Kubernetes",
      "Go",
      "Security",
    ],
    links: {
      website: "/speaking",
    },
    status: "Active",
    year: "2023-Present",
    featured: false,
  },
];
