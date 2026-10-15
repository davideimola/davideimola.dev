"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { useActionState, useEffect, useRef } from "react";
import { Card } from "../../../components/ui/Card";
import { useResolvedTheme } from "../../../components/ui/ThemeToggle";
import { sendContactEmail } from "../../actions/contact";

const initialState = { status: "idle" as const };

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactEmail, initialState);
  const loadTimeRef = useRef<HTMLInputElement>(null);
  const theme = useResolvedTheme();

  useEffect(() => {
    if (loadTimeRef.current) {
      loadTimeRef.current.value = Date.now().toString();
    }
  }, []);

  if (state.status === "success") {
    return (
      <Card tape="Message sent" hoverable={false} className="max-w-[640px]">
        <div className="flex flex-col gap-3" role="status">
          <p className="m-0 font-sans text-[17px] text-fg-body">
            Thanks. I'll get back to you as soon as I can.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="self-start font-mono text-[13px] text-fg border-b border-fg hover:text-accent hover:border-accent cursor-pointer"
          >
            Send another
          </button>
        </div>
      </Card>
    );
  }

  const label = "font-sans font-semibold text-[15px] text-fg";
  const field =
    "bg-surface border border-fg px-3.5 font-sans text-[17px] text-fg placeholder:text-fg-subtle outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

  return (
    <form action={action} className="flex flex-col gap-[22px] max-w-[640px] mt-2">
      {/* Honeypot: hidden from humans, filled by bots */}
      <div
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
      >
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" autoComplete="off" tabIndex={-1} />
      </div>

      <input ref={loadTimeRef} type="hidden" name="_t" value="" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Your name"
            className={`h-12 ${field}`}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="your@email.com"
            className={`h-12 ${field}`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className={label}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={7}
          placeholder="What's on your mind?"
          className={`py-3 leading-[1.5] resize-y ${field}`}
        />
        <p className="m-0 font-mono text-[13px] text-fg-subtle">
          No links, please. You can share them once I reply.
        </p>
      </div>

      <Turnstile
        key={theme ?? "pending"}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""}
        options={{
          theme: theme ?? "auto",
          size: "flexible",
          appearance: "interaction-only",
          language: "en",
        }}
      />

      {state.status === "error" && (
        <p role="alert" className="m-0 font-sans text-[15px] text-fg">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={pending}
          className="h-[50px] bg-fg text-bg px-[26px] font-sans font-semibold text-[16px] cursor-pointer hover:bg-fg-body transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Sending..." : "Send message"}
        </button>
        <span className="font-sans text-[14px] text-fg-subtle">
          Protected by Cloudflare Turnstile.
        </span>
      </div>
    </form>
  );
}
