"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/feedback/error-fallback";
import { logger } from "@/lib/logger";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("route-error", error.name);
  }, [error]);

  return <ErrorFallback onRetry={reset} />;
}
