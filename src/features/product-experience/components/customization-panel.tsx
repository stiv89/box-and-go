"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CARD_MESSAGE_MAX_LENGTH,
  PACKAGING_OPTIONS,
  RIBBON_COLORS,
} from "@/features/product-experience/constants";
import { useLogoPalette } from "@/features/product-experience/hooks/use-logo-palette";
import { describeLogoFailure, readValidatedLogoDataUrl } from "@/lib/logo-file";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { useBoxStore } from "@/stores/use-box-store";

const LOGO_HINT = "Stored in this browser tab only. Not included in share links.";

const CONTEXTUAL_MOTION =
  "motion-reduce:animate-none motion-reduce:transform-none animate-in fade-in slide-in-from-top-1 duration-[220ms]";

type CustomizationSection = "logo" | "ribbon" | "packaging" | "card";

interface CustomizationPanelProps {
  sections?: CustomizationSection[];
}

export function CustomizationPanel({
  sections = ["logo", "ribbon", "card", "packaging"],
}: CustomizationPanelProps) {
  const customization = useBoxStore((s) => s.customization);
  const updateCard = useBoxStore((s) => s.updateCard);
  const updatePackaging = useBoxStore((s) => s.updatePackaging);
  const updateRibbon = useBoxStore((s) => s.updateRibbon);
  const setLogoUrl = useBoxStore((s) => s.setLogoUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [logoBusy, setLogoBusy] = useState(false);
  const { colors, suggestions } = useLogoPalette();

  const showLogo = sections.includes("logo");
  const showRibbon = sections.includes("ribbon");
  const showPackaging = sections.includes("packaging");
  const showCard = sections.includes("card");
  const wrapStyle = customization.packaging.wrapStyle;
  const selectedRibbon =
    RIBBON_COLORS.find((option) => option.color === customization.ribbon.color) ??
    RIBBON_COLORS[0]!;

  function revokeIfBlob(url: string | null) {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }

  async function handleLogoUpload(file: File | undefined) {
    if (!file || logoBusy) return;

    setLogoError(null);
    setLogoBusy(true);
    try {
      const result = await readValidatedLogoDataUrl(file);
      if (!result.ok) {
        const message = describeLogoFailure(result.reason);
        setLogoError(message);
        notify.error(message);
        return;
      }

      revokeIfBlob(customization.logo.url);
      setLogoUrl(result.dataUrl);
      notify.success("Logo added to this box.");
    } catch {
      setLogoError("We couldn’t read that image. Try another PNG or JPG.");
      notify.error("We couldn’t read that image. Try another PNG or JPG.");
    } finally {
      setLogoBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleLogoRemove() {
    revokeIfBlob(customization.logo.url);
    setLogoUrl(null);
    setLogoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  const logoControls = (
    <section className="min-w-0 space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium">Corporate logo</h3>
        <p className="truncate text-[10px] leading-none text-muted-foreground" title={LOGO_HINT}>
          Optional
        </p>
      </div>

      {customization.logo.url ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 rounded-xl border border-[var(--chocolate-light)]/30 bg-card px-2.5 py-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={customization.logo.url}
              alt="Uploaded logo"
              className="max-h-9 max-w-[72px] object-contain"
            />
            <div className="flex flex-1 flex-wrap gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 min-h-9 px-2.5"
                onClick={() => fileInputRef.current?.click()}
                disabled={logoBusy}
              >
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 min-h-9 px-2.5"
                onClick={handleLogoRemove}
              >
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            </div>
          </div>
          {colors.length > 0 && (
            <p className="flex flex-wrap items-center gap-1.5 px-0.5 text-[10px] text-muted-foreground">
              {colors.map((color) => (
                <span
                  key={color}
                  className="size-2.5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: color }}
                  aria-hidden
                />
              ))}
              <span>
                {suggestions.length > 0
                  ? `Pairs with ${suggestions.map((chocolate) => chocolate.name).join(", ")}`
                  : "Palette from this logo"}
              </span>
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={logoBusy}
          onClick={() => {
            if (logoBusy) return;
            fileInputRef.current?.click();
          }}
          className={cn(
            "flex min-h-10 w-full items-center gap-2.5 rounded-xl border border-dashed",
            "border-[var(--chocolate-light)]/50 bg-[var(--cream)] px-3 py-2 text-left text-sm",
            "transition-colors hover:border-[var(--gold)] hover:bg-[var(--cream-dark)]",
            "motion-reduce:transition-none",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
          )}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[var(--cream-dark)]">
            <ImagePlus className="size-4 text-muted-foreground" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm text-[var(--chocolate-dark)]">
              {logoBusy ? "Checking logo…" : "Upload PNG or JPG"}
            </span>
            <span className="text-[11px] text-muted-foreground">Max 2 MB · preview only</span>
          </span>
        </button>
      )}

        <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        className="hidden"
        disabled={logoBusy}
        onChange={(e) => {
          void handleLogoUpload(e.target.files?.[0]);
        }}
      />

      {logoError && (
        <p className="text-xs text-destructive" role="alert">
          {logoError}
        </p>
      )}
    </section>
  );

  const ribbonControls = (
    <section className="min-w-0 space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-sm font-medium">Choose your ribbon</h3>
        <p className="truncate text-[11px] text-[var(--chocolate)]">{selectedRibbon.label}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {RIBBON_COLORS.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-label={option.label}
            aria-pressed={customization.ribbon.color === option.color}
            onClick={() => updateRibbon({ color: option.color, style: option.id })}
            className={cn(
              "size-10 min-h-10 min-w-10 rounded-full ring-offset-2 transition-all outline-none",
              "motion-reduce:transition-none",
              "focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
              customization.ribbon.color === option.color &&
                "ring-2 ring-[var(--chocolate-dark)]",
            )}
            style={{ backgroundColor: option.color }}
            title={option.label}
          />
        ))}
      </div>
    </section>
  );

  return (
    <div className="space-y-4">
      {showPackaging && (
        <section className="space-y-2">
          <h3 className="text-sm font-medium">Packaging</h3>
          <div className="grid grid-cols-3 gap-2">
            {PACKAGING_OPTIONS.map((option) => {
              const selected = wrapStyle === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={selected}
                  aria-label={option.label}
                  title={option.description}
                  onClick={() =>
                    updatePackaging({
                      wrapStyle: option.id,
                      giftNote: customization.packaging.giftNote,
                    })
                  }
                  className={cn(
                    "flex min-h-10 flex-col overflow-hidden rounded-xl border text-center transition-all outline-none",
                    "motion-reduce:transition-none",
                    "focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                    selected
                      ? "border-[var(--chocolate)] bg-[var(--cream-dark)] ring-1 ring-[var(--chocolate)]"
                      : "border-[var(--chocolate-light)]/30 hover:border-[var(--chocolate-light)]",
                  )}
                >
                  <span className="relative aspect-[4/3] w-full bg-[oklch(0.991_0.006_85)]">
                    <Image
                      src={option.src}
                      alt=""
                      fill
                      sizes="140px"
                      className="object-contain p-1.5"
                    />
                  </span>
                  <span className="px-1.5 pb-2 pt-0.5 text-[11px] font-medium leading-tight text-[var(--chocolate-dark)]">
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {showPackaging ? (
        <div key={wrapStyle} className={CONTEXTUAL_MOTION}>
          {wrapStyle === "standard" && (
            <p className="text-sm leading-relaxed text-neutral-500">
              Tissue and sleeve, as shown. No further details.
            </p>
          )}
          {wrapStyle === "gift" && showRibbon && ribbonControls}
          {wrapStyle === "corporate" && showLogo && logoControls}
        </div>
      ) : (
        <>
          {showLogo && logoControls}
          {showRibbon && ribbonControls}
        </>
      )}

      {showCard && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Gift card message</h3>
            <span className="text-xs text-muted-foreground">
              {customization.card.message.length}/{CARD_MESSAGE_MAX_LENGTH}
            </span>
          </div>
          <Textarea
            value={customization.card.message}
            maxLength={CARD_MESSAGE_MAX_LENGTH}
            placeholder="With appreciation from our team..."
            rows={3}
            onChange={(e) => updateCard({ message: e.target.value })}
          />
          <div className="flex gap-2">
            {(["serif", "sans"] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => updateCard({ fontStyle: style })}
                className={cn(
                  "min-h-10 rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors",
                  "motion-reduce:transition-none",
                  customization.card.fontStyle === style
                    ? "border-[var(--chocolate)] bg-[var(--chocolate)] text-[var(--cream)]"
                    : "border-[var(--chocolate-light)]/40 hover:bg-[var(--cream-dark)]",
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
