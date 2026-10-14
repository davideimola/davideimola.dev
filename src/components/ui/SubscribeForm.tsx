"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { type ReactNode, useActionState, useId } from "react";
import { subscribe } from "../../app/actions/subscribe";
import { StdoutPanel } from "./StdoutPanel";
import { useResolvedTheme } from "./ThemeToggle";

const initialState = { status: "idle" as const };

interface SubscribeFormProps {
  /**
   * `full`: the /newsletter hero. A sans label, a large joined field and button.
   * `inline`: the joined field and button at the regular size, for the home
   *   newsletter block and /links. The label is mono unless `label` says otherwise.
   * `compact`: field above button, for the end of a post and narrow columns.
   */
  mode?: "full" | "inline" | "compact";
  /** Visible label. `null` hides it (the field keeps an aria-label). */
  label?: string | null;
  /** A line under the field, e.g. "One email a month. Unsubscribe from any issue." */
  note?: ReactNode;
  /** Field background: `surface` on the page ground, `bg` inside a white block. */
  field?: "surface" | "bg";
  className?: string;
}

export function SubscribeForm({
  mode = "full",
  label,
  note,
  field = "surface",
  className = "",
}: SubscribeFormProps) {
  const [state, action, pending] = useActionState(subscribe, initialState);
  const theme = useResolvedTheme();
  const id = useId();
  const joined = mode !== "compact";
  const large = mode === "full";
  const labelText = label === undefined ? "Your email" : label;

  // Double opt-in: submitting only queues the confirmation email; the subscriber is
  // not done until they click it. The success copy says so; it never claims "subscribed".
  if (state.status === "success") {
    return (
      <StdoutPanel label="Almost there" className={className}>
        <div className="px-4 py-5">
          <p className="font-sans text-[15px] text-fg-muted m-0">
            Check your inbox and click the confirmation link to finish subscribing.
          </p>
        </div>
      </StdoutPanel>
    );
  }

  const fieldBg = field === "bg" ? "bg-bg" : "bg-surface";
  const height = large ? "h-14" : "h-12 sm:h-[52px]";
  const inputClasses = `min-w-0 ${height} ${fieldBg} border border-fg px-4 font-sans ${
    large ? "text-[18px]" : "text-[16px]"
  } text-fg placeholder:text-fg-subtle outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg`;
  const buttonClasses = `${height} shrink-0 bg-fg text-bg ${
    large ? "px-[26px] text-[17px]" : "px-6 text-[16px]"
  } font-sans font-semibold cursor-pointer hover:bg-fg-body transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <form action={action} className={`flex flex-col gap-2.5 ${className}`}>
      {/* Honeypot: hidden from humans, filled by bots */}
      <div
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
      >
        <label htmlFor={`website-${id}`}>Website</label>
        <input id={`website-${id}`} name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>

      {labelText && (
        <label
          htmlFor={`email-${id}`}
          className={
            large
              ? "font-sans font-semibold text-[16px] text-fg"
              : "font-mono text-[12px] sm:text-[13px] text-fg-subtle"
          }
        >
          {labelText}
        </label>
      )}

      <div className={joined ? "flex flex-col sm:flex-row" : "flex flex-col gap-2.5"}>
        <input
          id={`email-${id}`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@domain.dev"
          aria-label={labelText ? undefined : "Email address"}
          className={`${inputClasses} ${joined ? "sm:flex-1 sm:border-r-0" : ""}`}
        />
        <button
          type="submit"
          disabled={pending}
          className={`${buttonClasses} ${joined ? "mt-2.5 sm:mt-0" : "self-start"}`}
        >
          {pending ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      {/* Turnstile. The theme follows the site's, not only the system's; it only
          takes room when Cloudflare needs an interaction. */}
      <Turnstile
        key={theme ?? "pending"}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        options={{
          theme: theme ?? "auto",
          size: "flexible",
          appearance: "interaction-only",
        }}
      />

      {state.status === "error" && (
        <p role="alert" className="font-sans text-[14px] text-fg m-0">
          {state.message}
        </p>
      )}

      {note && <p className="font-mono text-[13px] text-fg-subtle m-0">{note}</p>}
    </form>
  );
}
