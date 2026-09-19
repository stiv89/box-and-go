function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Shared imprint look for catalog, cavities, proof HTML, and production preview.
 * Logo is clipped to the chocolate disc and multiplied into the cocoa — not a sticker.
 */
export const BRANDED_CHOCOLATE_IMPRINT_CSS = `
.bng-branded-piece {
  position: relative;
  display: block;
  isolation: isolate;
  background: transparent;
}
.bng-branded-piece__base {
  position: relative;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  background: transparent;
}
.bng-branded-piece__imprint {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  mix-blend-mode: overlay;
  -webkit-mask-image: var(--bng-branded-mask);
  mask-image: var(--bng-branded-mask);
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
.bng-branded-piece__well {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40%;
  height: 40%;
  transform: translateY(-3%);
}
.bng-branded-piece__mark {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  opacity: 0.92;
  filter: contrast(1.08) saturate(0.95);
}
.bng-branded-piece__well::after {
  content: "";
  position: absolute;
  inset: -12%;
  border-radius: 50%;
  background: radial-gradient(ellipse at 34% 30%, rgba(255, 255, 255, 0.18), transparent 62%);
  mix-blend-mode: soft-light;
  pointer-events: none;
}
`.trim();

function cssMaskUrl(imageUrl: string): string {
  const escaped = imageUrl.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `url("${escaped}")`;
}

export function renderBrandedPieceHtml(options: {
  imageUrl: string;
  name: string;
  logoUrl?: string | null;
  scale?: string;
}): string {
  const { imageUrl, name, logoUrl, scale } = options;
  const size = scale ? `width:${scale};height:${scale};` : "";
  const style = `--bng-branded-mask:${cssMaskUrl(imageUrl)};${size}`;
  const imprint =
    logoUrl
      ? `<span class="bng-branded-piece__imprint"><span class="bng-branded-piece__well"><img class="bng-branded-piece__mark" src="${escapeHtml(logoUrl)}" alt="" /></span></span>`
      : "";

  return `<span class="bng-branded-piece" style="${escapeHtml(style)}"><img class="bng-branded-piece__base" src="${escapeHtml(imageUrl)}" alt="${escapeHtml(name)}" />${imprint}</span>`;
}
