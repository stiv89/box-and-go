"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BOX_SIZES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useBoxStore } from "@/stores/use-box-store";
import type { BoxSize } from "@/types";

const BOX_SIZE_OPTIONS: BoxSize[] = [9, 16];

export function BoxSizeSelector() {
  const boxSize = useBoxStore((s) => s.boxSize);
  const slots = useBoxStore((s) => s.slots);
  const setBoxSize = useBoxStore((s) => s.setBoxSize);

  const [pendingSize, setPendingSize] = useState<BoxSize | null>(null);

  const filledCount = slots.filter((s) => s.chocolateId !== null).length;

  function requestSizeChange(size: BoxSize) {
    if (size === boxSize) return;
    if (filledCount > 0) {
      setPendingSize(size);
    } else {
      setBoxSize(size);
    }
  }

  function confirmSizeChange() {
    if (pendingSize !== null) {
      setBoxSize(pendingSize);
      setPendingSize(null);
    }
  }

  return (
    <>
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Box size</h3>
        <div className="flex flex-wrap gap-2">
          {BOX_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => requestSizeChange(size)}
              className={cn(
                "rounded-lg border px-4 py-2 text-sm transition-all outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2",
                boxSize === size
                  ? "border-[var(--chocolate)] bg-[var(--chocolate)] text-[var(--cream)]"
                  : "border-[var(--chocolate-light)]/40 bg-card hover:border-[var(--chocolate-light)]",
              )}
            >
              {BOX_SIZES[size].label}
            </button>
          ))}
        </div>
      </div>

      <Dialog open={pendingSize !== null} onOpenChange={(open) => !open && setPendingSize(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change box size?</DialogTitle>
            <DialogDescription>
              Switching to a {pendingSize !== null ? BOX_SIZES[pendingSize].label : ""} box will
              clear your current arrangement ({filledCount} slot
              {filledCount === 1 ? "" : "s"} filled). This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingSize(null)}>
              Cancel
            </Button>
            <Button onClick={confirmSizeChange}>Change size</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
