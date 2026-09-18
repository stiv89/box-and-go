"use client";

import { useState } from "react";
import { Download, FileOutput, Printer, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  buildClientProofHtml,
  buildPrintableProductionHtml,
  buildProductionSpecification,
  downloadHtmlDocument,
  downloadProductionSpecificationJson,
  openPrintableProductionDocument,
  preparePortableConfiguration,
  validateProductionSpecification,
} from "@/features/production";
import { getBoxConfigurationFromStore, useBoxStore } from "@/stores/use-box-store";
import type { BoxConfiguration, ProductionSpecification } from "@/types";

type ExportAction = "json" | "print" | "proof";

export function ProductionExportSlot() {
  const catalog = useBoxStore((s) => s.catalog);
  const [pending, setPending] = useState<ExportAction | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function runExport(
    action: ExportAction,
    run: (args: { configuration: BoxConfiguration; spec: ProductionSpecification }) => void,
  ) {
    setErrors([]);
    setPending(action);
    try {
      const rawConfiguration = getBoxConfigurationFromStore(useBoxStore.getState());
      const configuration = await preparePortableConfiguration(rawConfiguration);
      const spec = buildProductionSpecification(configuration, catalog);

      const validation = validateProductionSpecification(spec);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }

      run({ configuration, spec });
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Export failed."]);
    } finally {
      setPending(null);
    }
  }

  function handleDownloadJson() {
    void runExport("json", ({ spec }) => {
      downloadProductionSpecificationJson(spec);
    });
  }

  function handleOpenPrintable() {
    void runExport("print", ({ configuration, spec }) => {
      const html = buildPrintableProductionHtml({ configuration, spec, catalog });
      const opened = openPrintableProductionDocument(html);
      if (!opened) {
        downloadHtmlDocument(html, `box-and-go-production-${spec.orderId}.html`);
      }
    });
  }

  function handleDownloadProof() {
    void runExport("proof", ({ configuration, spec }) => {
      const html = buildClientProofHtml({ configuration, spec, catalog });
      downloadHtmlDocument(html, `box-and-go-proof-${spec.orderId}.html`);
    });
  }

  return (
    <div className="rounded-xl border border-[var(--chocolate-light)]/40 bg-[var(--cream)]/50 p-4">
      <div className="flex items-start gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
          <FileOutput className="size-4 text-muted-foreground" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <p className="text-sm font-medium">Production export</p>
            <p className="text-xs text-muted-foreground">
              Generates the production specification from the current design.
            </p>
          </div>

          {errors.length > 0 && (
            <ul className="space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          )}

          <div className="grid gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadJson}
              disabled={pending !== null}
            >
              <Download className="size-3.5" />
              {pending === "json" ? "Preparing…" : "Download production JSON"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleOpenPrintable}
              disabled={pending !== null}
            >
              <Printer className="size-3.5" />
              {pending === "print" ? "Preparing…" : "Open printable spec"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadProof}
              disabled={pending !== null}
            >
              <Share2 className="size-3.5" />
              {pending === "proof" ? "Preparing…" : "Download client proof"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
