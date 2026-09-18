export type ChocolateId = string;

export interface Chocolate {
  id: ChocolateId;
  name: string;
  description: string;
  flavor: string;
  /** Hex color used for visual previews in the builder. */
  color: string;
  imageUrl?: string;
  /** True for the special corporate logo chocolate piece. */
  isBranded?: boolean;
}
