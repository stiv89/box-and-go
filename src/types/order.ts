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
  /** True when this slot holds the corporate logo chocolate. */
  isBranded?: boolean;
}

export interface ProductionSpecification {
  orderId: string;
  boxSize: BoxSize;
  slots: ProductionSlotSpec[];
  customization: Customization;
  quantity: number;
  generatedAt: string;
}
