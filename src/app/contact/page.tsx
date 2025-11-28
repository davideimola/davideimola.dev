import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { type Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "~/app/_components/contact-form";
import { Icon } from "~/app/_components/icon";

export const metadata: Metadata = {
  title: "Contact - Davide Imola",
  description:
    "Get in touch with Davide Imola for speaking engagements, consulting opportunities, collaboration on infrastructure projects, or just to say hello.",
  keywords:
    "Davide Imola, Contact, Speaking Engagements, Consulting, Collaboration, Infrastructure, GitOps, Kubernetes",
  openGraph: {
    title: "Contact - Davide Imola",
    description:
      "Get in touch for speaking engagements, consulting, or collaboration.",
    url: "https://davideimola.dev/contact",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Davide Imola",
    description:
      "Get in touch for speaking engagements, consulting, or collaboration.",
  },
};

export default function Contact() {
  const contactMethods = [
    {
      icon: (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
          />
        </svg>
      ),
      label: "Email",
      value: "hello@davideimola.dev",
      href: "mailto:hello@davideimola.dev",
      description: "For general inquiries",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
      label: "LinkedIn",
      value: "/in/davideimola",
      href: "https://linkedin.com/in/davideimola",
      description: "Professional network",
    },
    {
      icon: (
        <img
          src="https://cdn.simpleicons.org/bluesky/C91F37"
          alt="BlueSky logo"
          className="h-6 w-6"
        />
      ),
      label: "BlueSky",
      value: "@davideimola.dev",
      href: "https://bsky.app/profile/davideimola.dev",
      description: "Follow for updates",
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      label: "GitHub",
      value: "/davideimola",
      href: "https://github.com/davideimola",
      description: "Check out my code",
    },
  ];

  const contactReasons = [
    {
      title: "Speaking Engagements",
      description:
        "Invite me to speak at your conference, meetup, or podcast about infrastructure, GitOps, Kubernetes, Go, or community building.",
      icon: "🎤",
    },
    {
      title: "Consulting & Collaboration",
      description:
        "Looking for expertise in cloud infrastructure, Kubernetes, GitOps, or security? Let's discuss how we can work together.",
      icon: "💼",
    },
    {
      title: "Community & Projects",
      description:
        "Interested in collaborating on open-source projects, organizing events, or building tech communities? I'd love to hear from you.",
      icon: "🤝",
    },
    {
      title: "General Inquiries",
      description:
        "Have a question, feedback about my content, or just want to say hello? Feel free to reach out!",
      icon: "💬",
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-[#0D0D0D]">
        {/* Hero Section */}
        <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-30" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              Let&apos;s Connect
            </h1>
            {/* Decorative accent line */}
            <div className="mx-auto mt-6 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a39e98]">
              「Whether you&apos;re looking for a speaker, want to collaborate
              on infrastructure projects, or just want to chat about tech,
              I&apos;d love to hear from you.」
            </p>
          </div>
        </section>

        {/* Contact Reasons */}
        <section className="bg-[#1A1816]/30 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {contactReasons.map((reason) => (
                <div
                  key={reason.title}
                  className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6 transition-all duration-300 hover:border-[#C91F37]/50"
                >
                  <div className="mb-4">
                    <Icon
                      name={reason.icon}
                      type="lucide"
                      size="lg"
                      variant="accent"
                    />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-100">
                    {reason.title}
                  </h3>
                  <p className="text-sm text-[#a39e98]">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form and Methods */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-100">
                    Send me a message
                  </h2>
                  <p className="mt-2 text-[#a39e98]">
                    Fill out the form below and I&apos;ll get back to you within
                    24-48 hours.
                  </p>
                </div>

                <ContactForm />
              </div>

              {/* Contact Methods */}
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-100">
                    Other ways to reach me
                  </h2>
                  <p className="mt-2 text-[#a39e98]">
                    Prefer a different channel? You can find me here:
                  </p>
                </div>

                <div className="space-y-4">
                  {contactMethods.map((method) => (
                    <Link
                      key={method.label}
                      href={method.href}
                      target={
                        method.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        method.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group flex items-start gap-4 rounded-xl border border-[#2A2725] bg-[#1A1816] p-5 transition-all duration-300 hover:border-[#C91F37]/50"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#C91F37]/10 text-[#C91F37] transition-colors group-hover:bg-[#C91F37]/20">
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-100">
                          {method.label}
                        </h3>
                        <p className="mt-1 text-sm text-[#C91F37]">
                          {method.value}
                        </p>
                        <p className="mt-1 text-xs text-[#726d68]">
                          {method.description}
                        </p>
                      </div>
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-[#726d68] transition-all group-hover:translate-x-1 group-hover:text-[#C91F37]"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </Link>
                  ))}
                </div>

                {/* Response Time */}
                <div className="mt-8 rounded-xl border border-[#2A2725] bg-[#1A1816]/50 p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100">
                        Response Time
                      </h3>
                      <p className="mt-1 text-sm text-[#a39e98]">
                        I typically respond within 24-48 hours during weekdays.
                        Weekend messages will be answered on Monday.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#1A1816] py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Want to learn more first?
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#a39e98]">
                Check out my experience, speaking history, or read my blog
                before getting in touch.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/about"
                  className="rounded-md border border-[#54504c] px-6 py-3 text-sm font-semibold text-[#d4cfc9] transition-colors hover:border-[#726d68] hover:text-[#e6e4e0]"
                >
                  About me
                </Link>
                <Link
                  href="/experience"
                  className="rounded-md border border-[#54504c] px-6 py-3 text-sm font-semibold text-[#d4cfc9] transition-colors hover:border-[#726d68] hover:text-[#e6e4e0]"
                >
                  Experience
                </Link>
                <Link
                  href="/speaking"
                  className="rounded-md border border-[#54504c] px-6 py-3 text-sm font-semibold text-[#d4cfc9] transition-colors hover:border-[#726d68] hover:text-[#e6e4e0]"
                >
                  Speaking
                </Link>
                <Link
                  href="/blog"
                  className="rounded-md border border-[#54504c] px-6 py-3 text-sm font-semibold text-[#d4cfc9] transition-colors hover:border-[#726d68] hover:text-[#e6e4e0]"
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
