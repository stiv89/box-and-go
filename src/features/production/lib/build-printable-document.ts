import { BOX_SIZES } from "@/lib/constants";
import type { BoxConfiguration, Chocolate, ProductionSpecification } from "@/types";

import { escapeHtml, renderBoxGridHtml } from "./html-utils";

export interface BuildPrintableDocumentParams {
  configuration: BoxConfiguration;
  spec: ProductionSpecification;
  catalog: Chocolate[];
}

export function buildPrintableProductionHtml({
  configuration,
  spec,
  catalog,
}: BuildPrintableDocumentParams): string {
  const boxLabel = BOX_SIZES[spec.boxSize].label;

  const breakdownRows =
    spec.chocolateBreakdown
      .map(
        (item) =>
          `<tr><td>${escapeHtml(item.chocolateName)}</td><td>${item.perBox}</td><td>${item.total.toLocaleString()}</td></tr>`,
      )
      .join("") || `<tr><td colspan="3">No chocolates placed yet.</td></tr>`;

  const slotRows =
    spec.slots
      .map(
        (slot) =>
          `<tr><td>${slot.slotIndex + 1}</td><td>${escapeHtml(slot.chocolateName)}</td></tr>`,
      )
      .join("") || `<tr><td colspan="2">No slots filled.</td></tr>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Box &amp; Go — Production Specification ${escapeHtml(spec.orderId)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font-family: -apple-system, "Segoe UI", sans-serif; color: #2b1a10; margin: 0; padding: 32px; background: #fff; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 13px; margin: 24px 0 8px; text-transform: uppercase; letter-spacing: 0.06em; color: #5c3d2e; }
  .meta { color: #6b5a4d; font-size: 12px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 6px 8px; border-bottom: 1px solid #e5dccf; }
  th { color: #6b5a4d; font-weight: 600; }
  .totals { display: flex; gap: 16px; margin: 16px 0; flex-wrap: wrap; }
  .totals .stat { background: #f6efe4; border-radius: 8px; padding: 10px 16px; }
  .totals .stat .value { font-size: 20px; font-weight: 700; }
  .totals .stat .label { font-size: 11px; text-transform: uppercase; color: #6b5a4d; }
  .box-grid { display: grid; gap: 4px; max-width: 200px; margin: 8px 0 20px; }
  .box-grid .slot { aspect-ratio: 1; border-radius: 4px; border: 1px solid rgba(0,0,0,0.1); }
  .custom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; font-size: 13px; }
  .custom-grid dt { color: #6b5a4d; }
  .custom-grid dd { margin: 0; font-weight: 600; }
  @media print {
    body { padding: 0; }
    @page { margin: 16mm; }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; }
  }
</style>
</head>
<body>
  <h1>Box &amp; Go — Production Specification</h1>
  <p class="meta">Order ${escapeHtml(spec.orderId)} · Generated ${escapeHtml(new Date(spec.generatedAt).toLocaleString())}</p>

  <div class="totals">
    <div class="stat"><div class="value">${boxLabel}</div><div class="label">Box size</div></div>
    <div class="stat"><div class="value">${spec.quantity.toLocaleString()}</div><div class="label">Boxes ordered</div></div>
    <div class="stat"><div class="value">${spec.totalChocolates.toLocaleString()}</div><div class="label">Total chocolates</div></div>
  </div>

  <h2>Slot layout (${boxLabel})</h2>
  ${renderBoxGridHtml(configuration, catalog)}

  <h2>Chocolates per box &times; total</h2>
  <table>
    <thead><tr><th>Chocolate</th><th>Per box</th><th>Total (&times;${spec.quantity.toLocaleString()})</th></tr></thead>
    <tbody>${breakdownRows}</tbody>
  </table>

  <h2>Slot positions</h2>
  <table>
    <thead><tr><th>Slot #</th><th>Chocolate</th></tr></thead>
    <tbody>${slotRows}</tbody>
  </table>

  <h2>Customization</h2>
  <dl class="custom-grid">
    <dt>Ribbon color</dt><dd>${escapeHtml(spec.customization.ribbon.color)} (${escapeHtml(spec.customization.ribbon.style)})</dd>
    <dt>Packaging</dt><dd>${escapeHtml(spec.customization.packaging.wrapStyle)}</dd>
    <dt>Card message</dt><dd>${spec.customization.card.message.trim() ? escapeHtml(spec.customization.card.message) : "None"}</dd>
    <dt>Corporate logo</dt><dd>${spec.customization.logo.url ? "Provided" : "Not provided"}</dd>
  </dl>
</body>
</html>`;
}

/** Opens the document in a new tab and triggers the print dialog. Returns false if the popup was blocked. */
export function openPrintableProductionDocument(html: string): boolean {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return false;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  printWindow.onload = () => printWindow.print();

  return true;
}
