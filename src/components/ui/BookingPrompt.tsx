import { CAL_COM_URL } from "../../lib/social";

interface BookingPromptProps {
  /** The lead-in line shown before the CTA. */
  message: string;
  className?: string;
}

/**
 * Turns an empty "upcoming" slot into an invitation to book.
 * Shared by the home and /sharing engagement modules so the empty
 * state always gives direction instead of leaving a void.
 */
export function BookingPrompt({ message, className = "" }: BookingPromptProps) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-3 ${className}`}>
      <p className="font-sans text-[16px] text-fg-muted m-0">{message}</p>
      <a
        href={CAL_COM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans font-semibold text-[15px] text-fg border-b border-fg pb-0.5 no-underline hover:text-accent hover:border-accent transition-colors duration-150"
      >
        Book a call
      </a>
    </div>
  );
}
