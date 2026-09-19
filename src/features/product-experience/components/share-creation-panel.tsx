"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Check, Copy, Download, Loader2, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClientProofPreview } from "@/features/product-experience/components/client-proof-preview";
import {
  buildShareUrl,
  encodeShareConfig,
  publicShareFromSelection,
} from "@/features/product-experience/lib/share-config";
import {
  assembleClientProofHtml,
  buildProductionSpecification,
  downloadClientProofPdf,
  preparePortableConfiguration,
} from "@/features/production";
import { notify } from "@/lib/notify";
import { toUserFacingError, USER_ERROR_EXPORT, USER_ERROR_SHARE } from "@/lib/user-facing-error";
import { cn } from "@/lib/utils";
import { getBoxConfigurationFromStore, useBoxStore } from "@/stores/use-box-store";

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    /* fall through to execCommand */
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  if (!ok) throw new Error("copy failed");
}

type ShareBusy = "copy" | "share" | "download" | null;

export function ShareCreationPanel({
  onCreateCopy,
  showCreateCopy = false,
  title = "Share for approval",
  description = "Send a visual proof and a public layout link.",
}: {
  onCreateCopy?: () => void;
  showCreateCopy?: boolean;
  title?: string;
  description?: string;
}) {
  const catalog = useBoxStore((s) => s.catalog);
  const boxSize = useBoxStore((s) => s.boxSize);
  const slots = useBoxStore((s) => s.slots);
  const quantity = useBoxStore((s) => s.quantity);
  const customization = useBoxStore((s) => s.customization);
  const filled = slots.filter((slot) => slot.chocolateId).length;
  const isDraft = filled < boxSize;
  const [busy, setBusy] = useState<ShareBusy>(null);
  const [copied, setCopied] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  const shareUrl = useMemo(() => {
    const payload = publicShareFromSelection({
      boxSize,
      slots,
      ribbon: customization.ribbon,
      packagingId: customization.packaging.wrapStyle,
      quantity,
      message: customization.card.message,
    });
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return buildShareUrl(encodeShareConfig(payload), origin);
  }, [
    boxSize,
    slots,
    quantity,
    customization.ribbon,
    customization.packaging.wrapStyle,
    customization.card.message,
  ]);

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copyLink() {
    setShareError(null);
    setBusy("copy");
    try {
      await copyText(shareUrl);
      setCopied(true);
      notify.success("Link copied.");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setShareError("Couldn’t copy. You can select the link instead.");
      notify.error(USER_ERROR_SHARE, { onRetry: () => void copyLink() });
    } finally {
      setBusy(null);
    }
  }

  async function nativeShare() {
    setShareError(null);
    setBusy("share");
    try {
      await navigator.share({
        title: "Box & Go",
        text: isDraft
          ? "A draft chocolate box from Box & Go."
          : "A chocolate box from Box & Go.",
        url: shareUrl,
      });
      notify.success("Shared.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareError("Sharing was cancelled or isn’t available here.");
      notify.error(USER_ERROR_SHARE, { onRetry: () => void nativeShare() });
    } finally {
      setBusy(null);
    }
  }

  async function downloadProof() {
    setShareError(null);
    setBusy("download");
    try {
      const rawConfiguration = getBoxConfigurationFromStore(useBoxStore.getState());
      const configuration = await preparePortableConfiguration(rawConfiguration);
      const spec = buildProductionSpecification(configuration, catalog);
      const { html } = await assembleClientProofHtml({ configuration, spec, catalog });
      await downloadClientProofPdf(html, "box-and-go-proof.pdf");
      notify.success("Client proof PDF downloaded.");
    } catch (error) {
      console.error("Client proof PDF failed", error);
      const message = toUserFacingError(error, USER_ERROR_EXPORT);
      notify.error(message, { onRetry: () => void downloadProof() });
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="font-serif text-[1.7rem] font-normal leading-tight text-[var(--chocolate-dark)] sm:text-3xl">
            {title}
          </h2>
          <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-neutral-500">{description}</p>
        </div>
        <div
          className="flex flex-wrap items-center gap-1 rounded-full border border-[var(--chocolate-light)]/35 bg-[var(--cream)]/90 p-1 shadow-[0_6px_18px_rgba(60,40,20,0.06)]"
          role="toolbar"
          aria-label="Share for approval"
        >
          <ToolbarButton
            onClick={() => void copyLink()}
            disabled={busy !== null}
            busy={busy === "copy"}
            testId="share-copy"
          >
            {busy === "copy" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : copied ? (
              <Check className="size-3.5" />
            ) : (
              <Copy className="size-3.5" />
            )}
            {busy === "copy" ? "Copying…" : copied ? "Copied" : "Copy"}
          </ToolbarButton>
          {canNativeShare ? (
            <ToolbarButton
              onClick={() => void nativeShare()}
              disabled={busy !== null}
              busy={busy === "share"}
              testId="share-native"
            >
              {busy === "share" ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Share2 className="size-3.5" />
              )}
              {busy === "share" ? "Sharing…" : "Share"}
            </ToolbarButton>
          ) : null}
          <ToolbarButton
            onClick={() => void downloadProof()}
            disabled={busy !== null}
            busy={busy === "download"}
            testId="share-download"
          >
            {busy === "download" ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
            {busy === "download" ? "Preparing…" : "Download"}
          </ToolbarButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isDraft ? (
          <span className="rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/10 px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] text-[var(--chocolate-dark)]">
            Draft
          </span>
        ) : null}
        <p className="min-w-0 flex-1 truncate text-[11px] text-neutral-500" title={shareUrl}>
          {shareUrl}
        </p>
      </div>

      {shareError ? (
        <p className="text-xs text-destructive" role="alert">
          {shareError}
        </p>
      ) : null}

      <ClientProofPreview />

      {showCreateCopy && onCreateCopy ? (
        <Button type="button" variant="outline" size="sm" onClick={onCreateCopy}>
          Create a copy
        </Button>
      ) : null}
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  disabled,
  busy,
  testId,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled: boolean;
  busy: boolean;
  testId: string;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy}
      data-testid={testId}
      className={cn(
        "h-8 rounded-full px-3 text-[12px] font-medium tracking-[0.04em] text-[var(--chocolate-dark)]",
        "hover:bg-[var(--chocolate)]/8",
        "bng-proof-print-hide",
      )}
    >
      {children}
    </Button>
  );
}

export function ShareActionRow({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-[var(--chocolate-light)]/30 bg-white/60 p-4", className)}>
      <ShareCreationPanel />
    </div>
  );
}
