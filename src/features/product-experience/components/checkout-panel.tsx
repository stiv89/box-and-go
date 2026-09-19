"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BoxQuantityControl } from "@/features/product-experience/components/box-quantity-control";
import { CustomizationPanel } from "@/features/product-experience/components/customization-panel";
import type { CheckoutSuccess } from "@/features/product-experience/lib/checkout-success";
import { isPresentableCheckoutSuccess } from "@/features/product-experience/lib/checkout-success";
import {
  getRibbonOption,
  PACKAGING_OPTIONS,
} from "@/features/product-experience/constants";
import { notify } from "@/lib/notify";
import { USER_ERROR_PAYMENT, USER_ERROR_QUOTE } from "@/lib/user-facing-error";
import { cn } from "@/lib/utils";
import { getActiveCustomization } from "@/types";
import { useBoxStore } from "@/stores/use-box-store";

const QUOTE_DRAFT_KEY = "box-and-go-quote-draft";

export function CheckoutPanel({
  boxLabel,
  filled,
  boxSize,
  incomplete,
  onGoToChocolates,
  onSuccess,
}: {
  boxLabel: string;
  filled: number;
  boxSize: number;
  incomplete: boolean;
  onGoToChocolates: () => void;
  onSuccess: (result: CheckoutSuccess) => void;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const quantity = useBoxStore((s) => s.quantity);
  const customization = useBoxStore((s) => s.customization);
  const active = getActiveCustomization(customization);
  const packagingLabel =
    PACKAGING_OPTIONS.find((option) => option.id === active.wrapStyle)?.label ??
    active.wrapStyle;
  const ribbonLabel =
    active.ribbonApplied && active.ribbon
      ? getRibbonOption(active.ribbon).label
      : null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [delivery, setDelivery] = useState("");
  const [phase, setPhase] = useState<"idle" | "loading" | "check">("idle");
  const [draftNote, setDraftNote] = useState<string | null>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canSaveQuote =
    !incomplete && name.trim().length > 0 && emailValid && phase === "idle";

  async function saveLocalQuote() {
    if (incomplete) {
      notify.warning(`This box isn’t complete. Place ${boxSize} chocolates before requesting a quote.`);
      return;
    }
    if (!name.trim() || !emailValid) {
      setDraftNote("Add a name and email to save a draft on this device.");
      notify.warning("Add a name and a valid email to request a quote.");
      return;
    }
    if (phase !== "idle") return;

    setPhase("loading");
    setDraftNote(null);

    let persisted = false;
    const payload: CheckoutSuccess = {
      source: "quote-local",
      verified: false,
      localOnly: true,
      persisted: false,
      name: name.trim(),
      email: email.trim(),
      quantity,
      boxLabel,
      delivery: delivery.trim() || undefined,
    };

    try {
      window.localStorage.setItem(
        QUOTE_DRAFT_KEY,
        JSON.stringify({
          source: payload.source,
          savedAt: new Date().toISOString(),
          boxLabel: payload.boxLabel,
          quantity: payload.quantity,
        }),
      );
      persisted = true;
    } catch {
      persisted = false;
    }

    const result: CheckoutSuccess = { ...payload, persisted };

    if (!isPresentableCheckoutSuccess(result)) {
      setPhase("idle");
      setDraftNote("Add a name and email to save a draft on this device.");
      notify.error(USER_ERROR_QUOTE);
      return;
    }

    setPhase("check");
    await wait(180);
    if (persisted) {
      notify.success("Quote draft saved on this device. Nothing was charged.");
    } else {
      notify.warning("We couldn’t keep a draft on this device. Keep this tab open.");
    }
    onSuccess(result);
  }

  return (
    <div className="space-y-6 motion-reduce:animate-none motion-reduce:transform-none animate-in fade-in slide-in-from-right-3 duration-300">
      <div>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-[1.7rem] font-normal leading-tight text-[var(--chocolate-dark)] outline-none sm:text-3xl"
        >
          Order your box
        </h2>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-500">
          Request a quote. Payment isn’t connected yet, so nothing is charged.
        </p>
      </div>

      {incomplete ? (
        <div
          className="rounded-2xl border border-[var(--chocolate)]/20 bg-[var(--cream)] p-4 text-sm text-[var(--chocolate-dark)]"
          role="status"
        >
          <p className="font-medium">This box isn’t complete.</p>
          <p className="mt-1 text-neutral-600">
            Place {boxSize} chocolates in Your Chocolates ({filled} of {boxSize} filled).
          </p>
          <Button type="button" className="mt-3" onClick={onGoToChocolates}>
            Continue filling
          </Button>
        </div>
      ) : null}

      <dl className="space-y-2 rounded-2xl border border-[var(--chocolate-light)]/30 bg-white/70 p-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">Box</dt>
          <dd className="font-medium">{boxLabel}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">Chocolates</dt>
          <dd className="font-medium tabular-nums">
            {filled} / {boxSize}
          </dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-neutral-500">Packaging</dt>
          <dd className="font-medium">{packagingLabel}</dd>
        </div>
        {ribbonLabel ? (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Ribbon</dt>
            <dd className="font-medium">{ribbonLabel}</dd>
          </div>
        ) : null}
        {active.sleeveLogoApplied ? (
          <div className="flex justify-between gap-3">
            <dt className="text-neutral-500">Logo</dt>
            <dd className="font-medium">Applied</dd>
          </div>
        ) : null}
      </dl>

      <BoxQuantityControl />

      <section className="space-y-3">
        <h3 className="text-sm font-medium">Personalization</h3>
        <p className="text-xs text-neutral-500">Optional gift-card message.</p>
        <CustomizationPanel sections={["card"]} />
      </section>

      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void saveLocalQuote();
        }}
      >
        <h3 className="text-sm font-medium">Contact and delivery</h3>
        <p className="text-xs text-neutral-500">
          This stays on your device. No email is sent and no payment is taken.
        </p>
        <div className="space-y-1.5">
          <Label htmlFor="quote-name">Name</Label>
          <Input
            id="quote-name"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={incomplete}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quote-email">Email</Label>
          <Input
            id="quote-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={incomplete}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="quote-delivery">Delivery information</Label>
          <Textarea
            id="quote-delivery"
            name="delivery"
            rows={3}
            value={delivery}
            onChange={(e) => setDelivery(e.target.value)}
            disabled={incomplete}
            placeholder="Address, city, and any notes"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="min-h-10 w-full"
          disabled
          title={USER_ERROR_PAYMENT}
        >
          Pay
        </Button>
        <p className="text-[11px] text-neutral-500">{USER_ERROR_PAYMENT}</p>
        <Button type="submit" className="min-h-10 w-full" disabled={!canSaveQuote}>
          <SubmitMark phase={phase} />
          {phase === "idle"
            ? "Request a quote"
            : phase === "loading"
              ? "Saving draft"
              : "Requested"}
        </Button>
        {draftNote ? (
          <p className="text-xs text-destructive" role="alert">
            {draftNote}
          </p>
        ) : null}
      </form>
    </div>
  );
}

function SubmitMark({ phase }: { phase: "idle" | "loading" | "check" }) {
  if (phase === "idle") return null;
  return (
    <span
      className={cn(
        "flex size-4 items-center justify-center",
        "motion-reduce:animate-none",
      )}
      aria-hidden
    >
      {phase === "loading" ? (
        <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" />
      ) : (
        <Check className="size-4 motion-reduce:animate-none animate-in fade-in zoom-in-95 duration-200" />
      )}
    </span>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
