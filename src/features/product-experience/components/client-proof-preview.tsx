"use client";

import { useCallback, useMemo, useState } from "react";

import { ProofCreationSheet } from "@/features/product-experience/components/proof-creation-sheet";
import {
  buildProductionSpecification,
} from "@/features/production";
import { buildProofSheetModel } from "@/features/production/lib/proof-sheet-model";
import { notify } from "@/lib/notify";
import { USER_ERROR_EXPORT } from "@/lib/user-facing-error";
import { getBoxConfigurationFromStore, useBoxStore } from "@/stores/use-box-store";

export function ClientProofPreview() {
  const catalog = useBoxStore((s) => s.catalog);
  const boxSize = useBoxStore((s) => s.boxSize);
  const slots = useBoxStore((s) => s.slots);
  const quantity = useBoxStore((s) => s.quantity);
  const customization = useBoxStore((s) => s.customization);

  const proofSignature = useMemo(
    () =>
      JSON.stringify({
        boxSize,
        quantity,
        slots: slots.map((slot) => [slot.index, slot.chocolateId]),
        wrap: customization.packaging.wrapStyle,
        ribbon: customization.ribbon,
        logo: customization.logo.url,
        message: customization.card.message,
      }),
    [boxSize, quantity, slots, customization],
  );

  const preview = useMemo(() => {
    try {
      const configuration = getBoxConfigurationFromStore(useBoxStore.getState());
      const spec = buildProductionSpecification(configuration, catalog);
      return {
        model: buildProofSheetModel(configuration, spec, catalog),
        error: null as string | null,
      };
    } catch {
      return {
        model: null,
        error: USER_ERROR_EXPORT,
      };
    }
  }, [catalog, proofSignature]);

  const [readyFor, setReadyFor] = useState<string | null>(null);
  const [failedFor, setFailedFor] = useState<string | null>(null);

  const visualFailed = failedFor === proofSignature;
  const buildError = preview.error;

  const handleAssetsReady = useCallback(() => {
    setReadyFor(proofSignature);
    setFailedFor((current) => (current === proofSignature ? null : current));
  }, [proofSignature]);

  const handleAssetsFailed = useCallback(() => {
    setReadyFor((current) => (current === proofSignature ? null : current));
    setFailedFor(proofSignature);
    notify.error(USER_ERROR_EXPORT);
  }, [proofSignature]);

  const errors = [
    ...(buildError ? [buildError] : []),
    ...(visualFailed ? [USER_ERROR_EXPORT] : []),
  ];

  return (
    <div className="space-y-3">
      <div>
        <p className="font-serif text-lg text-[var(--chocolate-dark)]">Client proof</p>
        <p className="mt-0.5 text-xs text-neutral-500">
          Visual layout for team or client approval. Download saves an ivory PDF of this sheet.
        </p>
      </div>

      {errors.length > 0 ? (
        <ul
          className="space-y-1 rounded-lg border border-destructive/30 bg-destructive/5 p-2 text-xs text-destructive"
          role="alert"
        >
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      ) : null}

      {preview.model && !visualFailed ? (
        <div className="max-h-[36rem] overflow-auto">
          <ProofCreationSheet
            model={preview.model}
            onAssetsReady={handleAssetsReady}
            onAssetsFailed={handleAssetsFailed}
          />
        </div>
      ) : errors.length === 0 ? (
        <p className="text-xs text-neutral-500">Preparing proof…</p>
      ) : null}

      {readyFor === proofSignature ? (
        <span className="sr-only">Proof images are ready.</span>
      ) : null}
    </div>
  );
}
