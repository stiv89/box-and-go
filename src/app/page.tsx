import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { HeroBoxVisual } from "@/features/product-experience";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[var(--gold-dark)]">
            Cocoa Dolce · Corporate Gifting
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-medium leading-[1.1] tracking-tight text-[var(--chocolate-dark)] sm:text-5xl lg:text-6xl">
            Box <span className="text-[var(--gold-dark)]">&amp;</span> Go
          </h1>
          <p className="mt-3 font-[family-name:var(--font-display)] text-xl italic text-[var(--chocolate)]">
            Design. Approve. Produce.
          </p>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
            A visual configurator for corporate chocolate boxes. Choose your
            assortment, arrange each piece, add your logo and ribbon, and prepare
            production-ready orders — without spreadsheets or back-and-forth emails.
          </p>
          <div className="mt-10">
            <Link
              href="/builder"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-2 bg-[var(--chocolate)] text-[var(--cream)] hover:bg-[var(--chocolate-dark)]",
              )}
            >
              Design Your Box
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>

        <HeroBoxVisual />
      </section>

      <section className="border-t border-[var(--chocolate-light)]/20 bg-[var(--cream-dark)]/40">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Select & arrange",
              body: "Pick from the sample catalog and fill each slot in your 9- or 16-piece box.",
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
              <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
