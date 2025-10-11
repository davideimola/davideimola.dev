/**
 * Speaking Events Data
 *
 * Add new speaking events here. The system will automatically:
 * - Separate upcoming vs past events based on the current date
 * - Sort upcoming events by date (nearest first)
 * - Sort past events by date (most recent first)
 *
 * To add a new event, simply add a new object to the array below.
 */

export type SpeakingEvent = {
  id: number;
  title: string;
  role:
    | "Speaker"
    | "Organizer"
    | "MC"
    | "Guest"
    | "Organizer & Speaker"
    | "Organizer & MC";
  talkTitle: string;
  location: string;
  date: string; // Format: YYYY-MM-DD
  type: "Conference" | "Meetup" | "Podcast" | "Podcast/Stream" | "Workshop";
  description?: string;
  coSpeaker?: string;
  videoUrl?: string;
  slidesUrl?: string;
  website?: string;
};

export const speakingEvents: SpeakingEvent[] = [
  {
    id: 1,
    title: "GOLab",
    role: "Speaker",
    talkTitle: "Gophers Gone Domain-Driven: a tale of Go and DDD",
    location: "Florence, Italy",
    date: "2024-11-13",
    type: "Conference",
    description:
      "Exploring Domain-Driven Design principles and patterns in Go applications, discussing how to build maintainable and scalable systems.",
    videoUrl: "https://www.youtube.com/watch?v=example",
  },
  {
    id: 2,
    title: "WeAreDevelopers World Congress",
    role: "Speaker",
    talkTitle: "GreenOps: Bridging the Gap Between DevOps and Sustainability",
    location: "Remote",
    date: "2024-07-18",
    type: "Conference",
    description:
      "Discussing sustainable practices in DevOps, exploring how to reduce the environmental impact of our infrastructure and development practices.",
  },
  {
    id: 3,
    title: "KCD Italy",
    role: "Speaker",
    talkTitle: "How to GitOps your cluster with Flux",
    location: "Bologna, Italy",
    date: "2024-06-20",
    type: "Conference",
    description:
      "Practical guide to implementing GitOps workflows in Kubernetes using Flux, covering best practices and real-world scenarios.",
  },
  {
    id: 4,
    title: "DevOps Time by UGIdotNET",
    role: "Speaker",
    talkTitle: "Come funziona l'incident response",
    location: "Remote",
    date: "2024-04-23",
    type: "Meetup",
    videoUrl: "https://www.youtube.com/watch?v=example",
    description:
      "Italian talk about incident response processes, discussing how to handle production incidents effectively.",
  },
  {
    id: 5,
    title: "DevOps Day",
    role: "Speaker",
    talkTitle: "Securing Secrets in the GitOps Era",
    location: "Remote",
    date: "2024-02-07",
    type: "Conference",
    slidesUrl: "https://slides.com/davideimola/securing-secrets",
    videoUrl: "https://www.youtube.com/watch?v=example",
    description:
      "Deep dive into secrets management in GitOps workflows, covering tools and best practices for secure secret handling.",
  },
  {
    id: 6,
    title: "GOLab",
    role: "Speaker",
    talkTitle: "Level UP your RDBMS Productivity with GO",
    location: "Florence, Italy",
    date: "2023-11-21",
    type: "Conference",
    coSpeaker: "with Ludovico Russo",
    slidesUrl: "https://slides.com/davideimola/go-rdbms",
    videoUrl: "https://www.youtube.com/watch?v=example",
    description:
      "Exploring database productivity patterns in Go, showing how to efficiently work with relational databases.",
  },
  {
    id: 7,
    title: "DevOps Time by UGIdotNET",
    role: "Speaker",
    talkTitle: "Securing Secrets in the GitOps Era",
    location: "Remote",
    date: "2023-11-14",
    type: "Meetup",
    videoUrl: "https://www.youtube.com/watch?v=example",
  },
  {
    id: 8,
    title: "DevSecOps Day",
    role: "Speaker",
    talkTitle: "Securing Secrets in the GitOps Era",
    location: "Bologna, Italy",
    date: "2023-10-13",
    type: "Conference",
    slidesUrl: "https://slides.com/davideimola/securing-secrets",
    videoUrl: "https://www.youtube.com/watch?v=example",
    description:
      "Security-focused talk about managing secrets in cloud-native and GitOps environments.",
  },
  {
    id: 9,
    title: "Giuseppe Funicello",
    role: "Guest",
    talkTitle: "Cos'è e cosa fa un DevOps?",
    location: "Remote",
    date: "2023-10-03",
    type: "Podcast/Stream",
    videoUrl: "https://www.youtube.com/watch?v=example",
    description:
      "Italian interview discussing the DevOps role, responsibilities, and best practices.",
  },
  {
    id: 10,
    title: "Giuseppe Funicello",
    role: "Guest",
    talkTitle:
      "Come funziona l'OPEN SOURCE? Con Davide Imola di @SchrodingerHat",
    location: "Remote",
    date: "2023-03-15",
    type: "Podcast/Stream",
    videoUrl: "https://www.youtube.com/watch?v=example",
    description:
      "Discussion about open source, community building, and Schrodinger Hat organization.",
  },
  {
    id: 11,
    title: "Incontro DevOps Italia",
    role: "Speaker",
    talkTitle: "How to GitOps your Kubernetes cluster with Flux",
    location: "Bologna, Italy",
    date: "2023-03-10",
    type: "Meetup",
    slidesUrl: "https://slides.com/davideimola/gitops-flux",
    videoUrl: "https://www.youtube.com/watch?v=example",
    description:
      "Introduction to GitOps principles and Flux implementation for Kubernetes clusters.",
  },
  {
    id: 12,
    title: "TomorrowDevs",
    role: "Guest",
    talkTitle: "Open Source Day with Schrodinger Hat",
    location: "Remote",
    date: "2023-03-08",
    type: "Meetup",
    videoUrl: "https://www.youtube.com/watch?v=example",
  },
  {
    id: 13,
    title: "DevOps Day",
    role: "Speaker",
    talkTitle: "How to GitOps your Kubernetes cluster with Flux",
    location: "Remote",
    date: "2023-02-15",
    type: "Conference",
    slidesUrl: "https://slides.com/davideimola/gitops-flux",
    videoUrl: "https://www.youtube.com/watch?v=example",
  },
  {
    id: 14,
    title: "The Developers' Bakery",
    role: "Guest",
    talkTitle: "Open Source Day with Schrodinger Hat",
    location: "Remote",
    date: "2023-01-17",
    type: "Podcast",
    videoUrl: "https://www.youtube.com/watch?v=example",
  },
];
