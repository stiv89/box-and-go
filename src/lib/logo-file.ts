export const LOGO_MAX_BYTES = 2 * 1024 * 1024;
export const ACCEPTED_LOGO_TYPES = ["image/png", "image/jpeg", "image/jpg"] as const;

export type LogoValidationFailure =
  | "empty"
  | "type"
  | "size"
  | "corrupt";

export function describeLogoFailure(reason: LogoValidationFailure): string {
  switch (reason) {
    case "empty":
      return "That file looks empty. Please choose a PNG or JPG logo.";
    case "type":
      return "Please upload a PNG or JPG file.";
    case "size":
      return "Logo must be 2 MB or smaller.";
    case "corrupt":
      return "We couldn’t read that image. Try another PNG or JPG.";
  }
}

export function validateLogoFileSync(file: File): LogoValidationFailure | null {
  if (!file || file.size <= 0) return "empty";
  if (!ACCEPTED_LOGO_TYPES.includes(file.type as (typeof ACCEPTED_LOGO_TYPES)[number])) {
    return "type";
  }
  if (file.size > LOGO_MAX_BYTES) return "size";
  return null;
}

function decodeWithImageElement(objectUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      if (image.naturalWidth < 1 || image.naturalHeight < 1) {
        reject(new Error("empty image"));
        return;
      }
      resolve();
    };
    image.onerror = () => reject(new Error("decode failed"));
    image.src = objectUrl;
  });
}

export async function readValidatedLogoDataUrl(file: File): Promise<
  { ok: true; dataUrl: string } | { ok: false; reason: LogoValidationFailure }
> {
  const sync = validateLogoFileSync(file);
  if (sync) return { ok: false, reason: sync };

  const objectUrl = URL.createObjectURL(file);
  try {
    await decodeWithImageElement(objectUrl);
  } catch {
    URL.revokeObjectURL(objectUrl);
    return { ok: false, reason: "corrupt" };
  }
  URL.revokeObjectURL(objectUrl);

  try {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== "string" || !result.startsWith("data:image/")) {
          reject(new Error("invalid data url"));
          return;
        }
        resolve(result);
      };
      reader.onerror = () => reject(reader.error ?? new Error("read failed"));
      reader.readAsDataURL(file);
    });
    return { ok: true, dataUrl };
  } catch {
    return { ok: false, reason: "corrupt" };
  }
}
