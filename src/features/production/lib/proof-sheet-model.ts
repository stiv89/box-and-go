import {
  getRibbonOption,
  PACKAGING_OPTIONS,
} from "@/features/product-experience/constants";
import {
  BRAND_LOGO_SRC,
  BUILDER_VISUALS,
  BOX_SIZES,
  OPEN_CAVITY_LAYOUT,
  OPEN_TRAY_INSET,
  type CavityRect,
} from "@/lib/constants";
import type { BoxConfiguration, Chocolate, ProductionSpecification } from "@/types";
import { getActiveCustomization } from "@/types";

export const BOX_COLLECTION_NAMES: Record<9 | 16, string> = {
  9: "The Classic",
  16: "The Grand",
};

export interface ProofCavityPiece {
  slotIndex: number;
  chocolateId: string;
  name: string;
  imageUrl: string;
  isBranded: boolean;
  cavity: CavityRect;
  pieceScale: number;
}

export interface ProofSelectionItem {
  chocolateId: string;
  name: string;
  quantity: number;
  imageUrl: string;
  isBranded: boolean;
}

export interface ProofSheetModel {
  boxSize: 9 | 16;
  boxName: string;
  filledCount: number;
  capacity: number;
  kicker: "CORPORATE DESIGN PROOF" | "READY FOR APPROVAL";
  packagingId: string;
  packagingLabel: string;
  packagingSrc: string;
  ribbonLabel: string | null;
  ribbonSrc: string | null;
  sleeveLogoUrl: string | null;
  sleeveLogoX: number;
  sleeveLogoY: number;
  sleeveLogoScale: number;
  sleeveLogoRotation: number;
  openTraySrc: string;
  brandLogoSrc: string;
  customerLogoSrc: string | null;
  cavities: ProofCavityPiece[];
  selection: ProofSelectionItem[];
  cardMessage: string;
  quantity: number;
  brandingLine: string | null;
}

export function buildProofSheetModel(
  configuration: BoxConfiguration,
  spec: ProductionSpecification,
  catalog: Chocolate[],
): ProofSheetModel {
  const boxSize = configuration.box.size;
  if (boxSize !== spec.boxSize) {
    throw new Error("Proof and production specification box sizes do not match.");
  }

  const chocolateById = new Map(catalog.map((chocolate) => [chocolate.id, chocolate]));
  const cavitiesLayout = OPEN_CAVITY_LAYOUT[boxSize];
  if (cavitiesLayout.length !== boxSize) {
    throw new Error("Open tray cavity layout does not match the selected box size.");
  }
  const pieceScale = OPEN_TRAY_INSET[boxSize].pieceScale;
  const active = getActiveCustomization(configuration.customization);
  const packaging =
    PACKAGING_OPTIONS.find((option) => option.id === active.wrapStyle) ?? PACKAGING_OPTIONS[0]!;

  const cavities: ProofCavityPiece[] = [];
  const selectionOrder: ProofSelectionItem[] = [];
  const selectionIndex = new Map<string, number>();

  for (const slot of configuration.box.slots) {
    if (!slot.chocolateId) continue;

    const specSlot = spec.slots.find((entry) => entry.slotIndex === slot.index);
    if (!specSlot || specSlot.chocolateId !== slot.chocolateId) {
      throw new Error("Proof slots do not match the production specification.");
    }

    const chocolate = chocolateById.get(slot.chocolateId);
    const imageUrl = chocolate?.imageUrl;
    if (!chocolate || !imageUrl) {
      throw new Error("Every placed chocolate needs a product photo before the proof can be built.");
    }

    const cavity = cavitiesLayout[slot.index];
    if (!cavity) {
      throw new Error("Box layout is missing a cavity for a placed piece.");
    }

    cavities.push({
      slotIndex: slot.index,
      chocolateId: chocolate.id,
      name: chocolate.name,
      imageUrl,
      isBranded: Boolean(chocolate.isBranded),
      cavity,
      pieceScale,
    });

    const existing = selectionIndex.get(chocolate.id);
    if (existing === undefined) {
      selectionIndex.set(chocolate.id, selectionOrder.length);
      selectionOrder.push({
        chocolateId: chocolate.id,
        name: chocolate.name,
        quantity: 1,
        imageUrl,
        isBranded: Boolean(chocolate.isBranded),
      });
    } else {
      const row = selectionOrder[existing];
      if (row) row.quantity += 1;
    }
  }

  if (cavities.length === 0) {
    throw new Error("Add chocolates before building a client proof.");
  }

  const ribbon = active.ribbonApplied && active.ribbon ? getRibbonOption(active.ribbon) : null;
  const customerLogoSrc = configuration.customization.logo.url;
  const sleeveLogo = active.sleeveLogo;

  return {
    boxSize,
    boxName: BOX_COLLECTION_NAMES[boxSize],
    filledCount: cavities.length,
    capacity: BOX_SIZES[boxSize].size,
    kicker: active.wrapStyle === "corporate" ? "CORPORATE DESIGN PROOF" : "READY FOR APPROVAL",
    packagingId: packaging.id,
    packagingLabel: packaging.label,
    packagingSrc: packaging.src,
    ribbonLabel: ribbon?.label ?? null,
    ribbonSrc: ribbon?.src ?? null,
    sleeveLogoUrl: sleeveLogo?.url ?? null,
    sleeveLogoX: sleeveLogo?.x ?? 0,
    sleeveLogoY: sleeveLogo?.y ?? 0,
    sleeveLogoScale: sleeveLogo?.scale ?? 1,
    sleeveLogoRotation: sleeveLogo?.rotation ?? 0,
    openTraySrc: boxSize === 16 ? BUILDER_VISUALS.open16 : BUILDER_VISUALS.open9,
    brandLogoSrc: BRAND_LOGO_SRC,
    customerLogoSrc,
    cavities,
    selection: selectionOrder,
    cardMessage: configuration.customization.card.message.trim(),
    quantity: spec.quantity,
    brandingLine: active.sleeveLogoApplied ? "Corporate sleeve branding" : null,
  };
}
