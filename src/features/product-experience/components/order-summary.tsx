"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PACKAGING_OPTIONS, RIBBON_COLORS } from "@/features/product-experience/constants";
import { BOX_SIZES, getRecommendedBrandedSlotIndex } from "@/lib/constants";
import { useBoxStore } from "@/stores/use-box-store";

export function OrderSummary() {
  const boxSize = useBoxStore((s) => s.boxSize);
  const slots = useBoxStore((s) => s.slots);
  const quantity = useBoxStore((s) => s.quantity);
  const customization = useBoxStore((s) => s.customization);
  const setQuantity = useBoxStore((s) => s.setQuantity);

  const filledCount = slots.filter((s) => s.chocolateId !== null).length;
  const totalChocolates = filledCount * quantity;

  const ribbonLabel =
    RIBBON_COLORS.find((r) => r.color === customization.ribbon.color)?.label ??
    "Custom";

  const packagingLabel =
    PACKAGING_OPTIONS.find((p) => p.id === customization.packaging.wrapStyle)?.label ??
    customization.packaging.wrapStyle;

  function adjustQuantity(delta: number) {
    setQuantity(quantity + delta);
  }

  function handleQuantityInput(value: string) {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      setQuantity(parsed);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-medium">
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
          <dt className="text-muted-foreground">Ribbon</dt>
          <dd className="font-medium">{ribbonLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Packaging</dt>
          <dd className="font-medium">{packagingLabel}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Logo</dt>
          <dd className="font-medium">{customization.logo.url ? "Uploaded" : "None"}</dd>
        </div>
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
      </dl>

      <Separator />

      <div className="space-y-2">
        <LabelRow label="Number of boxes" />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Decrease quantity"
            onClick={() => adjustQuantity(-1)}
            disabled={quantity <= 1}
          >
            <Minus className="size-3.5" />
          </Button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => handleQuantityInput(e.target.value)}
            className="h-8 w-full rounded-lg border border-[var(--chocolate-light)]/40 bg-card px-3 text-center text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
            aria-label="Number of boxes"
          />
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Increase quantity"
            onClick={() => adjustQuantity(1)}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--chocolate)]/20 bg-[var(--chocolate)]/5 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Total chocolates required
        </p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-3xl font-medium text-[var(--chocolate-dark)]">
          {totalChocolates.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {filledCount} per box × {quantity.toLocaleString()} boxes
        </p>
      </div>
    </div>
  );
}

function LabelRow({ label }: { label: string }) {
  return <p className="text-sm font-medium">{label}</p>;
}
