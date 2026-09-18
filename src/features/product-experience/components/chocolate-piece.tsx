import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import type { Chocolate } from "@/types";

interface ChocolatePieceProps {
  chocolate: Chocolate;
  size?: "sm" | "md" | "lg";
  className?: string;
  style?: CSSProperties;
  /** When set, renders the corporate logo on a branded chocolate disc. */
  logoUrl?: string | null;
}

const sizeClasses = {
  sm: "size-8 rounded-md",
  md: "size-12 rounded-lg",
  lg: "size-16 rounded-xl",
};

const logoSizeClasses = {
  sm: "max-h-5 max-w-5",
  md: "max-h-8 max-w-8",
  lg: "max-h-10 max-w-10",
};

export function ChocolatePiece({
  chocolate,
  size = "md",
  className,
  style,
  logoUrl,
}: ChocolatePieceProps) {
  const showLogo = Boolean(chocolate.isBranded && logoUrl);

  return (
    <div
      className={cn(
        "relative overflow-hidden shadow-sm ring-1 ring-black/10",
        sizeClasses[size],
        chocolate.isBranded && "ring-2 ring-[var(--gold)]/60",
        className,
      )}
      style={{ backgroundColor: chocolate.color, ...style }}
      title={chocolate.name}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 50%, rgba(0,0,0,0.15) 100%)",
        }}
      />
      <div className="absolute inset-x-1 top-1 h-1/4 rounded-full bg-white/20 blur-[1px]" />

      {showLogo && logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt=""
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-sm",
            logoSizeClasses[size],
          )}
        />
      )}
    </div>
  );
}
