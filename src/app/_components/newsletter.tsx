"use client";

import { useState } from "react";

interface NewsletterProps {
  formId?: string;
  title?: string;
  description?: string;
}

export function Newsletter({
  formId,
  title = "Stay Updated",
  description = "Get notified when I publish new articles about infrastructure, security, Kubernetes, Go, and tech community insights.",
}: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          formId,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        success?: boolean;
        message?: string;
      };

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to subscribe");
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <section className="bg-[#1A1816] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-100">
            {title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#a39e98]">{description}</p>

          {status === "success" ? (
            <div className="mt-8 rounded-lg bg-green-900/20 p-6 ring-1 ring-green-800">
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="text-lg font-semibold text-green-400">
                  Successfully subscribed!
                </p>
              </div>
              <p className="mt-2 text-sm text-[#a39e98]">
                Check your email to confirm your subscription.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8">
              <div className="mx-auto flex max-w-md gap-x-4">
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  className="min-w-0 flex-auto rounded-md border-0 bg-[#2A2725] px-3.5 py-2 text-gray-100 shadow-sm ring-1 ring-[#3E3B38] transition-colors ring-inset placeholder:text-[#726d68] focus:ring-2 focus:ring-[#C91F37] focus:ring-inset disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm sm:leading-6"
                  placeholder="Enter your email"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-none rounded-md bg-[#C91F37] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#D3381C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C91F37] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Subscribing...
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>

              {status === "error" && (
                <div className="mt-4 rounded-lg bg-red-900/20 p-4 ring-1 ring-red-800">
                  <p className="text-sm text-red-400">{errorMessage}</p>
                </div>
              )}

              <p className="mt-4 text-sm leading-6 text-[#726d68]">
                No spam, unsubscribe at any time. By subscribing, you agree to
                our{" "}
                <a
                  href="/privacy"
                  className="font-semibold text-[#a39e98] hover:text-[#C91F37]"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
