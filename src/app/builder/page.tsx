import type { Metadata } from "next";

import { BuilderWorkspace } from "@/features/product-experience";

export const metadata: Metadata = {
  title: "Build Your Box | Box & Go",
  description: "Design a custom corporate chocolate box, one decision at a time.",
};

export default function BuilderPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <BuilderWorkspace />
    </div>
  );
}
