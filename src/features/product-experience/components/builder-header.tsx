"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/layout/brand-logo";
import { ConciergePanel } from "@/features/concierge/components/concierge-panel";
import { cn } from "@/lib/utils";

interface BuilderHeaderProps {
  step: number;
  total: number;
  pill: string;
}

export function BuilderHeader({ step, total, pill }: BuilderHeaderProps) {
  return (
    <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-[var(--chocolate-light)]/15 bg-[oklch(0.991_0.006_85)]/90 px-4 backdrop-blur sm:px-6">
      <Link
        href="/"
        className="relative z-10 flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2"
      >
        <BrandLogo size="sm" className="sm:h-11" />
      </Link>

      <div
        className="pointer-events-none absolute left-1/2 flex max-w-[46vw] -translate-x-1/2 flex-col items-center gap-1 rounded-full border border-[var(--chocolate-light)]/20 bg-white/70 px-2.5 py-1.5 shadow-[0_1px_8px_rgba(60,40,20,0.04)] sm:max-w-none sm:flex-row sm:gap-3 sm:px-3.5 sm:py-1.5"
        aria-live="polite"
        aria-label={`Step ${step} of ${total}: ${pill}`}
      >
        <span className="flex items-center" aria-hidden>
          {Array.from({ length: total }, (_, index) => {
            const id = index + 1;
            const complete = id < step;
            const active = id === step;

            return (
              <span key={id} className="flex items-center">
                {index > 0 && (
                  <span className="relative mx-1 h-px w-2.5 overflow-hidden bg-[var(--chocolate-light)]/20 sm:mx-1.5 sm:w-3.5">
                    <span
                      className="absolute inset-y-0 left-0 bg-[var(--chocolate)] transition-[width] duration-300 ease-out motion-reduce:transition-none"
                      style={{ width: complete || active ? "100%" : "0%" }}
                    />
                  </span>
                )}
                <span
                  className={cn(
                    "rounded-full transition-[background-color,border-color,transform,box-shadow] duration-300 ease-out motion-reduce:transform-none motion-reduce:transition-none",
                    active
                      ? "size-1.5 scale-125 bg-[var(--chocolate)] shadow-[0_0_0_3px_rgba(60,40,20,0.08)] sm:size-2"
                      : complete
                        ? "size-1.5 bg-[var(--chocolate)] sm:size-2"
                        : "size-1.5 border border-[var(--chocolate-light)]/45 bg-transparent sm:size-2",
                  )}
                />
              </span>
            );
          })}
        </span>
        <span
          key={pill}
          className="max-w-[9.5rem] truncate text-[9px] font-medium tracking-[0.14em] text-[var(--chocolate-light)] motion-reduce:animate-none sm:max-w-none sm:text-[10px] sm:tracking-[0.16em] animate-in fade-in slide-in-from-bottom-1 duration-300"
        >
          {pill}
        </span>
      </div>

      <ConciergePanel
        triggerLabel="Concierge"
        triggerClassName="relative z-10 shrink-0 text-[12px] tracking-[0.12em] text-neutral-500 hover:text-[var(--chocolate-dark)]"
      />
    </header>
  );
}
