import { escapeHtml } from "./html-utils";
import { embedProofSheetAssets } from "./embed-proof-assets";
import { PROOF_SHEET_CSS, renderProofSheetInnerHtml } from "./proof-sheet-markup";
import { buildProofSheetModel, type ProofSheetModel } from "./proof-sheet-model";
import type { BoxConfiguration, Chocolate, ProductionSpecification } from "@/types";

export interface BuildClientProofParams {
  configuration: BoxConfiguration;
  spec: ProductionSpecification;
  catalog: Chocolate[];
  companyName?: string;
}

export function buildClientProofHtmlFromModel(model: ProofSheetModel): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Box &amp; Go — ${escapeHtml(model.boxName)} proof</title>
<style>
  :root { color-scheme: light; }
  html, body { margin: 0; background: #f3eadc; }
  body { padding: 28px 16px 40px; }
  ${PROOF_SHEET_CSS}
  .bng-proof { box-shadow: 0 24px 60px -28px rgba(60, 35, 20, 0.35); }
  @media print {
    html, body { background: #fbf6ee; }
    body { padding: 0; }
  }
</style>
</head>
<body>
${renderProofSheetInnerHtml(model)}
</body>
</html>`;
}

/**
 * Builds the visual client proof. Call after preparePortableConfiguration()
 * so customer logos are already data URLs. Does not embed tray/chocolate PNGs —
 * use assembleClientProofHtml() for a file that opens without localhost.
 */
export function buildClientProofHtml({
  configuration,
  spec,
  catalog,
}: BuildClientProofParams): string {
  const model = buildProofSheetModel(configuration, spec, catalog);
  return buildClientProofHtmlFromModel(model);
}

/** Self-contained proof: every image inlined as a data URI. Throws if assets fail to load. */
export async function assembleClientProofHtml({
  configuration,
  spec,
  catalog,
}: BuildClientProofParams): Promise<{ html: string; model: ProofSheetModel }> {
  const model = await embedProofSheetAssets(buildProofSheetModel(configuration, spec, catalog));
  return { html: buildClientProofHtmlFromModel(model), model };
}
