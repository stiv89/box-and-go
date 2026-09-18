import type { BoxConfiguration, Chocolate } from "@/types";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Static (non-interactive) HTML/CSS re-implementation of the box grid preview. */
export function renderBoxGridHtml(configuration: BoxConfiguration, catalog: Chocolate[]): string {
  const { box } = configuration;
  const chocolateById = new Map(catalog.map((chocolate) => [chocolate.id, chocolate]));

  const cells = box.slots
    .map((slot) => {
      const chocolate = slot.chocolateId ? chocolateById.get(slot.chocolateId) : null;
      const background = chocolate?.color ?? "#f1e9df";
      const label = chocolate ? escapeHtml(chocolate.name) : "Empty slot";
      return `<div class="slot" style="background:${background}" title="${label}"></div>`;
    })
    .join("");

  return `<div class="box-grid" style="grid-template-columns: repeat(${box.cols}, 1fr);">${cells}</div>`;
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
