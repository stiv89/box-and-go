"use client";

import { useState } from "react";
import { Download, FileOutput, Printer, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  assembleClientProofHtml,
  buildPrintableProductionHtml,
  buildProductionSpecification,
  downloadClientProofPdf,
  downloadHtmlDocument,
  downloadProductionSpecificationJson,
  openPrintableProductionDocument,
  preparePortableConfiguration,
  validateProductionSpecification,
} from "@/features/production";
import { notify } from "@/lib/notify";
import { toUserFacingError, USER_ERROR_EXPORT } from "@/lib/user-facing-error";
import { getBoxConfigurationFromStore, useBoxStore } from "@/stores/use-box-store";
import type { BoxConfiguration, ProductionSpecification } from "@/types";

type ExportAction = "json" | "print" | "proof";

export function ProductionExportSlot() {
  const catalog = useBoxStore((s) => s.catalog);
  const [pending, setPending] = useState<ExportAction | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  async function runExport(
    action: ExportAction,
    run: (args: {
      configuration: BoxConfiguration;
      spec: ProductionSpecification;
    }) => void | Promise<void>,
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
        notify.error(validation.errors[0] ?? USER_ERROR_EXPORT);
        return;
      }

      await run({ configuration, spec });
      notify.success(
        action === "json"
          ? "Production JSON downloaded."
          : action === "print"
            ? "Printable specification is ready."
            : "Client proof PDF downloaded.",
      );
    } catch (error) {
      const message = toUserFacingError(error, USER_ERROR_EXPORT);
      setErrors([message]);
      notify.error(message, { onRetry: () => void runExport(action, run) });
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
    void runExport("print", async ({ configuration, spec }) => {
      const html = await buildPrintableProductionHtml({ configuration, spec, catalog });
      const opened = openPrintableProductionDocument(html);
      if (!opened) {
        downloadHtmlDocument(html, `box-and-go-production-${spec.orderId}.html`);
      }
    });
  }

  function handleDownloadProof() {
    void runExport("proof", async ({ configuration, spec }) => {
      const { html } = await assembleClientProofHtml({ configuration, spec, catalog });
      await downloadClientProofPdf(html, "box-and-go-proof.pdf");
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
            <ul className="space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive" role="alert">
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
              {pending === "proof" ? "Preparing…" : "Download client proof PDF"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
