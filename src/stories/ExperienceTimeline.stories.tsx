import type { Meta, StoryObj } from "@storybook/react";
import { ExperienceTimeline } from "../components/ui/ExperienceTimeline";

const meta: Meta<typeof ExperienceTimeline> = {
  title: "UI/ExperienceTimeline",
  component: ExperienceTimeline,
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "dark",
      values: [{ name: "dark", value: "#080807" }],
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ExperienceTimeline>;

export const WithPromotion: Story = {
  args: {
    entries: [
      {
        company: "RedCarbon",
        period: "Sep 2022 — Present",
        current: true,
        roles: [
          {
            role: "Tech Lead",
            period: "Jan 2026 — Present",
            description:
              "Tech lead for the development team building an AI-powered cybersecurity platform. I still write code every day — the role is about helping the team move faster and grow, not stepping back from engineering.",
            current: true,
          },
          {
            role: "Software Engineer",
            period: "Sep 2022 — Dec 2025",
            description:
              "Backend engineering on a Go microservices platform. Kubernetes, GCP, gRPC, Next.js. Grew into the tech lead role from here.",
            current: false,
          },
        ],
      },
      {
        company: "Milkman Technologies",
        period: "Aug 2020 — Sep 2022",
        current: false,
        roles: [
          {
            role: "DevOps Engineer",
            period: "Aug 2020 — Sep 2022",
            description:
              "Last-mile delivery platform. AWS, Kafka, PostgreSQL, Datadog. Focus on reliability and observability.",
            current: false,
          },
        ],
      },
    ],
  },
};

export const SingleRole: Story = {
  args: {
    entries: [
      {
        company: "ASEM S.r.l.",
        period: "Dec 2017 — Aug 2020",
        current: false,
        roles: [
          {
            role: "DevOps Engineer",
            period: "Dec 2017 — Aug 2020",
            description:
              "Industrial automation software. Built CI/CD pipelines, containerized legacy systems with Docker, C#.",
            current: false,
          },
        ],
      },
    ],
  },
};

export const Full: Story = {
  args: {
    entries: [
      {
        company: "RedCarbon",
        period: "Sep 2022 — Present",
        current: true,
        roles: [
          {
            role: "Tech Lead",
            period: "Jan 2026 — Present",
            description:
              "Tech lead for the development team building an AI-powered cybersecurity platform. I still write code every day.",
            current: true,
          },
          {
            role: "Software Engineer",
            period: "Sep 2022 — Dec 2025",
            description:
              "Backend engineering on a Go microservices platform. Kubernetes, GCP, gRPC, Next.js.",
            current: false,
          },
        ],
      },
      {
        company: "Milkman Technologies",
        period: "Aug 2020 — Sep 2022",
        current: false,
        roles: [
          {
            role: "DevOps Engineer",
            period: "Aug 2020 — Sep 2022",
            description:
              "Last-mile delivery platform. AWS, Kafka, PostgreSQL, Datadog.",
            current: false,
          },
        ],
      },
      {
        company: "ASEM S.r.l.",
        period: "Dec 2017 — Aug 2020",
        current: false,
        roles: [
          {
            role: "DevOps Engineer",
            period: "Dec 2017 — Aug 2020",
            description:
              "Industrial automation software. Built CI/CD pipelines, containerized legacy systems with Docker, C#.",
            current: false,
          },
        ],
      },
      {
        company: "EDALab",
        period: "Nov 2016 — Sep 2017",
        current: false,
        roles: [
          {
            role: "Software Engineer",
            period: "Nov 2016 — Sep 2017",
            description:
              "Internship turned first job. Embedded systems, Qt, iOS, C++. Where engineering got serious.",
            current: false,
          },
        ],
      },
    ],
  },
};
