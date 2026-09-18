"use client";

import { BoxPreview } from "@/features/product-experience/components/box-preview";
import { BoxSizeSelector } from "@/features/product-experience/components/box-size-selector";
import { ChocolateCatalog } from "@/features/product-experience/components/chocolate-catalog";
import { CustomizationPanel } from "@/features/product-experience/components/customization-panel";
import { OrderSummary } from "@/features/product-experience/components/order-summary";
import { ProductionExportSlot } from "@/features/product-experience/components/production-export-slot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BuilderWorkspace() {
  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--chocolate-light)]/20 pb-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--gold-dark)]">
          Design. Approve. Produce.
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[var(--chocolate-dark)] sm:text-4xl">
          Configure your box
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Select chocolates, arrange your layout, and personalize branding. Click a
          chocolate, then click a slot to place it.
        </p>
      </header>

      {/* Mobile: preview first */}
      <section className="lg:hidden">
        <div className="rounded-2xl border border-[var(--chocolate-light)]/20 bg-card p-4">
          <BoxSizeSelector />
          <div className="mt-6">
            <BoxPreview />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Left panel */}
        <aside className="space-y-4 lg:col-span-3">
          <div className="rounded-2xl border border-[var(--chocolate-light)]/20 bg-card p-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
            <Tabs defaultValue="chocolates">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="chocolates" className="flex-1">
                  Chocolates
                </TabsTrigger>
                <TabsTrigger value="customize" className="flex-1">
                  Customize
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chocolates">
                <ChocolateCatalog />
              </TabsContent>
              <TabsContent value="customize">
                <CustomizationPanel />
              </TabsContent>
            </Tabs>
          </div>
        </aside>

        {/* Center preview — desktop */}
        <section className="hidden lg:col-span-6 lg:block">
          <div className="rounded-2xl border border-[var(--chocolate-light)]/20 bg-card p-6 lg:sticky lg:top-24">
            <BoxSizeSelector />
            <div className="mt-8">
              <BoxPreview />
            </div>
          </div>
        </section>

        {/* Right panel */}
        <aside className="space-y-4 lg:col-span-3">
          <div className="rounded-2xl border border-[var(--chocolate-light)]/20 bg-card p-4 lg:sticky lg:top-24">
            <OrderSummary />
          </div>
          <ProductionExportSlot />
        </aside>
      </div>
    </div>
  );
}
