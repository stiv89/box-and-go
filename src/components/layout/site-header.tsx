import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  className?: string;
}

export function SiteHeader({ className }: SiteHeaderProps) {
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
          className="group flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2"
        >
          <span
            aria-hidden
            className="inline-flex size-9 items-center justify-center rounded-lg bg-[var(--chocolate)] font-[family-name:var(--font-display)] text-lg text-[var(--cream)]"
          >
            B
          </span>
          <div className="leading-tight">
            <span className="font-[family-name:var(--font-display)] text-lg font-medium text-[var(--chocolate-dark)]">
              Box <span className="text-[var(--gold-dark)]">&amp;</span> Go
            </span>
            <span className="hidden text-[10px] tracking-widest text-muted-foreground uppercase sm:block">
              Design. Approve. Produce.
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/equipo"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
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
            Design Your Box
          </Link>
        </div>
      </div>
    </header>
  );
}
