import type { BoxSlot, ChocolateId } from "@/types";
import type { DragSource } from "./drag-data";

export interface SlotWrite {
  slotIndex: number;
  chocolateId: ChocolateId | null;
}

export interface DropResolution {
  /** Applied in order through the store's `setSlotChocolate`. */
  writes: SlotWrite[];
  focusSlotIndex: number;
}

interface ResolveDropInput {
  slots: readonly Pick<BoxSlot, "index" | "chocolateId">[];
  catalogIds: readonly ChocolateId[];
  source: DragSource;
  targetSlotIndex: number;
}

/**
 * Pure drop rules. Returns `null` when the drop must be ignored (invalid slot,
 * unknown chocolate, or a drag that went stale because the box changed).
 *
 * - catalog → slot: places the piece, replacing whatever was there.
 * - slot → slot: swaps the two slots, so a move never duplicates or loses a
 *   piece and an empty target simply receives the piece.
 */
export function resolveDrop({
  slots,
  catalogIds,
  source,
  targetSlotIndex,
}: ResolveDropInput): DropResolution | null {
  const target = slots.find((slot) => slot.index === targetSlotIndex);
  if (!target) return null;

  if (source.type === "catalog") {
    if (!catalogIds.includes(source.chocolateId)) return null;
    if (target.chocolateId === source.chocolateId) {
      return { writes: [], focusSlotIndex: target.index };
    }
    return {
      writes: [{ slotIndex: target.index, chocolateId: source.chocolateId }],
      focusSlotIndex: target.index,
    };
  }

  const origin = slots.find((slot) => slot.index === source.slotIndex);
  if (!origin || origin.chocolateId !== source.chocolateId) return null;
  if (origin.index === target.index) return null;

  return {
    writes: [
      { slotIndex: target.index, chocolateId: origin.chocolateId },
      { slotIndex: origin.index, chocolateId: target.chocolateId },
    ],
    focusSlotIndex: target.index,
  };
}
