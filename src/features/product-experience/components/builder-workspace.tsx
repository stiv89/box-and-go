"use client";

import { DndBuilderProvider } from "@/features/box-builder";
import { BoxPreview } from "@/features/product-experience/components/box-preview";
import { BoxSizeSelector } from "@/features/product-experience/components/box-size-selector";
import { ChocolateCatalog } from "@/features/product-experience/components/chocolate-catalog";
import { CustomizationPanel } from "@/features/product-experience/components/customization-panel";
import { DemoLoadButton } from "@/features/product-experience/components/demo-load-button";
import { OrderSummary } from "@/features/product-experience/components/order-summary";
import { ProductionExportSlot } from "@/features/product-experience/components/production-export-slot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function BuilderWorkspace() {
  return (
    <DndBuilderProvider>
      <div className="space-y-6 overflow-x-hidden">
        <header className="border-b border-[var(--chocolate-light)]/20 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--gold-dark)]">
            Design. Approve. Produce.
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl font-medium tracking-tight text-[var(--chocolate-dark)] sm:text-4xl">
            Configure your box
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Select or drag chocolates into the grid, personalize packaging, and
            export production-ready specifications for your corporate order.
          </p>
          <div className="mt-4">
            <DemoLoadButton />
          </div>
        </header>

        <section className="lg:hidden">
          <div className="rounded-2xl border border-[var(--chocolate-light)]/20 bg-card p-4 shadow-sm">
            <BoxSizeSelector />
            <div className="mt-6">
              <BoxPreview />
            </div>
          </div>
        </section>

        <div className="grid min-w-0 gap-6 lg:grid-cols-12 lg:gap-8">
          <aside className="min-w-0 space-y-4 lg:col-span-3">
            <div className="rounded-2xl border border-[var(--chocolate-light)]/20 bg-card p-4 shadow-sm lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
              <Tabs defaultValue="chocolates">
                <TabsList className="mb-4 w-full">
                  <TabsTrigger value="chocolates" className="flex-1 text-xs sm:text-sm">
                    Chocolates
                  </TabsTrigger>
                  <TabsTrigger value="customize" className="flex-1 text-xs sm:text-sm">
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

          <section className="hidden min-w-0 lg:col-span-6 lg:block">
            <div className="rounded-2xl border border-[var(--chocolate-light)]/20 bg-card p-6 shadow-sm lg:sticky lg:top-24">
              <BoxSizeSelector />
              <div className="mt-8">
                <BoxPreview />
              </div>
            </div>
          </section>

          <aside className="min-w-0 space-y-4 lg:col-span-3">
            <div className="rounded-2xl border border-[var(--chocolate-light)]/20 bg-card p-4 shadow-sm lg:sticky lg:top-24">
              <OrderSummary />
            </div>
            <ProductionExportSlot />
          </aside>
        </div>
      </div>
    </DndBuilderProvider>
  );
}
