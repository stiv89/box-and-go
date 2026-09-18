import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { HeroBoxVisual } from "@/features/product-experience";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden bg-white">
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--gold-dark)]">
            Cocoa Dolce · Corporate Gifting
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.08] tracking-tight text-[var(--chocolate-dark)] sm:text-5xl lg:text-[3.25rem]">
            Box <span className="text-[var(--gold-dark)]">&amp;</span> Go
          </h1>
          <p className="mt-3 font-[family-name:var(--font-display)] text-xl italic text-[var(--chocolate)]">
            Design. Approve. Produce.
          </p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-neutral-600">
            A visual configurator for corporate chocolate boxes. Choose your
            assortment, arrange each piece, add your logo and ribbon, and prepare
            production-ready orders — without spreadsheets or back-and-forth emails.
          </p>
          <div className="mt-10">
            <Link
              href="/builder"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 bg-[var(--chocolate)] text-white hover:bg-[var(--chocolate-dark)]",
              )}
            >
              Design Your Box
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <HeroBoxVisual />
        </div>
      </section>

      <section className="border-t border-neutral-100 bg-neutral-50/80">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Select & arrange",
              body: "Pick from the sample catalog and click or drag each piece into your 9- or 16-piece box.",
            },
            {
              step: "02",
              title: "Brand your box",
              body: "Upload a logo, choose a ribbon, and write a card message for your recipients.",
            },
            {
              step: "03",
              title: "Review & produce",
              body: "Confirm quantities and hand off a precise specification to production.",
            },
          ].map((item) => (
            <div key={item.step} className="space-y-2">
              <p className="text-xs font-medium tracking-widest text-[var(--gold-dark)]">
                {item.step}
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-medium text-[var(--chocolate-dark)]">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-neutral-600">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
