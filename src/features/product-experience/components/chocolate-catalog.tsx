"use client";

import { BrandedChocolatePanel } from "@/features/product-experience/components/branded-chocolate-panel";
import { ChocolatePiece } from "@/features/product-experience/components/chocolate-piece";
import { cn } from "@/lib/utils";
import { useBoxStore } from "@/stores/use-box-store";
import type { Chocolate } from "@/types";

function CatalogItem({
  chocolate,
  logoUrl,
}: {
  chocolate: Chocolate;
  logoUrl: string | null;
}) {
  const selectedChocolateId = useBoxStore((s) => s.selectedChocolateId);
  const setSelectedChocolate = useBoxStore((s) => s.setSelectedChocolate);
  const isSelected = selectedChocolateId === chocolate.id;

  return (
    <button
      type="button"
      onClick={() => setSelectedChocolate(isSelected ? null : chocolate.id)}
      aria-pressed={isSelected}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all outline-none",
        "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
        chocolate.isBranded && "border-[var(--gold)]/40 bg-[var(--gold)]/5",
        isSelected
          ? "border-[var(--gold)] bg-[var(--cream-dark)] shadow-sm"
          : "border-[var(--chocolate-light)]/30 bg-card hover:border-[var(--chocolate-light)] hover:bg-[var(--cream-dark)]/50",
      )}
    >
      <ChocolatePiece chocolate={chocolate} size="sm" logoUrl={logoUrl} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{chocolate.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {chocolate.isBranded ? "Logo imprint" : chocolate.flavor}
        </p>
      </div>
      {isSelected && (
        <span className="shrink-0 rounded-full bg-[var(--gold)]/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--chocolate-dark)]">
          Selected
        </span>
      )}
    </button>
  );
}

export function ChocolateCatalog() {
  const catalog = useBoxStore((s) => s.catalog);
  const selectedChocolateId = useBoxStore((s) => s.selectedChocolateId);
  const logoUrl = useBoxStore((s) => s.customization.logo.url);

  const regularChocolates = catalog.filter((c) => !c.isBranded);
  const brandedChocolates = catalog.filter((c) => c.isBranded);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-lg font-medium">
          Chocolates
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Select a piece, then click a slot to place it. Branded pieces require an
          uploaded logo.
        </p>
      </div>

      <BrandedChocolatePanel />

      {selectedChocolateId && (
        <p className="rounded-lg border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-3 py-2 text-xs text-[var(--chocolate-dark)]">
          Click any slot in the box preview to place your selection.
        </p>
      )}

      {brandedChocolates.length > 0 && (
        <div className="space-y-2">
          {brandedChocolates.map((chocolate) => (
            <CatalogItem key={chocolate.id} chocolate={chocolate} logoUrl={logoUrl} />
          ))}
        </div>
      )}

      <div className="space-y-2">
        {regularChocolates.map((chocolate) => (
          <CatalogItem key={chocolate.id} chocolate={chocolate} logoUrl={logoUrl} />
        ))}
      </div>
    </div>
  );
}
