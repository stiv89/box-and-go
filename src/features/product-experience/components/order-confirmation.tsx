"use client";

import { FileText, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ShareCreationPanel } from "@/features/product-experience/components/share-creation-panel";
import type { CheckoutSuccess } from "@/features/product-experience/lib/checkout-success";
import { cn } from "@/lib/utils";

const NEXT_STEPS = [
  "We review your order",
  "We prepare your production proof",
  "We confirm delivery details",
  "We begin production",
] as const;

export function OrderConfirmation({
  result,
  onCreateAnother,
}: {
  result: CheckoutSuccess;
  onCreateAnother: () => void;
}) {
  const isPayment = result.source === "payment";
  const isQuoteApi = result.source === "quote";
  const isDemoCart = result.source === "demo-cart";
  const title = isPayment || isDemoCart ? "Purchased" : "Quote requested";
  const subtitle = isPayment
    ? "Your box is being prepared."
    : isDemoCart
      ? "Saved to your cart on this device. Simulated checkout — nothing was charged."
    : result.source === "quote-local"
      ? result.persisted
        ? "Saved on this device. Quote requests aren’t sent until that service is connected."
        : "This tab only — we couldn’t keep a draft on the device. Nothing was sent or charged."
      : "We’ll be in touch about this request.";

  const referenceLabel = isPayment
    ? "Order number"
    : isDemoCart
      ? "Cart order"
      : isQuoteApi
      ? "Quote reference"
      : "Draft";
  const referenceValue = isPayment
    ? result.orderId
    : isDemoCart
      ? result.orderId
      : isQuoteApi
      ? result.reference
      : "Local only";

  return (
    <div
      data-testid="order-confirmation"
      data-confirmation-source={result.source}
      className="space-y-6 motion-reduce:animate-none motion-reduce:transform-none animate-in fade-in slide-in-from-right-3 duration-300"
    >
      <div>
        <h2 className="font-serif text-[1.7rem] font-normal leading-tight text-[var(--chocolate-dark)] sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-500">
          {subtitle}
        </p>
      </div>

      <dl className="space-y-2.5 rounded-2xl border border-[var(--chocolate-light)]/30 bg-white/70 p-4 text-sm shadow-[0_8px_24px_rgba(60,40,20,0.04)]">
        <Row label={referenceLabel} value={referenceValue} />
        <Row label="Email" value={result.email} />
        <Row label="Box" value={result.boxLabel} />
        <Row label="Quantity" value={String(result.quantity)} />
        {isPayment ? (
          <>
            <Row label="Total paid" value={result.totalPaid} />
            <Row label="Payment" value={result.paymentMethod} />
          </>
        ) : isDemoCart ? (
          <Row label="Total" value="Demo — not charged" />
        ) : (
          <Row label="Total" value="Quote — pricing not listed" />
        )}
        {result.delivery ? <Row label="Delivery" value={result.delivery} /> : null}
      </dl>

      <div className="grid gap-2">
        <Button type="button" disabled title="Available when an order exists in our system.">
          <MapPin className="size-3.5" />
          Track order
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled
          title="Available when an order exists in our system."
        >
          <FileText className="size-3.5" />
          Download receipt
        </Button>
        <p className="text-[11px] leading-relaxed text-neutral-500">
          Tracking and receipts appear after a verified order exists. Nothing is generated locally.
        </p>
        <Button type="button" variant="ghost" onClick={onCreateAnother}>
          Create another box
        </Button>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-medium text-[var(--chocolate-dark)]">What happens next</h3>
        <ol className="space-y-2 text-sm text-neutral-600">
          {NEXT_STEPS.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--chocolate)]/10 text-[10px] tabular-nums text-[var(--chocolate-dark)]">
                {index + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <ShareCreationPanel
        title="Send for approval"
        description="Share a layout link or download the visual proof as a PDF."
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className={cn("flex justify-between gap-4")}>
      <dt className="text-neutral-500">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium text-[var(--chocolate-dark)]">
        {value}
      </dd>
    </div>
  );
}
