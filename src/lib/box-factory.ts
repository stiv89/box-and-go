import { BOX_SIZES } from "@/lib/constants";
import type { BoxSize, BoxSlot, ChocolateBox } from "@/types";

export function createEmptyBox(size: BoxSize): ChocolateBox {
  const { rows, cols } = BOX_SIZES[size];
  const slots: BoxSlot[] = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      slots.push({
        index: row * cols + col,
        row,
        col,
        chocolateId: null,
      });
    }
  }

  return { size, rows, cols, slots };
}
