"use client";

import { useActionState } from "react";
import { sendContactEmail } from "../actions/contact";

const initialState = { status: "idle" as const };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactEmail, initialState);

  if (state.status === "success") {
    return (
      <div className="border border-border rounded-sm overflow-hidden">
        <div className="bg-bg-card border-b border-border px-4 py-2">
          <span className="font-mono text-[10px] text-text-3 tracking-widest uppercase">
            stdout
          </span>
        </div>
        <div className="px-4 py-8 flex flex-col gap-3">
          <p className="font-mono text-[13px]">
            <span className="text-accent">✓</span>{" "}
            <span className="text-text-1">Message sent.</span>
          </p>
          <p className="font-sans text-[13px] text-text-3">
            I'll get back to you as soon as I can.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-2 self-start font-mono text-[11px] text-text-3 hover:text-accent transition-colors duration-150"
          >
            ← send another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Honeypot — hidden from humans, filled by bots */}
      <div aria-hidden="true" tabIndex={-1} style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-mono text-[11px] text-text-3 tracking-widest uppercase"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className="bg-bg-card border border-border rounded-sm px-3 py-2.5 font-mono text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-border-hover transition-colors duration-150"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-mono text-[11px] text-text-3 tracking-widest uppercase"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          className="bg-bg-card border border-border rounded-sm px-3 py-2.5 font-mono text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-border-hover transition-colors duration-150"
        />
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="font-mono text-[11px] text-text-3 tracking-widest uppercase"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="What's on your mind?"
          className="bg-bg-card border border-border rounded-sm px-3 py-2.5 font-mono text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-border-hover transition-colors duration-150 resize-none"
        />
      </div>

      {/* Error */}
      {state.status === "error" && (
        <p className="font-mono text-[12px] text-accent">
          <span className="mr-2">✗</span>
          {state.message}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="self-start font-mono text-[12px] text-text-1 bg-bg-card border border-border rounded-sm px-4 py-2.5 cursor-pointer hover:border-border-hover hover:text-accent transition-[border-color,color] duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {pending ? (
          <>
            <span className="text-accent">❯</span>
            sending...
          </>
        ) : (
          <>
            <span className="text-accent">❯</span>
            send message
          </>
        )}
      </button>
    </form>
  );
}
