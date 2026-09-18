"use client";

import { FileOutput } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildProductionSlotsFromStore } from "@/lib/production-slots";
import { getBoxConfigurationFromStore, useBoxStore } from "@/stores/use-box-store";

/**
 * Integration point for Developer B (feature/production-export).
 *
 * Expected contract:
 * - Read configuration via getBoxConfigurationFromStore(useBoxStore.getState())
 * - Produce ProductionSpecification, JSON export, printable doc, shareable proof
 *
 * Do not implement export logic here — this slot is intentionally pending.
 */
export function ProductionExportSlot() {
  const state = useBoxStore();

  function handlePreviewData() {
    const config = getBoxConfigurationFromStore(state);
    const slots = buildProductionSlotsFromStore(state);
    console.info("[Box & Go] Configuration ready for export module:", {
      ...config,
      productionSlots: slots,
    });
  }

  return (
    <div className="rounded-xl border border-dashed border-[var(--chocolate-light)]/50 bg-[var(--cream)]/50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <FileOutput className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <p className="text-sm font-medium">Production export</p>
            <p className="text-xs text-muted-foreground">
              Pending integration from{" "}
              <code className="rounded bg-muted px-1">feature/production-export</code>.
              Export will consume{" "}
              <code className="rounded bg-muted px-1">getBoxConfigurationFromStore()</code>.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled
            title="Export module not yet integrated"
            className="w-full opacity-60"
          >
            Export specification — coming soon
          </Button>
          <button
            type="button"
            onClick={handlePreviewData}
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
          >
            Preview config in console (dev)
          </button>
        </div>
      </div>
    </div>
  );
}
