# Box & Go

Visual corporate chocolate box configurator for **Cocoa Dolce**. Users choose a box size, arrange chocolates, apply branding, and export production-ready specifications.

> Hackathon project — prioritizes simplicity, reliability, and fast iteration.

## Technology Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | Zustand |
| Drag & drop | @dnd-kit (installed, not yet wired) |
| Persistence | Supabase (optional, future) |
| Deployment | Vercel |
| Package manager | npm |

## Installation

```bash
git clone https://github.com/stiv89/box-and-go.git
cd box-and-go
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Local Development Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

No environment variables are required for local development — the app uses sample chocolate data from `src/data/demo-chocolates.ts`.

## Environment Variables

Copy the example file when you are ready to connect Supabase:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |

The app builds and runs without these values. See `src/lib/supabase/client.ts`.

## Folder Structure

```
src/
  app/                    # Routes (landing, /builder)
  components/
    ui/                   # shadcn/ui primitives (shared)
    layout/               # Header, footer (shared)
    box-builder/          # Developer 1 — UI components
    customization/        # Developer 2 — UI components
    production/           # Developer 3 — UI components
  features/
    box-builder/          # Developer 1 — feature logic
    customization/        # Developer 2 — feature logic
    production/           # Developer 3 — feature logic
  lib/
    constants/            # Box sizes, shared constants
    supabase/             # Optional Supabase client
    box-factory.ts        # Box grid helpers
  stores/
    use-box-store.ts      # Shared Zustand store
  types/                  # Shared TypeScript contracts
  data/
    demo-chocolates.ts    # Sample catalog (not real Cocoa Dolce data)
public/
```

## Git Branching Strategy

| Branch | Purpose |
| --- | --- |
| `main` | Production — stable releases only |
| `develop` | Integration — completed features merge here |
| `setup/base` | Foundation work (merged into develop) |
| `feature/*` | Individual developer feature branches |

### Workflow Rules

1. Work only on your assigned feature branch.
2. Commit and push changes to your feature branch.
3. Before starting or finishing work, sync with `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-branch
   git merge develop
   ```
4. Merge into `develop` when your feature is ready (Pull Requests preferred, not mandatory).
5. Test the integrated app on `develop`.
6. **Never** merge feature branches directly into `main`.
7. **Never** force-push shared branches (`main`, `develop`).
8. Only merge `develop` → `main` after the team verifies the integrated app and explicitly decides to release.

## Team Responsibilities

### Developer 1 — `feature/box-builder`

**Owns:**
- `src/features/box-builder/`
- `src/components/box-builder/`

**Scope:** Box grid, chocolate selection, drag-and-drop (dnd-kit), slot placement, box size switching.

### Developer 2 — `feature/customization`

**Owns:**
- `src/features/customization/`
- `src/components/customization/`

**Scope:** Logo upload/positioning, ribbon selection, card customization, packaging preferences.

### Developer 3 — `feature/production-export`

**Owns:**
- `src/features/production/`
- `src/components/production/`

**Scope:** Production specification, order quantities, JSON export, printable document, shareable proof.

### Shared (do not modify without coordination)

- `src/types/` — shared data contracts
- `src/stores/use-box-store.ts` — extend carefully; coordinate schema changes
- `src/components/ui/` — shadcn primitives
- `src/components/layout/` — site chrome
- `src/lib/constants/` — box size definitions

## Getting Started as a Developer

```bash
# 1. Clone and install
git clone https://github.com/stiv89/box-and-go.git
cd box-and-go
npm install

# 2. Fetch all branches
git fetch origin

# 3. Check out your feature branch (example: Developer 1)
git checkout feature/box-builder

# 4. Start developing
npm run dev
```

Before merging your feature:

```bash
git checkout develop
git pull origin develop
git checkout feature/box-builder
git merge develop
# resolve conflicts if any
npm run lint && npm run build
git push origin feature/box-builder
# merge into develop via PR or local merge
```

## Production Release Workflow

1. Verify the integrated app on `develop` (`npm run lint && npm run build`).
2. Team agrees the release is ready.
3. Merge `develop` into `main`:
   ```bash
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   ```
4. Vercel deploys `main` to production automatically once connected.

## Deployment (Vercel)

| Environment | Branch | Notes |
| --- | --- | --- |
| Production | `main` | Stable releases only |
| Preview / staging | `develop` | Integration testing |
| Preview | `feature/*` | Per-branch preview URLs |

**Manual setup (if not yet connected):**

1. Import the GitHub repo in [Vercel](https://vercel.com/new).
2. Set **Production Branch** to `main`.
3. Add Supabase env vars in project settings when ready (optional for demo).
4. Deploy — feature branches receive automatic preview URLs.

## Shared Types

All developers import from `@/types`:

- `Chocolate`, `ChocolateBox`, `BoxSlot`, `BoxConfiguration`
- `Customization`, `CorporateOrder`, `ProductionSpecification`
- Box sizes: `9` (3×3) and `16` (4×4)

Sample catalog: `src/data/demo-chocolates.ts` — clearly labeled as sample data, not Cocoa Dolce's real catalog.
