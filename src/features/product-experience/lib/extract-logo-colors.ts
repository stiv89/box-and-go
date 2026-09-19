import {
  colorDistance,
  parseHexColor,
  rgbToHex,
  type Rgb,
} from "@/features/product-experience/lib/suggest-palette";

const SAMPLE_SIZE = 48;
const MIN_ALPHA = 140;
const SIMILAR_THRESHOLD = 48;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("logo decode failed"));
    image.src = src;
  });
}

function isPaperWhite({ r, g, b }: Rgb) {
  return r > 242 && g > 242 && b > 242;
}

/**
 * Samples the uploaded logo and returns a few dominant colors.
 * Skips paper-white and transparent pixels so pairing stays on brand ink.
 */
export async function extractLogoPalette(
  src: string,
  count = 3,
): Promise<string[]> {
  if (!src || typeof document === "undefined" || count < 1) return [];

  try {
    const image = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = SAMPLE_SIZE;
    canvas.height = SAMPLE_SIZE;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return [];

    context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    const { data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    const buckets = new Map<string, { n: number } & Rgb>();

    for (let index = 0; index < data.length; index += 4) {
      const alpha = data[index + 3] ?? 0;
      if (alpha < MIN_ALPHA) continue;
      const pixel = {
        r: data[index] ?? 0,
        g: data[index + 1] ?? 0,
        b: data[index + 2] ?? 0,
      };
      if (isPaperWhite(pixel)) continue;

      const key = `${pixel.r >> 4},${pixel.g >> 4},${pixel.b >> 4}`;
      const current = buckets.get(key);
      if (current) {
        current.n += 1;
        current.r += pixel.r;
        current.g += pixel.g;
        current.b += pixel.b;
      } else {
        buckets.set(key, { n: 1, ...pixel });
      }
    }

    const ranked = [...buckets.values()].sort((left, right) => right.n - left.n);
    const palette: string[] = [];

    for (const bucket of ranked) {
      const average = {
        r: bucket.r / bucket.n,
        g: bucket.g / bucket.n,
        b: bucket.b / bucket.n,
      };
      const hex = rgbToHex(average);
      const rgb = parseHexColor(hex);
      if (!rgb) continue;
      if (
        palette.some((existing) => {
          const other = parseHexColor(existing);
          return other ? colorDistance(rgb, other) < SIMILAR_THRESHOLD : false;
        })
      ) {
        continue;
      }
      palette.push(hex);
      if (palette.length >= count) break;
    }

    return palette;
  } catch {
    return [];
  }
}
