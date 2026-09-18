"use client";

import { BoxSlotGrid } from "@/features/product-experience/components/box-slot-grid";
import { BOX_SIZES, getRecommendedBrandedSlotIndex } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useBoxStore } from "@/stores/use-box-store";

interface BoxPreviewProps {
  interactive?: boolean;
  className?: string;
}

export function BoxPreview({ interactive = true, className }: BoxPreviewProps) {
  const boxSize = useBoxStore((s) => s.boxSize);
  const slots = useBoxStore((s) => s.slots);
  const catalog = useBoxStore((s) => s.catalog);
  const selectedChocolateId = useBoxStore((s) => s.selectedChocolateId);
  const focusedSlotIndex = useBoxStore((s) => s.focusedSlotIndex);
  const customization = useBoxStore((s) => s.customization);
  const setSlotChocolate = useBoxStore((s) => s.setSlotChocolate);
  const clearSlot = useBoxStore((s) => s.clearSlot);
  const setFocusedSlotIndex = useBoxStore((s) => s.setFocusedSlotIndex);

  const { rows, cols } = BOX_SIZES[boxSize];
  const ribbonColor = customization.ribbon.color;
  const logo = customization.logo;
  const cardMessage = customization.card.message.trim();

  function handleSlotActivate(slotIndex: number) {
    if (!interactive) return;
    setFocusedSlotIndex(slotIndex);
    if (selectedChocolateId) {
      setSlotChocolate(slotIndex, selectedChocolateId);
    }
  }

  return (
    <div className={cn("mx-auto w-full max-w-md", className)}>
      <div className="relative rounded-2xl border border-[var(--chocolate-light)]/30 bg-[var(--cream-dark)] p-6 shadow-[0_8px_30px_-12px_rgba(60,35,20,0.25)]">
        {/* Ribbon */}
        <div
          className="absolute left-1/2 top-0 h-8 w-24 -translate-x-1/2 -translate-y-1/2 rounded-sm shadow-md"
          style={{ backgroundColor: ribbonColor }}
          aria-hidden
        >
          <div
            className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45"
            style={{ backgroundColor: ribbonColor }}
          />
        </div>

        {/* Logo overlay */}
        {logo.url && (
          <div
            className="pointer-events-none absolute z-10"
            style={{
              left: `${50 + logo.x}%`,
              top: `${8 + logo.y}%`,
              transform: `translate(-50%, 0) scale(${logo.scale}) rotate(${logo.rotation}deg)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.url}
              alt="Corporate logo preview"
              className="max-h-12 max-w-[120px] object-contain drop-shadow-sm"
            />
          </div>
        )}

        <div className="mb-4 text-center">
          <p className="font-[family-name:var(--font-display)] text-sm tracking-wide text-[var(--chocolate-dark)]">
            Box &amp; Go
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {BOX_SIZES[boxSize].label}
          </p>
        </div>

        <BoxSlotGrid
          rows={rows}
          cols={cols}
          slots={slots}
          catalog={catalog}
          selectedChocolateId={selectedChocolateId}
          focusedSlotIndex={focusedSlotIndex}
          onSlotActivate={handleSlotActivate}
          onSlotClear={clearSlot}
          onSlotFocus={setFocusedSlotIndex}
          readOnly={!interactive}
          recommendedSlotIndex={
            logo.url ? getRecommendedBrandedSlotIndex(rows, cols) : null
          }
          logoUrl={logo.url}
        />

        {cardMessage && (
          <div className="mt-4 rounded-lg border border-[var(--chocolate-light)]/20 bg-card/80 px-3 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Card</p>
            <p
              className={cn(
                "mt-1 text-xs leading-relaxed text-[var(--chocolate-dark)]",
                customization.card.fontStyle === "serif"
                  ? "font-[family-name:var(--font-display)]"
                  : "font-sans",
              )}
            >
              {cardMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
