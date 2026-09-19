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
    role: "Product Lead, UX/UI & Integración",
    bio: "Arquitectura inicial del proyecto (Next.js, TypeScript, Tailwind), configurador de producto (personalización de cajas de 9 y 16 chocolates, branded placement, vista previa en vivo), diseño visual y responsive, deploy en Vercel, e integración final de todas las partes para el release.",
    photoSrc: "/equipo/estebanjara.jpg",
    photoAlt: "Esteban Jara, Product Lead de Box & Go",
    featured: true,
  },
  {
    id: "fernando",
    name: "Fernando Fleitas",
    role: "Production Export",
    bio: "Diseñó y desarrolló el módulo de exportación de especificaciones de producción, encargado de traducir cada configuración del cliente en posiciones, tipos y cantidades exactas de chocolates listas para fábrica.",
    photoSrc: "/equipo/fernandofleitas.jpg",
    photoAlt: "Fernando Fleitas, Production Export de Box & Go",
  },
  {
    id: "manuel",
    name: "Manuel Ayala",
    role: "Box Builder",
    bio: "Construyó el editor interactivo de armado de cajas, incluyendo la experiencia de drag-and-drop con dnd-kit que permite a los clientes ubicar cada chocolate en tiempo real.",
    photoSrc: "/equipo/manuel.jpg",
    photoAlt: "Manuel Ayala, Box Builder de Box & Go",
  },
];
