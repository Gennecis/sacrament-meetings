"use client";

import { useEffect } from "react";
import Link from "next/link";

interface MeetingsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Shown by the meetings error boundaries when something unexpected fails. */
export default function MeetingsError({ error, reset }: MeetingsErrorProps) {
  useEffect(() => {
    console.error("An unexpected error occurred:", error);
  }, [error]);

  return (
    <section className="space-y-4 py-8 text-center">
      <h1 className="text-3xl font-bold text-brand">Something went wrong</h1>
      <p className="text-muted">We could not load or save the meeting. Please try again in a moment.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="rounded-md bg-brand px-5 py-2 font-semibold text-white hover:bg-brand/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Try Again
        </button>
        <Link
          href="/meetings"
          className="rounded-md border border-brand px-5 py-2 font-semibold text-brand hover:bg-brand-light"
        >
          Back to all meetings
        </Link>
      </div>
    </section>
  );
}
