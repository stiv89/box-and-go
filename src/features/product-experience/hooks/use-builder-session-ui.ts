import { create } from "zustand";

import type { ChocolateId } from "@/types";

export type UndoKind = "remove" | "replace" | "clear" | "removeFlavor";

export interface UndoSlot {
  slotIndex: number;
  previousId: ChocolateId | null;
}

export interface UndoAction {
  kind: UndoKind;
  slots: UndoSlot[];
}

interface BuilderSessionUi {
  boxFullNotice: boolean;
  rearrangeTipVisible: boolean;
  rearrangeTipConsumed: boolean;
  lastUndo: UndoAction | null;
  appearingSlotIndex: number | null;
  appearingNonce: number;
  setBoxFullNotice: (visible: boolean) => void;
  showRearrangeTipOnce: () => void;
  dismissRearrangeTip: () => void;
  setLastUndo: (action: UndoAction | null) => void;
  markAppearing: (slotIndex: number) => void;
  clearAppearing: () => void;
}

export const useBuilderSessionUi = create<BuilderSessionUi>((set, get) => ({
  boxFullNotice: false,
  rearrangeTipVisible: false,
  rearrangeTipConsumed: false,
  lastUndo: null,
  appearingSlotIndex: null,
  appearingNonce: 0,

  setBoxFullNotice: (visible) => set({ boxFullNotice: visible }),

  showRearrangeTipOnce: () => {
    if (get().rearrangeTipConsumed) return;
    set({ rearrangeTipVisible: true, rearrangeTipConsumed: true });
  },

  dismissRearrangeTip: () => set({ rearrangeTipVisible: false }),

  setLastUndo: (action) => set({ lastUndo: action }),

  markAppearing: (slotIndex) =>
    set((state) => ({
      appearingSlotIndex: slotIndex,
      appearingNonce: state.appearingNonce + 1,
    })),

  clearAppearing: () => set({ appearingSlotIndex: null }),
}));
