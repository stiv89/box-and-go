/** Convert a blob, http(s), blob:, or public path into a data:image URL. Never uses canvas (keeps PNG alpha). */

const IMAGE_EXT_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export async function toImageDataUrl(src: string, label: string): Promise<string> {
  if (src.startsWith("data:image/")) return src;
  if (src.startsWith("data:")) {
    throw new Error(`Couldn’t prepare ${label} — not an image.`);
  }

  const resolved = resolveAssetUrl(src);
  const response = await fetch(resolved);
  if (!response.ok) {
    throw new Error(`Couldn’t load ${label}.`);
  }

  const blob = await response.blob();
  if (blob.size < 32) {
    throw new Error(`Couldn’t load ${label}.`);
  }

  const hintedMime = mimeFromSrc(src);
  const mime =
    blob.type.startsWith("image/")
      ? blob.type
      : hintedMime ?? (blob.type === "application/octet-stream" ? "image/png" : null);

  if (!mime) {
    throw new Error(`Couldn’t load ${label}.`);
  }

  const dataUrl = await readBlobAsDataUrl(blob);
  const comma = dataUrl.indexOf(",");
  if (comma < 0) {
    throw new Error(`Couldn’t prepare ${label}.`);
  }

  return `data:${mime};base64,${dataUrl.slice(comma + 1)}`;
}

export function resolveAssetUrl(src: string): string {
  if (src.startsWith("blob:") || src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  return new URL(src, origin).href;
}

function mimeFromSrc(src: string): string | null {
  const clean = src.split("?")[0]?.split("#")[0] ?? src;
  const ext = clean.split(".").pop()?.toLowerCase();
  return ext ? (IMAGE_EXT_MIME[ext] ?? null) : null;
}

async function readBlobAsDataUrl(blob: Blob): Promise<string> {
  if (typeof FileReader === "undefined") {
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const mime = blob.type || "application/octet-stream";
    return `data:${mime};base64,${btoa(binary)}`;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read image data."));
    reader.readAsDataURL(blob);
  });
}
