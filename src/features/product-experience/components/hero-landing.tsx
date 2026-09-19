"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { ConciergePanel } from "@/features/concierge/components/concierge-panel";
import { HeroBoxVisual } from "@/features/product-experience/components/hero-box-visual";
import { HeroRibbonBackdrop } from "@/features/product-experience/components/hero-ribbon-backdrop";
import { useOrbitalCarousel } from "@/features/product-experience/hooks/use-orbital-carousel";
import {
  HERO_BOX_VARIANTS,
  HERO_CTA,
  HERO_CTA_HINT,
  HERO_CONCIERGE_CTA,
  HERO_TRUST_LABELS,
  HERO_HEADLINE,
  HERO_HEADLINE_ACCENT,
} from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

export function HeroLanding() {
  const { activeIndex, step, stepRef, reducedMotion } = useOrbitalCarousel(
    HERO_BOX_VARIANTS.length,
  );

  const activeVariant = HERO_BOX_VARIANTS[activeIndex]!;

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-[oklch(0.991_0.006_85)] md:overflow-hidden">
      <HeroRibbonBackdrop />
      <div className="h-20 shrink-0 sm:h-24 md:h-24" aria-hidden />

      <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-2 pb-2 md:pb-3">
        <div className="flex w-full max-w-3xl shrink-0 flex-col items-center lg:max-w-4xl">
          <div className="relative h-[min(36dvh,19rem)] w-full sm:h-[min(40dvh,22rem)] md:h-[min(38dvh,21rem)]">
            <HeroBoxVisual
              className="absolute inset-0 mx-auto"
              activeIndex={activeIndex}
              step={step}
              stepRef={stepRef}
              reducedMotion={reducedMotion}
            />
          </div>

          <p
            key={activeVariant.src}
            aria-live="polite"
            className={cn(
              "mt-1 text-[11px] font-medium tracking-wide text-neutral-500 sm:mt-2 sm:text-xs",
              !reducedMotion && "animate-in fade-in duration-500",
            )}
          >
            {activeVariant.label}
          </p>
        </div>

        <h1 className="mt-4 max-w-lg px-4 text-center font-serif text-[1.7rem] font-normal leading-[1.12] tracking-tight text-[var(--chocolate-dark)] sm:mt-5 sm:text-3xl md:text-[2.15rem] lg:text-4xl">
          {HERO_HEADLINE}
          <br />
          <span className="italic text-[var(--chocolate-dark)]/90">
            {HERO_HEADLINE_ACCENT}
          </span>
        </h1>

        <div className="mt-4 flex flex-col items-center sm:mt-5">
          <p className="mb-1.5 text-[10px] font-semibold tracking-[0.22em] text-neutral-400">
            {HERO_CTA_HINT}
          </p>
          <Link
            href="/builder"
            className={cn(
              buttonVariants({ size: "default" }),
              "h-10 gap-1.5 rounded-full border border-white/25 px-6 font-serif text-[15px] font-normal not-italic text-white md:h-11 md:px-8 md:text-base",
              "bg-[linear-gradient(180deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0)_48%),var(--chocolate)]",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.45),inset_0_-1px_0_0_rgba(0,0,0,0.25),0_1px_2px_rgba(0,0,0,0.1),0_8px_22px_rgba(45,28,16,0.18)]",
              "hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_48%),var(--chocolate-dark)] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.32),inset_0_-1px_0_0_rgba(0,0,0,0.28),0_1px_2px_rgba(0,0,0,0.12),0_6px_16px_rgba(45,28,16,0.2)]",
            )}
          >
            {HERO_CTA}
            <ArrowUpRight className="size-4" strokeWidth={2.25} />
          </Link>
          <p className="mt-2 flex items-center gap-2 text-[11px] tracking-wide text-neutral-400">
            {HERO_TRUST_LABELS.map((label, index) => (
              <span key={label} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden>·</span>}
                {label}
              </span>
            ))}
          </p>
          <ConciergePanel
            triggerLabel={HERO_CONCIERGE_CTA}
            triggerClassName="mt-2.5"
          />
        </div>
      </div>
    </div>
  );
}
