"use client";

import type { ReactNode } from "react";
import { ChevronDown, Link2, ShoppingBag } from "lucide-react";

import { DemoLoadButton } from "@/features/product-experience/components/demo-load-button";
import { CheckoutPanel } from "@/features/product-experience/components/checkout-panel";
import { OrderConfirmation } from "@/features/product-experience/components/order-confirmation";
import { OrderSummary } from "@/features/product-experience/components/order-summary";
import { ProductionExportSlot } from "@/features/product-experience/components/production-export-slot";
import { ShareCreationPanel } from "@/features/product-experience/components/share-creation-panel";
import {
  getRibbonOption,
  PACKAGING_OPTIONS,
} from "@/features/product-experience/constants";
import type { CheckoutSuccess } from "@/features/product-experience/lib/checkout-success";
import { isPresentableCheckoutSuccess } from "@/features/product-experience/lib/checkout-success";
import { cn } from "@/lib/utils";
import { getActiveCustomization } from "@/types";
import { useBoxStore } from "@/stores/use-box-store";

export type FinaleView = "main" | "order" | "share" | "success";

const BOX_NAMES: Record<9 | 16, string> = {
  9: "The Classic",
  16: "The Grand",
};

export function CompletionStep({
  view,
  onViewChange,
  onGoTo,
  sharedArrival,
  onCreateCopy,
  success,
  onSuccess,
}: {
  view: FinaleView;
  onViewChange: (view: FinaleView) => void;
  onGoTo: (step: number) => void;
  sharedArrival: boolean;
  onCreateCopy: () => void;
  success: CheckoutSuccess | null;
  onSuccess: (result: CheckoutSuccess | null) => void;
}) {
  const boxSize = useBoxStore((s) => s.boxSize);
  const slots = useBoxStore((s) => s.slots);
  const customization = useBoxStore((s) => s.customization);
  const filled = slots.filter((slot) => slot.chocolateId).length;
  const incomplete = filled < boxSize;
  const active = getActiveCustomization(customization);
  const packaging =
    PACKAGING_OPTIONS.find((option) => option.id === active.wrapStyle) ??
    PACKAGING_OPTIONS[0]!;
  const ribbonLabel =
    active.ribbonApplied && active.ribbon
      ? getRibbonOption(active.ribbon).label
      : null;
  const boxLabel = BOX_NAMES[boxSize];

  const extraBits = [
    ribbonLabel ? `${ribbonLabel} ribbon` : null,
    active.sleeveLogoApplied ? "Logo applied" : null,
  ].filter((bit): bit is string => Boolean(bit));

  function presentSuccess(result: CheckoutSuccess) {
    if (!isPresentableCheckoutSuccess(result)) return;
    onSuccess(result);
    onViewChange("success");
  }

  if (view === "success" && success && isPresentableCheckoutSuccess(success)) {
    return (
      <OrderConfirmation
        result={success}
        onCreateAnother={() => {
          useBoxStore.getState().resetBox();
          onSuccess(null);
          onViewChange("main");
          onGoTo(1);
        }}
      />
    );
  }

  if (view === "order") {
    return (
      <CheckoutPanel
        boxLabel={boxLabel}
        filled={filled}
        boxSize={boxSize}
        incomplete={incomplete}
        onGoToChocolates={() => onGoTo(3)}
        onSuccess={presentSuccess}
      />
    );
  }

  if (view === "share") {
    return (
      <div className="motion-reduce:animate-none motion-reduce:transform-none animate-in fade-in slide-in-from-right-3 duration-300">
        <ShareCreationPanel
          showCreateCopy={sharedArrival}
          onCreateCopy={onCreateCopy}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 motion-reduce:animate-none motion-reduce:transform-none animate-in fade-in duration-300">
      <div>
        <h1 className="font-serif text-[1.7rem] font-normal leading-tight text-[var(--chocolate-dark)] sm:text-3xl">
          Your masterpiece.
        </h1>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-500">
          Everything looks beautiful. What&apos;s next?
        </p>
      </div>

      {sharedArrival ? (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--gold)]/30 bg-[var(--gold)]/8 px-3 py-2.5 text-sm">
          <p className="text-[var(--chocolate-dark)]">
            Shared layout{incomplete ? " · Draft" : ""}
          </p>
          <button
            type="button"
            onClick={onCreateCopy}
            className="text-xs font-medium tracking-[0.08em] text-[var(--chocolate)] underline-offset-4 hover:underline"
          >
            Create a copy
          </button>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-3 rounded-2xl border border-[var(--chocolate-light)]/30 bg-white/70 p-4 shadow-[0_8px_24px_rgba(60,40,20,0.04)]">
        <div className="min-w-0">
          <p className="font-serif text-lg text-[var(--chocolate-dark)]">{boxLabel}</p>
          <p className="mt-1 text-sm leading-relaxed text-neutral-500">
            {filled} of {boxSize} chocolates · {packaging.label}
            {extraBits.length > 0 ? ` · ${extraBits.join(" · ")}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onGoTo(1)}
          className="shrink-0 text-[11px] font-medium tracking-[0.12em] text-[var(--gold-dark)] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
        >
          Edit
        </button>
      </div>

      <div className="grid gap-3">
        <ActionCard
          icon={<ShoppingBag className="size-4" />}
          title="Order your box"
          description="Save the order summary to your cart."
          onClick={() => onViewChange("order")}
        />
        <ActionCard
          icon={<Link2 className="size-4" />}
          title="Share for approval"
          description="Send a visual proof to your team or client."
          onClick={() => onViewChange("share")}
        />
      </div>

      <details className="group rounded-2xl border border-[var(--chocolate-light)]/30 bg-white/50">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-[var(--chocolate-dark)] outline-none hover:bg-white/60 focus-visible:ring-2 focus-visible:ring-[var(--gold)] [&::-webkit-details-marker]:hidden">
          Production tools
          <ChevronDown className="size-4 text-neutral-400 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
        </summary>
        <div className="space-y-4 border-t border-[var(--chocolate-light)]/20 px-3 py-4">
          <ProductionExportSlot />
          <DemoLoadButton />
          <details className="rounded-xl border border-[var(--chocolate-light)]/25 bg-transparent">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs tracking-[0.12em] text-neutral-500 outline-none hover:text-neutral-700 [&::-webkit-details-marker]:hidden">
              Details
              <ChevronDown className="size-3.5 transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" />
            </summary>
            <div className="border-t border-[var(--chocolate-light)]/20 px-3 py-3">
              <OrderSummary />
            </div>
          </details>
        </div>
      </details>
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-2xl border border-[var(--chocolate-light)]/30 bg-white/80 p-4 text-left shadow-[0_8px_24px_rgba(60,40,20,0.05)]",
        "transition-all duration-300 ease-out outline-none",
        "hover:-translate-y-0.5 hover:border-[var(--chocolate-light)]/50 hover:shadow-[0_12px_28px_rgba(60,40,20,0.08)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--chocolate)]/8 text-[var(--chocolate-dark)]">
        {icon}
      </span>
      <span>
        <span className="block font-serif text-lg text-[var(--chocolate-dark)]">{title}</span>
        <span className="mt-0.5 block text-sm text-neutral-500">{description}</span>
      </span>
    </button>
  );
}
