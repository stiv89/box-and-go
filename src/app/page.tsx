import { HeroLanding } from "@/features/product-experience/components/hero-landing";

export default function HomePage() {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[oklch(0.991_0.006_85)] md:overflow-hidden">
      <HeroLanding />
    </div>
  );
}
