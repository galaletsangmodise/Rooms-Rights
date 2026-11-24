"use client";

import { btnPrimary } from "@/lib/ui";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="text-3xl font-extrabold text-maroon">Something went wrong</h1>
      <p className="mt-3 text-ink-soft">
        Please try again. If it keeps happening, come back in a few minutes.
      </p>
      <button type="button" onClick={reset} className={`${btnPrimary} mt-6`}>
        Try again
      </button>
    </div>
  );
}
