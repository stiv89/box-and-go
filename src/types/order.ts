import type { BoxSize, BoxConfiguration } from "./box";
import type { Customization } from "./customization";
import type { ChocolateId } from "./chocolate";

export type OrderStatus = "draft" | "submitted" | "in_production" | "completed";

export interface CorporateOrder {
  id: string;
  companyName: string;
  contactEmail: string;
  configuration: BoxConfiguration;
  createdAt: string;
  status: OrderStatus;
}

export interface ProductionSlotSpec {
  slotIndex: number;
  chocolateId: ChocolateId;
  chocolateName: string;
}

export interface ProductionChocolateBreakdown {
  chocolateId: ChocolateId;
  chocolateName: string;
  /** Quantity of this chocolate in a single box. */
  perBox: number;
  /** Quantity of this chocolate across the full order (perBox * quantity). */
  total: number;
}

export interface ProductionSpecification {
  orderId: string;
  boxSize: BoxSize;
  slots: ProductionSlotSpec[];
  customization: Customization;
  quantity: number;
  chocolateBreakdown: ProductionChocolateBreakdown[];
  totalChocolates: number;
  generatedAt: string;
}
