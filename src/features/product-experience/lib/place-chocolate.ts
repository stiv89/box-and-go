import { useBuilderSessionUi } from "@/features/product-experience/hooks/use-builder-session-ui";
import { isBrandedChocolateId } from "@/lib/constants";
import { notify } from "@/lib/notify";
import { USER_ERROR_BOX_FULL } from "@/lib/user-facing-error";
import { useBoxStore } from "@/stores/use-box-store";
import type { ChocolateId } from "@/types";

export type PlaceChocolateResult = "placed" | "full";

function randomEmptySlotIndex(emptyIndexes: number[]): number {
  const pick = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  return pick ?? emptyIndexes[0]!;
}

/**
 * Catalog click: always add into a random empty cavity. Never replaces a
 * focused slot — replacement is drag-swap or an explicit slot action.
 */
export function placeChocolateFromCatalog(chocolateId: ChocolateId): PlaceChocolateResult {
  const store = useBoxStore.getState();
  const ui = useBuilderSessionUi.getState();
  const { slots } = store;

  // One branded piece max: extra catalog clicks must not relocate it or steal
  // the next flavor add via leftover selection/focus.
  if (isBrandedChocolateId(chocolateId)) {
    const existing = slots.find((slot) => isBrandedChocolateId(slot.chocolateId));
    if (existing) {
      store.setSelectedChocolate(null);
      store.setFocusedSlotIndex(null);
      return "placed";
    }
  }

  const emptyIndexes = slots.filter((slot) => !slot.chocolateId).map((slot) => slot.index);
  if (emptyIndexes.length === 0) {
    ui.setBoxFullNotice(true);
    notify.warning(USER_ERROR_BOX_FULL);
    return "full";
  }

  const slotIndex = randomEmptySlotIndex(emptyIndexes);
  const filledBefore = slots.filter((slot) => slot.chocolateId).length;
  ui.setLastUndo({
    kind: "replace",
    slots: [{ slotIndex, previousId: null }],
  });
  store.setSlotChocolate(slotIndex, chocolateId);
  store.setSelectedChocolate(null);
  store.setFocusedSlotIndex(null);
  ui.markAppearing(slotIndex);
  ui.setBoxFullNotice(false);
  if (filledBefore === 0) {
    ui.showRearrangeTipOnce();
  }
  return "placed";
}

export function removeFocusedOrSlot(slotIndex: number) {
  const store = useBoxStore.getState();
  const ui = useBuilderSessionUi.getState();
  const current = store.slots.find((slot) => slot.index === slotIndex);
  if (!current?.chocolateId) return;

  ui.setLastUndo({
    kind: "remove",
    slots: [{ slotIndex, previousId: current.chocolateId }],
  });
  store.clearSlot(slotIndex);
  ui.setBoxFullNotice(false);
}

/** Remove one placed piece of this flavor (the highest-index match). */
export function removeOneOfFlavor(chocolateId: ChocolateId) {
  const store = useBoxStore.getState();
  const match = [...store.slots]
    .reverse()
    .find((slot) => slot.chocolateId === chocolateId);
  if (!match) return;
  removeFocusedOrSlot(match.index);
}

export function clearBox() {
  const store = useBoxStore.getState();
  const filled = store.slots.filter((slot) => slot.chocolateId);
  if (filled.length === 0) return;

  useBuilderSessionUi.getState().setLastUndo({
    kind: "clear",
    slots: filled.map((slot) => ({
      slotIndex: slot.index,
      previousId: slot.chocolateId,
    })),
  });

  for (const slot of filled) {
    store.setSlotChocolate(slot.index, null);
  }
  store.setFocusedSlotIndex(null);
  useBuilderSessionUi.getState().setBoxFullNotice(false);
}

export function undoLastBoxEdit() {
  const store = useBoxStore.getState();
  const ui = useBuilderSessionUi.getState();
  const action = ui.lastUndo;
  if (!action) return;

  for (const change of action.slots) {
    store.setSlotChocolate(change.slotIndex, change.previousId);
  }
  const focus = action.slots[0]?.slotIndex ?? null;
  store.setFocusedSlotIndex(focus);
  ui.setLastUndo(null);
  ui.setBoxFullNotice(false);
  if (focus !== null && action.slots[0]?.previousId) {
    ui.markAppearing(focus);
  }
}
