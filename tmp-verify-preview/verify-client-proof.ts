import { DEMO_CHOCOLATES } from "../src/data/demo-chocolates";
import { createEmptyBox } from "../src/lib/box-factory";
import { createBrandedChocolate } from "../src/lib/constants/branded-chocolate";
import { buildClientProofHtmlFromModel } from "../src/features/production/lib/build-client-proof";
import { renderNumberedSlotGridHtml } from "../src/features/production/lib/html-utils";
import { buildProductionSpecification } from "../src/features/production/lib/build-production-specification";
import { buildProofSheetModel } from "../src/features/production/lib/proof-sheet-model";
import { createDefaultCustomization, type BoxConfiguration } from "../src/types";

const catalog = [...DEMO_CHOCOLATES, createBrandedChocolate()];

function fill(size: 9 | 16, ids: Array<string | null>): BoxConfiguration {
  const box = createEmptyBox(size);
  return {
    box: {
      ...box,
      slots: box.slots.map((slot, index) => ({
        ...slot,
        chocolateId: ids[index] ?? null,
      })),
    },
    customization: {
      ...createDefaultCustomization(),
      packaging: { wrapStyle: "gift", giftNote: "" },
      ribbon: { color: "#6b2d3c", style: "burgundy" },
      card: { message: "Congratulations on the launch.", fontStyle: "serif" },
      logo: {
        url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
        x: 0,
        y: 0,
        scale: 1,
        rotation: 0,
      },
    },
    quantity: 12,
  };
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function checkSize(size: 9 | 16) {
  const ids = Array.from({ length: size }, (_, index) => DEMO_CHOCOLATES[index % DEMO_CHOCOLATES.length]!.id);
  // Duplicate flavor in slot 0 and 1; move "slot 5" piece by putting espresso in index 4 (slot 5).
  ids[0] = DEMO_CHOCOLATES[0]!.id;
  ids[1] = DEMO_CHOCOLATES[0]!.id;
  if (size === 9) {
    ids[4] = DEMO_CHOCOLATES[4]!.id; // slot 5 (1-based)
  } else {
    ids[4] = DEMO_CHOCOLATES[4]!.id;
    ids[15] = DEMO_CHOCOLATES[2]!.id;
  }

  const configuration = fill(size, ids);
  const spec = buildProductionSpecification(configuration, catalog);
  const model = buildProofSheetModel(configuration, spec, catalog);
  const html = buildClientProofHtmlFromModel(model);

  assert(model.cavities.length === size, `${size}: expected ${size} placed pieces`);
  for (const piece of model.cavities) {
    const specSlot = spec.slots.find((slot) => slot.slotIndex === piece.slotIndex);
    assert(specSlot, `${size}: missing spec slot ${piece.slotIndex}`);
    assert(specSlot.chocolateId === piece.chocolateId, `${size}: slot ${piece.slotIndex} id mismatch`);
    const marker = `data-slot-index="${piece.slotIndex}" data-chocolate-id="${piece.chocolateId}"`;
    assert(html.includes(marker), `${size}: HTML missing ${marker}`);
  }

  assert(html.includes("Your creation."), "missing title");
  assert(html.includes("Thoughtfully designed. Ready for your approval."), "missing subtitle");
  assert(html.includes("For review"), "missing for-review");
  assert(!html.includes("Approve"), "fake approve button");
  assert(html.includes("data-proof-ribbon=\"true\""), `${size}: gift should show ribbon`);
  assert(html.includes("/ribbons/burgundy.png") || html.includes("burgundy"), "burgundy ribbon asset");
  assert(html.includes("Congratulations on the launch."), "gift message");
  assert(!html.includes(spec.orderId), "client proof leaked order id");
  assert(html.includes("@media print"), "print css");
  assert(html.includes("page-break-inside: avoid"), "hero page-break");
  const duplicateId = DEMO_CHOCOLATES[0]!.id;
  const duplicateCount = ids.filter((id) => id === duplicateId).length;
  assert(
    model.selection.find((item) => item.chocolateId === duplicateId)?.quantity === duplicateCount,
    "duplicates",
  );

  const standard = fill(size, ids);
  standard.customization.packaging = { wrapStyle: "standard", giftNote: "" };
  const standardModel = buildProofSheetModel(
    standard,
    buildProductionSpecification(standard, catalog),
    catalog,
  );
  const standardHtml = buildClientProofHtmlFromModel(standardModel);
  assert(!standardHtml.includes("data-proof-ribbon=\"true\""), "standard wrap must omit ribbon");
  assert(standardHtml.includes("/boxes/standard-wrap.png"), "standard packaging asset");

  const corporate = fill(size, ids);
  corporate.customization.packaging = { wrapStyle: "corporate", giftNote: "" };
  const corporateModel = buildProofSheetModel(
    corporate,
    buildProductionSpecification(corporate, catalog),
    catalog,
  );
  const corporateHtml = buildClientProofHtmlFromModel(corporateModel);
  assert(!corporateHtml.includes("data-proof-ribbon=\"true\""), "corporate wrap must omit ribbon");
  assert(corporateHtml.includes("CORPORATE DESIGN PROOF"), "corporate kicker");
  assert(corporateHtml.includes("sleeve-logo"), `${size}: corporate logo overlay`);
  assert(corporateHtml.includes("/boxes/corporate-sleeve.png"), "corporate packaging asset");

  const numbered = renderNumberedSlotGridHtml(configuration, catalog);
  for (let index = 0; index < size; index += 1) {
    assert(numbered.includes(`data-slot-index="${index}"`), `numbered grid missing ${index}`);
    assert(numbered.includes(`<span class="prod-num">${index + 1}</span>`), `missing number ${index + 1}`);
  }

  return { size, html, model, spec };
}

const classic = checkSize(9);
const grand = checkSize(16);

console.log(
  JSON.stringify(
    {
      classicSlots: classic.model.cavities.map((piece) => [piece.slotIndex, piece.chocolateId]),
      grandSlots: grand.model.cavities.map((piece) => [piece.slotIndex, piece.chocolateId]),
      classicRibbon: classic.model.ribbonLabel,
      classicPackaging: classic.model.packagingId,
      specMatches9: classic.spec.slots.every(
        (slot) =>
          classic.model.cavities.find((piece) => piece.slotIndex === slot.slotIndex)?.chocolateId ===
          slot.chocolateId,
      ),
      specMatches16: grand.spec.slots.every(
        (slot) =>
          grand.model.cavities.find((piece) => piece.slotIndex === slot.slotIndex)?.chocolateId ===
          slot.chocolateId,
      ),
    },
    null,
    2,
  ),
);
