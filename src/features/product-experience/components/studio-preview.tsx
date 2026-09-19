"use client";

import Image from "next/image";

import { DndBoxSlotGrid, resolveDrop } from "@/features/box-builder";
import {
  getRibbonOption,
  PACKAGING_OPTIONS,
  RIBBON_COLORS,
} from "@/features/product-experience/constants";
import { useBuilderSessionUi } from "@/features/product-experience/hooks/use-builder-session-ui";
import { removeFocusedOrSlot } from "@/features/product-experience/lib/place-chocolate";
import {
  BUILDER_VISUALS,
  BOX_SIZES,
  CLOSED_BOX_RIBBON_FRAME,
  CORPORATE_SLEEVE_LOGO_ANCHOR,
  OPEN_CAVITY_LAYOUT,
  OPEN_TRAY_INSET,
} from "@/lib/constants";
import { getRecommendedBrandedSlotIndex } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { getActiveCustomization } from "@/types";
import { useBoxStore } from "@/stores/use-box-store";

export type StudioPreviewMode = "closed" | "open";

interface StudioPreviewProps {
  mode: StudioPreviewMode;
  className?: string;
  interactive?: boolean;
  showRibbon?: boolean;
  statusSeal?: "confirmed" | "quoted" | null;
}

const OPEN_BOX_SOURCES = [BUILDER_VISUALS.open9, BUILDER_VISUALS.open16] as const;

const fadeClass =
  "transition-opacity duration-300 ease-in-out motion-reduce:transition-none motion-reduce:duration-0";

export function StudioPreview({
  mode,
  className,
  interactive = true,
  showRibbon = true,
  statusSeal = null,
}: StudioPreviewProps) {
  const boxSize = useBoxStore((s) => s.boxSize);
  const slots = useBoxStore((s) => s.slots);
  const catalog = useBoxStore((s) => s.catalog);
  const selectedChocolateId = useBoxStore((s) => s.selectedChocolateId);
  const focusedSlotIndex = useBoxStore((s) => s.focusedSlotIndex);
  const customization = useBoxStore((s) => s.customization);
  const appearingSlotIndex = useBuilderSessionUi((s) => s.appearingSlotIndex);
  const appearingNonce = useBuilderSessionUi((s) => s.appearingNonce);
  const rearrangeTipVisible = useBuilderSessionUi((s) => s.rearrangeTipVisible);
  const dismissRearrangeTip = useBuilderSessionUi((s) => s.dismissRearrangeTip);

  const { rows, cols } = BOX_SIZES[boxSize];
  const inset = OPEN_TRAY_INSET[boxSize];
  const filled = slots.filter((slot) => slot.chocolateId).length;
  const showOpen = mode === "open";
  const openSrc = boxSize === 16 ? BUILDER_VISUALS.open16 : BUILDER_VISUALS.open9;
  const active = getActiveCustomization(customization);
  const wrapStyle = active.wrapStyle;
  const packaging =
    PACKAGING_OPTIONS.find((option) => option.id === wrapStyle) ?? PACKAGING_OPTIONS[0]!;
  const ribbon = getRibbonOption(customization.ribbon);
  const showGiftLid = wrapStyle === "gift";
  const showPackagingPhoto = wrapStyle === "standard" || wrapStyle === "corporate";
  const overlayGiftRibbon = showRibbon && active.ribbonApplied;
  const overlaySleeveLogo = Boolean(active.sleeveLogo);

  function handleSlotActivate(slotIndex: number) {
    if (!interactive) return;
    const state = useBoxStore.getState();
    const focused = state.focusedSlotIndex;
    const origin = focused !== null ? state.slots.find((slot) => slot.index === focused) : null;

    if (focused !== null && focused !== slotIndex && origin?.chocolateId) {
      const resolution = resolveDrop({
        slots: state.slots,
        catalogIds: state.catalog.map((item) => item.id),
        source: {
          type: "slot",
          slotIndex: focused,
          chocolateId: origin.chocolateId,
        },
        targetSlotIndex: slotIndex,
      });
      if (!resolution) return;
      for (const write of resolution.writes) {
        state.setSlotChocolate(write.slotIndex, write.chocolateId);
      }
      state.setFocusedSlotIndex(resolution.focusSlotIndex);
      return;
    }

    state.setFocusedSlotIndex(focused === slotIndex ? null : slotIndex);
  }

  function handleSlotClear(slotIndex: number) {
    if (!interactive) return;
    removeFocusedOrSlot(slotIndex);
  }

  return (
    <div
      className={cn("relative mx-auto flex h-full w-full items-center justify-center", className)}
      data-studio-mode={mode}
      data-box-size={boxSize}
      data-packaging={wrapStyle}
      data-ribbon={overlayGiftRibbon ? ribbon.id : "none"}
    >
      <div className="relative aspect-square h-full max-w-full">
        <div
          className={cn(
            "absolute inset-0",
            fadeClass,
            showOpen ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          {PACKAGING_OPTIONS.map((option) => (
            <Image
              key={option.id}
              src={option.src}
              alt=""
              fill
              priority={option.id === packaging.id}
              sizes="(max-width: 768px) 90vw, 55vw"
              className={cn(
                "pointer-events-none object-contain",
                fadeClass,
                showPackagingPhoto && option.id === packaging.id
                  ? "opacity-100"
                  : "opacity-0",
              )}
            />
          ))}
          <Image
            src={BUILDER_VISUALS.closed}
            alt=""
            fill
            sizes="(max-width: 768px) 90vw, 55vw"
            className={cn(
              "pointer-events-none object-contain",
              fadeClass,
              showGiftLid || !showPackagingPhoto ? "opacity-100" : "opacity-0",
            )}
          />
          {overlayGiftRibbon && (
            <div
              className="pointer-events-none absolute z-[1]"
              style={CLOSED_BOX_RIBBON_FRAME}
            >
              {RIBBON_COLORS.map((option) => (
                <Image
                  key={option.src}
                  src={option.src}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 90vw, 55vw"
                  className={cn(
                    "pointer-events-none object-contain",
                    fadeClass,
                    option.src === ribbon.src ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>
          )}
          {overlaySleeveLogo && active.sleeveLogo && (
            <div
              className="pointer-events-none absolute z-10"
              style={{
                left: `${CORPORATE_SLEEVE_LOGO_ANCHOR.leftPercent + active.sleeveLogo.x}%`,
                top: `${CORPORATE_SLEEVE_LOGO_ANCHOR.topPercent + active.sleeveLogo.y}%`,
                transform: `translate(-50%, -50%) scale(${active.sleeveLogo.scale}) rotate(${active.sleeveLogo.rotation}deg)`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={active.sleeveLogo.url ?? ""}
                alt=""
                className="max-h-10 max-w-[72px] object-contain drop-shadow-sm sm:max-h-12"
              />
            </div>
          )}
        </div>

        <div
          className={cn(
            "absolute inset-0",
            fadeClass,
            showOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          {OPEN_BOX_SOURCES.map((src) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              priority={src === openSrc}
              sizes="(max-width: 768px) 90vw, 55vw"
              className={cn(
                "pointer-events-none object-contain",
                fadeClass,
                src === openSrc ? "opacity-100" : "opacity-0",
              )}
            />
          ))}
          <div className="absolute inset-0">
            <DndBoxSlotGrid
              rows={rows}
              cols={cols}
              slots={slots}
              catalog={catalog}
              selectedChocolateId={selectedChocolateId}
              focusedSlotIndex={focusedSlotIndex}
              onSlotActivate={handleSlotActivate}
              onSlotClear={handleSlotClear}
              onSlotFocus={(index) => {
                if (!interactive) return;
                useBoxStore.getState().setFocusedSlotIndex(index);
              }}
              readOnly={!interactive || !showOpen}
              variant="cavity"
              className="h-full w-full"
              pieceScale={inset.pieceScale}
              cavities={OPEN_CAVITY_LAYOUT[boxSize]}
              appearingSlotIndex={appearingSlotIndex}
              appearingNonce={appearingNonce}
              recommendedSlotIndex={
                customization.logo.url
                  ? getRecommendedBrandedSlotIndex(rows, cols)
                  : null
              }
              logoUrl={customization.logo.url}
            />
          </div>
        </div>
      </div>

      {showOpen && rearrangeTipVisible && !statusSeal ? (
        <div
          className="pointer-events-auto absolute left-1/2 top-[7%] z-30 w-[min(16.5rem,calc(100%-1rem))] -translate-x-1/2 rounded-xl border border-[var(--chocolate-light)]/25 bg-[var(--cream)] px-3.5 py-3 shadow-[0_10px_30px_rgba(40,24,12,0.12)] motion-reduce:animate-none animate-in fade-in zoom-in-95 duration-200"
          role="status"
        >
          <p className="font-serif text-sm text-[var(--chocolate-dark)]">Make it your own</p>
          <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">
            Your chocolate has been added! Drag it to rearrange your box.
          </p>
          <button
            type="button"
            onClick={dismissRearrangeTip}
            className="mt-2.5 rounded-full bg-[var(--chocolate-dark)] px-3 py-1 text-[11px] text-[var(--cream)] hover:bg-[var(--chocolate)] focus-visible:ring-2 focus-visible:ring-[var(--gold)]"
          >
            Got it
          </button>
        </div>
      ) : null}

      {statusSeal ? (
        <p
          className={cn(
            "pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 rounded-full border border-[var(--gold)]/40 bg-[oklch(0.991_0.006_85)]/95 px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-[var(--chocolate-dark)] shadow-[0_4px_16px_rgba(60,40,20,0.08)]",
            "motion-reduce:animate-none motion-reduce:transform-none animate-in fade-in slide-in-from-bottom-1 duration-300",
          )}
        >
          {statusSeal === "confirmed" ? "Confirmed" : "Thank you"}
        </p>
      ) : null}

      <p className="sr-only">
        {showOpen
          ? `${BOX_SIZES[boxSize].label} open box, ${filled} of ${boxSize} pieces placed`
          : `${packaging.label} packaging preview`}
      </p>
    </div>
  );
}
