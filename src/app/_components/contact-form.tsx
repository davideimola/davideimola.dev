"use client";

import { useState } from "react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  company: string;
  message: string;
}

interface ContactFormResponse {
  success?: boolean;
  error?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "general",
    company: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as ContactFormResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to send message");
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "general",
        company: "",
        message: "",
      });
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-300"
        >
          Name <span className="text-[#C91F37]">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#C91F37] focus:outline-none focus:ring-1 focus:ring-[#C91F37]"
          placeholder="Your name"
          disabled={status === "loading"}
        />
      </div>

      {/* Email */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-300"
        >
          Email <span className="text-[#C91F37]">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#C91F37] focus:outline-none focus:ring-1 focus:ring-[#C91F37]"
          placeholder="your.email@example.com"
          disabled={status === "loading"}
        />
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-gray-300"
        >
          Subject <span className="text-[#C91F37]">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 focus:border-[#C91F37] focus:outline-none focus:ring-1 focus:ring-[#C91F37]"
          disabled={status === "loading"}
        >
          <option value="general">General Inquiry</option>
          <option value="speaking">Speaking Engagement</option>
          <option value="consulting">Consulting / Collaboration</option>
          <option value="community">Community / Open Source</option>
          <option value="feedback">Feedback</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Company (Optional) */}
      <div>
        <label
          htmlFor="company"
          className="block text-sm font-medium text-gray-300"
        >
          Company / Organization{" "}
          <span className="text-gray-500">(optional)</span>
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#C91F37] focus:outline-none focus:ring-1 focus:ring-[#C91F37]"
          placeholder="Your company or organization"
          disabled={status === "loading"}
        />
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-300"
        >
          Message <span className="text-[#C91F37]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          value={formData.message}
          onChange={handleChange}
          className="mt-2 block w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-100 placeholder-gray-500 focus:border-[#C91F37] focus:outline-none focus:ring-1 focus:ring-[#C91F37]"
          placeholder="Tell me about your inquiry..."
          disabled={status === "loading"}
        />
      </div>

      {/* Status Messages */}
      {status === "success" && (
        <div className="rounded-lg bg-green-500/10 p-4 ring-1 ring-green-500/20">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-400">
                Message sent successfully!
              </p>
              <p className="mt-1 text-xs text-green-300">
                Thanks for reaching out! I&apos;ll get back to you within 24-48
                hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-lg bg-red-500/10 p-4 ring-1 ring-red-500/20">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-400">
                Failed to send message
              </p>
              <p className="mt-1 text-xs text-red-300">
                {errorMessage || "Please try again later or email me directly."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[#C91F37] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#D3381C] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "loading" ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="h-5 w-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
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
            Sending...
          </span>
        ) : (
          "Send Message"
        )}
      </button>
    </form>
  );
}

