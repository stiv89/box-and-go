export interface RibbonColorOption {
  id: string;
  label: string;
  color: string;
  src: string;
}

export const RIBBON_COLORS: RibbonColorOption[] = [
  { id: "classic-brown", label: "Classic Brown", color: "#5c3d2e", src: "/ribbons/classic-brown.png" },
  { id: "deep-cocoa", label: "Deep Cocoa", color: "#3d2314", src: "/ribbons/deep-cocoa.png" },
  { id: "champagne-gold", label: "Champagne Gold", color: "#b8956b", src: "/ribbons/champagne-gold.png" },
  { id: "burgundy", label: "Burgundy", color: "#6b2d3c", src: "/ribbons/burgundy.png" },
  { id: "forest", label: "Forest", color: "#2f4f3a", src: "/ribbons/forest.png" },
  { id: "slate", label: "Slate", color: "#4a4a4a", src: "/ribbons/slate.png" },
];

export function getRibbonOption(ribbon: { color?: string; style?: string }) {
  return (
    RIBBON_COLORS.find((option) => option.id === ribbon.style) ??
    RIBBON_COLORS.find((option) => option.color === ribbon.color) ??
    RIBBON_COLORS[0]!
  );
}
