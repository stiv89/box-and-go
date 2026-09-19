"use client";

import { X } from "lucide-react";

import { ChocolatePiece } from "@/features/product-experience/components/chocolate-piece";
import { cn } from "@/lib/utils";
import type { BoxSlot, Chocolate, ChocolateId } from "@/types";

/**
 * Reusable box grid — click-based today, designed for dnd-kit enhancement later.
 * Developer A (feature/box-builder) can wrap or replace slot interaction
 * without rewriting the builder page.
 */
export interface BoxSlotGridProps {
  rows: number;
  cols: number;
  slots: BoxSlot[];
  catalog: Chocolate[];
  selectedChocolateId: ChocolateId | null;
  focusedSlotIndex: number | null;
  onSlotActivate: (slotIndex: number) => void;
  onSlotClear: (slotIndex: number) => void;
  onSlotFocus: (slotIndex: number) => void;
  readOnly?: boolean;
  className?: string;
  variant?: "default" | "cavity";
  /** Front-center slot suggestion for branded piece (KAN-7). */
  recommendedSlotIndex?: number | null;
  /** Logo URL for rendering on branded chocolate pieces. */
  logoUrl?: string | null;
  /** Scale the piece relative to the cavity cell (compensates PNG padding). */
  pieceScale?: number;
  appearingSlotIndex?: number | null;
  appearingNonce?: number;
  columnGap?: string;
  rowGap?: string;
  /** Absolute cavity rectangles in % of the open-box image. */
  cavities?: readonly { left: number; top: number; width: number; height: number }[];
}

function findChocolate(catalog: Chocolate[], id: ChocolateId | null) {
  if (!id) return null;
  return catalog.find((item) => item.id === id) ?? null;
}

export function BoxSlotGrid({
  rows,
  cols,
  slots,
  catalog,
  selectedChocolateId,
  focusedSlotIndex,
  onSlotActivate,
  onSlotClear,
  onSlotFocus,
  readOnly = false,
  className,
  variant = "default",
  recommendedSlotIndex = null,
  logoUrl = null,
  columnGap,
  rowGap,
}: BoxSlotGridProps) {
  return (
    <div
      className={cn("grid gap-2", className)}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        columnGap,
        rowGap,
      }}
      role="group"
      aria-label={`Chocolate box grid, ${rows} by ${cols}`}
    >
      {slots.map((slot) => {
        const chocolate = findChocolate(catalog, slot.chocolateId);
        const isFocused = focusedSlotIndex === slot.index;
        const canPlace = Boolean(selectedChocolateId) && !readOnly;
        const isRecommended = recommendedSlotIndex === slot.index;
        const isEmpty = !chocolate;

        return (
          <div key={slot.index} className="relative">
            {isRecommended && isEmpty && (
              <span className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[var(--gold)]/90 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-[var(--chocolate-dark)]">
                Suggested
              </span>
            )}

            <button
              type="button"
              aria-label={
                chocolate
                  ? `Slot ${slot.index + 1}, ${chocolate.name}. Press to focus, use clear to remove.`
                  : `Empty slot ${slot.index + 1}. ${canPlace ? "Click to place selected chocolate." : "Select a chocolate first."}${isRecommended ? " Recommended for branded piece." : ""}`
              }
              aria-current={isFocused ? "true" : undefined}
              disabled={readOnly}
              onClick={() => onSlotActivate(slot.index)}
              onFocus={() => onSlotFocus(slot.index)}
              className={cn(
                "group relative flex aspect-square w-full items-center justify-center rounded-lg border transition-all outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
                variant === "cavity" &&
                  "rounded-[18%] border-transparent bg-transparent shadow-none",
                variant === "default" &&
                  (chocolate
                    ? "border-[var(--chocolate-light)] bg-[var(--cream-dark)]"
                    : "border-dashed border-[var(--chocolate-light)]/50 bg-[var(--cream)]"),
                isFocused && "ring-2 ring-[var(--gold)] ring-offset-1",
                isRecommended &&
                  isEmpty &&
                  (variant === "cavity"
                    ? "ring-1 ring-[var(--gold)]/70"
                    : "border-[var(--gold)]/70 bg-[var(--gold)]/5"),
                canPlace && !chocolate && "cursor-pointer hover:border-[var(--gold)]",
                canPlace && chocolate && "cursor-pointer hover:border-[var(--gold)]",
              )}
            >
              {chocolate ? (
                <ChocolatePiece
                  chocolate={chocolate}
                  size="md"
                  logoUrl={logoUrl}
                  className={variant === "cavity" ? "!size-[88%] !rounded-[18%]" : undefined}
                />
              ) : (
                <span className="text-[10px] text-muted-foreground/40">{slot.index + 1}</span>
              )}
            </button>

            {chocolate && !readOnly && (
              <button
                type="button"
                aria-label={`Remove ${chocolate.name} from slot ${slot.index + 1}`}
                onClick={(event) => {
                  event.stopPropagation();
                  onSlotClear(slot.index);
                }}
                className={cn(
                  "absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full",
                  "bg-[var(--chocolate)] text-[var(--cream)] shadow-sm",
                  "opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100",
                  "hover:bg-[var(--chocolate-dark)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                )}
              >
                <X className="size-3" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
