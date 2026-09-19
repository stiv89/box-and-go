import type { Chocolate } from "@/types";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export function parseHexColor(hex: string): Rgb | null {
  const value = hex.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(value)) return null;
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const toByte = (channel: number) =>
    Math.max(0, Math.min(255, Math.round(channel)))
      .toString(16)
      .padStart(2, "0");
  return `#${toByte(r)}${toByte(g)}${toByte(b)}`;
}

/** Weighted RGB distance that keeps dark cocoa tones distinct from mint/red. */
export function colorDistance(left: Rgb, right: Rgb): number {
  const rMean = (left.r + right.r) / 2;
  const dR = left.r - right.r;
  const dG = left.g - right.g;
  const dB = left.b - right.b;
  return Math.sqrt(
    (2 + rMean / 256) * dR * dR + 4 * dG * dG + (2 + (255 - rMean) / 256) * dB * dB,
  );
}

export function suggestChocolatesForColors(
  logoColors: string[],
  chocolates: readonly Chocolate[],
  limit = 3,
): Chocolate[] {
  const samples = logoColors
    .map(parseHexColor)
    .filter((color): color is Rgb => color !== null);
  if (samples.length === 0 || limit < 1) return [];

  const scored = chocolates
    .filter((chocolate) => !chocolate.isBranded)
    .map((chocolate) => {
      const rgb = parseHexColor(chocolate.color);
      if (!rgb) return { chocolate, score: Number.POSITIVE_INFINITY };
      const score = Math.min(
        ...samples.map((sample) => colorDistance(sample, rgb)),
      );
      return { chocolate, score };
    })
    .filter((entry) => Number.isFinite(entry.score))
    .sort((left, right) => left.score - right.score);

  return scored.slice(0, limit).map((entry) => entry.chocolate);
}
