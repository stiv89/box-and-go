export interface PackagingOption {
  id: string;
  label: string;
  description: string;
  src: string;
}

export const PACKAGING_OPTIONS: PackagingOption[] = [
  {
    id: "standard",
    label: "Standard Wrap",
    description: "Classic tissue and outer sleeve.",
    src: "/boxes/standard-wrap.png",
  },
  {
    id: "gift",
    label: "Gift Presentation",
    description: "Elevated wrap with ribbon accent on the outer box.",
    src: "/boxes/gift-presentation.png",
  },
  {
    id: "corporate",
    label: "Corporate Sleeve",
    description: "Minimal sleeve suited for logo-forward branding.",
    src: "/boxes/corporate-sleeve.png",
  },
];

export const CARD_MESSAGE_MAX_LENGTH = 120;
