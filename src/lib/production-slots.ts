import {
  BRANDED_CHOCOLATE_ID,
  isBrandedChocolateId,
} from "@/lib/constants";
import type { BoxStoreState } from "@/stores/use-box-store";
import type { ProductionSlotSpec } from "@/types";

/** Builds production-ready slot specs from store state (for export module). */
export function buildProductionSlotsFromStore(
  state: Pick<BoxStoreState, "slots" | "catalog">,
): ProductionSlotSpec[] {
  return state.slots
    .filter((slot) => slot.chocolateId !== null)
    .map((slot) => {
      const chocolate = state.catalog.find((c) => c.id === slot.chocolateId);
      const branded = isBrandedChocolateId(slot.chocolateId);
      return {
        slotIndex: slot.index,
        chocolateId: slot.chocolateId!,
        chocolateName: branded
          ? "Branded Corporate Piece"
          : (chocolate?.name ?? "Unknown"),
        isBranded: branded || undefined,
      };
    });
}

export { BRANDED_CHOCOLATE_ID };
