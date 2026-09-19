import { renderBrandedPieceHtml } from "@/features/product-experience/lib/branded-chocolate-imprint";
import type { BoxConfiguration, Chocolate } from "@/types";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Numbered factory grid: position 1…N, chocolate photo when available, empty otherwise.
 * Not a visual client proof — keep slot numbers visible.
 */
export function renderNumberedSlotGridHtml(
  configuration: BoxConfiguration,
  catalog: Chocolate[],
): string {
  const { box } = configuration;
  const chocolateById = new Map(catalog.map((chocolate) => [chocolate.id, chocolate]));
  const logoUrl = configuration.customization.logo.url;

  const cells = box.slots
    .map((slot) => {
      const chocolate = slot.chocolateId ? chocolateById.get(slot.chocolateId) : null;
      const label = chocolate ? escapeHtml(chocolate.name) : "Empty";
      const photo = chocolate?.imageUrl
        ? chocolate.isBranded
          ? renderBrandedPieceHtml({
              imageUrl: chocolate.imageUrl,
              name: chocolate.name,
              logoUrl,
            })
          : `<img src="${escapeHtml(chocolate.imageUrl)}" alt="${label}" />`
        : "";
      return `<div class="prod-slot" data-slot-index="${slot.index}" data-chocolate-id="${escapeHtml(chocolate?.id ?? "")}" title="${label}"><span class="prod-num">${slot.index + 1}</span>${photo}<span class="prod-name">${label}</span></div>`;
    })
    .join("");

  return `<div class="prod-grid" style="grid-template-columns: repeat(${box.cols}, 1fr);">${cells}</div>`;
}

/** @deprecated Prefer renderNumberedSlotGridHtml for production documents. */
export function renderBoxGridHtml(configuration: BoxConfiguration, catalog: Chocolate[]): string {
  return renderNumberedSlotGridHtml(configuration, catalog);
}

export function downloadHtmlDocument(html: string, filename: string): void {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
