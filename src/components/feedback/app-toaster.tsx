"use client";

import { X } from "lucide-react";

import { useNotifyStore, type NoticeTone } from "@/lib/notify";
import { cn } from "@/lib/utils";

const TONE_LABEL: Record<NoticeTone, string> = {
  success: "Success",
  error: "Error",
  warning: "Warning",
  info: "Notice",
};

export function AppToaster() {
  const notices = useNotifyStore((state) => state.notices);

  if (notices.length === 0) return null;

  const assertive = notices.some((notice) => notice.tone === "error");

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-20 z-[80] flex justify-end px-4 sm:px-6"
      role="region"
      aria-label="Notifications"
    >
      <ul
        className="pointer-events-auto flex w-full max-w-sm flex-col gap-2"
        aria-live={assertive ? "assertive" : "polite"}
        aria-relevant="additions text"
      >
        {notices.map((notice) => (
          <li
            key={notice.id}
            className={cn(
              "rounded-2xl border px-3 py-3 shadow-[0_12px_32px_rgba(40,24,12,0.12)]",
              notice.tone === "error" && "border-destructive/30 bg-white text-[var(--chocolate-dark)]",
              notice.tone === "warning" &&
                "border-[var(--gold)]/40 bg-[oklch(0.99_0.01_85)] text-[var(--chocolate-dark)]",
              notice.tone === "success" &&
                "border-[var(--chocolate-light)]/35 bg-white text-[var(--chocolate-dark)]",
              notice.tone === "info" &&
                "border-[var(--chocolate-light)]/30 bg-[oklch(0.991_0.006_85)] text-[var(--chocolate-dark)]",
            )}
          >
            <div className="flex items-start gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium tracking-[0.16em] text-[var(--chocolate-light)]">
                  {TONE_LABEL[notice.tone]}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed">{notice.message}</p>
                {notice.onRetry ? (
                  <button
                    type="button"
                    className="mt-2 min-h-10 rounded-full border border-[var(--chocolate-light)]/40 px-3 text-xs font-medium text-[var(--chocolate)] hover:bg-[var(--cream)]"
                    onClick={() => {
                      const retry = notice.onRetry;
                      useNotifyStore.getState().dismiss(notice.id);
                      retry?.();
                    }}
                  >
                    {notice.retryLabel ?? "Retry"}
                  </button>
                ) : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-neutral-400 hover:bg-[var(--cream)] hover:text-[var(--chocolate-dark)]"
                onClick={() => useNotifyStore.getState().dismiss(notice.id)}
              >
                <X className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
