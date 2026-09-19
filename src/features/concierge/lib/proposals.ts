import { DEMO_CHOCOLATES } from "@/data/demo-chocolates";
import { RIBBON_COLORS } from "@/features/product-experience/constants/ribbon-colors";
import type { BoxSize, Chocolate } from "@/types";

export interface ConciergeProposal {
  id: string;
  title: string;
  size: BoxSize;
  chocolateIds: string[];
  ribbonColor: string;
  ribbonStyle: string;
  ribbonLabel: string;
}

const champagne = RIBBON_COLORS.find((r) => r.id === "champagne-gold")!;
const burgundy = RIBBON_COLORS.find((r) => r.id === "burgundy")!;

function idsForSize(size: BoxSize, pool: readonly Chocolate[]) {
  return Array.from({ length: size }, (_, index) => pool[index % pool.length]!.id);
}

export const STARTER_9: ConciergeProposal = {
  id: "starter-9",
  title: "9-piece tasting layout",
  size: 9,
  chocolateIds: idsForSize(9, DEMO_CHOCOLATES),
  ribbonColor: champagne.color,
  ribbonStyle: champagne.id,
  ribbonLabel: champagne.label,
};

export const STARTER_16: ConciergeProposal = {
  id: "starter-16",
  title: "16-piece host layout",
  size: 16,
  chocolateIds: idsForSize(16, DEMO_CHOCOLATES),
  ribbonColor: burgundy.color,
  ribbonStyle: burgundy.id,
  ribbonLabel: burgundy.label,
};

export function chocolatesMentioningNuts() {
  return DEMO_CHOCOLATES.filter((chocolate) =>
    /hazelnut|pecan|\bnut/i.test(`${chocolate.name} ${chocolate.description}`),
  );
}

export function chocolatesWithoutNutMentions() {
  const nutty = new Set(chocolatesMentioningNuts().map((chocolate) => chocolate.id));
  return DEMO_CHOCOLATES.filter((chocolate) => !nutty.has(chocolate.id));
}

export function nutAwareProposal(): ConciergeProposal {
  const pool = chocolatesWithoutNutMentions();
  return {
    id: "starter-9-no-nut-mentions",
    title: "9-piece without nut mentions",
    size: 9,
    chocolateIds: idsForSize(9, pool),
    ribbonColor: champagne.color,
    ribbonStyle: champagne.id,
    ribbonLabel: champagne.label,
  };
}

export function namesForProposal(proposal: ConciergeProposal) {
  return proposal.chocolateIds.map((id) => {
    const chocolate = DEMO_CHOCOLATES.find((item) => item.id === id);
    return chocolate?.name ?? id;
  });
}
