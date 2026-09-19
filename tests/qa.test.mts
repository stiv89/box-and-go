import assert from "node:assert/strict";
import test from "node:test";

import { resolveDrop } from "../src/features/box-builder/lib/resolve-drop.ts";
import { isPresentableCheckoutSuccess } from "../src/features/product-experience/lib/checkout-success.ts";
import {
  decodeShareConfig,
  encodeShareConfig,
  publicShareFromSelection,
} from "../src/features/product-experience/lib/share-config.ts";
import { placeChocolateFromCatalog } from "../src/features/product-experience/lib/place-chocolate.ts";
import { buildProductionSpecification } from "../src/features/production/lib/build-production-specification.ts";
import { validateProductionSpecification } from "../src/features/production/lib/download-production-json.ts";
import { validateLogoFileSync } from "../src/lib/logo-file.ts";
import { getActiveCustomization, toExportCustomization, INACTIVE_RIBBON } from "../src/types/customization.ts";
import { createEmptyBox } from "../src/lib/box-factory.ts";
import { DEMO_CHOCOLATES } from "../src/data/demo-chocolates.ts";
import { useBoxStore } from "../src/stores/use-box-store.ts";

test("decodeShareConfig rejects invalid payloads", () => {
  assert.equal(decodeShareConfig(""), null);
  assert.equal(decodeShareConfig("%%%not-valid%%%"), null);
  assert.equal(decodeShareConfig("YWJj"), null);
});

test("share round-trip keeps layout and strips branded / logo", () => {
  const payload = publicShareFromSelection({
    boxSize: 9,
    slots: Array.from({ length: 9 }, (_, index) => ({
      chocolateId: index === 0 ? "branded-corporate-logo" : DEMO_CHOCOLATES[index % DEMO_CHOCOLATES.length]!.id,
    })),
    ribbon: { style: "classic-brown", color: "#5c3d2e" },
    packagingId: "gift",
    quantity: 2,
    message: "Hello",
  });
  const encoded = encodeShareConfig(payload);
  const decoded = decodeShareConfig(encoded);
  assert.ok(decoded);
  assert.equal(decoded.s, 9);
  assert.equal(decoded.p, "gift");
  assert.equal(decoded.i[0], "");
  assert.ok(decoded.i.some((id) => id.length > 0));
  assert.equal(JSON.stringify(decoded).includes("data:"), false);
});

test("decodeShareConfig recovers tokens polluted by share-sheet copy", () => {
  const payload = publicShareFromSelection({
    boxSize: 9,
    slots: Array.from({ length: 9 }, (_, index) => ({
      chocolateId: DEMO_CHOCOLATES[index % DEMO_CHOCOLATES.length]!.id,
    })),
    ribbon: { style: "classic-brown", color: "#5c3d2e" },
    packagingId: "gift",
    quantity: 1,
  });
  const encoded = encodeShareConfig(payload);
  const polluted = `${encoded} A chocolate box from Box & Go.`;
  const decoded = decodeShareConfig(polluted);
  assert.ok(decoded);
  assert.equal(decoded.s, 9);
  assert.equal(decoded.p, "gift");
});

test("checkout success guard rejects fake payments and incomplete local quotes", () => {
  assert.equal(
    isPresentableCheckoutSuccess({
      source: "payment",
      verified: true,
      orderId: "",
      email: "a@b.com",
      paymentMethod: "card",
      totalPaid: "$0",
      quantity: 1,
      boxLabel: "The Classic",
    }),
    false,
  );
  assert.equal(
    isPresentableCheckoutSuccess({
      source: "quote-local",
      verified: false,
      localOnly: true,
      persisted: true,
      name: "Ada",
      email: "ada@example.com",
      quantity: 1,
      boxLabel: "The Classic",
    }),
    true,
  );
  assert.equal(
    isPresentableCheckoutSuccess({
      source: "quote-local",
      verified: false,
      localOnly: true,
      persisted: true,
      name: "Ada",
      email: "  ",
      quantity: 1,
      boxLabel: "The Classic",
    }),
    false,
  );
});

test("resolveDrop swaps filled cavities and never duplicates", () => {
  const slots = [
    { index: 0, chocolateId: "a" },
    { index: 1, chocolateId: "b" },
  ];
  const resolution = resolveDrop({
    slots,
    catalogIds: ["a", "b"],
    source: { type: "slot", slotIndex: 0, chocolateId: "a" },
    targetSlotIndex: 1,
  });
  assert.ok(resolution);
  assert.deepEqual(resolution.writes, [
    { slotIndex: 1, chocolateId: "a" },
    { slotIndex: 0, chocolateId: "b" },
  ]);
});

test("inactive ribbon is export-only when packaging is not gift", () => {
  const customization = {
    logo: { url: "data:image/png;base64,xx", x: 0, y: 0, scale: 1, rotation: 0 },
    ribbon: { color: "#111", style: "classic-brown" },
    card: { message: "Thanks", fontStyle: "serif" },
    packaging: { wrapStyle: "standard", giftNote: "" },
    brandedPlacement: { slotIndex: null },
  };
  const active = getActiveCustomization(customization);
  assert.equal(active.ribbonApplied, false);
  assert.equal(active.sleeveLogoApplied, false);
  assert.equal(toExportCustomization(customization).ribbon.style, INACTIVE_RIBBON.style);
});

test("production spec uses a local specification id and validates empty boxes", () => {
  const box = createEmptyBox(9);
  const configuration = {
    box,
    quantity: 1,
    customization: {
      logo: { url: null, x: 0, y: 0, scale: 1, rotation: 0 },
      ribbon: { color: "#5c3d2e", style: "classic-brown" },
      card: { message: "", fontStyle: "serif" },
      packaging: { wrapStyle: "standard", giftNote: "" },
      brandedPlacement: { slotIndex: null },
    },
  };
  const emptySpec = buildProductionSpecification(configuration, DEMO_CHOCOLATES);
  assert.match(emptySpec.orderId, /^local-spec-/);
  assert.equal(validateProductionSpecification(emptySpec).valid, false);

  configuration.box.slots[0]!.chocolateId = DEMO_CHOCOLATES[0]!.id;
  const filledSpec = buildProductionSpecification(configuration, DEMO_CHOCOLATES);
  assert.equal(validateProductionSpecification(filledSpec).valid, true);
  assert.equal(filledSpec.slots[0]?.chocolateId, DEMO_CHOCOLATES[0]!.id);
});

test("logo validation rejects empty, wrong type, and oversized files", () => {
  const empty = new File([], "empty.png", { type: "image/png" });
  assert.equal(validateLogoFileSync(empty), "empty");
  const badType = new File(["abc"], "logo.gif", { type: "image/gif" });
  assert.equal(validateLogoFileSync(badType), "type");
  const huge = new File([new Uint8Array(2 * 1024 * 1024 + 1)], "logo.png", { type: "image/png" });
  assert.equal(validateLogoFileSync(huge), "size");
});

test("click-to-add does not overwrite when the box is full", () => {
  useBoxStore.setState({
    boxSize: 9,
    slots: createEmptyBox(9).slots.map((slot) => ({
      ...slot,
      chocolateId: DEMO_CHOCOLATES[0]!.id,
    })),
  });
  const before = useBoxStore.getState().slots.map((slot) => slot.chocolateId);
  const result = placeChocolateFromCatalog(DEMO_CHOCOLATES[1]!.id);
  assert.equal(result, "full");
  assert.deepEqual(
    useBoxStore.getState().slots.map((slot) => slot.chocolateId),
    before,
  );
});

test("branded piece HTML uses disc imprint, not a sticker overlay", async () => {
  const { renderBrandedPieceHtml } = await import(
    "../src/features/product-experience/lib/branded-chocolate-imprint.ts"
  );
  const html = renderBrandedPieceHtml({
    imageUrl: "/sabores/branded-plain.png",
    name: "Branded Corporate Piece",
    logoUrl: "data:image/png;base64,aaa",
    scale: "130%",
  });
  assert.match(html, /bng-branded-piece__imprint/);
  assert.match(html, /bng-branded-piece__mark/);
  assert.equal(html.includes("cavity-logo"), false);
  assert.equal(html.includes("drop-shadow"), false);
});

test("looksLikePdf accepts a PDF header", async () => {
  const { looksLikePdf } = await import("../src/features/production/lib/download-client-proof-pdf.ts");
  assert.equal(looksLikePdf(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d])), true);
  assert.equal(looksLikePdf(new Uint8Array([0x3c, 0x68, 0x74, 0x6d, 0x6c])), false);
});
