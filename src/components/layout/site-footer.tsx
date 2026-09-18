import { cn } from "@/lib/utils";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "border-t border-[var(--chocolate-light)]/20 bg-[var(--cream-dark)]/30 py-8 text-sm text-muted-foreground",
        className,
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-[family-name:var(--font-display)] font-medium text-[var(--chocolate-dark)]">
            Box &amp; Go
          </span>{" "}
          — Visual configurator concept for corporate gifting.
        </p>
        <p className="text-xs">Sample data only · Not official Cocoa Dolce branding</p>
      </div>
    </footer>
  );
}
