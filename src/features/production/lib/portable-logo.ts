/**
 * blob: URLs (from URL.createObjectURL in the customization panel) only resolve
 * inside the tab that created them. Any export meant to be opened by someone
 * else (JSON, printable doc, client proof) must inline the logo as a data URL.
 */
export async function toPortableLogoDataUrl(url: string | null): Promise<string | null> {
  if (!url || !url.startsWith("blob:")) return url;

  const response = await fetch(url);
  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read logo image."));
    reader.readAsDataURL(blob);
  });
}
