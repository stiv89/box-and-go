"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useBoxStore } from "@/stores/use-box-store";

export function BoxQuantityControl() {
  const quantity = useBoxStore((s) => s.quantity);
  const setQuantity = useBoxStore((s) => s.setQuantity);

  function handleQuantityInput(value: string) {
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      setQuantity(parsed);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-[var(--chocolate-dark)]">Number of boxes</p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="min-h-10 min-w-10"
          aria-label="Decrease quantity"
          onClick={() => setQuantity(quantity - 1)}
          disabled={quantity <= 1}
        >
          <Minus className="size-3.5" />
        </Button>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => handleQuantityInput(e.target.value)}
          className="h-10 min-h-10 w-full rounded-lg border border-[var(--chocolate-light)]/40 bg-card px-3 text-center text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          aria-label="Number of boxes"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          className="min-h-10 min-w-10"
          aria-label="Increase quantity"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
