import { BOX_SIZES } from "@/lib/constants";
import type { BoxConfiguration, Chocolate, ProductionSpecification } from "@/types";

import { escapeHtml, renderBoxGridHtml } from "./html-utils";

export interface BuildClientProofParams {
  configuration: BoxConfiguration;
  spec: ProductionSpecification;
  catalog: Chocolate[];
  companyName?: string;
}

/**
 * Self-contained proof (no server/session dependency): logo is inlined as a data URL
 * by preparePortableConfiguration() before this is called, so the downloaded file
 * opens correctly for anyone, on any machine.
 */
export function buildClientProofHtml({
  configuration,
  spec,
  catalog,
  companyName,
}: BuildClientProofParams): string {
  const boxLabel = BOX_SIZES[spec.boxSize].label;
  const logo = spec.customization.logo;
  const ribbonColor = spec.customization.ribbon.color;
  const cardMessage = spec.customization.card.message.trim();

  const logoBlock = logo.url
    ? `<img class="logo" src="${logo.url}" alt="Corporate logo" style="left:${50 + logo.x}%; transform: translate(-50%, 0) scale(${logo.scale}) rotate(${logo.rotation}deg);" />`
    : "";

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Box &amp; Go — Design proof ${escapeHtml(spec.orderId)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; background: #f6efe4; color: #2b1a10; margin: 0; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
  .card { width: 100%; max-width: 420px; background: #fffaf3; border-radius: 20px; padding: 28px; box-shadow: 0 20px 45px -20px rgba(60,35,20,0.35); position: relative; }
  .ribbon { position: absolute; left: 50%; top: 0; width: 96px; height: 32px; transform: translate(-50%, -50%); background: ${ribbonColor}; border-radius: 2px; }
  .ribbon::after { content: ""; position: absolute; left: 50%; bottom: -8px; width: 16px; height: 16px; transform: translate(-50%, 0) rotate(45deg); background: ${ribbonColor}; }
  .logo { position: absolute; top: 4%; max-height: 48px; max-width: 120px; object-fit: contain; }
  h1 { font-size: 16px; text-align: center; margin: 12px 0 0; }
  .subtitle { font-size: 11px; text-align: center; text-transform: uppercase; letter-spacing: 0.16em; color: #8a7862; margin-bottom: 20px; }
  .box-grid { display: grid; gap: 6px; margin: 0 auto 20px; max-width: 220px; }
  .box-grid .slot { aspect-ratio: 1; border-radius: 8px; border: 1px solid rgba(0,0,0,0.08); }
  .msg { text-align: center; font-size: 13px; font-style: italic; border-top: 1px solid #e5dccf; padding-top: 14px; margin-top: 8px; }
  .meta { width: 100%; max-width: 420px; margin-top: 24px; font-size: 12px; color: #6b5a4d; }
  .meta dl { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 18px; }
  .meta dt { color: #8a7862; }
  .meta dd { margin: 0; font-weight: 600; }
  .footer { margin-top: 24px; font-size: 11px; color: #8a7862; text-align: center; max-width: 420px; }
  @media print { body { background: #fff; padding: 0; } .footer { display: none; } }
</style>
</head>
<body>
  <div class="card">
    <div class="ribbon" aria-hidden="true"></div>
    ${logoBlock}
    <h1>Box &amp; Go</h1>
    <p class="subtitle">${boxLabel} · Corporate approval proof</p>
    ${renderBoxGridHtml(configuration, catalog)}
    ${cardMessage ? `<p class="msg">&ldquo;${escapeHtml(cardMessage)}&rdquo;</p>` : ""}
  </div>
  <div class="meta">
    <dl>
      <dt>${companyName ? "Company" : "Order"}</dt><dd>${escapeHtml(companyName ?? spec.orderId)}</dd>
      <dt>Boxes ordered</dt><dd>${spec.quantity.toLocaleString()}</dd>
      <dt>Total chocolates</dt><dd>${spec.totalChocolates.toLocaleString()}</dd>
      <dt>Generated</dt><dd>${escapeHtml(new Date(spec.generatedAt).toLocaleString())}</dd>
    </dl>
  </div>
  <p class="footer">Prepared by the Box &amp; Go concierge team for client approval. To save as PDF or image, open your browser's Print menu and choose &ldquo;Save as PDF&rdquo;.</p>
</body>
</html>`;
}
