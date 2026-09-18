"use client";

import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type Announcements,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState, type ReactNode } from "react";

import { ChocolatePiece } from "@/features/product-experience/components/chocolate-piece";
import { useBoxStore } from "@/stores/use-box-store";

import { readDragSource, readDropTarget, type DragSource } from "../lib/drag-data";
import { resolveDrop } from "../lib/resolve-drop";

function chocolateName(source: DragSource | null) {
  if (!source) return "chocolate";
  const { catalog } = useBoxStore.getState();
  return catalog.find((item) => item.id === source.chocolateId)?.name ?? "chocolate";
}

const announcements: Announcements = {
  onDragStart({ active }) {
    return `Picked up ${chocolateName(readDragSource(active.data.current))}.`;
  },
  onDragOver({ active, over }) {
    const target = readDropTarget(over?.data.current);
    const name = chocolateName(readDragSource(active.data.current));
    return target ? `${name} is over slot ${target.slotIndex + 1}.` : `${name} is not over a slot.`;
  },
  onDragEnd({ active, over }) {
    const target = readDropTarget(over?.data.current);
    const name = chocolateName(readDragSource(active.data.current));
    return target ? `Dropped ${name} on slot ${target.slotIndex + 1}.` : `Dropped ${name} outside the box.`;
  },
  onDragCancel({ active }) {
    return `Dragging ${chocolateName(readDragSource(active.data.current))} was cancelled.`;
  },
};

/**
 * Owns the `DndContext` for the builder. Wrap the catalog and the box preview
 * in one provider; drops are applied through the existing store actions so no
 * box state lives outside Zustand.
 */
export function DndBuilderProvider({ children }: { children: ReactNode }) {
  const [activeSource, setActiveSource] = useState<DragSource | null>(null);
  const catalog = useBoxStore((s) => s.catalog);
  const logoUrl = useBoxStore((s) => s.customization.logo.url);

  // Mouse needs a small movement threshold so clicks still register; touch
  // needs a press-and-hold so the catalog list can still scroll.
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  );

  function handleDragStart({ active }: DragStartEvent) {
    setActiveSource(readDragSource(active.data.current));
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveSource(null);

    const source = readDragSource(active.data.current);
    const target = readDropTarget(over?.data.current);
    if (!source || !target) return;

    // Read the store at drop time: the box may have changed during the drag.
    const state = useBoxStore.getState();
    const resolution = resolveDrop({
      slots: state.slots,
      catalogIds: state.catalog.map((item) => item.id),
      source,
      targetSlotIndex: target.slotIndex,
    });
    if (!resolution) return;

    for (const write of resolution.writes) {
      state.setSlotChocolate(write.slotIndex, write.chocolateId);
    }
    state.setFocusedSlotIndex(resolution.focusSlotIndex);
  }

  const activeChocolate = activeSource
    ? (catalog.find((item) => item.id === activeSource.chocolateId) ?? null)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      accessibility={{ announcements }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveSource(null)}
    >
      {children}
      <DragOverlay>
        {activeChocolate ? (
          <ChocolatePiece
            chocolate={activeChocolate}
            size="md"
            logoUrl={logoUrl}
            className="cursor-grabbing shadow-lg ring-2 ring-[var(--gold)]"
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
