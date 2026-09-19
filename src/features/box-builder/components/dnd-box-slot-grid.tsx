"use client";

import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { useEffect, useId, useState, type MouseEvent } from "react";

import type { BoxSlotGridProps } from "@/features/product-experience/components/box-slot-grid";
import { ChocolatePiece } from "@/features/product-experience/components/chocolate-piece";
import { cn } from "@/lib/utils";
import type { BoxSlot, Chocolate } from "@/types";

import { slotDragId, slotDropId, type DragSource, type DropTargetData } from "../lib/drag-data";

interface DndSlotProps
  extends Pick<
    BoxSlotGridProps,
    "onSlotActivate" | "onSlotClear" | "onSlotFocus" | "logoUrl" | "pieceScale"
  > {
  instanceId: string;
  slot: BoxSlot;
  chocolate: Chocolate | null;
  isFocused: boolean;
  isRecommended: boolean;
  canPlace: boolean;
  readOnly: boolean;
  dragActive: boolean;
  variant?: "default" | "cavity";
  isAppearing: boolean;
  appearingNonce: number;
  cavity?: { left: number; top: number; width: number; height: number };
}

function DndSlot({
  instanceId,
  slot,
  chocolate,
  isFocused,
  isRecommended,
  canPlace,
  readOnly,
  dragActive,
  variant = "default",
  logoUrl,
  pieceScale = 1,
  isAppearing,
  appearingNonce,
  cavity,
  onSlotActivate,
  onSlotClear,
  onSlotFocus,
}: DndSlotProps) {
  const isEmpty = !chocolate;
  const [fadingOut, setFadingOut] = useState(false);
  const isCavity = variant === "cavity";

  useEffect(() => {
    setFadingOut(false);
  }, [chocolate?.id]);

  const dropData: DropTargetData = { slotIndex: slot.index };
  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: slotDropId(instanceId, slot.index),
    data: dropData,
    disabled: readOnly,
  });

  const dragData: DragSource | undefined = chocolate
    ? { type: "slot", slotIndex: slot.index, chocolateId: chocolate.id }
    : undefined;
  const {
    setNodeRef: setDragRef,
    listeners,
    isDragging,
  } = useDraggable({
    id: slotDragId(instanceId, slot.index),
    data: dragData,
    disabled: readOnly || isEmpty,
  });

  function handleRemove(event: MouseEvent) {
    event.stopPropagation();
    if (isCavity) {
      setFadingOut(true);
      window.setTimeout(() => onSlotClear(slot.index), 200);
      return;
    }
    onSlotClear(slot.index);
  }

  const piecePercent = `${Math.round(pieceScale * 100)}%`;

  const cavityStyle = cavity
    ? {
        position: "absolute" as const,
        left: `${cavity.left}%`,
        top: `${cavity.top}%`,
        width: `${cavity.width}%`,
        height: `${cavity.height}%`,
      }
    : undefined;

  return (
    <div
      ref={setDropRef}
      className="group relative h-full w-full"
      style={cavityStyle}
      data-cavity-slot={slot.index}
      data-cavity-chocolate={chocolate?.id ?? ""}
    >
      {isRecommended && isEmpty && !isCavity && (
        <span className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[var(--gold)]/90 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-[var(--chocolate-dark)]">
          Suggested
        </span>
      )}

      <button
        type="button"
        aria-label={
          chocolate
            ? `Slot ${slot.index + 1}, ${chocolate.name}. Click to select, drag to rearrange, or click another slot to move.`
            : `Empty slot ${slot.index + 1}. ${canPlace ? "Click to move the selected piece here." : "Click a flavor to fill a cavity, or select a piece then click here to move it."}${isRecommended ? " Recommended for branded piece." : ""}`
        }
        aria-current={isFocused ? "true" : undefined}
        disabled={readOnly}
        onClick={() => onSlotActivate(slot.index)}
        onFocus={() => {
          if (!isCavity) onSlotFocus(slot.index);
        }}
        onKeyDown={(event) => {
          if (chocolate && (event.key === "Delete" || event.key === "Backspace")) {
            event.preventDefault();
            onSlotClear(slot.index);
          }
        }}
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-lg border transition-transform outline-none",
          !isCavity && "aspect-square",
          "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
          isCavity && "rounded-[22%] border-transparent bg-transparent shadow-none",
          variant === "default" &&
            (chocolate
              ? "border-[var(--chocolate-light)] bg-[var(--cream-dark)]"
              : "border-dashed border-[var(--chocolate-light)]/50 bg-[var(--cream)]"),
          isFocused && !isCavity && "ring-2 ring-[var(--gold)] ring-offset-1",
          isFocused && isCavity && "ring-1 ring-[var(--gold)]/80",
          isRecommended && isEmpty && isCavity && "ring-1 ring-[var(--gold)]/50",
          isRecommended &&
            isEmpty &&
            variant === "default" &&
            "border-[var(--gold)]/70 bg-[var(--gold)]/5",
          canPlace && "cursor-pointer",
          dragActive && !readOnly && !isCavity && "border-[var(--gold)]/50",
          isOver && "z-10 scale-[1.04]",
          "motion-reduce:transition-none motion-reduce:scale-100",
        )}
      >
        {chocolate ? (
          <span
            ref={setDragRef}
            {...listeners}
            className={cn(
              "absolute inset-0 flex select-none items-center justify-center",
              "cursor-grab",
              isDragging && "opacity-30",
            )}
          >
            <ChocolatePiece
              key={isAppearing ? `appear-${appearingNonce}` : chocolate.id}
              chocolate={chocolate}
              size="md"
              logoUrl={logoUrl}
              className={cn(
                isCavity ? "max-h-none max-w-none" : undefined,
                isAppearing &&
                  "motion-reduce:animate-none animate-in fade-in zoom-in-95 duration-200",
                fadingOut &&
                  "motion-reduce:animate-none animate-out fade-out zoom-out-95 duration-200",
              )}
              style={
                isCavity
                  ? { width: piecePercent, height: piecePercent }
                  : undefined
              }
            />
          </span>
        ) : (
          !isCavity && (
            <span className="text-[10px] text-muted-foreground/35">{slot.index + 1}</span>
          )
        )}
      </button>

      {chocolate && !readOnly && (
        <button
          type="button"
          aria-label={`Remove ${chocolate.name} from slot ${slot.index + 1}`}
          data-cavity-remove={slot.index}
          onClick={handleRemove}
          className={cn(
            "absolute z-20 flex items-center justify-center rounded-full",
            "bg-[var(--chocolate-dark)] text-[var(--cream)] shadow-sm",
            "opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
            isFocused && "opacity-100",
            isCavity
              ? "-right-[14%] -top-[14%] size-4 before:absolute before:-inset-3 before:content-[''] sm:size-[1.15rem]"
              : "-right-1.5 -top-1.5 size-5 before:absolute before:-inset-2.5 before:content-['']",
            "hover:bg-[var(--chocolate)] focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
          )}
        >
          <X className={isCavity ? "size-2.5" : "size-3"} />
        </button>
      )}
    </div>
  );
}

/**
 * Drop-in replacement for `BoxSlotGrid` — same props, plus drag & drop.
 *
 * Must render under `DndBuilderProvider` to enable dragging; without one it
 * behaves exactly like the click-based grid. Slots stay the source of truth in
 * the Zustand store: this component only reports interactions via the same
 * `onSlot*` callbacks.
 */
export function DndBoxSlotGrid({
  rows,
  cols,
  slots,
  catalog,
  selectedChocolateId: _selectedChocolateId,
  focusedSlotIndex,
  onSlotActivate,
  onSlotClear,
  onSlotFocus,
  readOnly = false,
  className,
  variant = "default",
  recommendedSlotIndex = null,
  logoUrl = null,
  pieceScale = 1,
  appearingSlotIndex = null,
  appearingNonce = 0,
  columnGap,
  rowGap,
  cavities,
}: BoxSlotGridProps) {
  const instanceId = useId();
  const { active } = useDndContext();
  const useCavities = Boolean(cavities?.length);

  return (
    <div
      className={cn(useCavities ? "relative" : "grid", className)}
      style={
        useCavities
          ? undefined
          : {
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
              columnGap,
              rowGap,
            }
      }
      role="group"
      aria-label={`Chocolate box grid, ${rows} by ${cols}`}
    >
      {slots.map((slot) => {
        const chocolate = slot.chocolateId
          ? (catalog.find((item) => item.id === slot.chocolateId) ?? null)
          : null;

        return (
          <DndSlot
            key={slot.index}
            instanceId={instanceId}
            slot={slot}
            chocolate={chocolate}
            isFocused={focusedSlotIndex === slot.index}
            isRecommended={recommendedSlotIndex === slot.index}
            canPlace={!readOnly}
            readOnly={readOnly}
            dragActive={active !== null}
            variant={variant}
            logoUrl={logoUrl}
            pieceScale={pieceScale}
            isAppearing={appearingSlotIndex === slot.index}
            appearingNonce={appearingNonce}
            cavity={cavities?.[slot.index]}
            onSlotActivate={onSlotActivate}
            onSlotClear={onSlotClear}
            onSlotFocus={onSlotFocus}
          />
        );
      })}
      <span className="sr-only" data-appearing-nonce={appearingNonce} />
    </div>
  );
}
