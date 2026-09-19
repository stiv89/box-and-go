import { DEMO_CHOCOLATES } from "@/data/demo-chocolates";
import {
  CARD_MESSAGE_MAX_LENGTH,
  getRibbonOption,
  PACKAGING_OPTIONS,
  RIBBON_COLORS,
} from "@/features/product-experience/constants";
import { isBrandedChocolateId } from "@/lib/constants";
import type { BoxSize, ChocolateId } from "@/types";

export const SHARE_QUERY_PARAM = "c";

/** Public obfuscation key — not a secret; the query just shouldn't be readable JSON. */
const SHARE_OBFUSCATION_KEY = "box-and-go-share-v1";

const MAX_SHARE_QUANTITY = 9_999;

export interface PublicSharePayload {
  v: 1;
  s: BoxSize;
  p: string;
  i: string[];
  /** Ribbon id — only meaningful for gift packaging. */
  r?: string;
  q?: number;
  /** Optional gift-card message (public copy). */
  m?: string;
}

const PUBLIC_IDS = new Set(DEMO_CHOCOLATES.map((chocolate) => chocolate.id));
const RIBBON_IDS = new Set(RIBBON_COLORS.map((option) => option.id));
const PACKAGING_IDS = new Set(PACKAGING_OPTIONS.map((option) => option.id));

function xorBytes(bytes: Uint8Array): Uint8Array {
  const key = new TextEncoder().encode(SHARE_OBFUSCATION_KEY);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i += 1) {
    out[i] = bytes[i]! ^ key[i % key.length]!;
  }
  return out;
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const binary = atob(padded + pad);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch {
    return null;
  }
}

function bytesToJson(bytes: Uint8Array): string | null {
  try {
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

export function isPublicCatalogId(id: string | null): id is ChocolateId {
  return Boolean(id) && PUBLIC_IDS.has(id as ChocolateId);
}

function compactPayload(payload: PublicSharePayload): PublicSharePayload {
  const compact: PublicSharePayload = {
    v: 1,
    s: payload.s,
    p: payload.p,
    i: payload.i,
  };
  if (payload.p === "gift" && payload.r) compact.r = payload.r;
  if (payload.q && payload.q > 1) compact.q = payload.q;
  if (payload.m) compact.m = payload.m;
  return compact;
}

export function encodeShareConfig(payload: PublicSharePayload): string {
  const json = JSON.stringify(compactPayload(payload));
  const xor = xorBytes(new TextEncoder().encode(json));
  return bytesToBase64Url(xor);
}

function parseShareJson(json: string): PublicSharePayload | null {
  try {
    const parsed = JSON.parse(json) as Partial<PublicSharePayload>;
    if (parsed.v !== 1) return null;
    if (parsed.s !== 9 && parsed.s !== 16) return null;
    if (typeof parsed.p !== "string" || !PACKAGING_IDS.has(parsed.p)) return null;
    if (!Array.isArray(parsed.i) || parsed.i.length !== parsed.s) return null;

    let ribbon: string | undefined;
    if (parsed.p === "gift") {
      if (typeof parsed.r !== "string" || !RIBBON_IDS.has(parsed.r)) return null;
      ribbon = parsed.r;
    }

    let quantity: number | undefined;
    if (parsed.q !== undefined) {
      if (typeof parsed.q !== "number" || !Number.isFinite(parsed.q)) return null;
      const q = Math.floor(parsed.q);
      if (q < 1 || q > MAX_SHARE_QUANTITY) return null;
      quantity = q;
    }

    let message: string | undefined;
    if (parsed.m !== undefined) {
      if (typeof parsed.m !== "string") return null;
      const trimmed = parsed.m.slice(0, CARD_MESSAGE_MAX_LENGTH);
      if (trimmed.length > 0) message = trimmed;
    }

    const slots = parsed.i.map((id) => {
      if (typeof id !== "string" || id.length === 0) return "";
      if (isBrandedChocolateId(id) || !PUBLIC_IDS.has(id)) return "";
      return id;
    });

    return compactPayload({
      v: 1,
      s: parsed.s,
      p: parsed.p,
      r: ribbon,
      i: slots,
      q: quantity,
      m: message,
    });
  } catch {
    return null;
  }
}

export function decodeShareConfig(raw: string): PublicSharePayload | null {
  if (!raw || /[^A-Za-z0-9_-]/.test(raw)) return null;

  const bytes = base64UrlToBytes(raw);
  if (!bytes) return null;

  const obfuscated = bytesToJson(xorBytes(bytes));
  const fromObfuscated = obfuscated ? parseShareJson(obfuscated) : null;
  if (fromObfuscated) return fromObfuscated;

  const plain = bytesToJson(bytes);
  return plain ? parseShareJson(plain) : null;
}

export function buildShareSearch(encoded: string): string {
  return `${SHARE_QUERY_PARAM}=${encodeURIComponent(encoded)}`;
}

export function buildShareUrl(encoded: string, origin?: string): string {
  const path = `/builder?${buildShareSearch(encoded)}`;
  if (!origin) return path;
  return `${origin}${path}`;
}

export function publicShareFromSelection(args: {
  boxSize: BoxSize;
  slots: Array<{ chocolateId: ChocolateId | null }>;
  ribbon: { color?: string; style?: string };
  packagingId: string;
  quantity?: number;
  message?: string;
}): PublicSharePayload {
  const packagingId = PACKAGING_IDS.has(args.packagingId)
    ? args.packagingId
    : "standard";
  const ribbon = getRibbonOption(args.ribbon);
  const quantity = Math.min(
    MAX_SHARE_QUANTITY,
    Math.max(1, Math.floor(args.quantity ?? 1)),
  );
  const message = (args.message ?? "").slice(0, CARD_MESSAGE_MAX_LENGTH).trim();
  const slots = Array.from({ length: args.boxSize }, (_, index) => {
    const id = args.slots[index]?.chocolateId ?? null;
    return isPublicCatalogId(id) ? id : "";
  });

  return compactPayload({
    v: 1,
    s: args.boxSize,
    p: packagingId,
    r: packagingId === "gift" ? ribbon.id : undefined,
    i: slots,
    q: quantity,
    m: message || undefined,
  });
}
