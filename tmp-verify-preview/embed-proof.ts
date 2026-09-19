import { writeFileSync } from "node:fs";
import { DEMO_CHOCOLATES } from "../src/data/demo-chocolates";
import { createEmptyBox } from "../src/lib/box-factory";
import { assembleClientProofHtml } from "../src/features/production/lib/build-client-proof";
import { buildPrintableProductionHtml } from "../src/features/production/lib/build-printable-document";
import { buildProductionSpecification } from "../src/features/production/lib/build-production-specification";
import { createDefaultCustomization, type BoxConfiguration } from "../src/types";

function configurationFor(size: 9 | 16): BoxConfiguration {
  const box = createEmptyBox(size);
  return {
    box: {
      ...box,
      slots: box.slots.map((slot, index) => ({
        ...slot,
        chocolateId: DEMO_CHOCOLATES[index % DEMO_CHOCOLATES.length]!.id,
      })),
    },
    customization: {
      ...createDefaultCustomization(),
      packaging: { wrapStyle: size === 9 ? "gift" : "standard", giftNote: "" },
      ribbon: { color: "#6b2d3c", style: "burgundy" },
      card: { message: "A note for the team.", fontStyle: "serif" },
    },
    quantity: 3,
  };
}

async function main() {
  for (const size of [9, 16] as const) {
    const configuration = configurationFor(size);
    const spec = buildProductionSpecification(configuration, DEMO_CHOCOLATES);
    const { html, model } = await assembleClientProofHtml({
      configuration,
      spec,
      catalog: DEMO_CHOCOLATES,
    });
    const out = `tmp-verify-preview/proof-${size}.html`;
    writeFileSync(out, html);
    const hasHttp = /src="https?:/.test(html);
    const hasRelative = /src="\//.test(html);
    const allData = model.cavities.every((piece) => piece.imageUrl.startsWith("data:image/"));
    const trayData = model.openTraySrc.startsWith("data:image/");
    console.log(
      JSON.stringify({
        size,
        out,
        bytes: html.length,
        hasHttp,
        hasRelative,
        allData,
        trayData,
        ribbon: model.ribbonSrc ? model.ribbonSrc.slice(0, 12) : null,
        packaging: model.packagingId,
        slotCount: model.cavities.length,
      }),
    );
  }

  const prodConfig = configurationFor(9);
  const spec = buildProductionSpecification(prodConfig, DEMO_CHOCOLATES);
  const production = await buildPrintableProductionHtml({
    configuration: prodConfig,
    spec,
    catalog: DEMO_CHOCOLATES,
  });
  writeFileSync("tmp-verify-preview/production-spec-9.html", production);
  console.log(
    JSON.stringify({
      production: "tmp-verify-preview/production-spec-9.html",
      numbered: production.includes("prod-num"),
      slotTable: production.includes("Slot #"),
    }),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
