"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { Button } from "@/components/ui/button";

export function ErrorFallback({
  onRetry,
  homeHref = "/",
}: {
  onRetry?: () => void;
  homeHref?: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[oklch(0.991_0.006_85)] px-6 py-16 text-center">
      <BrandLogo size="md" />
      <h1 className="mt-8 font-serif text-3xl font-normal text-[var(--chocolate-dark)]">
        Something didn’t go as planned.
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
        Your experience was interrupted. Please try again.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {onRetry ? (
          <Button type="button" className="min-h-10 px-5" onClick={onRetry}>
            Try again
          </Button>
        ) : null}
        <Link
          href={homeHref}
          className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[var(--chocolate-light)]/40 bg-[var(--cream)] px-5 text-sm text-[var(--chocolate)]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
