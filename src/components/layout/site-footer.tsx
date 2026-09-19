"use client";

import { usePathname } from "next/navigation";

import { TeamCredits } from "@/components/layout/team-credits";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  const pathname = usePathname();

  if (pathname === "/builder") {
    return null;
  }

  return (
    <footer
      id="site-footer"
      className={cn(
        "relative z-20 shrink-0 border-t border-[var(--chocolate-light)]/20 bg-white py-3 text-[11px] text-muted-foreground sm:text-xs",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 sm:px-6">
        <p>© {new Date().getFullYear()} Box &amp; Go. Todos los derechos reservados.</p>
        <TeamCredits />
      </div>
    </footer>
  );
}
