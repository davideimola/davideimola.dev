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
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-3 ${className}`}>
      <p className="font-mono text-[13px] text-text-2">
        <span className="text-accent mr-2">❯</span>
        {message}
      </p>
      <a
        href="https://cal.com/davideimola"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 font-mono text-[12px] text-text-2 border border-border rounded-sm px-3 py-2 hover:border-border-hover hover:text-accent transition-[border-color,color] duration-150"
      >
        book a call →
      </a>
    </div>
  );
}
