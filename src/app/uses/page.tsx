import { Header } from "~/app/_components/header";
import { Footer } from "~/app/_components/footer";
import { type Metadata } from "next";
import Link from "next/link";
import { ToolIcon } from "~/app/_components/tool-icon";
import { HardwareIcon } from "~/app/_components/hardware-icon";
import { usesData } from "~/content/uses";

export const metadata: Metadata = {
  title: "Uses - Davide Imola",
  description:
    "Hardware, software, and tools Davide Imola uses for development, infrastructure work, and content creation. Inspired by uses.tech.",
  keywords:
    "Davide Imola, Uses, Setup, Hardware, Software, Tools, Development Stack, DevOps Tools, VS Code, Kubernetes, Go",
  openGraph: {
    title: "Uses - Davide Imola's Setup & Tools",
    description:
      "Hardware, software, and tools I use for development and infrastructure work.",
    url: "https://davideimola.dev/uses",
  },
  twitter: {
    card: "summary_large_image",
    title: "Uses - Davide Imola's Setup & Tools",
    description:
      "Hardware, software, and tools I use for development and infrastructure work.",
  },
};

export default function Uses() {
  return (
    <>
      <Header />
      <main className="bg-[#0D0D0D]">
        {/* Hero Section */}
        <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
          <div className="absolute top-0 right-0 -z-20 h-[500px] w-[500px] rounded-full bg-[#C91F37]/20 opacity-50 mix-blend-screen blur-[120px]" />
          <div className="absolute bottom-0 left-0 -z-20 h-[500px] w-[500px] rounded-full bg-[#a39e98]/10 opacity-50 mix-blend-screen blur-[120px]" />
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-playfair text-4xl font-bold tracking-tight text-gray-100 sm:text-5xl">
              My Setup & Tools
            </h1>
            {/* Decorative accent line */}
            <div className="mx-auto mt-6 h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#a39e98]">
              「Hardware, software, and services I use daily for development,
              infrastructure work, and content creation.」
            </p>
            <p className="mt-4 text-sm text-[#726d68]">
              Inspired by{" "}
              <a
                href="https://uses.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C91F37] underline underline-offset-4 transition-colors hover:text-[#D3381C]"
              >
                uses.tech
              </a>{" "}
              • Last updated: {usesData.lastUpdated}
            </p>
          </div>
        </section>

        {/* Hardware Section */}
        <section className="bg-[#1A1816]/30 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 flex items-center justify-center gap-4 text-3xl font-bold tracking-tight text-gray-100">
                {usesData.hardware.title}
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            </div>

            <div className="mx-auto max-w-6xl">
              <div className="space-y-16">
                {usesData.hardware.categories.map((category) => (
                  <div key={category.name}>
                    {/* Category Header */}
                    <div className="mb-8">
                      <h3 className="font-playfair mb-3 flex items-center gap-4 text-2xl font-bold text-gray-100">
                        {"iconType" in category && category.iconType ? (
                          <HardwareIcon
                            type={category.iconType}
                            size="lg"
                            className="text-[#C91F37]"
                          />
                        ) : (
                          <span className="text-3xl text-[#C91F37]">
                            {category.emoji}
                          </span>
                        )}
                        {category.name}
                      </h3>
                      <div className="h-0.5 w-20 bg-gradient-to-r from-[#C91F37] to-transparent"></div>
                    </div>

                    {/* Category Items */}
                    <div className="grid gap-6 md:grid-cols-2">
                      {category.items.map((item) => (
                        <div
                          key={item.name}
                          className="rounded-xl border border-[#2A2725] bg-[#1A1816] p-6 transition-all duration-300 hover:border-[#C91F37]/50"
                        >
                          <div className="flex items-start gap-4">
                            {/* Hardware Icon */}
                            {(() => {
                              if ("iconType" in item && item.iconType) {
                                return (
                                  <HardwareIcon
                                    type={item.iconType}
                                    size="md"
                                    className="flex-shrink-0"
                                  />
                                );
                              }
                              if ("emoji" in item && item.emoji) {
                                return (
                                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#2A2725]/50 text-xl">
                                    {item.emoji}
                                  </div>
                                );
                              }
                              return null;
                            })()}

                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-100">
                                {item.name}
                              </h4>
                              <p className="mt-2 text-sm text-[#a39e98]">
                                {item.description}
                              </p>
                              {"specs" in item && item.specs && (
                                <p className="mt-2 font-mono text-xs text-[#726d68]">
                                  {item.specs}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Software Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 flex items-center justify-center gap-4 text-3xl font-bold tracking-tight text-gray-100">
                {usesData.software.title}
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {usesData.software.items.map((item) => (
                  <div
                    key={item.name}
                    className="group rounded-xl border border-[#2A2725] bg-[#1A1816] p-6 transition-all duration-300 hover:border-[#C91F37]/50 hover:shadow-lg hover:shadow-[#C91F37]/5"
                  >
                    <div className="flex items-start gap-4">
                      <ToolIcon
                        name={item.name}
                        icon={
                          "icon" in item && typeof item.icon === "string"
                            ? item.icon
                            : undefined
                        }
                        emoji={
                          "emoji" in item && typeof item.emoji === "string"
                            ? item.emoji
                            : undefined
                        }
                        size="md"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-100">
                            {item.name}
                          </h3>
                          <span className="inline-flex items-center rounded-full bg-[#2A2725] px-2 py-0.5 text-xs font-medium text-[#726d68]">
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-[#a39e98]">
                          {item.description}
                        </p>
                        {"link" in item && item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-xs font-medium text-[#C91F37] transition-colors hover:text-[#D3381C]"
                          >
                            Visit website
                            <svg
                              className="ml-1 h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Development Stack Section */}
        <section className="bg-[#1A1816]/30 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 flex items-center justify-center gap-4 text-3xl font-bold tracking-tight text-gray-100">
                {usesData.devStack.title}
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            </div>

            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {usesData.devStack.items.map((item) => (
                  <div
                    key={item.name}
                    className="group rounded-lg border border-[#2A2725] bg-[#1A1816] p-5 transition-all duration-300 hover:border-[#C91F37]/50 hover:shadow-lg hover:shadow-[#C91F37]/5"
                  >
                    <div className="flex items-start gap-3">
                      <ToolIcon
                        name={item.name}
                        icon={
                          "icon" in item && typeof item.icon === "string"
                            ? item.icon
                            : undefined
                        }
                        emoji={
                          "emoji" in item && typeof item.emoji === "string"
                            ? item.emoji
                            : undefined
                        }
                        size="sm"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-gray-100">
                            {item.name}
                          </h3>
                          <span className="inline-flex items-center rounded-full bg-[#2A2725] px-1.5 py-0.5 text-xs font-medium text-[#726d68]">
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#a39e98]">
                          {item.description}
                        </p>
                        {"link" in item && item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-xs font-medium text-[#C91F37] transition-colors hover:text-[#D3381C]"
                          >
                            Learn more →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 flex items-center justify-center gap-4 text-3xl font-bold tracking-tight text-gray-100">
                {usesData.services.title}
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {usesData.services.items.map((item) => (
                  <div
                    key={item.name}
                    className="group rounded-xl border border-[#2A2725] bg-[#1A1816] p-6 transition-all duration-300 hover:border-[#C91F37]/50 hover:shadow-lg hover:shadow-[#C91F37]/5"
                  >
                    <div className="flex items-start gap-4">
                      <ToolIcon
                        name={item.name}
                        icon={
                          "icon" in item && typeof item.icon === "string"
                            ? item.icon
                            : undefined
                        }
                        emoji={
                          "emoji" in item && typeof item.emoji === "string"
                            ? item.emoji
                            : undefined
                        }
                        size="md"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-gray-100">
                            {item.name}
                          </h3>
                          <span className="inline-flex items-center rounded-full bg-[#2A2725] px-2 py-0.5 text-xs font-medium text-[#726d68]">
                            {item.category}
                          </span>
                        </div>
                        <p className="mt-1.5 text-sm text-[#a39e98]">
                          {item.description}
                        </p>
                        {"link" in item && item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center text-xs font-medium text-[#C91F37] transition-colors hover:text-[#D3381C]"
                          >
                            Visit website
                            <svg
                              className="ml-1 h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* VS Code Extensions Section */}
        <section className="bg-[#1A1816]/30 py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto mb-16 max-w-2xl text-center">
              <h2 className="font-playfair mb-4 flex items-center justify-center gap-4 text-3xl font-bold tracking-tight text-gray-100">
                {usesData.extensions.title}
              </h2>
              <div className="mx-auto h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C91F37] to-transparent"></div>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {usesData.extensions.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-lg border border-[#2A2725] bg-[#1A1816] p-5 transition-all duration-300 hover:border-[#C91F37]/50 hover:shadow-lg hover:shadow-[#C91F37]/5"
                  >
                    <h3 className="text-sm font-semibold text-gray-100">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-[#a39e98]">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="relative bg-[#1A1816] py-16 sm:py-24">
          <div className="pattern-seigaiha absolute inset-0 -z-10 opacity-10" />
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-playfair text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
                Questions about my setup?
              </h2>
              <p className="mt-6 text-lg leading-8 text-[#a39e98]">
                「Have questions about any of these tools or want
                recommendations? Feel free to reach out!」
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/contact"
                  className="rounded-lg bg-[#C91F37] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#D3381C]"
                >
                  Get in touch
                </Link>
                <Link
                  href="/about"
                  className="font-playfair text-sm leading-6 font-semibold text-[#d4cfc9] underline underline-offset-4 transition-colors hover:text-[#C91F37]"
                >
                  About me <span aria-hidden="true">→</span>
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
