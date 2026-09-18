import type { Chocolate, ChocolateId } from "@/types";

/** Reserved catalog id for the corporate logo chocolate piece. */
export const BRANDED_CHOCOLATE_ID: ChocolateId = "branded-corporate-logo";

export function createBrandedChocolate(): Chocolate {
  return {
    id: BRANDED_CHOCOLATE_ID,
    name: "Branded Corporate Piece",
    description: "Milk chocolate disc imprinted with your uploaded logo.",
    flavor: "Branded",
    color: "#c4a574",
    isBranded: true,
  };
}

export function isBrandedChocolateId(id: ChocolateId | null): boolean {
  return id === BRANDED_CHOCOLATE_ID;
}

/**
 * Front-center suggestion: center slot of the front row (row 0).
 * Example from the hackathon brief — not a mandatory production rule.
 */
export function getRecommendedBrandedSlotIndex(rows: number, cols: number): number {
  void rows;
  return Math.floor(cols / 2);
}
