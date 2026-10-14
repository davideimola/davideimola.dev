"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useActionState } from "react";
import { subscribe } from "../../app/actions/subscribe";
import { StdoutPanel } from "./StdoutPanel";
import { useResolvedTheme } from "./ThemeToggle";

const initialState = { status: "idle" as const };

interface SubscribeFormProps {
  /**
   * `full`: the standalone form for the /newsletter page (label + widget + button).
   * `compact`: a tight CTA for the home, sharing, and end-of-post placements.
   * `inline`: the footer's one-line form, field and button joined; the security
   * check only shows itself when Cloudflare needs an interaction.
   */
  mode?: "full" | "compact" | "inline";
  className?: string;
}

export function SubscribeForm({ mode = "full", className = "" }: SubscribeFormProps) {
  const [state, action, pending] = useActionState(subscribe, initialState);
  const theme = useResolvedTheme();
  const compact = mode !== "full";
  const inline = mode === "inline";

  // Double opt-in: submitting only queues the confirmation email; the subscriber is
  // not done until they click it. The success copy says so; it never claims "subscribed".
  if (state.status === "success") {
    return (
      <StdoutPanel className={className}>
        <div className="px-4 py-6 flex flex-col gap-2">
          <p className="font-sans font-semibold text-[16px] text-fg">Almost there.</p>
          <p className="font-sans text-[15px] text-fg-muted">
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

      {inline ? (
        <div className="flex w-full max-w-[400px]">
          <input
            id={`email-${mode}`}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@domain.dev"
            aria-label="Email address"
            className="min-w-0 flex-1 h-11 bg-surface border border-fg border-r-0 px-3.5 font-sans text-[15px] text-fg placeholder:text-fg-subtle outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
          />
          <button
            type="submit"
            disabled={pending}
            className="h-11 shrink-0 bg-fg text-bg px-[18px] font-sans font-semibold text-[15px] cursor-pointer hover:bg-fg-body transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pending ? "Subscribing..." : "Subscribe"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {!compact && (
            <label
              htmlFor={`email-${mode}`}
              className="font-mono text-[12px] text-fg-subtle tracking-[0.06em] uppercase"
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
            placeholder="you@domain.dev"
            aria-label={compact ? "Email address" : undefined}
            className="h-11 bg-surface border border-fg px-3.5 font-sans text-[15px] text-fg placeholder:text-fg-subtle outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg"
          />
        </div>
      )}

      {/* Turnstile. The theme follows the site's, not only the system's. */}
      <Turnstile
        key={theme ?? "pending"}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        options={{
          theme: theme ?? "auto",
          size: compact ? "flexible" : "normal",
          appearance: inline ? "interaction-only" : "always",
        }}
      />

      {/* Error */}
      {state.status === "error" && (
        <p role="alert" className="font-sans text-[14px] text-fg">
          {state.message}
        </p>
      )}

      {/* Submit */}
      {!inline && (
        <button
          type="submit"
          disabled={pending}
          className="self-start h-11 bg-fg text-bg px-[18px] font-sans font-semibold text-[15px] cursor-pointer hover:bg-fg-body transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Subscribing..." : "Subscribe"}
        </button>
      )}
    </form>
  );
}
