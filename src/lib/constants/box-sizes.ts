import type { BoxSize } from "@/types";

export interface BoxSizeDefinition {
  size: BoxSize;
  label: string;
  rows: number;
  cols: number;
}

export const BOX_SIZES: Record<BoxSize, BoxSizeDefinition> = {
  9: { size: 9, label: "9-piece (3×3)", rows: 3, cols: 3 },
  16: { size: 16, label: "16-piece (4×4)", rows: 4, cols: 4 },
};

export const DEFAULT_BOX_SIZE: BoxSize = 9;
