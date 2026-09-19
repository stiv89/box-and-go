"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

const MS_PER_SLOT = 2_600;
const AUTOPLAY_MS_REDUCED = 5_000;
/** Must stay below 1 / (2π) so the orbit never reverses. */
const LINGER = 0.1;

function easedStep(raw: number) {
  const slot = Math.floor(raw);
  const t = raw - slot;
  return slot + t - LINGER * Math.sin(t * Math.PI * 2);
}

function wrapIndex(value: number, count: number) {
  return ((value % count) + count) % count;
}

export function useOrbitalCarousel(count: number) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const stepRef = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      const timer = window.setInterval(() => {
        setStep((current) => {
          const next = current + 1;
          stepRef.current = next;
          setActiveIndex(wrapIndex(next, count));
          return next;
        });
      }, AUTOPLAY_MS_REDUCED);

      return () => window.clearInterval(timer);
    }

    let frame = 0;
    let last = performance.now();
    let raw = stepRef.current;
    let lastActive = wrapIndex(Math.round(stepRef.current), count);

    const tick = (now: number) => {
      const delta = Math.min(now - last, 48);
      last = now;

      raw += delta / MS_PER_SLOT;
      const nextStep = easedStep(raw);
      stepRef.current = nextStep;
      const nextActive = wrapIndex(Math.round(nextStep), count);
      if (nextActive !== lastActive) {
        lastActive = nextActive;
        setActiveIndex(nextActive);
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [count, reducedMotion]);

  return {
    activeIndex,
    step,
    stepRef,
    reducedMotion,
  };
}

export type OrbitalStepRef = RefObject<number>;

/** Continuous orbit angle in degrees: 0deg is the front (active) slot. */
export function getOrbitAngle(index: number, step: number, count: number) {
  return (index - step) * (360 / count);
}
