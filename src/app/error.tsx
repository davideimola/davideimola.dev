"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "../components/ui/Button";
import { Tape } from "../components/ui/Tape";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-[1136px] mx-auto px-4 sm:px-8 pt-12 md:pt-16 pb-20 min-h-[60vh] flex items-center">
      <div className="flex flex-col gap-6 max-w-[42rem]">
        <Tape tilt={1}>Error</Tape>
        <h1 className="m-0 font-sans font-bold text-fg text-[40px] sm:text-[52px] lg:text-h1 leading-[1.02] tracking-[-0.045em]">
          Something broke on my side.
        </h1>
        <p className="m-0 font-sans text-[19px] sm:text-lead leading-[1.5] text-fg-muted">
          An unexpected error stopped this page. Trying again usually helps.
        </p>
        {error.digest && (
          <p className="m-0 font-mono text-meta text-fg-subtle">digest: {error.digest}</p>
        )}
        <div className="flex flex-wrap items-center gap-6 mt-2">
          <Button type="button" variant="primary" onClick={reset}>
            Try again
          </Button>
          <ButtonLink variant="link" href="/">
            Back to the home page
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
