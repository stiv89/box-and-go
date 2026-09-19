"use client";

import { Suspense, useEffect, useState } from "react";

import { ExperienceErrorBoundary } from "@/components/feedback/experience-error-boundary";
import { DndBuilderProvider } from "@/features/box-builder";
import { BuilderExperience } from "@/features/product-experience/components/builder-experience";
import { SHARE_QUERY_PARAM } from "@/features/product-experience/lib/share-config";
import { useBoxStore } from "@/stores/use-box-store";

export function BuilderWorkspace() {
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    const hasShare = new URLSearchParams(window.location.search).has(SHARE_QUERY_PARAM);
    if (hasShare) {
      setSessionReady(true);
      return;
    }

    void Promise.resolve(useBoxStore.persist.rehydrate())
      .catch(() => undefined)
      .finally(() => setSessionReady(true));
  }, []);

  return (
    <ExperienceErrorBoundary>
      <DndBuilderProvider>
        <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
          {!sessionReady ? (
            <div className="flex-1 bg-[oklch(0.991_0.006_85)]" aria-busy="true" />
          ) : (
            <Suspense fallback={<div className="flex-1 bg-[oklch(0.991_0.006_85)]" />}>
              <BuilderExperience />
            </Suspense>
          )}
        </div>
      </DndBuilderProvider>
    </ExperienceErrorBoundary>
  );
}
