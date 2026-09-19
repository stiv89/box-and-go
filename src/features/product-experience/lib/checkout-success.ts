export type CheckoutSuccess =
  | {
      source: "payment";
      verified: true;
      orderId: string;
      email: string;
      paymentMethod: string;
      totalPaid: string;
      quantity: number;
      boxLabel: string;
      delivery?: string;
    }
  | {
      source: "quote";
      verified: true;
      reference: string;
      email: string;
      quantity: number;
      boxLabel: string;
      delivery?: string;
    }
  | {
      source: "quote-local";
      verified: false;
      localOnly: true;
      persisted: boolean;
      name: string;
      email: string;
      quantity: number;
      boxLabel: string;
      delivery?: string;
    }
  | {
      source: "demo-cart";
      verified: false;
      simulated: true;
      orderId: string;
      name: string;
      email: string;
      quantity: number;
      boxLabel: string;
      delivery?: string;
    };

export function isPresentableCheckoutSuccess(
  result: CheckoutSuccess,
): result is CheckoutSuccess {
  if (result.source === "payment") {
    return result.verified === true && result.orderId.trim().length > 0;
  }
  if (result.source === "quote") {
    return result.verified === true && result.reference.trim().length > 0;
  }
  if (result.source === "demo-cart") {
    return (
      result.simulated === true &&
      result.verified === false &&
      result.orderId.startsWith("DEMO-") &&
      result.name.trim().length > 0 &&
      result.email.trim().length > 0
    );
  }
  return (
    result.source === "quote-local" &&
    result.localOnly === true &&
    result.verified === false &&
    typeof result.persisted === "boolean" &&
    result.email.trim().length > 0
  );
}
