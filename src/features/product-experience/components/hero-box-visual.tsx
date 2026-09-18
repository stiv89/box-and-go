import { DEMO_CHOCOLATES } from "@/data/demo-chocolates";
import { ChocolatePiece } from "@/features/product-experience/components/chocolate-piece";

const HERO_GRID = DEMO_CHOCOLATES.slice(0, 9);

export function HeroBoxVisual() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-sm"
      aria-hidden
    >
      <div className="absolute inset-0 rounded-3xl bg-[var(--cream-dark)] shadow-[0_20px_60px_-20px_rgba(60,35,20,0.35)] ring-1 ring-[var(--chocolate-light)]/30" />
      <div
        className="absolute left-1/2 top-0 h-10 w-28 -translate-x-1/2 -translate-y-1/3 rounded-sm bg-[var(--gold)] shadow-md"
      />
      <div className="absolute inset-0 flex items-center justify-center p-10">
        <div className="grid grid-cols-3 gap-2.5">
          {HERO_GRID.map((chocolate, index) => (
            <ChocolatePiece
              key={chocolate.id}
              chocolate={chocolate}
              size="lg"
              className="shadow-md"
              style={{ transform: `rotate(${(index % 3) - 1}deg)` }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-x-8 bottom-8 rounded-lg border border-[var(--chocolate-light)]/20 bg-card/90 px-4 py-3 text-center backdrop-blur-sm">
        <p className="font-[family-name:var(--font-display)] text-sm text-[var(--chocolate-dark)]">
          Your brand, beautifully boxed
        </p>
      </div>
    </div>
  );
}
