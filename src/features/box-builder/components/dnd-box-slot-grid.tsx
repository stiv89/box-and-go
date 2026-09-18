"use client";

import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { useId } from "react";

import type { BoxSlotGridProps } from "@/features/product-experience/components/box-slot-grid";
import { ChocolatePiece } from "@/features/product-experience/components/chocolate-piece";
import { cn } from "@/lib/utils";
import type { BoxSlot, Chocolate } from "@/types";

import { slotDragId, slotDropId, type DragSource, type DropTargetData } from "../lib/drag-data";

interface DndSlotProps
  extends Pick<
    BoxSlotGridProps,
    "onSlotActivate" | "onSlotClear" | "onSlotFocus" | "logoUrl"
  > {
  instanceId: string;
  slot: BoxSlot;
  chocolate: Chocolate | null;
  isFocused: boolean;
  isRecommended: boolean;
  canPlace: boolean;
  readOnly: boolean;
  dragActive: boolean;
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
  logoUrl,
  onSlotActivate,
  onSlotClear,
  onSlotFocus,
}: DndSlotProps) {
  const isEmpty = !chocolate;

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

  return (
    <div ref={setDropRef} className="relative">
      {isRecommended && isEmpty && (
        <span className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 rounded-full bg-[var(--gold)]/90 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-[var(--chocolate-dark)]">
          Suggested
        </span>
      )}

      <button
        type="button"
        aria-label={
          chocolate
            ? `Slot ${slot.index + 1}, ${chocolate.name}. Press to focus, drag to move, use clear to remove.`
            : `Empty slot ${slot.index + 1}. ${canPlace ? "Click to place selected chocolate." : "Select a chocolate first, or drag one here."}${isRecommended ? " Recommended for branded piece." : ""}`
        }
        aria-current={isFocused ? "true" : undefined}
        disabled={readOnly}
        onClick={() => onSlotActivate(slot.index)}
        onFocus={() => onSlotFocus(slot.index)}
        onKeyDown={(event) => {
          if (chocolate && (event.key === "Delete" || event.key === "Backspace")) {
            event.preventDefault();
            onSlotClear(slot.index);
          }
        }}
        className={cn(
          "group relative flex aspect-square w-full items-center justify-center rounded-lg border transition-all outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
          chocolate
            ? "border-[var(--chocolate-light)] bg-[var(--cream-dark)]"
            : "border-dashed border-[var(--chocolate-light)]/50 bg-[var(--cream)]",
          isFocused && "ring-2 ring-[var(--gold)] ring-offset-1",
          isRecommended && isEmpty && "border-[var(--gold)]/70 bg-[var(--gold)]/5",
          canPlace && !chocolate && "cursor-pointer hover:border-[var(--gold)] hover:bg-[var(--cream-dark)]",
          canPlace && chocolate && "cursor-pointer hover:border-[var(--gold)]",
          dragActive && !readOnly && "border-[var(--gold)]/60",
          isOver && "scale-105 border-solid border-[var(--gold)] bg-[var(--gold)]/15 ring-2 ring-[var(--gold)]",
        )}
      >
        {chocolate ? (
          // The drag handle fills the whole slot, not just the piece, so the
          // padding around a piece is grabbable too.
          <span
            ref={setDragRef}
            {...listeners}
            className={cn(
              "absolute inset-0 flex select-none items-center justify-center",
              "cursor-grab",
              isDragging && "opacity-30",
            )}
          >
            <ChocolatePiece chocolate={chocolate} size="md" logoUrl={logoUrl} />
          </span>
        ) : (
          <span className="text-xs text-muted-foreground/60">{slot.index + 1}</span>
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
  selectedChocolateId,
  focusedSlotIndex,
  onSlotActivate,
  onSlotClear,
  onSlotFocus,
  readOnly = false,
  className,
  recommendedSlotIndex = null,
  logoUrl = null,
}: BoxSlotGridProps) {
  // The builder mounts two previews (mobile + desktop, one hidden by CSS), so
  // droppable ids must be unique per grid instance.
  const instanceId = useId();
  const { active } = useDndContext();

  return (
    <div
      className={cn("grid gap-2", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
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
            canPlace={Boolean(selectedChocolateId) && !readOnly}
            readOnly={readOnly}
            dragActive={active !== null}
            logoUrl={logoUrl}
            onSlotActivate={onSlotActivate}
            onSlotClear={onSlotClear}
            onSlotFocus={onSlotFocus}
          />
        );
      })}
    </div>
  );
}
