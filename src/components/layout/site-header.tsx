"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/layout/brand-logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

function GlassPillHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center bg-transparent px-4 pt-4 sm:pt-5",
        className,
      )}
    >
      <Link
        href="/"
        className={cn(
          "pointer-events-auto flex items-center bg-transparent outline-none transition-opacity hover:opacity-85",
          "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        )}
      >
        <BrandLogo size="header" priority />
      </Link>
    </header>
  );
}

function DefaultHeader({ className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-[var(--chocolate-light)]/20 bg-[var(--cream)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--cream)]/85",
        className,
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="group flex items-center outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2"
        >
          <BrandLogo size="md" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/equipo"
            className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground sm:text-sm"
          >
            Equipo
          </Link>
          <Link
            href="/builder"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-[var(--chocolate)] text-[var(--cream)] hover:bg-[var(--chocolate-dark)]",
            )}
          >
            <span className="hidden sm:inline">Design Your Box</span>
            <span className="sm:hidden">Builder</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteHeader(props: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) {
    return <GlassPillHeader {...props} />;
  }

  if (pathname === "/builder") {
    return null;
  }

  return <DefaultHeader {...props} />;
}
