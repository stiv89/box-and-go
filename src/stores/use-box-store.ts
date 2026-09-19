"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { DEMO_CHOCOLATES } from "@/data/demo-chocolates";
import { RIBBON_COLORS } from "@/features/product-experience/constants";
import {
  isPublicCatalogId,
  type PublicSharePayload,
} from "@/features/product-experience/lib/share-config";
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
  applyPublicShareConfig: (payload: PublicSharePayload) => void;
  resetBox: () => void;
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

const SESSION_KEY = "box-and-go-builder-session";

export const useBoxStore = create<BoxStoreState>()(
  persist(
    (set, get) => ({
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

    set({
      catalog: catalogWithBranded(true),
      selectedChocolateId:
        state.selectedChocolateId === BRANDED_CHOCOLATE_ID
          ? null
          : state.selectedChocolateId,
      customization: {
        ...state.customization,
        logo: { ...state.customization.logo, url },
      },
    });
  },

  placeBrandedAtRecommended: () => {
    const state = get();
    if (!state.customization.logo.url) return;

    const box = createEmptyBox(state.boxSize);
    const recommended = getRecommendedBrandedSlotIndex(box.rows, box.cols);
    const occupant =
      state.slots.find((slot) => slot.index === recommended)?.chocolateId ?? null;
    const brandedFrom =
      state.slots.find((slot) => isBrandedChocolateId(slot.chocolateId))?.index ??
      null;

    if (brandedFrom === recommended) {
      set({ selectedChocolateId: null, focusedSlotIndex: null });
      return;
    }

    const occupantIsOther = occupant !== null && !isBrandedChocolateId(occupant);
    let occupantDest: number | null = null;
    if (occupantIsOther) {
      occupantDest =
        brandedFrom !== null
          ? brandedFrom
          : (state.slots.find(
              (slot) => slot.chocolateId === null && slot.index !== recommended,
            )?.index ?? null);
      if (occupantDest === null) {
        set({ selectedChocolateId: null, focusedSlotIndex: null });
        return;
      }
    }

    get().setSlotChocolate(recommended, BRANDED_CHOCOLATE_ID);
    if (occupantIsOther && occupantDest !== null && occupantDest !== recommended) {
      get().setSlotChocolate(occupantDest, occupant);
    }
    set({ selectedChocolateId: null, focusedSlotIndex: null });
  },

  applyPublicShareConfig: (payload) => {
    const box = createEmptyBox(payload.s);
    const giftRibbon =
      payload.p === "gift" && payload.r
        ? RIBBON_COLORS.find((option) => option.id === payload.r)
        : undefined;

    set((state) => ({
      boxSize: payload.s,
      quantity: payload.q && payload.q > 0 ? payload.q : 1,
      slots: box.slots.map((slot, index) => {
        const rawId = payload.i[index] ?? "";
        const chocolateId = isPublicCatalogId(rawId) ? rawId : null;
        return { ...slot, chocolateId };
      }),
      selectedChocolateId: null,
      focusedSlotIndex: null,
      catalog: catalogWithBranded(false),
      customization: {
        ...state.customization,
        logo: { ...state.customization.logo, url: null },
        ribbon: giftRibbon
          ? { color: giftRibbon.color, style: giftRibbon.id }
          : state.customization.ribbon,
        card: {
          ...state.customization.card,
          message: payload.m ?? "",
        },
        packaging: {
          ...state.customization.packaging,
          wrapStyle: payload.p,
        },
        brandedPlacement: { slotIndex: null },
      },
    }));
  },

  resetBox: () => {
    const url = get().customization.logo.url;
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
    set({
      boxSize: DEFAULT_BOX_SIZE,
      slots: createEmptyBox(DEFAULT_BOX_SIZE).slots,
      quantity: 1,
      catalog: catalogWithBranded(false),
      selectedChocolateId: null,
      focusedSlotIndex: null,
      customization: createDefaultCustomization(),
    });
  },
    }),
    {
      name: SESSION_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return sessionStorage;
      }),
      partialize: (state) => ({
        boxSize: state.boxSize,
        slots: state.slots,
        quantity: state.quantity,
        customization: state.customization,
      }),
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = persisted as Partial<BoxStoreState> | undefined;
        if (!saved) return current;
        const customization = saved.customization ?? current.customization;
        const logoUrl = customization.logo?.url ?? null;
        const safeLogo =
          logoUrl && (logoUrl.startsWith("data:image/") || logoUrl.startsWith("/"))
            ? logoUrl
            : null;
        const nextCustomization = {
          ...current.customization,
          ...customization,
          logo: { ...current.customization.logo, ...customization.logo, url: safeLogo },
        };
        return {
          ...current,
          boxSize: saved.boxSize ?? current.boxSize,
          slots: saved.slots ?? current.slots,
          quantity: saved.quantity ?? current.quantity,
          customization: nextCustomization,
          catalog: catalogWithBranded(Boolean(safeLogo)),
        };
      },
    },
  ),
);

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
