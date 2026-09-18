"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  CARD_MESSAGE_MAX_LENGTH,
  PACKAGING_OPTIONS,
  RIBBON_COLORS,
} from "@/features/product-experience/constants";
import { cn } from "@/lib/utils";
import { useBoxStore } from "@/stores/use-box-store";

const LOGO_MAX_BYTES = 2 * 1024 * 1024;
const ACCEPTED_LOGO_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export function CustomizationPanel() {
  const customization = useBoxStore((s) => s.customization);
  const updateLogo = useBoxStore((s) => s.updateLogo);
  const updateRibbon = useBoxStore((s) => s.updateRibbon);
  const updateCard = useBoxStore((s) => s.updateCard);
  const updatePackaging = useBoxStore((s) => s.updatePackaging);
  const setLogoUrl = useBoxStore((s) => s.setLogoUrl);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoError, setLogoError] = useState<string | null>(null);

  function revokeIfBlob(url: string | null) {
    if (url?.startsWith("blob:")) {
      URL.revokeObjectURL(url);
    }
  }

  function handleLogoUpload(file: File | undefined) {
    if (!file) return;

    setLogoError(null);

    if (!ACCEPTED_LOGO_TYPES.includes(file.type)) {
      setLogoError("Please upload a PNG or JPG file.");
      return;
    }

    if (file.size > LOGO_MAX_BYTES) {
      setLogoError("Logo must be 2 MB or smaller.");
      return;
    }

    revokeIfBlob(customization.logo.url);
    const objectUrl = URL.createObjectURL(file);
    setLogoUrl(objectUrl);
  }

  function handleLogoRemove() {
    revokeIfBlob(customization.logo.url);
    setLogoUrl(null);
    setLogoError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Logo */}
      <section className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Corporate logo</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Local preview only — logos are not persisted and will be lost on refresh
            until Supabase storage is connected.
          </p>
        </div>

        {customization.logo.url ? (
          <div className="flex items-center gap-3 rounded-xl border border-[var(--chocolate-light)]/30 bg-card p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={customization.logo.url}
              alt="Uploaded logo"
              className="max-h-12 max-w-[100px] object-contain"
            />
            <div className="flex flex-1 flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Replace
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleLogoRemove}>
                <Trash2 className="size-3.5" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex w-full flex-col items-center gap-2 rounded-xl border border-dashed",
              "border-[var(--chocolate-light)]/50 bg-[var(--cream)] px-4 py-6 text-sm",
              "transition-colors hover:border-[var(--gold)] hover:bg-[var(--cream-dark)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
            )}
          >
            <ImagePlus className="size-5 text-muted-foreground" />
            <span>Upload PNG or JPG</span>
            <span className="text-xs text-muted-foreground">Max 2 MB</span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => handleLogoUpload(e.target.files?.[0])}
        />

        {logoError && <p className="text-xs text-destructive">{logoError}</p>}

        {customization.logo.url && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="logo-x">Horizontal</Label>
              <input
                id="logo-x"
                type="range"
                min={-30}
                max={30}
                value={customization.logo.x}
                onChange={(e) => updateLogo({ x: Number(e.target.value) })}
                className="w-full accent-[var(--chocolate)]"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="logo-scale">Scale</Label>
              <input
                id="logo-scale"
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={customization.logo.scale}
                onChange={(e) => updateLogo({ scale: Number(e.target.value) })}
                className="w-full accent-[var(--chocolate)]"
              />
            </div>
          </div>
        )}
      </section>

      {/* Ribbon */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium">Ribbon</h3>
        <div className="flex flex-wrap gap-2">
          {RIBBON_COLORS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-label={option.label}
              aria-pressed={customization.ribbon.color === option.color}
              onClick={() => updateRibbon({ color: option.color, style: option.id })}
              className={cn(
                "size-8 rounded-full ring-offset-2 transition-all outline-none",
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

      {/* Card */}
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
                "rounded-lg border px-3 py-1.5 text-xs capitalize transition-colors",
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

      {/* Packaging */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium">Packaging</h3>
        <div className="space-y-2">
          {PACKAGING_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                updatePackaging({ wrapStyle: option.id, giftNote: customization.packaging.giftNote })
              }
              className={cn(
                "w-full rounded-xl border p-3 text-left transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
                customization.packaging.wrapStyle === option.id
                  ? "border-[var(--gold)] bg-[var(--cream-dark)]"
                  : "border-[var(--chocolate-light)]/30 hover:border-[var(--chocolate-light)]",
              )}
            >
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
