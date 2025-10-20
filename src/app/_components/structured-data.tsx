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
      name: "RedCarbon",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Verona",
      addressCountry: "IT",
    },
    sameAs: [
      "https://github.com/davideimola",
      "https://linkedin.com/in/davideimola",
      "https://bsky.app/profile/davideimola.dev",
    ],
    knowsAbout: [
      "Kubernetes",
      "Go Programming Language",
      "Docker",
      "GitOps",
      "Flux",
      "Cloud Computing",
      "Infrastructure as Code",
      "Cybersecurity",
      "Backend Development",
      "Frontend Development",
      "Domain-Driven Design",
      "DevOps",
      "Platform Engineering",
    ],
    alumniOf: {
      "@type": "Organization",
      name: "University of Verona",
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
      "Personal website of Davide Imola, Software Engineer at RedCarbon, community organizer, and tech speaker from Verona, Italy.",
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
