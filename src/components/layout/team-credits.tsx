"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  TEAM_CHOCOLATHON_DISCLAIMER,
  TEAM_FLAG_SRC,
  TEAM_INTRO_SEEN_KEY,
  TEAM_MEMBERS,
  TEAM_ORIGIN_LABEL,
} from "@/lib/constants/team";
import { cn } from "@/lib/utils";

const INTRO_DELAY_MS = 500;
const BEACON_MS = 1400;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function markTeamIntroSeen() {
  try {
    sessionStorage.setItem(TEAM_INTRO_SEEN_KEY, "1");
  } catch {
    /* private mode / blocked storage */
  }
}

function hasSeenTeamIntro() {
  try {
    return sessionStorage.getItem(TEAM_INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function TeamCredits() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [beacon, setBeacon] = useState(false);
  const shouldGuideToFooterRef = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const beaconTimerRef = useRef<number>(null);

  const guideToFooter = useCallback(() => {
    const reduced = prefersReducedMotion();
    const footer = document.getElementById("site-footer");
    const target = triggerRef.current ?? footer;

    target?.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: reduced ? "auto" : "smooth",
    });
    triggerRef.current?.focus({ preventScroll: true });
    setBeacon(true);
    if (beaconTimerRef.current) {
      window.clearTimeout(beaconTimerRef.current);
    }
    beaconTimerRef.current = window.setTimeout(() => {
      setBeacon(false);
    }, BEACON_MS);
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    if (hasSeenTeamIntro()) return;

    const delay = prefersReducedMotion() ? 0 : INTRO_DELAY_MS;
    const timer = window.setTimeout(() => {
      if (hasSeenTeamIntro()) return;
      shouldGuideToFooterRef.current = true;
      markTeamIntroSeen();
      setOpen(true);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (beaconTimerRef.current) {
        window.clearTimeout(beaconTimerRef.current);
      }
    };
  }, []);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (pathname === "/" || !nextOpen) {
      markTeamIntroSeen();
    }
  };

  const handleOpenChangeComplete = (nextOpen: boolean) => {
    if (nextOpen) return;
    if (!shouldGuideToFooterRef.current) return;
    shouldGuideToFooterRef.current = false;
    guideToFooter();
  };

  return (
    <Dialog
      open={open}
      triggerId="meet-the-team"
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
    >
      <DialogTrigger
        ref={triggerRef}
        id="meet-the-team"
        className={cn(
          "group inline-flex flex-col items-end gap-1.5 rounded-md px-1.5 py-0.5 text-left outline-none transition-[color,box-shadow] duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
          beacon && "team-credits-beacon text-[var(--chocolate-dark)]",
        )}
        aria-haspopup="dialog"
        aria-label={`${TEAM_ORIGIN_LABEL}. Meet the team`}
      >
        <span
          aria-hidden
          className="relative flex w-max origin-bottom rounded-full bg-white p-px shadow-[0_10px_24px_-10px_rgba(45,28,16,0.45)] ring-1 ring-black/5 transition-transform duration-300 ease-out group-hover:scale-110 group-focus-visible:scale-110"
        >
          <span className="flex items-center">
            {TEAM_MEMBERS.map((member, index) => (
              <span
                key={member.id}
                className="relative size-7 overflow-hidden rounded-full bg-[var(--cream)] ring-2 ring-white"
                style={{
                  marginLeft: index === 0 ? 0 : -8,
                  zIndex: TEAM_MEMBERS.length - index,
                }}
              >
                <Image
                  src={member.photoSrc}
                  alt=""
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
            ))}
          </span>
          <span className="absolute left-1/2 top-full -mt-px -translate-x-1/2 border-4 border-transparent border-t-white drop-shadow-[0_1px_0_rgba(0,0,0,0.04)]" />
        </span>
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
          {TEAM_ORIGIN_LABEL}
          <Image
            src={TEAM_FLAG_SRC}
            alt=""
            width={20}
            height={12}
            className="h-3 w-auto rounded-[1px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
          />
          <ArrowUpRight className="size-3" strokeWidth={2.25} aria-hidden />
        </span>
      </DialogTrigger>

      <DialogContent className="max-h-[min(90dvh,40rem)] overflow-y-auto border border-[var(--chocolate-light)]/25 bg-[var(--cream)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-normal text-[var(--chocolate-dark)]">
            Meet the team
          </DialogTitle>
          <DialogDescription>{TEAM_CHOCOLATHON_DISCLAIMER}</DialogDescription>
        </DialogHeader>

        <ul className="grid gap-4 sm:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <li
              key={member.id}
              className={cn(
                "flex flex-col rounded-2xl border bg-[oklch(0.995_0.008_85)] p-3",
                member.featured
                  ? "border-[var(--gold)]/55 shadow-[0_8px_24px_-12px_oklch(0.32_0.06_45_/_0.35)] sm:col-span-1"
                  : "border-[var(--chocolate-light)]/20",
              )}
            >
              <div
                className={cn(
                  "relative mx-auto overflow-hidden rounded-full ring-2 ring-offset-2 ring-offset-[var(--cream)]",
                  member.featured
                    ? "size-24 ring-[var(--gold)]"
                    : "size-20 ring-[var(--chocolate-light)]/50",
                )}
              >
                <Image
                  src={member.photoSrc}
                  alt={member.photoAlt}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <p className="mt-3 text-center font-medium text-[var(--chocolate-dark)]">
                {member.href ? (
                  <a
                    href={member.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 underline-offset-3 hover:underline"
                  >
                    {member.name}
                    <ArrowUpRight className="size-3" strokeWidth={2.25} />
                  </a>
                ) : (
                  member.name
                )}
              </p>
              <p className="mt-0.5 text-center text-[11px] font-medium tracking-wide text-[var(--gold-dark)]">
                {member.role}
              </p>
              <p className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
