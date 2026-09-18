"use client";

import { Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { applyHackathonDemoConfiguration } from "@/data/demo-configuration";
import { useBoxStore } from "@/stores/use-box-store";

export function DemoLoadButton() {
  function handleLoadDemo() {
    applyHackathonDemoConfiguration(useBoxStore.getState());
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleLoadDemo}
      className="gap-2 border-[var(--gold)]/40 text-[var(--chocolate-dark)] hover:bg-[var(--gold)]/10"
    >
      <Sparkles className="size-3.5" />
      Load demo order (16-piece · 500 boxes)
    </Button>
  );
}
