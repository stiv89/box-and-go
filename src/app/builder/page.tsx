import type { Metadata } from "next";

import { BuilderWorkspace } from "@/features/product-experience";

export const metadata: Metadata = {
  title: "Builder | Box & Go",
  description: "Configure your corporate chocolate box layout, branding, and order details.",
};

export default function BuilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <BuilderWorkspace />
    </div>
  );
}
