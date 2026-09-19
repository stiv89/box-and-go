"use client";

import { useEffect, useId, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { applyConciergeProposal } from "@/features/concierge/lib/apply-proposal";
import type { ConciergeProposal } from "@/features/concierge/lib/proposals";
import {
  CONCIERGE_CHIPS,
  CONCIERGE_WELCOME,
  matchConciergeIntent,
  replyForIntent,
  type ConciergeIntent,
} from "@/features/concierge/lib/script";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "concierge" | "user";
  text: string;
  proposal?: ConciergeProposal;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

interface ConciergePanelProps {
  triggerClassName?: string;
  triggerLabel?: string;
}

export function ConciergePanel({
  triggerClassName,
  triggerLabel = "Ask our concierge",
}: ConciergePanelProps) {
  const router = useRouter();
  const pathname = usePathname();
  const listRef = useRef<HTMLDivElement>(null);
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [applied, setApplied] = useState(false);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "concierge", text: CONCIERGE_WELCOME.text },
  ]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending]);

  function pushReply(intent: ConciergeIntent) {
    const reply = replyForIntent(intent);
    setPending(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: createId(),
          role: "concierge",
          text: reply.text,
          proposal: reply.proposal,
        },
      ]);
      setPending(false);
    }, 280);
  }

  function handleIntent(intent: ConciergeIntent, asUser?: string) {
    if (pending) return;
    if (asUser) {
      setMessages((current) => [
        ...current,
        { id: createId(), role: "user", text: asUser },
      ]);
    }
    pushReply(intent);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    setInput("");
    handleIntent(matchConciergeIntent(text), text);
  }

  function handleApply(proposal: ConciergeProposal) {
    applyConciergeProposal(proposal);
    setApplied(true);
    setMessages((current) => [
      ...current,
      {
        id: createId(),
        role: "concierge",
        text: `Applied “${proposal.title}” to the configurator. Opening the builder so you can review and keep editing.`,
      },
    ]);
    window.setTimeout(() => {
      setOpen(false);
      if (pathname !== "/builder") {
        router.push("/builder");
      }
    }, 600);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(
          "text-[12px] tracking-wide text-neutral-400 underline-offset-4 transition-colors hover:text-[var(--chocolate)] hover:underline focus-visible:ring-2 focus-visible:ring-[var(--gold)]",
          triggerClassName,
        )}
      >
        {triggerLabel}
      </DialogTrigger>

      <DialogContent className="flex max-h-[min(36rem,82dvh)] flex-col gap-3 overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-lg font-normal text-[var(--chocolate-dark)]">
            Chocolate Concierge
          </DialogTitle>
          <DialogDescription>
            Scripted guide with the real catalog — not a live AI. Confirm before
            anything is applied to your box.
          </DialogDescription>
        </DialogHeader>

        <div
          ref={listRef}
          className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[92%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
                message.role === "user"
                  ? "ml-auto bg-[var(--chocolate)] text-white"
                  : "bg-[oklch(0.97_0.012_80)] text-[var(--chocolate-dark)]",
              )}
            >
              {message.text}
              {message.proposal && !applied && !dismissed.includes(message.id) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    className="bg-[var(--chocolate)] text-white hover:bg-[var(--chocolate-dark)]"
                    onClick={() => handleApply(message.proposal!)}
                  >
                    Apply this layout
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setDismissed((current) => [...current, message.id])}
                  >
                    Not now
                  </Button>
                </div>
              )}
            </div>
          ))}
          {pending && (
            <p className="text-[11px] tracking-wide text-neutral-400">
              Concierge is preparing a reply…
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {CONCIERGE_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              disabled={pending}
              onClick={() => handleIntent(chip.intent, chip.label)}
              className="min-h-10 rounded-full border border-neutral-200 px-2.5 text-[11px] text-neutral-500 transition-colors hover:border-[var(--chocolate)]/30 hover:text-[var(--chocolate-dark)] disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <label className="sr-only" htmlFor={inputId}>
            Message the concierge
          </label>
          <Input
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about size, flavors, or branding"
            className="h-9"
            autoComplete="off"
          />
          <Button
            type="submit"
            size="sm"
            disabled={pending || !input.trim()}
            className="bg-[var(--chocolate)] text-white hover:bg-[var(--chocolate-dark)]"
          >
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
