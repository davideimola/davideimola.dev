"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useActionState } from "react";
import { subscribe } from "../../app/actions/subscribe";
import { StdoutPanel } from "./StdoutPanel";

const initialState = { status: "idle" as const };

interface SubscribeFormProps {
  /**
   * `full`: the standalone form for the /newsletter page (label + widget + button).
   * `compact`: a tight inline CTA for the home, sharing, and end-of-post placements.
   */
  mode?: "full" | "compact";
  className?: string;
}

export function SubscribeForm({ mode = "full", className = "" }: SubscribeFormProps) {
  const [state, action, pending] = useActionState(subscribe, initialState);
  const compact = mode === "compact";

  // Double opt-in: submitting only queues the confirmation email; the subscriber is
  // not done until they click it. The success copy says so; it never claims "subscribed".
  if (state.status === "success") {
    return (
      <StdoutPanel className={className}>
        <div className="px-4 py-6 flex flex-col gap-2">
          <p className="font-mono text-[13px]">
            <span className="text-accent">✓</span>{" "}
            <span className="text-text-1">Almost there.</span>
          </p>
          <p className="font-sans text-[13px] text-text-3">
            Check your inbox and click the confirmation link to finish subscribing.
          </p>
        </div>
      </StdoutPanel>
    );
  }

  return (
    <form action={action} className={`flex flex-col ${compact ? "gap-3" : "gap-5"} ${className}`}>
      {/* Honeypot: hidden from humans, filled by bots */}
      <div
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
      >
        <label htmlFor={`website-${mode}`}>Website</label>
        <input id={`website-${mode}`} name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        {!compact && (
          <label
            htmlFor={`email-${mode}`}
            className="font-mono text-[11px] text-text-3 tracking-widest uppercase"
          >
            Email
          </label>
        )}
        <input
          id={`email-${mode}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="your@email.com"
          aria-label={compact ? "Email address" : undefined}
          className="bg-bg-card border border-border rounded-sm px-3 py-2.5 font-mono text-[13px] text-text-1 placeholder:text-text-3 outline-none focus:border-accent transition-colors duration-150"
        />
      </div>

      {/* Turnstile */}
      <Turnstile
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        options={{ theme: "dark", size: compact ? "flexible" : "normal" }}
      />

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
        <span className="text-accent">❯</span>
        {pending ? "subscribing..." : "subscribe"}
      </button>
    </form>
  );
}
