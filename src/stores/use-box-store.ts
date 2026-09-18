import { create } from "zustand";

import { DEMO_CHOCOLATES } from "@/data/demo-chocolates";
import { createEmptyBox } from "@/lib/box-factory";
import {
  BRANDED_CHOCOLATE_ID,
  createBrandedChocolate,
  DEFAULT_BOX_SIZE,
  getRecommendedBrandedSlotIndex,
  isBrandedChocolateId,
} from "@/lib/constants";
import type {
  BoxSize,
  CardConfiguration,
  Chocolate,
  ChocolateId,
  Customization,
  LogoConfiguration,
  PackagingPreferences,
  RibbonConfiguration,
} from "@/types";
import { createDefaultCustomization } from "@/types";

export interface BoxStoreState {
  boxSize: BoxSize;
  slots: ReturnType<typeof createEmptyBox>["slots"];
  quantity: number;
  catalog: Chocolate[];
  selectedChocolateId: ChocolateId | null;
  focusedSlotIndex: number | null;
  customization: Customization;
  setBoxSize: (size: BoxSize) => void;
  setSlotChocolate: (slotIndex: number, chocolateId: ChocolateId | null) => void;
  setQuantity: (quantity: number) => void;
  setSelectedChocolate: (id: ChocolateId | null) => void;
  setFocusedSlotIndex: (index: number | null) => void;
  clearSlot: (slotIndex: number) => void;
  updateLogo: (partial: Partial<LogoConfiguration>) => void;
  updateRibbon: (partial: Partial<RibbonConfiguration>) => void;
  updateCard: (partial: Partial<CardConfiguration>) => void;
  updatePackaging: (partial: Partial<PackagingPreferences>) => void;
  setLogoUrl: (url: string | null) => void;
  placeBrandedAtRecommended: () => void;
}

function catalogWithBranded(hasLogo: boolean): Chocolate[] {
  const base = DEMO_CHOCOLATES.filter((c) => !c.isBranded);
  return hasLogo ? [createBrandedChocolate(), ...base] : base;
}

function stripBrandedFromSlots(
  slots: BoxStoreState["slots"],
): BoxStoreState["slots"] {
  return slots.map((slot) =>
    isBrandedChocolateId(slot.chocolateId)
      ? { ...slot, chocolateId: null }
      : slot,
  );
}

export const useBoxStore = create<BoxStoreState>((set, get) => ({
  boxSize: DEFAULT_BOX_SIZE,
  slots: createEmptyBox(DEFAULT_BOX_SIZE).slots,
  quantity: 1,
  catalog: catalogWithBranded(false),
  selectedChocolateId: null,
  focusedSlotIndex: null,
  customization: createDefaultCustomization(),

  setBoxSize: (size) =>
    set((state) => ({
      boxSize: size,
      slots: createEmptyBox(size).slots,
      focusedSlotIndex: null,
      customization: {
        ...state.customization,
        brandedPlacement: { slotIndex: null },
      },
    })),

  setSlotChocolate: (slotIndex, chocolateId) =>
    set((state) => {
      const placingBranded = isBrandedChocolateId(chocolateId);

      let slots = state.slots.map((slot) =>
        slot.index === slotIndex ? { ...slot, chocolateId } : slot,
      );

      if (placingBranded && chocolateId) {
        slots = slots.map((slot) =>
          slot.index !== slotIndex && isBrandedChocolateId(slot.chocolateId)
            ? { ...slot, chocolateId: null }
            : slot,
        );
      }

      let brandedSlotIndex = state.customization.brandedPlacement.slotIndex;

      if (placingBranded && chocolateId) {
        brandedSlotIndex = slotIndex;
      } else if (chocolateId === null && brandedSlotIndex === slotIndex) {
        brandedSlotIndex = null;
      } else if (chocolateId !== null && !placingBranded && brandedSlotIndex === slotIndex) {
        brandedSlotIndex = null;
      }

      return {
        slots,
        customization: {
          ...state.customization,
          brandedPlacement: { slotIndex: brandedSlotIndex },
        },
      };
    }),

  setQuantity: (quantity) => set({ quantity: Math.max(1, quantity) }),

  setSelectedChocolate: (id) => set({ selectedChocolateId: id }),

  setFocusedSlotIndex: (index) => set({ focusedSlotIndex: index }),

  clearSlot: (slotIndex) => {
    get().setSlotChocolate(slotIndex, null);
    set({ focusedSlotIndex: slotIndex });
  },

  updateLogo: (partial) =>
    set((state) => ({
      customization: {
        ...state.customization,
        logo: { ...state.customization.logo, ...partial },
      },
    })),

  updateRibbon: (partial) =>
    set((state) => ({
      customization: {
        ...state.customization,
        ribbon: { ...state.customization.ribbon, ...partial },
      },
    })),

  updateCard: (partial) =>
    set((state) => ({
      customization: {
        ...state.customization,
        card: { ...state.customization.card, ...partial },
      },
    })),

  updatePackaging: (partial) =>
    set((state) => ({
      customization: {
        ...state.customization,
        packaging: { ...state.customization.packaging, ...partial },
      },
    })),

  setLogoUrl: (url) => {
    const state = get();
    if (!url) {
      set({
        catalog: catalogWithBranded(false),
        slots: stripBrandedFromSlots(state.slots),
        selectedChocolateId:
          state.selectedChocolateId === BRANDED_CHOCOLATE_ID
            ? null
            : state.selectedChocolateId,
        customization: {
          ...state.customization,
          logo: { ...state.customization.logo, url: null },
          brandedPlacement: { slotIndex: null },
        },
      });
      return;
    }

    get().updateLogo({ url });
    set({ catalog: catalogWithBranded(true) });
  },

  placeBrandedAtRecommended: () => {
    const state = get();
    if (!state.customization.logo.url) return;

    const box = createEmptyBox(state.boxSize);
    const recommended = getRecommendedBrandedSlotIndex(box.rows, box.cols);

    set({ selectedChocolateId: BRANDED_CHOCOLATE_ID });
    get().setSlotChocolate(recommended, BRANDED_CHOCOLATE_ID);
    set({ focusedSlotIndex: recommended });
  },
}));

/** Convenience selector for the full configuration shape. */
export function getBoxConfigurationFromStore(state: BoxStoreState) {
  const box = createEmptyBox(state.boxSize);
  return {
    box: { ...box, slots: state.slots },
    customization: state.customization,
    quantity: state.quantity,
  };
}

/** Recommended front-center slot for the current box size. */
export function getRecommendedBrandedSlotForState(state: BoxStoreState): number {
  const box = createEmptyBox(state.boxSize);
  return getRecommendedBrandedSlotIndex(box.rows, box.cols);
}
