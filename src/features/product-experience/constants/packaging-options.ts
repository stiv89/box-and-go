export interface PackagingOption {
  id: string;
  label: string;
  description: string;
}

export const PACKAGING_OPTIONS: PackagingOption[] = [
  {
    id: "standard",
    label: "Standard Wrap",
    description: "Classic tissue and outer sleeve.",
  },
  {
    id: "gift",
    label: "Gift Presentation",
    description: "Elevated wrap with ribbon accent on the outer box.",
  },
  {
    id: "corporate",
    label: "Corporate Sleeve",
    description: "Minimal sleeve suited for logo-forward branding.",
  },
];

export const CARD_MESSAGE_MAX_LENGTH = 120;
