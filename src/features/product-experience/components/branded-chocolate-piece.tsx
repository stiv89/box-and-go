import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import type { Chocolate } from "@/types";

const sizeClasses = {
  sm: "size-8",
  md: "size-12",
  lg: "size-16",
};

interface BrandedChocolatePieceProps {
  chocolate: Chocolate;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
}

/** Visual mockup: logo overlaid into a smooth disc, clipped to chocolate alpha. */
export function BrandedChocolatePiece({
  chocolate,
  logoUrl,
  size = "md",
  className,
  style,
}: BrandedChocolatePieceProps) {
  const baseSrc = chocolate.imageUrl;
  const mask = baseSrc ? { ["--bng-branded-mask" as string]: `url("${baseSrc.replace(/"/g, '\\"')}")` } : undefined;

  return (
    <span
      className={cn("bng-branded-piece relative", sizeClasses[size], className)}
      style={{ ...mask, ...style }}
      title={chocolate.name}
    >
      {baseSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="bng-branded-piece__base" src={baseSrc} alt="" />
      ) : (
        <span
          className="absolute inset-[8%] rounded-full"
          style={{ backgroundColor: chocolate.color }}
        />
      )}
      {logoUrl ? (
        <span className="bng-branded-piece__imprint">
          <span className="bng-branded-piece__well">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="bng-branded-piece__mark" src={logoUrl} alt="" />
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function BrandedImprintCaption({ className }: { className?: string }) {
  return (
    <p className={cn("text-[10px] leading-relaxed text-muted-foreground", className)}>
      Visual mockup — not a production-approved edible imprint. Solid backgrounds may
      print as a rectangle.
    </p>
  );
}
