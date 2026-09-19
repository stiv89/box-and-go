import Link from "next/link";
import Image from "next/image";

import { BrandLogo } from "@/components/layout/brand-logo";
import { BUILDER_VISUALS } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[oklch(0.991_0.006_85)] px-6 py-16 text-center">
      <BrandLogo size="lg" />
      <p className="mt-10 text-[11px] font-medium tracking-[0.22em] text-[var(--chocolate-light)]">
        404 — PAGE NOT FOUND
      </p>
      <h1 className="mt-3 font-serif text-4xl font-normal text-[var(--chocolate-dark)] sm:text-5xl">
        Oops. This box got lost.
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="relative mt-8 aspect-square w-40 sm:w-52">
        <Image
          src={BUILDER_VISUALS.closed}
          alt=""
          fill
          sizes="208px"
          className="object-contain"
        />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--chocolate-dark)] px-6 text-sm text-[var(--cream)]"
        >
          Back to home
        </Link>
        <Link
          href="/builder"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--chocolate-light)]/40 bg-[var(--cream)] px-6 text-sm text-[var(--chocolate)]"
        >
          Create your box
        </Link>
      </div>
    </div>
  );
}
