"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { BuilderHeader } from "@/features/product-experience/components/builder-header";
import {
  BrandedUnlockNote,
  ChocolateCatalog,
  PlaceBrandedHint,
} from "@/features/product-experience/components/chocolate-catalog";
import { useBuilderSessionUi } from "@/features/product-experience/hooks/use-builder-session-ui";
import { clearBox, undoLastBoxEdit } from "@/features/product-experience/lib/place-chocolate";
import {
  CompletionStep,
  type FinaleView,
} from "@/features/product-experience/components/completion-step";
import { CustomizationPanel } from "@/features/product-experience/components/customization-panel";
import { StudioPreview } from "@/features/product-experience/components/studio-preview";
import {
  decodeShareConfig,
  SHARE_QUERY_PARAM,
} from "@/features/product-experience/lib/share-config";
import type { CheckoutSuccess } from "@/features/product-experience/lib/checkout-success";
import { BUILDER_VISUALS } from "@/lib/constants";
import { notify } from "@/lib/notify";
import { USER_ERROR_SHARE_LINK } from "@/lib/user-facing-error";
import { cn } from "@/lib/utils";
import { useBoxStore } from "@/stores/use-box-store";

const STEPS = [
  {
    id: 1,
    pill: "Your Creation",
    kicker: "First, choose your box.",
    copy: "Every great gift begins with the perfect box.",
  },
  {
    id: 2,
    pill: "Make It Yours",
    kicker: "Now, make it yours.",
    copy: "Choose how your box is presented.",
  },
  {
    id: 3,
    pill: "Your Chocolates",
    kicker: "Pick your chocolates.",
    copy: "Click a flavor to add it. Drag pieces in the box to rearrange.",
  },
  {
    id: 4,
    pill: "Final Touches",
    kicker: "Your masterpiece.",
    copy: "Everything looks beautiful. What's next?",
  },
] as const;

function StepChooseBox() {
  const boxSize = useBoxStore((s) => s.boxSize);
  const setBoxSize = useBoxStore((s) => s.setBoxSize);

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(
        [
          {
            size: 9 as const,
            name: "The Classic",
            detail: "9 chocolates",
            src: BUILDER_VISUALS.open9,
          },
          {
            size: 16 as const,
            name: "The Grand",
            detail: "16 chocolates",
            src: BUILDER_VISUALS.open16,
          },
        ] as const
      ).map((option) => {
        const selected = boxSize === option.size;
        return (
          <button
            key={option.size}
            type="button"
            onClick={() => setBoxSize(option.size)}
            className={cn(
              "overflow-hidden rounded-2xl border text-left transition-all outline-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
              selected
                ? "border-[var(--chocolate)] shadow-md"
                : "border-neutral-200 hover:border-neutral-300",
            )}
          >
            <div className="relative aspect-[4/3] bg-[oklch(0.991_0.006_85)]">
              <Image
                src={option.src}
                alt={option.name}
                fill
                sizes="280px"
                className="object-contain p-3"
              />
            </div>
            <div className="px-4 py-3">
              <p className="font-serif text-lg text-[var(--chocolate-dark)]">{option.name}</p>
              <p className="text-xs text-neutral-500">{option.detail}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--gold-dark)]">
                {selected ? "Selected" : "Select box"}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function BuilderExperience() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [finaleView, setFinaleView] = useState<FinaleView>("main");
  const [checkoutSuccess, setCheckoutSuccess] = useState<CheckoutSuccess | null>(
    null,
  );
  const [sharedArrival, setSharedArrival] = useState(false);
  const [shareLinkWarning, setShareLinkWarning] = useState<string | null>(null);
  const lastShareParam = useRef<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const applyPublicShareConfig = useBoxStore((s) => s.applyPublicShareConfig);
  const filled = useBoxStore((s) => s.slots.filter((slot) => slot.chocolateId).length);
  const boxSize = useBoxStore((s) => s.boxSize);
  const boxFullNotice = useBuilderSessionUi((s) => s.boxFullNotice);
  const lastUndo = useBuilderSessionUi((s) => s.lastUndo);
  const current = STEPS[step - 1]!;
  const previewMode = step === 2 ? "closed" : "open";
  const canContinue = useMemo(() => step < STEPS.length, [step]);

  useEffect(() => {
    useBuilderSessionUi.getState().setBoxFullNotice(false);
    useBuilderSessionUi.getState().setLastUndo(null);
  }, [boxSize]);

  useLayoutEffect(() => {
    const raw = searchParams.get(SHARE_QUERY_PARAM);
    if (raw === lastShareParam.current) return;
    lastShareParam.current = raw;

    if (!raw) {
      setShareLinkWarning(null);
      return;
    }

    const decoded = decodeShareConfig(raw);
    if (!decoded) {
      setShareLinkWarning(USER_ERROR_SHARE_LINK);
      setSharedArrival(false);
      notify.warning(USER_ERROR_SHARE_LINK);
      return;
    }

    applyPublicShareConfig(decoded);
    setShareLinkWarning(null);
    setSharedArrival(true);
    setStep(4);
  }, [applyPublicShareConfig, searchParams]);

  function goTo(next: number) {
    const clamped = Math.min(STEPS.length, Math.max(1, next));
    setDirection(clamped >= step ? 1 : -1);
    setStep(clamped);
    if (clamped !== 4) {
      setFinaleView("main");
    }
  }

  function handleFinaleBack() {
    if (step === 4 && finaleView !== "main") {
      setFinaleView("main");
      return;
    }
    goTo(step - 1);
  }

  function handleCreateCopy() {
    setSharedArrival(false);
    router.replace("/builder");
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[oklch(0.991_0.006_85)]">
      <BuilderHeader step={step} total={STEPS.length} pill={current.pill} />

      {shareLinkWarning ? (
        <p
          role="status"
          className="shrink-0 border-b border-destructive/20 bg-destructive/5 px-4 py-2 text-xs text-destructive sm:px-6"
        >
          {shareLinkWarning}
        </p>
      ) : null}

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="order-2 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:order-1 md:w-[38%] md:shrink-0 lg:w-[35%]">
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 md:py-6">
            <div
              key={step}
              className={cn(
                "motion-reduce:animate-none motion-reduce:transform-none animate-in fade-in duration-300 ease-out",
                direction >= 0 ? "slide-in-from-right-3" : "slide-in-from-left-3",
              )}
            >
              {step !== 4 && (
                <>
                  <h1 className="font-serif text-[1.7rem] font-normal leading-tight text-[var(--chocolate-dark)] sm:text-3xl">
                    {current.kicker}
                  </h1>
                  <p
                    className={cn(
                      "mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-500",
                      step === 2 && "mt-1",
                    )}
                  >
                    {current.copy}
                  </p>
                </>
              )}

              <div className={cn(step === 4 ? "mt-0" : "mt-6", step === 2 && "mt-4")}>
                {step === 1 && <StepChooseBox />}
                {step === 2 && (
                  <CustomizationPanel sections={["logo", "ribbon", "packaging"]} />
                )}
                {step === 3 && (
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <p className="text-sm tabular-nums text-[var(--chocolate-dark)]">
                          {filled} of {boxSize} chocolates
                        </p>
                        {filled > 0 && (
                          <button
                            type="button"
                            data-clear-box
                            onClick={clearBox}
            className="min-h-10 text-[11px] text-neutral-500 underline-offset-2 transition-colors hover:text-[var(--chocolate)] hover:underline"
                          >
                            Clear box
                          </button>
                        )}
                      </div>
                      <div
                        className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--chocolate-light)]/20"
                        aria-hidden
                      >
                        <div
                          className="h-full rounded-full bg-[var(--chocolate)] transition-[width] duration-200 ease-out motion-reduce:transition-none"
                          style={{ width: `${boxSize ? (filled / boxSize) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    {boxFullNotice && (
                      <p
                        role="status"
                        className="rounded-lg border border-[var(--chocolate-light)]/30 bg-[var(--cream-dark)]/80 px-3 py-2 text-xs text-[var(--chocolate-dark)]"
                      >
                        Your box is full
                      </p>
                    )}
                    {lastUndo && (
                      <button
                        type="button"
                        onClick={undoLastBoxEdit}
                        className="min-h-10 rounded-full border border-[var(--chocolate-light)]/30 bg-[var(--cream)] px-3 text-[11px] text-[var(--chocolate)] shadow-sm hover:bg-white"
                      >
                        Undo
                      </button>
                    )}
                    <BrandedUnlockNote />
                    <PlaceBrandedHint />
                    <ChocolateCatalog compact />
                  </div>
                )}
                {step === 4 && (
                  <CompletionStep
                    view={finaleView}
                    onViewChange={setFinaleView}
                    onGoTo={goTo}
                    sharedArrival={sharedArrival}
                    onCreateCopy={handleCreateCopy}
                    success={checkoutSuccess}
                    onSuccess={setCheckoutSuccess}
                  />
                )}
              </div>
            </div>
          </div>
        </aside>

        <section className="order-1 flex h-[34vh] shrink-0 items-center justify-center overflow-hidden px-3 pt-2 md:order-2 md:h-auto md:min-h-0 md:flex-1 md:px-6 md:py-4">
          <StudioPreview
            mode={previewMode}
            showRibbon={step === 2 || finaleView === "success"}
            interactive={finaleView !== "success"}
            statusSeal={
              finaleView === "success" && checkoutSuccess
                ? checkoutSuccess.source === "payment"
                  ? "confirmed"
                  : "quoted"
                : null
            }
          />
        </section>
      </div>

      <nav
        aria-label="Builder steps"
        className="z-10 flex shrink-0 items-center justify-between gap-3 border-t border-[var(--chocolate-light)]/20 bg-[oklch(0.991_0.006_85)] px-4 py-3 shadow-[0_-6px_24px_rgba(60,40,20,0.05)] sm:px-6"
      >
        {step > 1 ? (
          <button
            type="button"
            onClick={() => handleFinaleBack()}
            className={cn(
              "inline-flex h-11 min-w-[6.5rem] items-center justify-center gap-1.5 rounded-full border border-[var(--chocolate-light)]/40 bg-[var(--cream)] px-4 text-sm text-[var(--chocolate)]",
              "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75)]",
              "transition-all duration-150 ease-out",
              "hover:-translate-y-px hover:border-[var(--chocolate-light)]/60 hover:bg-white hover:shadow-[0_2px_8px_rgba(60,40,20,0.06),inset_0_1px_0_0_rgba(255,255,255,0.85)]",
              "active:translate-y-0 active:shadow-none",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
            )}
          >
            <ArrowLeft className="size-4" />
            Back
          </button>
        ) : (
          <span className="min-h-11 min-w-0 sm:min-w-[6.5rem]" aria-hidden />
        )}

        {canContinue ? (
          <button
            type="button"
            onClick={() => goTo(step + 1)}
            className={cn(
              "inline-flex h-11 min-w-[8.25rem] items-center justify-center gap-1.5 rounded-full bg-[var(--chocolate-dark)] px-5 text-sm text-[var(--cream)]",
              "border border-black/15",
              "shadow-[0_3px_10px_rgba(36,22,12,0.28),inset_0_1px_0_0_rgba(255,255,255,0.2)]",
              "transition-all duration-150 ease-out",
              "hover:-translate-y-0.5 hover:bg-[var(--chocolate)] hover:shadow-[0_8px_18px_rgba(36,22,12,0.32),inset_0_1px_0_0_rgba(255,255,255,0.22)]",
              "active:translate-y-0 active:shadow-[0_1px_4px_rgba(36,22,12,0.24),inset_0_1px_0_0_rgba(255,255,255,0.12)]",
              "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
              "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
            )}
          >
            Continue
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <span className="inline-flex h-11 items-center px-3 text-xs tracking-[0.14em] text-[var(--chocolate-light)]">
            {finaleView === "success" ? "Thank you" : ""}
          </span>
        )}
      </nav>
    </div>
  );
}
