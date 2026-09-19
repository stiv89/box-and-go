import {
  BRANDED_CHOCOLATE_IMPRINT_CSS,
  renderBrandedPieceHtml,
} from "@/features/product-experience/lib/branded-chocolate-imprint";
import { CORPORATE_SLEEVE_LOGO_ANCHOR } from "@/lib/constants";

import { escapeHtml } from "./html-utils";
import type { ProofSheetModel } from "./proof-sheet-model";

/** Shared CSS for the on-screen proof sheet and the downloaded HTML. */
export const PROOF_SHEET_CSS = `
.bng-proof { box-sizing: border-box; width: 100%; max-width: 42rem; margin: 0 auto; padding: 2.25rem 1.75rem 2.5rem; background: #fbf6ee; color: #2b1a10; font-family: Palatino, "Palatino Linotype", "Iowan Old Style", Georgia, "Times New Roman", serif; }
.bng-proof *, .bng-proof *::before, .bng-proof *::after { box-sizing: border-box; }
.bng-proof .proof-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; }
.bng-proof .brand-logo { height: 2.75rem; width: auto; max-width: 9rem; object-fit: contain; }
.bng-proof .status { margin: 0; padding: 0.28rem 0.7rem; border: 1px solid rgba(184, 149, 107, 0.45); border-radius: 999px; font-family: "Segoe UI", system-ui, sans-serif; font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: #6b5a4d; }
.bng-proof .kicker { margin: 1.6rem 0 0; font-family: "Segoe UI", system-ui, sans-serif; font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase; color: #8a7862; }
.bng-proof h1 { margin: 0.45rem 0 0; font-size: clamp(2.1rem, 6vw, 3.1rem); font-weight: 400; letter-spacing: -0.03em; line-height: 1.05; }
.bng-proof .lede { margin: 0.65rem 0 0; max-width: 22rem; font-size: 1.02rem; line-height: 1.45; color: #6b5a4d; }
.bng-proof .hero { width: 100%; margin: 1.75rem 0 1.25rem; break-inside: avoid; page-break-inside: avoid; }
.bng-proof .tray { position: relative; width: 100%; aspect-ratio: 1 / 1; }
.bng-proof .tray-photo { display: block; width: 100%; height: 100%; object-fit: contain; background: transparent; }
.bng-proof .cavity { position: absolute; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.bng-proof .cavity .piece, .bng-proof .cavity .bng-branded-piece { display: block; object-fit: contain; background: transparent; }
.bng-proof .arrive { display: flex; align-items: center; justify-content: center; gap: 1.25rem; margin: 0 0 1.75rem; padding: 0.75rem 0.5rem; break-inside: avoid; page-break-inside: avoid; }
.bng-proof .arrive-pack { position: relative; width: min(38%, 9.5rem); aspect-ratio: 1 / 1; }
.bng-proof .arrive-pack img.pack { width: 100%; height: 100%; object-fit: contain; background: transparent; }
.bng-proof .sleeve-logo { position: absolute; max-width: 28%; max-height: 18%; object-fit: contain; filter: drop-shadow(0 1px 2px rgba(40,24,12,0.2)); }
.bng-proof .arrive-ribbon { width: min(32%, 8rem); aspect-ratio: 1 / 1; object-fit: contain; background: transparent; }
.bng-proof .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem 1.5rem; margin: 0; padding: 1.1rem 0 0; border-top: 1px solid rgba(90, 64, 45, 0.12); font-family: "Segoe UI", system-ui, sans-serif; }
.bng-proof .meta > div { min-width: 0; }
.bng-proof .meta .label { margin: 0; font-size: 0.62rem; letter-spacing: 0.16em; text-transform: uppercase; color: #8a7862; }
.bng-proof .meta .value { margin: 0.2rem 0 0; font-size: 0.92rem; font-weight: 600; color: #2b1a10; }
.bng-proof .selection { margin-top: 1.75rem; }
.bng-proof .selection h2 { margin: 0 0 0.85rem; font-size: 1.15rem; font-weight: 400; }
.bng-proof .flavors { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.85rem 0.7rem; }
.bng-proof .flavor { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 0.35rem; }
.bng-proof .flavor-photo { position: relative; width: 3.1rem; height: 3.1rem; }
.bng-proof .flavor-photo > img:first-of-type, .bng-proof .flavor-photo .bng-branded-piece { width: 3.1rem; height: 3.1rem; object-fit: contain; background: transparent; }
.bng-proof .proof-mockup { margin: 0.65rem 0 0; font-family: "Segoe UI", system-ui, sans-serif; font-size: 0.68rem; line-height: 1.4; color: #8a7862; }
.bng-proof .flavor p { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; font-size: 0.72rem; line-height: 1.3; color: #5c4a3c; }
.bng-proof .flavor .qty { color: #8a7862; }
.bng-proof .message { margin: 1.6rem 0 0; padding: 1rem 0 0; border-top: 1px solid rgba(90, 64, 45, 0.12); text-align: center; font-size: 1.05rem; font-style: italic; color: #4a382c; }
.bng-proof .proof-foot { margin: 2rem 0 0; padding-top: 1rem; border-top: 1px solid rgba(90, 64, 45, 0.12); text-align: center; font-family: "Segoe UI", system-ui, sans-serif; font-size: 0.78rem; letter-spacing: 0.04em; color: #8a7862; }
@media print {
  @page { size: auto; margin: 12mm; }
  .bng-proof { max-width: none; padding: 0; background: #fbf6ee; }
  .bng-proof .hero { width: 62%; max-width: 148mm; margin-left: auto; margin-right: auto; }
  .bng-proof-print-hide { display: none !important; }
}
@media (max-width: 520px) {
  .bng-proof { padding: 1.4rem 1rem 1.75rem; }
  .bng-proof .flavors { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .bng-proof .meta { grid-template-columns: 1fr; }
}
${BRANDED_CHOCOLATE_IMPRINT_CSS}
`.trim();

export function renderProofBoxHeroHtml(model: ProofSheetModel): string {
  const pieces = model.cavities
    .map((piece) => {
      const scale = `${Math.round(piece.pieceScale * 100)}%`;
      const visual = piece.isBranded
        ? renderBrandedPieceHtml({
            imageUrl: piece.imageUrl,
            name: piece.name,
            logoUrl: model.customerLogoSrc,
            scale,
          })
        : `<img class="piece" src="${escapeHtml(piece.imageUrl)}" alt="${escapeHtml(piece.name)}" style="width:${scale};height:${scale};" />`;
      return `<div class="cavity" data-slot-index="${piece.slotIndex}" data-chocolate-id="${escapeHtml(piece.chocolateId)}" style="left:${piece.cavity.left}%;top:${piece.cavity.top}%;width:${piece.cavity.width}%;height:${piece.cavity.height}%;">${visual}</div>`;
    })
    .join("");

  return `<section class="hero" data-proof-hero data-box-size="${model.boxSize}"><div class="tray"><img class="tray-photo" src="${escapeHtml(model.openTraySrc)}" alt="${escapeHtml(model.boxName)} open tray" />${pieces}</div></section>`;
}

export function renderProofSheetInnerHtml(model: ProofSheetModel): string {
  const metaItems = [
    ["Collection", model.boxName],
    ["Chocolates", `${model.filledCount} of ${model.capacity}`],
    ["Packaging", model.packagingLabel],
  ];
  if (model.ribbonLabel) metaItems.push(["Ribbon", model.ribbonLabel]);
  if (model.brandingLine) metaItems.push(["Branding", model.brandingLine]);
  if (model.quantity > 1) metaItems.push(["Boxes", model.quantity.toLocaleString()]);

  const meta = metaItems
    .map(
      ([label, value]) =>
        `<div><p class="label">${escapeHtml(label!)}</p><p class="value">${escapeHtml(value!)}</p></div>`,
    )
    .join("");

  const flavors = model.selection
    .map((item) => {
      const qty = item.quantity > 1 ? `<span class="qty"> × ${item.quantity}</span>` : "";
      const visual = item.isBranded
        ? renderBrandedPieceHtml({
            imageUrl: item.imageUrl,
            name: item.name,
            logoUrl: model.customerLogoSrc,
          })
        : `<img src="${escapeHtml(item.imageUrl)}" alt="" />`;
      return `<div class="flavor" data-flavor-id="${escapeHtml(item.chocolateId)}"><div class="flavor-photo">${visual}</div><p>${escapeHtml(item.name)}${qty}</p></div>`;
    })
    .join("");

  const sleeveLogo =
    model.sleeveLogoUrl && model.packagingId === "corporate"
      ? `<img class="sleeve-logo" src="${escapeHtml(model.sleeveLogoUrl)}" alt="" style="left:${CORPORATE_SLEEVE_LOGO_ANCHOR.leftPercent + model.sleeveLogoX}%;top:${CORPORATE_SLEEVE_LOGO_ANCHOR.topPercent + model.sleeveLogoY}%;transform:translate(-50%,-50%) scale(${model.sleeveLogoScale}) rotate(${model.sleeveLogoRotation}deg);" />`
      : "";

  const ribbon = model.ribbonSrc
    ? `<img class="arrive-ribbon" src="${escapeHtml(model.ribbonSrc)}" alt="${escapeHtml(model.ribbonLabel ?? "Ribbon")}" data-proof-ribbon="true" />`
    : "";

  const message = model.cardMessage
    ? `<p class="message">&ldquo;${escapeHtml(model.cardMessage)}&rdquo;</p>`
    : "";

  return `<article class="bng-proof" data-packaging="${escapeHtml(model.packagingId)}" data-ribbon="${model.ribbonSrc ? "on" : "none"}">
  <div class="proof-top">
    <img class="brand-logo" src="${escapeHtml(model.brandLogoSrc)}" alt="Box &amp; Go" />
    <p class="status">For review</p>
  </div>
  <p class="kicker">${model.kicker}</p>
  <h1>Your creation.</h1>
  <p class="lede">Thoughtfully designed. Ready for your approval.</p>
  ${renderProofBoxHeroHtml(model)}
  <section class="arrive" data-proof-packaging="${escapeHtml(model.packagingId)}">
    <div class="arrive-pack">
      <img class="pack" src="${escapeHtml(model.packagingSrc)}" alt="${escapeHtml(model.packagingLabel)}" />
      ${sleeveLogo}
    </div>
    ${ribbon}
  </section>
  <div class="meta">${meta}</div>
  <section class="selection">
    <h2>Your selection</h2>
    <div class="flavors">${flavors}</div>
  </section>
  ${message}
  ${model.customerLogoSrc ? `<p class="proof-mockup">Branded piece shown as a visual mockup — not a production-approved edible imprint.</p>` : ""}
  <p class="proof-foot">Please review your design before production.</p>
</article>`;
}
