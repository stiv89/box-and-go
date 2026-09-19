"use client";

import { create } from "zustand";

export type NoticeTone = "success" | "error" | "warning" | "info";

export interface AppNotice {
  id: string;
  tone: NoticeTone;
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
}

interface NotifyState {
  notices: AppNotice[];
  push: (notice: Omit<AppNotice, "id"> & { id?: string }) => string;
  dismiss: (id: string) => void;
  clear: () => void;
}

const DEDUPE_MS = 2500;
const recent = new Map<string, number>();

function noticeKey(tone: NoticeTone, message: string) {
  return `${tone}:${message}`;
}

export const useNotifyStore = create<NotifyState>((set, get) => ({
  notices: [],
  push: (notice) => {
    const key = noticeKey(notice.tone, notice.message);
    const now = Date.now();
    const last = recent.get(key) ?? 0;
    if (now - last < DEDUPE_MS) {
      const existing = get().notices.find((item) => noticeKey(item.tone, item.message) === key);
      return existing?.id ?? "";
    }
    recent.set(key, now);
    const id = notice.id ?? `${now}-${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({
      notices: [...state.notices.filter((item) => item.id !== id), { ...notice, id }],
    }));
    const lifetime = notice.tone === "error" ? 8000 : 4200;
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        get().dismiss(id);
      }, lifetime);
    }
    return id;
  },
  dismiss: (id) =>
    set((state) => ({ notices: state.notices.filter((item) => item.id !== id) })),
  clear: () => set({ notices: [] }),
}));

export const notify = {
  success: (message: string) => useNotifyStore.getState().push({ tone: "success", message }),
  info: (message: string) => useNotifyStore.getState().push({ tone: "info", message }),
  warning: (message: string) => useNotifyStore.getState().push({ tone: "warning", message }),
  error: (message: string, retry?: { label?: string; onRetry: () => void }) =>
    useNotifyStore.getState().push({
      tone: "error",
      message,
      retryLabel: retry?.label ?? "Retry",
      onRetry: retry?.onRetry,
    }),
};
