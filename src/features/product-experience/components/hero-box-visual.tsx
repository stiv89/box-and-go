"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import {
  getOrbitAngle,
  type OrbitalStepRef,
} from "@/features/product-experience/hooks/use-orbital-carousel";
import { BRAND_NAME, HERO_BOX_VARIANTS } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

/** Orbit shape. X is a share of each slide's width, Z is depth in pixels. */
const ORBIT_X = 46;
const ORBIT_Z = 220;
const ORBIT_Y = 10;
const BACK_SCALE = 0.64;
const BACK_OPACITY = 0.38;
const FACE_TURN = 28;

function cssNumber(value: number, digits: number) {
  return Number.parseFloat(value.toFixed(digits)).toString();
}

function getOrbitStyle(angleDeg: number) {
  const radians = (angleDeg * Math.PI) / 180;
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  // 1 at the front of the orbit, 0 at the back.
  const depth = (cos + 1) / 2;

  return {
    transform: [
      `translate3d(${cssNumber(ORBIT_X * sin, 3)}%, ${cssNumber(ORBIT_Y * (1 - cos), 2)}px, ${cssNumber(ORBIT_Z * (cos - 1), 2)}px)`,
      `rotateY(${cssNumber(-sin * FACE_TURN, 2)}deg)`,
      `scale(${cssNumber(BACK_SCALE + (1 - BACK_SCALE) * depth, 3)})`,
    ].join(" "),
    filter: `drop-shadow(0 ${cssNumber(12 + 16 * depth, 1)}px ${cssNumber(24 + 24 * depth, 1)}px rgba(120,90,50,${cssNumber(0.12 + 0.1 * depth, 3)}))`,
    opacity: Number.parseFloat(
      (BACK_OPACITY + (1 - BACK_OPACITY) * depth).toFixed(3),
    ),
    zIndex: Math.round(depth * 100),
  };
}

function applyOrbitStyle(node: HTMLElement, angleDeg: number) {
  const style = getOrbitStyle(angleDeg);
  node.style.transform = style.transform;
  node.style.filter = style.filter;
  node.style.opacity = String(style.opacity);
  node.style.zIndex = String(style.zIndex);
}

export interface HeroBoxVisualProps {
  className?: string;
  activeIndex: number;
  step: number;
  stepRef: OrbitalStepRef;
  reducedMotion: boolean;
}

export function HeroBoxVisual({
  className,
  activeIndex,
  step,
  stepRef,
  reducedMotion,
}: HeroBoxVisualProps) {
  const count = HERO_BOX_VARIANTS.length;
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (reducedMotion) {
      itemRefs.current.forEach((node, index) => {
        if (!node) return;
        applyOrbitStyle(node, getOrbitAngle(index, step, count));
      });
      return;
    }

    let frame = 0;
    const paint = () => {
      const current = stepRef.current;
      itemRefs.current.forEach((node, index) => {
        if (!node) return;
        applyOrbitStyle(node, getOrbitAngle(index, current, count));
      });
      frame = window.requestAnimationFrame(paint);
    };

    frame = window.requestAnimationFrame(paint);
    return () => window.cancelAnimationFrame(frame);
  }, [count, reducedMotion, step, stepRef]);

  return (
    <div className={cn("relative h-full min-h-0 w-full max-w-3xl lg:max-w-4xl", className)}>
      <div
        className="relative h-full w-full"
        style={{ perspective: "1500px", perspectiveOrigin: "50% 50%" }}
      >
        <div className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
          {HERO_BOX_VARIANTS.map((variant, index) => {
            const style = getOrbitStyle(getOrbitAngle(index, step, count));
            const isActive = index === activeIndex;

            return (
              <div
                key={variant.src}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                aria-hidden={!isActive}
                className="absolute inset-x-[16%] inset-y-[3%] will-change-transform [backface-visibility:hidden] [transform-style:preserve-3d]"
                style={{
                  transform: style.transform,
                  filter: style.filter,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                }}
              >
                <div className="relative h-full w-full origin-center">
                  <Image
                    src={variant.src}
                    alt={isActive ? `${BRAND_NAME} ${variant.label}` : ""}
                    fill
                    priority
                    draggable={false}
                    sizes="(max-width: 640px) 80vw, 620px"
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
