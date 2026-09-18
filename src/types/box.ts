import type { Customization } from "./customization";
import type { ChocolateId } from "./chocolate";

/** Supported box sizes: 3×3 (9) and 4×4 (16). */
export type BoxSize = 9 | 16;

export interface BoxSlot {
  index: number;
  row: number;
  col: number;
  chocolateId: ChocolateId | null;
}

export interface ChocolateBox {
  size: BoxSize;
  rows: number;
  cols: number;
  slots: BoxSlot[];
}

export interface BoxConfiguration {
  box: ChocolateBox;
  customization: Customization;
  quantity: number;
}
