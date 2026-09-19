import Image from "next/image";

import {
  BRAND_LOGO_SRC,
  BRAND_NAME,
  BRAND_TAGLINE,
} from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

const sizeClasses = {
  xs: "h-7",
  sm: "h-10",
  md: "h-11",
  lg: "h-14",
  header: "h-12 sm:h-16",
  hero: "h-16 sm:h-20",
} as const;

interface BrandLogoProps {
  size?: keyof typeof sizeClasses;
  className?: string;
  priority?: boolean;
}

export function BrandLogo({ size = "md", className, priority }: BrandLogoProps) {
  return (
    <Image
      src={BRAND_LOGO_SRC}
      alt={`${BRAND_NAME} — ${BRAND_TAGLINE}`}
      width={320}
      height={96}
      priority={priority}
      className={cn("w-auto object-contain", sizeClasses[size], className)}
    />
  );
}
