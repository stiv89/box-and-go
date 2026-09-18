# Box & Go — Team Integration Guide

> Updated after merging `feature/product-experience` into `develop`.

The product experience (landing, builder, click-based editor, customization,
order summary) is now on **`develop`**. Two feature branches remain for
parallel work.

---

## Current Branch State

| Branch | Status |
| --- | --- |
| `develop` | **Integration branch** — includes full product experience |
| `main` | Unchanged — scaffold only, no product features |
| `feature/product-experience` | Merged into `develop` — do not delete yet, but work from `develop` |
| `feature/box-builder` | Stale — no unique commits; must sync with `develop` |
| `feature/production-export` | Stale — no unique commits; must sync with `develop` |
| `feature/customization` | Stale — customization already shipped via product experience |

**Important:** `feature/box-builder` and `feature/production-export` do **not**
contain independent work yet. Syncing with `develop` is a fast-forward with no
conflicts expected.

---

## Developer Responsibilities

### Developer A — Drag & Drop (`feature/box-builder`)

**Scope:** Replace or enhance click-based slot interaction with dnd-kit.

**Owns (create/edit here):**
- `src/features/box-builder/`
- `src/components/box-builder/`

**Do not modify without coordination:**
- `src/features/product-experience/` (owned by lead / merged product experience)
- `src/stores/use-box-store.ts` — extend only if necessary; keep backward compatible
- `src/types/` — coordinate schema changes

---

### Developer B — Production Export (`feature/production-export`)

**Scope:** JSON export, printable production document, shareable proof.

**Owns (create/edit here):**
- `src/features/production/`
- `src/components/production/`

**Do not modify without coordination:**
- `src/features/product-experience/` — especially `production-export-slot.tsx`
- `src/stores/use-box-store.ts`
- `src/types/`

---

## Files You Must Not Modify

| File / folder | Owner | Reason |
| --- | --- | --- |
| `src/features/product-experience/**` | Lead (merged) | Core product UI |
| `src/app/page.tsx`, `src/app/builder/page.tsx` | Lead (merged) | Route shells |
| `src/components/layout/**` | Lead (merged) | Site chrome |
| `src/features/box-builder/**` | Developer A | Parallel feature |
| `src/features/production/**` | Developer B | Parallel feature |
| `src/types/**` | Shared | Coordinate changes |
| `src/stores/use-box-store.ts` | Shared | Coordinate changes |

---

## Sync With develop (required before starting)

Both developers run:

```bash
git fetch origin
git checkout develop
git pull origin develop
npm install
npm run lint && npm run build
```

Then update your feature branch:

```bash
# Developer A
git checkout feature/box-builder
git merge develop

# Developer B
git checkout feature/production-export
git merge develop
```

If you already have local commits on your feature branch:

```bash
git checkout feature/your-branch
git merge develop
# resolve conflicts if any
npm run lint && npm run build
git push origin feature/your-branch
```

When your feature is ready:

```bash
git checkout develop
git pull origin develop
git merge feature/your-branch
npm run lint && npm run build
git push origin develop
```

**Never** merge feature branches directly into `main`.

---

## Interface 1: BoxSlotGrid (Drag & Drop)

**Location:** `src/features/product-experience/components/box-slot-grid.tsx`

**Exported from:** `@/features/product-experience` (also import path above)

### Props

```typescript
export interface BoxSlotGridProps {
  rows: number;
  cols: number;
  slots: BoxSlot[];                    // from @/types
  catalog: Chocolate[];                // from @/types
  selectedChocolateId: ChocolateId | null;
  focusedSlotIndex: number | null;
  onSlotActivate: (slotIndex: number) => void;
  onSlotClear: (slotIndex: number) => void;
  onSlotFocus: (slotIndex: number) => void;
  readOnly?: boolean;
  className?: string;
}
```

### Current usage

`BoxPreview` renders `BoxSlotGrid` and wires store actions:

- `onSlotActivate` → sets focus + places `selectedChocolateId` via `setSlotChocolate`
- `onSlotClear` → `clearSlot`
- `onSlotFocus` → `setFocusedSlotIndex`

### Integration strategy (Developer A)

1. **Preferred:** Create `DndBoxSlotGrid` in `src/features/box-builder/` that
   accepts the same props (or extends them) and swap it into `BoxPreview` via a
   PR coordinated with lead — **or** wrap `BoxSlotGrid` with dnd-kit droppable
   zones without changing product-experience files.

2. **Alternative:** Add a dnd-kit layer in `src/components/box-builder/` that
   imports `BoxSlotGrid` as the visual shell and overrides interaction handlers.

3. **Store:** Use existing actions only:
   - `setSlotChocolate(slotIndex, chocolateId)`
   - `clearSlot(slotIndex)`
   - `setSelectedChocolate(id)`
   - Do not duplicate box state outside Zustand.

### Acceptance criteria (Developer A)

- [ ] Drag chocolate from catalog onto a slot places it in the store
- [ ] Drag between slots reorders / moves pieces
- [ ] Remove chocolate from slot still works
- [ ] Box size switch + confirm dialog still works
- [ ] Keyboard accessibility preserved or improved
- [ ] `npm run lint && npm run build` pass
- [ ] No edits inside `src/features/product-experience/` unless agreed with lead

---

## Interface 2: Production Export

**Integration slot:** `src/features/product-experience/components/production-export-slot.tsx`

**Configuration reader:**

```typescript
import { getBoxConfigurationFromStore, useBoxStore } from "@/stores/use-box-store";

const state = useBoxStore.getState();
const config = getBoxConfigurationFromStore(state);
```

### Return shape (`BoxConfiguration` + quantity)

```typescript
{
  box: {
    size: 9 | 16;
    rows: number;
    cols: number;
    slots: BoxSlot[];   // { index, row, col, chocolateId }
  };
  customization: {
    logo: { url, x, y, scale, rotation };
    ribbon: { color, style };
    card: { message, fontStyle };
    packaging: { wrapStyle, giftNote };
  };
  quantity: number;
}
```

### Target output type

Build toward `ProductionSpecification` in `src/types/order.ts`:

```typescript
interface ProductionSpecification {
  orderId: string;
  boxSize: BoxSize;
  slots: ProductionSlotSpec[];  // { slotIndex, chocolateId, chocolateName }
  customization: Customization;
  quantity: number;
  generatedAt: string;
}
```

Resolve chocolate names via `useBoxStore.getState().catalog`.

### Integration strategy (Developer B)

1. Create export components in `src/features/production/`.
2. Replace or mount alongside `ProductionExportSlot` after merge review.
3. Wire the disabled **"Export specification — coming soon"** button to your export flow.
4. For logo URLs: note they are **blob URLs** (session-only). Document in export
   output or resolve when Supabase storage is connected.

### Acceptance criteria (Developer B)

- [ ] Export produces valid JSON matching `ProductionSpecification`
- [ ] Printable document renders box layout + customization + quantity
- [ ] Shareable proof (screenshot, link, or PDF) works for demo
- [ ] Order summary totals match exported quantity
- [ ] Empty slots handled gracefully in export
- [ ] `npm run lint && npm run build` pass
- [ ] No fake "success" when export fails

---

## Shared Store Reference

`src/stores/use-box-store.ts` — key fields after product experience merge:

| Field | Type | Notes |
| --- | --- | --- |
| `boxSize` | `9 \| 16` | |
| `slots` | `BoxSlot[]` | |
| `quantity` | `number` | min 1 |
| `catalog` | `Chocolate[]` | demo data |
| `selectedChocolateId` | `ChocolateId \| null` | active catalog pick |
| `focusedSlotIndex` | `number \| null` | |
| `customization` | `Customization` | logo, ribbon, card, packaging |

Actions: `setBoxSize`, `setSlotChocolate`, `setQuantity`, `setSelectedChocolate`,
`clearSlot`, `updateLogo`, `updateRibbon`, `updateCard`, `updatePackaging`, `setLogoUrl`.

---

## Known Limitations (post-merge)

- Logo upload uses blob URLs — lost on page refresh
- No Supabase persistence
- No pricing or payments
- Click-based placement (dnd-kit pending from Developer A)
- Export button disabled until Developer B integrates

---

## Quick Verification After Sync

```bash
npm run dev
# Open http://localhost:3000/builder
# 1. Select 16-piece box
# 2. Pick a chocolate, click slots to fill
# 3. Upload logo, change ribbon, add card message
# 4. Set quantity to 500 — order summary updates
# 5. Switch to 9-piece — confirm reset dialog appears
```
