"use client";

import { useDraggable } from "@dnd-kit/core";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import type { ChocolateId } from "@/types";

import { catalogDragId, type DragSource } from "../lib/drag-data";

interface DraggableChocolateProps {
  chocolateId: ChocolateId;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Wraps an existing catalog item so it can be dragged into the box.
 * Only pointer listeners are attached — the wrapped button keeps its own
 * click / keyboard behavior, so click-to-select still works untouched.
 */
export function DraggableChocolate({
  chocolateId,
  disabled = false,
  className,
  children,
}: DraggableChocolateProps) {
  const source: DragSource = { type: "catalog", chocolateId };
  const { setNodeRef, listeners, isDragging } = useDraggable({
    id: catalogDragId(chocolateId),
    data: source,
    disabled,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      className={cn(
        "select-none",
        !disabled && "cursor-grab",
        isDragging && "opacity-40",
        className,
      )}
    >
      {children}
    </div>
  );
}
