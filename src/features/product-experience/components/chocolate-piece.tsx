import type { CSSProperties } from "react";

import { BrandedChocolatePiece } from "@/features/product-experience/components/branded-chocolate-piece";
import { cn } from "@/lib/utils";
import type { Chocolate } from "@/types";

interface ChocolatePieceProps {
  chocolate: Chocolate;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
  /** When set, renders the corporate logo as a surface imprint on a branded disc. */
  logoUrl?: string | null;
}

const sizeClasses = {
  sm: "size-8",
  md: "size-12",
  lg: "size-16",
};

export function ChocolatePiece({
  chocolate,
  size = "md",
  className,
  style,
  logoUrl,
}: ChocolatePieceProps) {
  if (chocolate.isBranded) {
    return (
      <BrandedChocolatePiece
        chocolate={chocolate}
        logoUrl={logoUrl}
        size={size}
        className={className}
        style={style}
      />
    );
  }

  const hasImage = Boolean(chocolate.imageUrl);

  return (
    <div
      className={cn(
        "relative",
        sizeClasses[size],
        hasImage
          ? "bg-transparent shadow-none ring-0"
          : "overflow-hidden rounded-lg shadow-sm ring-1 ring-black/10",
        className,
      )}
      style={!hasImage ? { backgroundColor: chocolate.color, ...style } : style}
      title={chocolate.name}
    >
      {hasImage && chocolate.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={chocolate.imageUrl}
          alt=""
          className="absolute inset-0 size-full object-contain"
        />
      )}

      {!hasImage && (
        <>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
            }}
          />
          <div className="absolute inset-x-1 top-1 h-1/4 rounded-full bg-white/20 blur-[1px]" />
        </>
      )}
    </div>
  );
}
