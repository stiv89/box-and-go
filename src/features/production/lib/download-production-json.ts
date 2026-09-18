import type { ProductionSpecification } from "@/types";

export interface ProductionSpecValidation {
  valid: boolean;
  errors: string[];
}

export function validateProductionSpecification(
  spec: ProductionSpecification,
): ProductionSpecValidation {
  const errors: string[] = [];

  if (!spec.orderId) errors.push("Missing order id.");
  if (!Number.isFinite(spec.quantity) || spec.quantity <= 0) {
    errors.push("Quantity must be at least 1 box.");
  }
  if (spec.slots.length === 0) {
    errors.push("Box has no chocolates placed — add chocolates before exporting.");
  }

  const expectedTotal = spec.chocolateBreakdown.reduce((sum, item) => sum + item.total, 0);
  if (expectedTotal !== spec.totalChocolates) {
    errors.push("Total chocolates do not match the per-type breakdown.");
  }

  return { valid: errors.length === 0, errors };
}

/** Triggers a real file download; returns the validation result either way. */
export function downloadProductionSpecificationJson(
  spec: ProductionSpecification,
): ProductionSpecValidation {
  const validation = validateProductionSpecification(spec);
  if (!validation.valid) return validation;

  const json = JSON.stringify(spec, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `box-and-go-production-${spec.orderId}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);

  return validation;
}
