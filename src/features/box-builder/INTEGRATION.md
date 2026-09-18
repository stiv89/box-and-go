# Box Builder — drag & drop integration (KAN-17 / KAN-18 / KAN-19)

Everything lives in `src/features/box-builder/`. Nothing outside this folder is
required to *compile*; three small edits in `product-experience` turn it on.
All state stays in the existing Zustand store (`setSlotChocolate`,
`setFocusedSlotIndex`) — there is no second store.

## Exports (`@/features/box-builder`)

| Export | Purpose |
| --- | --- |
| `DndBuilderProvider` | Owns the `DndContext`, sensors, drag overlay and drop handling. |
| `DndBoxSlotGrid` | Drop-in for `BoxSlotGrid` — **same props**, plus drag & drop. |
| `DraggableChocolate` | Wrapper that makes a catalog item draggable. |
| `resolveDrop` | Pure drop rules (used by the provider; unit-testable). |

Without a `DndBuilderProvider` above it, `DndBoxSlotGrid` behaves exactly like
the click-based `BoxSlotGrid`.

## The three edits

1. `builder-workspace.tsx` — wrap the returned tree in `<DndBuilderProvider>`
   (catalog and preview must share one provider).
2. `box-preview.tsx` — render `<DndBoxSlotGrid …>` instead of `<BoxSlotGrid …>`
   (props are identical).
3. `chocolate-catalog.tsx` — wrap the `<button>` returned by `CatalogItem` in
   `<DraggableChocolate chocolateId={chocolate.id}>…</DraggableChocolate>`.

## Behavior

- Catalog → empty slot: places. Catalog → occupied slot: replaces.
- Slot → empty slot: moves. Slot → occupied slot: **swaps** (never loses or
  duplicates a piece; filled count is preserved).
- Drop outside the grid: no change. Stale drags (box resized / piece changed
  mid-drag) and out-of-range slot indexes are ignored.
- Branded piece: uniqueness is still enforced by the store's
  `setSlotChocolate`; moving it clears its old slot.
- Click flow is untouched. `Delete`/`Backspace` on a focused filled slot removes it.
- Mouse: 6px movement starts a drag. Touch: press-and-hold 200ms starts a drag,
  so the catalog list can still be scrolled with a quick swipe.
- No keyboard drag sensor on purpose: Enter/Space already drive click-to-place,
  and a keyboard sensor would hijack them.
- `BuilderWorkspace` mounts two `BoxPreview`s (mobile + desktop, one hidden by
  CSS), so droppable ids are namespaced per grid instance with `useId()`.
