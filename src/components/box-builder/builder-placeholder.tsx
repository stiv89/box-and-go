"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BOX_SIZES } from "@/lib/constants";
import { useBoxStore } from "@/stores/use-box-store";
import type { BoxSize } from "@/types";

const BOX_SIZE_OPTIONS: BoxSize[] = [9, 16];

export function BuilderPlaceholder() {
  const boxSize = useBoxStore((state) => state.boxSize);
  const slots = useBoxStore((state) => state.slots);
  const quantity = useBoxStore((state) => state.quantity);
  const catalog = useBoxStore((state) => state.catalog);
  const setBoxSize = useBoxStore((state) => state.setBoxSize);

  const filledCount = slots.filter((slot) => slot.chocolateId !== null).length;
  const { rows, cols } = BOX_SIZES[boxSize];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardHeader>
          <CardTitle>Box Preview</CardTitle>
          <CardDescription>
            Placeholder grid — drag-and-drop will be implemented on{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">feature/box-builder</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="mx-auto grid max-w-md gap-2 rounded-xl border border-dashed border-border bg-muted/20 p-4"
            style={{
              gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            }}
          >
            {slots.map((slot) => {
              const chocolate = catalog.find((item) => item.id === slot.chocolateId);
              return (
                <div
                  key={slot.index}
                  className="flex aspect-square items-center justify-center rounded-lg border border-border/70 bg-background text-xs text-muted-foreground"
                  style={
                    chocolate
                      ? { backgroundColor: `${chocolate.color}33`, borderColor: chocolate.color }
                      : undefined
                  }
                  title={chocolate?.name ?? "Empty slot"}
                >
                  {chocolate ? chocolate.name.split(" ")[0] : slot.index + 1}
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {rows}×{cols} grid · {filledCount}/{boxSize} slots filled
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
            <CardDescription>Shared Zustand store — ready for feature work.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-sm font-medium">Box size</p>
              <div className="flex flex-wrap gap-2">
                {BOX_SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setBoxSize(size)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                      boxSize === size
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    {BOX_SIZES[size].label}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary">Quantity: {quantity}</Badge>
              <Badge variant="outline">{catalog.length} sample chocolates</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coming next</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Developer 1: drag-and-drop slot placement</p>
            <p>• Developer 2: logo, ribbon, and card customization</p>
            <p>• Developer 3: production specs and export</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
