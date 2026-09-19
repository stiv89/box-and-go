export const TEAM_NAME = "the team";
export const TEAM_ORIGIN_LABEL = "Made with love from Paraguay";
export const TEAM_FLAG_SRC = "/flag.webp";

/**
 * sessionStorage flag for the landing intro modal.
 * A new tab/session can show Meet the team once; it does not persist across browser restarts.
 */
export const TEAM_INTRO_SEEN_KEY = "box-and-go:team-intro-seen";

export const TEAM_CHOCOLATHON_DISCLAIMER =
  "Box & Go is an independent Chocolathon prototype. It is not an official Cocoa Dolce product or affiliated with Cocoa Dolce.";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoSrc: string;
  photoAlt: string;
  featured?: boolean;
  href?: string;
}

/** Names, roles, photos, and bios provided by the team. Order is leadership first. */
export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "esteban",
    name: "Esteban Jara",
    role: "Product Lead, UX/UI & Integration",
    bio: "Initial project architecture (Next.js, TypeScript, Tailwind), product configurator (custom 9- and 16-piece boxes, branded placement, live preview), visual and responsive design, Vercel deploy, and final integration of every piece for release.",
    photoSrc: "/equipo/estebanjara.jpg",
    photoAlt: "Esteban Jara, Product Lead of Box & Go",
    featured: true,
  },
  {
    id: "fernando",
    name: "Fernando Fleitas",
    role: "Production Export",
    bio: "Designed and built the production-specification export module, which turns each client configuration into exact chocolate positions, types, and quantities ready for the factory.",
    photoSrc: "/equipo/fernandofleitas.jpg",
    photoAlt: "Fernando Fleitas, Production Export of Box & Go",
  },
  {
    id: "manuel",
    name: "Manuel Ayala",
    role: "Box Builder",
    bio: "Built the interactive box-assembly editor, including the dnd-kit drag-and-drop experience that lets clients place each chocolate in real time.",
    photoSrc: "/equipo/manuel.jpg",
    photoAlt: "Manuel Ayala, Box Builder of Box & Go",
  },
];
