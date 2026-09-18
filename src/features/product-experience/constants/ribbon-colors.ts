export interface RibbonColorOption {
  id: string;
  label: string;
  color: string;
}

export const RIBBON_COLORS: RibbonColorOption[] = [
  { id: "classic-brown", label: "Classic Brown", color: "#5c3d2e" },
  { id: "deep-cocoa", label: "Deep Cocoa", color: "#3d2314" },
  { id: "champagne-gold", label: "Champagne Gold", color: "#b8956b" },
  { id: "burgundy", label: "Burgundy", color: "#6b2d3c" },
  { id: "forest", label: "Forest", color: "#2f4f3a" },
  { id: "slate", label: "Slate", color: "#4a4a4a" },
];
