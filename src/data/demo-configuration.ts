import { DEMO_CHOCOLATES } from "@/data/demo-chocolates";
import { createEmptyBox } from "@/lib/box-factory";
import type { BoxStoreState } from "@/stores/use-box-store";

/**
 * Sample corporate order for hackathon demos and QA (KAN-11 / KAN-12).
 * Does not include a logo — upload one live to demonstrate branding.
 */
export function applyHackathonDemoConfiguration(
  store: Pick<
    BoxStoreState,
    "setBoxSize" | "setSlotChocolate" | "setQuantity" | "updateRibbon" | "updateCard" | "updatePackaging"
  >,
) {
  store.setBoxSize(16);
  const box = createEmptyBox(16);

  box.slots.forEach((slot, index) => {
    const chocolate = DEMO_CHOCOLATES[index % DEMO_CHOCOLATES.length];
    store.setSlotChocolate(slot.index, chocolate.id);
  });

  store.setQuantity(500);
  store.updateRibbon({ color: "#b8956b", style: "champagne-gold" });
  store.updateCard({
    message: "With gratitude from our team — enjoy every piece.",
    fontStyle: "serif",
  });
  store.updatePackaging({ wrapStyle: "corporate", giftNote: "Corporate gifting order" });
}
