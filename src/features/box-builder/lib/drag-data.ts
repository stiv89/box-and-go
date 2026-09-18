import type { ChocolateId } from "@/types";

/** What is being dragged: a catalog piece, or a piece already placed in a slot. */
export type DragSource =
  | { type: "catalog"; chocolateId: ChocolateId }
  | { type: "slot"; slotIndex: number; chocolateId: ChocolateId };

/** Payload carried by every slot drop zone. */
export interface DropTargetData {
  slotIndex: number;
}

export function catalogDragId(chocolateId: ChocolateId) {
  return `catalog:${chocolateId}`;
}

export function slotDragId(instanceId: string, slotIndex: number) {
  return `${instanceId}:slot-piece:${slotIndex}`;
}

export function slotDropId(instanceId: string, slotIndex: number) {
  return `${instanceId}:slot-drop:${slotIndex}`;
}

/** dnd-kit types `data.current` as `any`; validate before trusting it. */
export function readDragSource(data: unknown): DragSource | null {
  if (typeof data !== "object" || data === null) return null;
  const candidate = data as Record<string, unknown>;

  if (typeof candidate.chocolateId !== "string") return null;
  if (candidate.type === "catalog") {
    return { type: "catalog", chocolateId: candidate.chocolateId };
  }
  if (candidate.type === "slot" && Number.isInteger(candidate.slotIndex)) {
    return {
      type: "slot",
      slotIndex: candidate.slotIndex as number,
      chocolateId: candidate.chocolateId,
    };
  }
  return null;
}

export function readDropTarget(data: unknown): DropTargetData | null {
  if (typeof data !== "object" || data === null) return null;
  const { slotIndex } = data as Record<string, unknown>;
  return Number.isInteger(slotIndex) ? { slotIndex: slotIndex as number } : null;
}
