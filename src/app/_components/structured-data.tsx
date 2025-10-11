import Script from "next/script";

export function PersonStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Davide Imola",
    url: "https://davideimola.dev",
    jobTitle: "Software Engineer",
    worksFor: {
      "@type": "Organization",
      name: "Tech Industry",
    },
    sameAs: [
      "https://github.com/davideimola",
      "https://linkedin.com/in/davideimola",
      "https://twitter.com/davideimola",
    ],
    knowsAbout: [
      "Kubernetes",
      "Go Programming Language",
      "Docker",
      "GitOps",
      "Cloud Computing",
      "Infrastructure",
      "Security",
      "Backend Development",
      "Frontend Development",
      "Software Architecture",
      "Community Building",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "University of Rome La Sapienza",
    },
  };

  return (
    <Script
      id="person-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Davide Imola",
    url: "https://davideimola.dev",
    description:
      "Personal website of Davide Imola, Software Engineer, conference organizer, and tech speaker.",
    author: {
      "@type": "Person",
      name: "Davide Imola",
    },
    inLanguage: "en-US",
  };

  return (
    <Script
      id="website-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function OrganizationStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Schrodinger Hat",
    url: "https://schroedinger-hat.org",
    description:
      "Non-profit organization spreading the love for open-source software",
    founder: {
      "@type": "Person",
      name: "Davide Imola",
    },
    sameAs: ["https://github.com/Schrodinger-Hat"],
  };

  return (
    <Script
      id="organization-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function EventStructuredData({
  events,
}: {
  events: Array<{
    title: string;
    date: string;
    location: string;
    description?: string;
  }>;
}) {
  const structuredData = events.map((event) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    location: {
      "@type": "Place",
      name: event.location,
    },
    description: event.description ?? "",
    organizer: {
      "@type": "Person",
      name: "Davide Imola",
      url: "https://davideimola.dev",
    },
  }));

  return (
    <Script
      id="event-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
