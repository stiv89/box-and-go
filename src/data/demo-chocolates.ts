import { FLAVOR_IMAGES } from "@/lib/constants/flavor-images";
import type { Chocolate } from "@/types";

/**
 * Sample catalog — 9 flavors matching the hero box assortment.
 * Product shots live in /public/sabores/.
 */
export const DEMO_CHOCOLATES: Chocolate[] = [
  {
    id: "sample-dark-sea-salt",
    name: "Dark Sea Salt",
    description: "72% dark chocolate with flaky sea salt.",
    flavor: "Dark",
    color: "#3d2314",
    imageUrl: FLAVOR_IMAGES.darkSeaSalt,
  },
  {
    id: "sample-milk-hazelnut",
    name: "Milk Hazelnut Praline",
    description: "Creamy milk chocolate with roasted hazelnut ganache.",
    flavor: "Milk",
    color: "#8b5a2b",
    imageUrl: FLAVOR_IMAGES.milkHazelnut,
  },
  {
    id: "sample-white-raspberry",
    name: "White Raspberry",
    description: "White chocolate infused with raspberry purée.",
    flavor: "White",
    color: "#e8c4c4",
    imageUrl: FLAVOR_IMAGES.whiteRaspberry,
  },
  {
    id: "sample-caramel-pecan",
    name: "Caramel Pecan",
    description: "Soft caramel center with toasted pecan pieces.",
    flavor: "Caramel",
    color: "#a0522d",
    imageUrl: FLAVOR_IMAGES.caramelPecan,
  },
  {
    id: "sample-espresso-bean",
    name: "Espresso Bean",
    description: "Dark chocolate shell around a crisp espresso bean.",
    flavor: "Coffee",
    color: "#4a3728",
    imageUrl: FLAVOR_IMAGES.espressoBean,
  },
  {
    id: "sample-mint-crisp",
    name: "Mint Crisp",
    description: "Dark chocolate with peppermint oil and rice crisps.",
    flavor: "Mint",
    color: "#2f4f3a",
    imageUrl: FLAVOR_IMAGES.mintCrisp,
  },
  {
    id: "sample-orange-zest",
    name: "Orange Zest",
    description: "Milk chocolate ganache with candied orange peel.",
    flavor: "Citrus",
    color: "#c67b3c",
    imageUrl: FLAVOR_IMAGES.orangeZest,
  },
  {
    id: "sample-champagne-truffle",
    name: "Champagne Truffle",
    description: "White chocolate truffle with a hint of sparkling wine.",
    flavor: "Truffle",
    color: "#f5e6d3",
    imageUrl: FLAVOR_IMAGES.champagneTruffle,
  },
  {
    id: "sample-salted-caramel",
    name: "Salted Caramel",
    description: "Milk chocolate with caramel drizzle and sea salt.",
    flavor: "Salted",
    color: "#9a6b3a",
    imageUrl: FLAVOR_IMAGES.saltedCaramel,
  },
];
