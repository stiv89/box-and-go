export const BUILDER_VISUALS = {
  closed: "/builder/box-closed.png",
  open9: "/builder/box-open-9.png",
  open16: "/builder/box-open-16.png",
  ribbon: "/builder/ribbon-bow.png",
} as const;

/** Lid frame inside the closed-box PNG, used to seat the ribbon overlay. */
export const CLOSED_BOX_RIBBON_FRAME = {
  top: "12.1%",
  left: "7.7%",
  width: "84.6%",
  height: "84.6%",
} as const;

/** Customer mark on the left ivory panel of corporate-sleeve.png (not the printed band). */
export const CORPORATE_SLEEVE_LOGO_ANCHOR = {
  leftPercent: 22,
  topPercent: 46,
} as const;

export interface CavityRect {
  /** Percent of the open-box PNG (not the preview chrome). */
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * Bounding tray used when a uniform grid is needed. Prefer `OPEN_CAVITY_LAYOUT`
 * for the configurator overlay — the wells are perspective-warped.
 */
export const OPEN_TRAY_INSET = {
  9: {
    top: "49.12%",
    left: "27.11%",
    right: "27.83%",
    bottom: "11.32%",
    columnGap: "4.4%",
    rowGap: "3.4%",
    pieceScale: 1.3,
  },
  16: {
    top: "47.77%",
    left: "24.40%",
    right: "24.80%",
    bottom: "10.05%",
    columnGap: "4.6%",
    rowGap: "4.8%",
    pieceScale: 1.3,
  },
} as const;

/**
 * Per-cavity rectangles measured from the dark well floors of
 * box-open-9.png / box-open-16.png (1254×1254). Index is row-major
 * from the lid (top of the tray) so slot 0 is top-left.
 */
export const OPEN_CAVITY_LAYOUT: Record<9 | 16, readonly CavityRect[]> = {
  9: [
    { left: 27.99, top: 49.12, width: 13.24, height: 11.8 },
    { left: 43.14, top: 49.12, width: 12.84, height: 11.8 },
    { left: 58.37, top: 49.12, width: 12.52, height: 11.8 },
    { left: 27.59, top: 62.04, width: 13.56, height: 12.28 },
    { left: 42.98, top: 62.04, width: 13.8, height: 12.28 },
    { left: 58.53, top: 62.04, width: 13.32, height: 12.28 },
    { left: 27.11, top: 75.52, width: 14.2, height: 13.16 },
    { left: 42.82, top: 75.52, width: 13.72, height: 13.16 },
    { left: 58.69, top: 75.52, width: 13.48, height: 13.16 },
  ],
  16: [
    { left: 25.76, top: 47.77, width: 11.08, height: 9.33 },
    { left: 38.2, top: 47.77, width: 11.08, height: 9.33 },
    { left: 50.72, top: 47.77, width: 10.36, height: 9.33 },
    { left: 63.08, top: 47.77, width: 10.52, height: 9.33 },
    { left: 25.28, top: 58.21, width: 11.4, height: 9.73 },
    { left: 37.96, top: 58.21, width: 11.24, height: 9.73 },
    { left: 50.72, top: 58.21, width: 10.76, height: 9.73 },
    { left: 63.32, top: 58.21, width: 10.68, height: 9.73 },
    { left: 24.8, top: 69.14, width: 11.56, height: 9.81 },
    { left: 37.72, top: 69.14, width: 11.48, height: 9.81 },
    { left: 50.72, top: 69.14, width: 11.08, height: 9.81 },
    { left: 63.64, top: 69.14, width: 11.0, height: 9.81 },
    { left: 24.4, top: 80.06, width: 11.72, height: 9.89 },
    { left: 37.48, top: 80.06, width: 11.72, height: 9.89 },
    { left: 50.8, top: 80.06, width: 11.64, height: 9.89 },
    { left: 63.88, top: 80.06, width: 11.32, height: 9.89 },
  ],
};
