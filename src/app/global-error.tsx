"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[box-and-go] root-error", error.name);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-dvh flex-col items-center justify-center bg-[#faf6ef] px-6 text-center text-[#3d2918]">
        <p className="text-[11px] tracking-[0.2em]">BOX &amp; GO</p>
        <h1 className="mt-4 font-serif text-3xl">Something didn’t go as planned.</h1>
        <p className="mt-3 max-w-md text-sm text-neutral-600">
          Your experience was interrupted. Please try again.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className="min-h-11 rounded-full bg-[#3d2918] px-6 text-sm text-[#faf6ef]"
            onClick={() => reset()}
          >
            Try again
          </button>
          {/* Root crash: use a full navigation, not the App Router Link tree. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d9cbb8] px-6 text-sm"
          >
            Back to home
          </a>
        </div>
      </body>
    </html>
  );
}
