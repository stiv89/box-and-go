"use client";

import { useEffect, useRef } from "react";

import { PROOF_SHEET_CSS, renderProofSheetInnerHtml } from "@/features/production/lib/proof-sheet-markup";
import type { ProofSheetModel } from "@/features/production/lib/proof-sheet-model";

interface ProofCreationSheetProps {
  model: ProofSheetModel;
  onAssetsReady?: () => void;
  onAssetsFailed?: (message: string) => void;
}

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete) {
    return image.naturalWidth > 0
      ? Promise.resolve()
      : Promise.reject(new Error("A proof image loaded empty."));
  }
  return new Promise((resolve, reject) => {
    image.addEventListener(
      "load",
      () => {
        if (image.naturalWidth === 0) {
          reject(new Error("A proof image loaded empty."));
          return;
        }
        resolve();
      },
      { once: true },
    );
    image.addEventListener("error", () => reject(new Error("A proof image failed to load.")), {
      once: true,
    });
  });
}

/** Editorial proof used on-screen; markup matches the downloaded HTML. */
export function ProofCreationSheet({
  model,
  onAssetsReady,
  onAssetsFailed,
}: ProofCreationSheetProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = hostRef.current;
    if (!root) return;
    const images = [...root.querySelectorAll("img")];
    let cancelled = false;

    Promise.all(images.map((image) => waitForImage(image)))
      .then(() => {
        if (!cancelled) onAssetsReady?.();
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        onAssetsFailed?.(
          error instanceof Error ? error.message : "The proof images didn’t finish loading.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [model, onAssetsReady, onAssetsFailed]);

  return (
    <div ref={hostRef} className="bng-proof-host overflow-hidden rounded-2xl border border-[var(--chocolate-light)]/30 bg-[#f3eadc]">
      <style>{PROOF_SHEET_CSS}</style>
      <div dangerouslySetInnerHTML={{ __html: renderProofSheetInnerHtml(model) }} />
    </div>
  );
}
