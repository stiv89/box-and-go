"use client";

import { useEffect, useMemo, useState } from "react";

import { extractLogoPalette } from "@/features/product-experience/lib/extract-logo-colors";
import { suggestChocolatesForColors } from "@/features/product-experience/lib/suggest-palette";
import { useBoxStore } from "@/stores/use-box-store";

export function useLogoPalette() {
  const logoUrl = useBoxStore((state) => state.customization.logo.url);
  const catalog = useBoxStore((state) => state.catalog);
  const [colors, setColors] = useState<string[]>([]);

  useEffect(() => {
    if (!logoUrl) {
      setColors([]);
      return;
    }

    let cancelled = false;
    void extractLogoPalette(logoUrl).then((next) => {
      if (!cancelled) setColors(next);
    });

    return () => {
      cancelled = true;
    };
  }, [logoUrl]);

  const suggestions = useMemo(
    () => suggestChocolatesForColors(colors, catalog, 3),
    [catalog, colors],
  );

  return { colors, suggestions };
}
