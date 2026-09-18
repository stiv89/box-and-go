"use client";

import { AlertTriangle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ChocolatePiece } from "@/features/product-experience/components/chocolate-piece";
import {
  BOX_SIZES,
  BRANDED_CHOCOLATE_ID,
  createBrandedChocolate,
  getRecommendedBrandedSlotIndex,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useBoxStore } from "@/stores/use-box-store";

export function BrandedChocolatePanel() {
  const boxSize = useBoxStore((s) => s.boxSize);
  const customization = useBoxStore((s) => s.customization);
  const selectedChocolateId = useBoxStore((s) => s.selectedChocolateId);
  const setSelectedChocolate = useBoxStore((s) => s.setSelectedChocolate);
  const placeBrandedAtRecommended = useBoxStore((s) => s.placeBrandedAtRecommended);

  const logoUrl = customization.logo.url;
  const brandedSlot = customization.brandedPlacement.slotIndex;
  const { rows, cols } = BOX_SIZES[boxSize];
  const recommended = getRecommendedBrandedSlotIndex(rows, cols);
  const brandedChocolate = createBrandedChocolate();

  if (!logoUrl) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--chocolate-light)]/40 bg-[var(--cream)]/50 p-4 text-xs text-muted-foreground">
        Upload a logo in the <strong>Customize</strong> tab to unlock the branded
        corporate chocolate piece.
      </div>
    );
  }

  const isAtRecommended = brandedSlot === recommended;
  const isBrandedSelected = selectedChocolateId === BRANDED_CHOCOLATE_ID;

  return (
    <div className="space-y-3 rounded-xl border border-[var(--gold)]/30 bg-[var(--gold)]/5 p-4">
      <div className="flex items-start gap-3">
        <ChocolatePiece
          chocolate={brandedChocolate}
          size="sm"
          logoUrl={logoUrl}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[var(--chocolate-dark)]">
            Branded corporate piece
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your logo imprinted on a chocolate disc. Select it, then click a slot — or
            use the suggested front-center placement.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          setSelectedChocolate(isBrandedSelected ? null : BRANDED_CHOCOLATE_ID)
        }
        aria-pressed={isBrandedSelected}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
          isBrandedSelected
            ? "border-[var(--gold)] bg-[var(--gold)]/20 font-medium"
            : "border-[var(--chocolate-light)]/40 bg-card hover:bg-[var(--cream-dark)]",
        )}
      >
        <Sparkles className="size-3.5" />
        {isBrandedSelected ? "Branded piece selected" : "Select branded piece"}
      </button>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full"
        onClick={placeBrandedAtRecommended}
      >
        Place at front-center (slot {recommended + 1})
      </Button>

      {brandedSlot === null ? (
        <p className="flex items-start gap-2 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          No branded piece placed yet. We suggest slot {recommended + 1} (front row,
          center) for maximum visibility when the box is opened.
        </p>
      ) : isAtRecommended ? (
        <p className="flex items-start gap-2 text-xs text-emerald-800">
          <Sparkles className="mt-0.5 size-3.5 shrink-0" />
          Branded piece placed at the recommended front-center slot ({brandedSlot + 1}).
        </p>
      ) : (
        <p className="flex items-start gap-2 text-xs text-amber-800">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          Branded piece is in slot {brandedSlot + 1}. Recommended: slot{" "}
          {recommended + 1} (front-center). This is a suggestion, not a production
          requirement.
        </p>
      )}
    </div>
  );
}
