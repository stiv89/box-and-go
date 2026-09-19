export interface LogoConfiguration {
  url: string | null;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface RibbonConfiguration {
  color: string;
  style: string;
}

export interface CardConfiguration {
  message: string;
  fontStyle: string;
}

export interface PackagingPreferences {
  wrapStyle: string;
  giftNote: string;
}

/** Tracks where the branded logo chocolate is placed in the grid. */
export interface BrandedPlacement {
  slotIndex: number | null;
}

export interface Customization {
  logo: LogoConfiguration;
  ribbon: RibbonConfiguration;
  card: CardConfiguration;
  packaging: PackagingPreferences;
  brandedPlacement: BrandedPlacement;
}

export function createDefaultCustomization(): Customization {
  return {
    logo: { url: null, x: 0, y: 0, scale: 1, rotation: 0 },
    ribbon: { color: "#5c3d2e", style: "classic-brown" },
    card: { message: "", fontStyle: "serif" },
    packaging: { wrapStyle: "standard", giftNote: "" },
    brandedPlacement: { slotIndex: null },
  };
}

/** Sentinel written into production exports when a ribbon is stored but not applied. */
export const INACTIVE_RIBBON: RibbonConfiguration = {
  color: "not-applied",
  style: "not-applied",
};

export interface ActiveCustomization {
  wrapStyle: string;
  ribbonApplied: boolean;
  sleeveLogoApplied: boolean;
  /** Ribbon used by the live preview / production; null when packaging has no ribbon. */
  ribbon: RibbonConfiguration | null;
  /** Logo overlay for the corporate sleeve only. */
  sleeveLogo: LogoConfiguration | null;
  /** Stored logo — still unlocks branded chocolate on later steps. */
  logo: LogoConfiguration;
  card: CardConfiguration;
  packaging: PackagingPreferences;
  brandedPlacement: BrandedPlacement;
}

/**
 * Packaging-aware view of customization. Store values are preserved;
 * ribbon is only active for gift wrap, sleeve overlay only for corporate.
 */
export function getActiveCustomization(customization: Customization): ActiveCustomization {
  const wrapStyle = customization.packaging.wrapStyle;
  const ribbonApplied = wrapStyle === "gift";
  const sleeveLogoApplied = wrapStyle === "corporate" && Boolean(customization.logo.url);

  return {
    wrapStyle,
    ribbonApplied,
    sleeveLogoApplied,
    ribbon: ribbonApplied ? customization.ribbon : null,
    sleeveLogo: sleeveLogoApplied ? customization.logo : null,
    logo: customization.logo,
    card: customization.card,
    packaging: customization.packaging,
    brandedPlacement: customization.brandedPlacement,
  };
}

/** Spec/JSON shape: keep logo for branded chocolate; do not mark a ribbon as applied off gift wrap. */
export function toExportCustomization(customization: Customization): Customization {
  const active = getActiveCustomization(customization);
  return {
    ...customization,
    ribbon: active.ribbon ?? INACTIVE_RIBBON,
  };
}
