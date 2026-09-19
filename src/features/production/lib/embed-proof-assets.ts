import type { ProofSheetModel } from "./proof-sheet-model";
import { toImageDataUrl } from "./to-data-url";

/** Rewrites every proof image to a data URI so the HTML file opens without localhost. */
export async function embedProofSheetAssets(model: ProofSheetModel): Promise<ProofSheetModel> {
  const cache = new Map<string, Promise<string>>();

  function embed(src: string | null, label: string): Promise<string | null> {
    if (!src) return Promise.resolve(null);
    const cached = cache.get(src);
    if (cached) return cached;
    const pending = toImageDataUrl(src, label);
    cache.set(src, pending);
    return pending;
  }

  const uniqueFlavors = [...new Map(model.cavities.map((piece) => [piece.imageUrl, piece.name])).entries()];

  const [brandLogoSrc, openTraySrc, packagingSrc, ribbonSrc, customerLogoSrc, ...flavorUrls] =
    await Promise.all([
      embed(model.brandLogoSrc, "Box & Go logo"),
      embed(model.openTraySrc, "open box tray"),
      embed(model.packagingSrc, "packaging"),
      embed(model.ribbonSrc, model.ribbonLabel ? `${model.ribbonLabel} ribbon` : "ribbon"),
      embed(model.customerLogoSrc, "customer logo"),
      ...uniqueFlavors.map(([src, name]) => embed(src, name)),
    ]);

  if (!brandLogoSrc || !openTraySrc || !packagingSrc) {
    throw new Error("The proof images didn’t finish loading. Try again.");
  }
  if (model.ribbonSrc && !ribbonSrc) {
    throw new Error("The ribbon image didn’t finish loading. Try again.");
  }
  if (model.customerLogoSrc && !customerLogoSrc) {
    throw new Error("The logo image didn’t finish loading. Try again.");
  }

  const flavorMap = new Map(uniqueFlavors.map(([src], index) => [src, flavorUrls[index]]));

  const cavities = model.cavities.map((piece) => {
    const imageUrl = flavorMap.get(piece.imageUrl);
    if (!imageUrl) {
      throw new Error(`Couldn’t embed ${piece.name} in the proof.`);
    }
    return { ...piece, imageUrl };
  });

  const selection = model.selection.map((item) => {
    const imageUrl = flavorMap.get(item.imageUrl);
    if (!imageUrl) {
      throw new Error(`Couldn’t embed ${item.name} in the proof.`);
    }
    return { ...item, imageUrl };
  });

  return {
    ...model,
    brandLogoSrc,
    openTraySrc,
    packagingSrc,
    ribbonSrc,
    customerLogoSrc,
    sleeveLogoUrl: model.sleeveLogoUrl ? customerLogoSrc : null,
    cavities,
    selection,
  };
}
