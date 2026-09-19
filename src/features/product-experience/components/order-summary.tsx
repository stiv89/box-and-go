"use client";

import { Separator } from "@/components/ui/separator";
import {
  getRibbonOption,
  PACKAGING_OPTIONS,
} from "@/features/product-experience/constants";
import { BOX_SIZES, getRecommendedBrandedSlotIndex } from "@/lib/constants";
import { getActiveCustomization } from "@/types";
import { useBoxStore } from "@/stores/use-box-store";

export function OrderSummary() {
  const boxSize = useBoxStore((s) => s.boxSize);
  const slots = useBoxStore((s) => s.slots);
  const quantity = useBoxStore((s) => s.quantity);
  const customization = useBoxStore((s) => s.customization);

  const filledCount = slots.filter((s) => s.chocolateId !== null).length;
  const totalChocolates = filledCount * quantity;

  const active = getActiveCustomization(customization);
  const packagingLabel =
    PACKAGING_OPTIONS.find((option) => option.id === active.wrapStyle)?.label ??
    active.wrapStyle;
  const ribbonLabel =
    active.ribbonApplied && active.ribbon
      ? getRibbonOption(active.ribbon).label
      : null;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">
          Order summary
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Configuration totals — pricing not included.
        </p>
      </div>

      {filledCount === 0 && (
        <p className="rounded-lg border border-dashed border-[var(--chocolate-light)]/40 bg-[var(--cream)]/50 p-3 text-xs text-muted-foreground">
          No chocolates placed yet. Select or drag pieces into the box to begin
          your order.
        </p>
      )}

      <dl className="space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Box size</dt>
          <dd className="font-medium">{BOX_SIZES[boxSize].label}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Filled slots</dt>
          <dd className="font-medium">
            {filledCount} / {boxSize}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Chocolates per box</dt>
          <dd className="font-medium">{filledCount}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Packaging</dt>
          <dd className="font-medium">{packagingLabel}</dd>
        </div>
        {ribbonLabel ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Ribbon</dt>
            <dd className="font-medium">{ribbonLabel}</dd>
          </div>
        ) : null}
        {active.sleeveLogoApplied ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Logo</dt>
            <dd className="font-medium">Applied on sleeve</dd>
          </div>
        ) : null}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Branded piece</dt>
          <dd className="font-medium">
            {customization.brandedPlacement.slotIndex !== null
              ? `Slot ${customization.brandedPlacement.slotIndex + 1}`
              : "Not placed"}
          </dd>
        </div>
        {customization.logo.url &&
          customization.brandedPlacement.slotIndex !== null && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Placement</dt>
              <dd className="text-right text-xs font-medium">
                {customization.brandedPlacement.slotIndex ===
                getRecommendedBrandedSlotIndex(
                  BOX_SIZES[boxSize].rows,
                  BOX_SIZES[boxSize].cols,
                )
                  ? "Recommended (front-center)"
                  : "Custom (see preview)"}
              </dd>
            </div>
          )}
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Card message</dt>
          <dd className="max-w-[140px] truncate font-medium">
            {customization.card.message.trim() || "None"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Number of boxes</dt>
          <dd className="font-medium tabular-nums">{quantity.toLocaleString()}</dd>
        </div>
      </dl>

      <Separator />

      <div className="rounded-xl border border-[var(--chocolate)]/20 bg-[var(--chocolate)]/5 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Total chocolates required
        </p>
        <p className="mt-1 text-3xl font-semibold tabular-nums text-[var(--chocolate-dark)]">
          {totalChocolates.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {filledCount} per box × {quantity.toLocaleString()} boxes
        </p>
      </div>
    </div>
  );
}
