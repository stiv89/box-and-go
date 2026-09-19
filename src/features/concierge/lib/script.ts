import { DEMO_CHOCOLATES } from "@/data/demo-chocolates";
import { BOX_SIZES } from "@/lib/constants/box-sizes";
import {
  chocolatesMentioningNuts,
  chocolatesWithoutNutMentions,
  namesForProposal,
  nutAwareProposal,
  STARTER_16,
  STARTER_9,
  type ConciergeProposal,
} from "@/features/concierge/lib/proposals";

export type ConciergeIntent =
  | "greeting"
  | "size"
  | "catalog"
  | "nuts"
  | "coffee"
  | "branding"
  | "apply-9"
  | "apply-16"
  | "apply"
  | "fallback";

export interface ConciergeReply {
  text: string;
  proposal?: ConciergeProposal;
}

const CATALOG_LINES = DEMO_CHOCOLATES.map(
  (chocolate) => `• ${chocolate.name} — ${chocolate.description}`,
).join("\n");

export const CONCIERGE_WELCOME: ConciergeReply = {
  text: "I'm the Box & Go concierge — a scripted guide, not a live AI. I only use our real catalog and won't invent prices, stock, or ingredients.\n\nI can help you pick a size, choose flavors, explain branding, or apply a starter layout to the configurator after you confirm.",
};

export const CONCIERGE_CHIPS = [
  { label: "9 or 16 pieces?", intent: "size" as const },
  { label: "What's in the catalog?", intent: "catalog" as const },
  { label: "How does branding work?", intent: "branding" as const },
  { label: "Apply a 9-piece starter", intent: "apply-9" as const },
];

export function matchConciergeIntent(raw: string): ConciergeIntent {
  const query = raw.trim().toLowerCase();
  if (!query) return "fallback";
  if (/^(hi|hello|hey|hola)\b/.test(query)) return "greeting";
  if (/nut|allerg|hazelnut|pecan/.test(query)) return "nuts";
  if (/coffee|espresso/.test(query)) return "coffee";
  if (/logo|brand|ribbon|packag|card|imprim/.test(query)) return "branding";
  if (/16/.test(query) && /apply|starter|fill|layout|propose/.test(query)) {
    return "apply-16";
  }
  if (/9/.test(query) && /apply|starter|fill|layout|propose/.test(query)) {
    return "apply-9";
  }
  if (/16/.test(query) && /piece|box|size|vs|or/.test(query)) return "size";
  if (/9/.test(query) && /piece|box|size|vs|or/.test(query)) return "size";
  if (/9\s*or\s*16|16\s*or\s*9|box size|how many/.test(query)) return "size";
  if (/apply|starter|fill the box|propose|layout/.test(query)) return "apply";
  if (/catalog|flavor|recommend|what do you have|chocolates|menu/.test(query)) {
    return "catalog";
  }
  if (/size|piece/.test(query)) return "size";
  return "fallback";
}

export function replyForIntent(intent: ConciergeIntent): ConciergeReply {
  switch (intent) {
    case "greeting":
      return CONCIERGE_WELCOME;
    case "size":
      return {
        text: `We offer two sizes from the configurator:\n\n• ${BOX_SIZES[9].label} — a compact tasting box. Good for a first corporate sample.\n• ${BOX_SIZES[16].label} — more variety for a host or shared table.\n\nI can apply either layout with catalog pieces only. Which would you like?`,
      };
    case "catalog":
      return {
        text: `Here is the full catalog on file — ${DEMO_CHOCOLATES.length} pieces:\n\n${CATALOG_LINES}\n\nI can recommend from this list, but I won't add flavors that aren't here.`,
      };
    case "nuts": {
      const mentioned = chocolatesMentioningNuts()
        .map((chocolate) => chocolate.name)
        .join(", ");
      const safer = chocolatesWithoutNutMentions()
        .map((chocolate) => chocolate.name)
        .join(", ");
      return {
        text: `I don't have a certified allergen sheet — only the written descriptions.\n\nThese pieces mention nuts: ${mentioned}.\nThese do not mention nuts in the copy: ${safer}.\n\nIf you want, I can propose a 9-piece layout using only the second group. Please still confirm with your own dietary review.`,
        proposal: nutAwareProposal(),
      };
    }
    case "coffee": {
      const coffee = DEMO_CHOCOLATES.find((chocolate) =>
        /espresso|coffee/i.test(`${chocolate.name} ${chocolate.flavor} ${chocolate.description}`),
      );
      return {
        text: coffee
          ? `${coffee.name} is the coffee piece in the catalog: "${coffee.description}" I don't have other coffee SKUs on file.`
          : "I don't have a coffee piece listed in the catalog.",
      };
    }
    case "branding":
      return {
        text: "In Customize you can upload a logo (local preview only — it isn't saved after refresh), place it on the lid, and choose a ribbon color from the palette.\n\nIf you add a logo, a branded chocolate disc unlocks so you can preview that mark as a visual imprint mockup on one piece. It isn't a production-approved edible print. I can't place a logo for you from this chat because the file has to be uploaded in the builder.",
      };
    case "apply-9":
      return proposalReply(STARTER_9);
    case "apply-16":
      return proposalReply(STARTER_16);
    case "apply":
      return proposalReply(STARTER_9);
    default:
      return {
        text: "I can help with box size (9 or 16), the real flavor catalog, branding steps, or applying a starter layout to the configurator. What would you like to do?",
      };
  }
}

function proposalReply(proposal: ConciergeProposal): ConciergeReply {
  const names = namesForProposal(proposal);
  const unique = [...new Set(names)];
  return {
    text: `I can apply “${proposal.title}” to the configurator:\n\n• Size: ${BOX_SIZES[proposal.size].label}\n• Ribbon: ${proposal.ribbonLabel}\n• Pieces: ${unique.join(", ")}${proposal.size > unique.length ? " (repeated to fill the grid)" : ""}\n\nNothing changes until you confirm. This uses only catalog items — no prices or extra SKUs.`,
    proposal,
  };
}
