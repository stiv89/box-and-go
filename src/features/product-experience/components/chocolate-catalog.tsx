"use client";

import { Sparkles, X } from "lucide-react";

import { BrandedImprintCaption } from "@/features/product-experience/components/branded-chocolate-piece";
import { ChocolatePiece } from "@/features/product-experience/components/chocolate-piece";
import { useBuilderSessionUi } from "@/features/product-experience/hooks/use-builder-session-ui";
import { useLogoPalette } from "@/features/product-experience/hooks/use-logo-palette";
import {
  placeChocolateFromCatalog,
  removeOneOfFlavor,
} from "@/features/product-experience/lib/place-chocolate";
import { cn } from "@/lib/utils";
import { useBoxStore } from "@/stores/use-box-store";
import type { Chocolate } from "@/types";

function CatalogCard({
  chocolate,
  logoUrl,
  quantity,
  suggested = false,
}: {
  chocolate: Chocolate;
  logoUrl: string | null;
  quantity: number;
  suggested?: boolean;
}) {
  const filled = useBoxStore((s) => s.slots.filter((slot) => slot.chocolateId).length);
  const boxSize = useBoxStore((s) => s.boxSize);
  const isFull = filled >= boxSize;

  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => placeChocolateFromCatalog(chocolate.id)}
        data-catalog-id={chocolate.id}
        aria-label={
          isFull
            ? `${chocolate.name}. Box is full.`
            : `Add ${chocolate.name} to a random empty cavity`
        }
        className={cn(
          "flex w-full flex-col items-center rounded-xl border bg-[var(--cream)] px-1.5 pb-2 pt-1.5 text-center transition-all outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
          "hover:-translate-y-0.5 hover:shadow-[0_6px_16px_rgba(60,40,20,0.08)]",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
          chocolate.isBranded && "border-[var(--gold)]/45",
          suggested && !chocolate.isBranded && "border-[var(--gold)]/30",
          quantity > 0
            ? "border-[var(--chocolate-light)]/55 bg-[var(--cream-dark)]/70"
            : "border-[var(--chocolate-light)]/25 hover:border-[var(--chocolate-light)]/50",
          isFull && "cursor-not-allowed opacity-60 hover:translate-y-0 hover:shadow-none",
        )}
      >
        <div className="relative aspect-square w-full">
          <ChocolatePiece
            chocolate={chocolate}
            size="lg"
            logoUrl={logoUrl}
            className="!size-full"
          />
          {suggested && quantity === 0 && (
            <span
              aria-label="Suggested for this logo"
              className="absolute left-0.5 top-0.5 size-1.5 rounded-full bg-[var(--gold)] shadow-sm"
            />
          )}
          {quantity > 0 && (
            <span className="absolute right-0.5 top-0.5 flex size-5 items-center justify-center rounded-full bg-[var(--chocolate-dark)] text-[10px] font-medium text-[var(--cream)] shadow-sm">
              {quantity}
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-2 min-h-[2rem] text-[11px] font-medium leading-tight text-[var(--chocolate-dark)]">
          {chocolate.name}
        </p>
        <p className="truncate text-[10px] text-muted-foreground">
          {chocolate.isBranded ? "Visual mockup" : chocolate.flavor}
        </p>
      </button>
      {quantity > 0 && (
        <button
          type="button"
          data-catalog-remove={chocolate.id}
          aria-label={`Remove one ${chocolate.name} from the box`}
          onClick={(event) => {
            event.stopPropagation();
            removeOneOfFlavor(chocolate.id);
          }}
          className={cn(
            "absolute -right-1 -top-1 z-10 flex size-5 items-center justify-center rounded-full",
            "before:absolute before:-inset-2.5 before:content-['']",
            "bg-[var(--chocolate-dark)] text-[var(--cream)] shadow-sm",
            "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
            "hover:bg-[var(--chocolate)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
          )}
        >
          <X className="size-3" />
        </button>
      )}
    </div>
  );
}

export function ChocolateCatalog({ compact = false }: { compact?: boolean }) {
  const catalog = useBoxStore((s) => s.catalog);
  const slots = useBoxStore((s) => s.slots);
  const logoUrl = useBoxStore((s) => s.customization.logo.url);
  const { colors, suggestions } = useLogoPalette();
  const suggestedIds = new Set(suggestions.map((chocolate) => chocolate.id));
  const regularChocolates = catalog.filter((c) => !c.isBranded);
  const brandedChocolates = catalog.filter((c) => c.isBranded);

  const quantities = new Map<string, number>();
  for (const slot of slots) {
    if (!slot.chocolateId) continue;
    quantities.set(slot.chocolateId, (quantities.get(slot.chocolateId) ?? 0) + 1);
  }

  if (catalog.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--chocolate-light)]/40 p-4 text-center text-sm text-muted-foreground">
        No chocolates available in the catalog.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {!compact && (
        <div>
          <h2 className="text-lg font-semibold">Chocolates</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Click a flavor to add it to your box.
          </p>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-medium tracking-[0.12em] text-neutral-400 uppercase">
            Suggested for this logo
          </span>
          {colors.map((color) => (
            <span
              key={color}
              className="size-2.5 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: color }}
              aria-hidden
            />
          ))}
          {suggestions.map((chocolate) => (
            <button
              key={chocolate.id}
              type="button"
              onClick={() => placeChocolateFromCatalog(chocolate.id)}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--chocolate-light)]/30 bg-white/70 px-2 py-0.5 text-[10px] text-[var(--chocolate-dark)] hover:border-[var(--gold)]/50 hover:bg-[var(--cream)]"
            >
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: chocolate.color }}
                aria-hidden
              />
              {chocolate.name}
            </button>
          ))}
        </div>
      )}

      {brandedChocolates.length > 0 && (
        <div className="space-y-1.5">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {brandedChocolates.map((chocolate) => (
              <CatalogCard
                key={chocolate.id}
                chocolate={chocolate}
                logoUrl={logoUrl}
                quantity={quantities.get(chocolate.id) ?? 0}
              />
            ))}
          </div>
          <BrandedImprintCaption />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {regularChocolates.map((chocolate) => (
          <CatalogCard
            key={chocolate.id}
            chocolate={chocolate}
            logoUrl={logoUrl}
            quantity={quantities.get(chocolate.id) ?? 0}
            suggested={suggestedIds.has(chocolate.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function BrandedUnlockNote() {
  const logoUrl = useBoxStore((s) => s.customization.logo.url);
  if (logoUrl) return null;
  return (
    <p className="rounded-xl border border-dashed border-[var(--chocolate-light)]/40 bg-[var(--cream)]/50 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
      Upload a logo in <strong>Make it yours</strong> to unlock the branded corporate piece.
    </p>
  );
}

export function PlaceBrandedHint() {
  const logoUrl = useBoxStore((s) => s.customization.logo.url);
  const placeBrandedAtRecommended = useBoxStore((s) => s.placeBrandedAtRecommended);
  const brandedSlot = useBoxStore((s) => s.customization.brandedPlacement.slotIndex);

  if (!logoUrl) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const filledBefore = useBoxStore.getState().slots.filter((slot) => slot.chocolateId).length;
        placeBrandedAtRecommended();
        const slot = useBoxStore.getState().customization.brandedPlacement.slotIndex;
        if (slot === null) return;
        const ui = useBuilderSessionUi.getState();
        ui.markAppearing(slot);
        if (filledBefore === 0) ui.showRearrangeTipOnce();
      }}
      className={cn(
        "inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[var(--gold)]/35 bg-[var(--gold)]/10 px-3 py-2 text-[11px] text-[var(--chocolate-dark)]",
        "hover:bg-[var(--gold)]/16 focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
      )}
    >
      <Sparkles className="size-3.5" />
      {brandedSlot === null
        ? "Place branded piece at front-center"
        : "Move branded piece to front-center"}
    </button>
  );
}
