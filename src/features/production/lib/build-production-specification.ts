import type {
  BoxConfiguration,
  Chocolate,
  ProductionChocolateBreakdown,
  ProductionSlotSpec,
  ProductionSpecification,
} from "@/types";

export interface BuildProductionSpecificationOptions {
  orderId?: string;
  generatedAt?: string;
}

/**
 * Pure conversion from the active box configuration into a ProductionSpecification.
 * No UI dependency — takes the same shape returned by getBoxConfigurationFromStore().
 */
export function buildProductionSpecification(
  configuration: BoxConfiguration,
  catalog: Chocolate[],
  options: BuildProductionSpecificationOptions = {},
): ProductionSpecification {
  const { box, customization, quantity } = configuration;
  const safeQuantity = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 0;
  const chocolateById = new Map(catalog.map((chocolate) => [chocolate.id, chocolate]));

  const slots: ProductionSlotSpec[] = [];
  const perBoxCounts = new Map<string, number>();

  for (const slot of box.slots) {
    if (!slot.chocolateId) continue;

    const chocolateName = chocolateById.get(slot.chocolateId)?.name ?? "Unknown chocolate";
    slots.push({
      slotIndex: slot.index,
      chocolateId: slot.chocolateId,
      chocolateName,
    });
    perBoxCounts.set(slot.chocolateId, (perBoxCounts.get(slot.chocolateId) ?? 0) + 1);
  }

  const chocolateBreakdown: ProductionChocolateBreakdown[] = Array.from(
    perBoxCounts.entries(),
  ).map(([chocolateId, perBox]) => ({
    chocolateId,
    chocolateName: chocolateById.get(chocolateId)?.name ?? "Unknown chocolate",
    perBox,
    total: perBox * safeQuantity,
  }));

  const totalChocolates = chocolateBreakdown.reduce((sum, item) => sum + item.total, 0);

  return {
    orderId: options.orderId ?? generateOrderId(),
    boxSize: box.size,
    slots,
    customization,
    quantity: safeQuantity,
    chocolateBreakdown,
    totalChocolates,
    generatedAt: options.generatedAt ?? new Date().toISOString(),
  };
}

function generateOrderId(): string {
  return `order-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
