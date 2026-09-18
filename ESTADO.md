# Box & Go — Estado del proyecto

> Última actualización: 18 sep 2026  
> Rama activa recomendada para trabajar: **`develop`**

Documento rápido para saber **dónde estamos**, **qué ya funciona**, **qué falta** y **qué le toca a cada uno** cuando entren al repo.

---

## Resumen en una línea

El proyecto está **inicializado y listo para desarrollar en paralelo**. Hay landing page, ruta `/builder` con placeholder, tipos compartidos, store de Zustand y ramas de feature creadas — **pero ninguna feature principal está implementada todavía**.

---

## Qué ya está hecho

### Infra y repo

- [x] Next.js 15 + TypeScript (strict) + Tailwind v4 + ESLint
- [x] shadcn/ui instalado (Button, Card, Badge, Separator)
- [x] Dependencias listas: Zustand, dnd-kit, Supabase client (stub)
- [x] Repo en GitHub: `https://github.com/stiv89/box-and-go`
- [x] Ramas creadas y pusheadas a `origin`

### Ramas

| Rama | Estado | Contenido |
| --- | --- | --- |
| `main` | Estable, mínima | Solo scaffold inicial de Next.js |
| `develop` | **Rama de integración** | Toda la base compartida |
| `setup/base` | Mergeada en develop | Trabajo de foundation (histórico) |
| `feature/box-builder` | Lista para Dev 1 | Apunta al mismo commit que `develop` |
| `feature/customization` | Lista para Dev 2 | Apunta al mismo commit que `develop` |
| `feature/production-export` | Lista para Dev 3 | Apunta al mismo commit que `develop` |

### Commits actuales

```
9a12347  Merge branch 'setup/base' into develop
6d39bde  Add shared foundation: types, store, UI, and collaboration structure
e5592fc  Initialize Next.js application with TypeScript and Tailwind CSS
```

### App funcional (base)

- [x] Landing page en `/`
- [x] Ruta `/builder` con grid placeholder
- [x] Header + footer responsive
- [x] Tema visual chocolate (colores primary cálidos)
- [x] `.env.example` documentado (Supabase opcional)
- [x] `npm run dev`, `lint` y `build` pasan

### Contratos compartidos (`src/types/`)

- [x] `Chocolate`, `ChocolateBox`, `BoxSlot`, `BoxConfiguration`
- [x] `Customization` (logo, ribbon, card, packaging)
- [x] `CorporateOrder`, `ProductionSpecification`
- [x] Tamaños de caja: **9** (3×3) y **16** (4×4)

### Datos y estado

- [x] Catálogo demo en `src/data/demo-chocolates.ts` (datos de muestra, no catálogo real)
- [x] Store Zustand en `src/stores/use-box-store.ts` (tamaño, slots, cantidad, catálogo)
- [x] Factory de cajas en `src/lib/box-factory.ts`

---

## Qué NO está hecho (todavía)

Estas son las **tres features principales** del hackathon. Nada de esto está implementado:

| Feature | Rama | Estado |
| --- | --- | --- |
| Box builder (grid, drag & drop, slots) | `feature/box-builder` | ❌ Pendiente |
| Customization (logo, ribbon, card) | `feature/customization` | ❌ Pendiente |
| Production export (specs, JSON, proof) | `feature/production-export` | ❌ Pendiente |

Tampoco está hecho:

- [ ] Drag and drop con dnd-kit
- [ ] Upload de logo
- [ ] Export JSON / documento imprimible
- [ ] Proof compartible
- [ ] Supabase conectado (solo stub)
- [ ] Deploy en Vercel (documentado, no configurado)
- [ ] Merge de `develop` → `main` (solo cuando el equipo decida release)

---

## Cómo correr el proyecto ahora

```bash
git clone https://github.com/stiv89/box-and-go.git
cd box-and-go
git checkout develop
npm install
npm run dev
```

Abrir: http://localhost:3000  
Builder: http://localhost:3000/builder

---

## Estructura de carpetas (quién toca qué)

```
src/
  components/
    box-builder/      → Dev 1
    customization/    → Dev 2
    production/       → Dev 3
    layout/           → Compartido (header, footer)
    ui/               → Compartido (shadcn)
  features/
    box-builder/      → Dev 1
    customization/    → Dev 2
    production/       → Dev 3
  types/              → Compartido (coordinar cambios)
  stores/             → Compartido (extender con cuidado)
  data/               → Mock data (por ahora)
```

---

## Si vos (lead) vas a hacer la mayor parte primero

Recomendación de orden antes de repartir tareas:

### 1. Trabajar en `develop` o en tu propia rama temporal

Si vas a tocar varias features vos solo al principio, podés:

```bash
git checkout develop
git pull origin develop
# opcional: crear rama tuya
git checkout -b feature/lead-integration
```

### 2. Prioridad sugerida (orden lógico de dependencias)

1. **Box builder** — sin grid funcional, el resto no tiene mucho sentido visual
2. **Customization** — logo/ribbon/card encima del builder
3. **Production export** — consume la config final del store

### 3. Cosas que conviene dejar listas antes de pasarles el repo al equipo

- [ ] Grid interactivo con drag & drop básico
- [ ] Selector de chocolates conectado al store
- [ ] Cambio de tamaño 9 ↔ 16 sin perder lógica rota
- [ ] UI mínima de customization (aunque sea placeholder funcional)
- [ ] Un botón de "export preview" aunque sea JSON en consola
- [ ] Verificar que `npm run build` sigue pasando después de tus cambios

### 4. Cuando repartas tareas

Cada dev hace checkout de **su** rama (todas salen del mismo `develop`):

```bash
# Dev 1
git checkout feature/box-builder

# Dev 2
git checkout feature/customization

# Dev 3
git checkout feature/production-export
```

Antes de mergear a `develop`, que sincronicen:

```bash
git checkout develop && git pull origin develop
git checkout feature/su-rama
git merge develop
npm run lint && npm run build
```

---

## Tareas concretas para repartir después

### Dev 1 — `feature/box-builder`

**Carpetas:** `src/features/box-builder/`, `src/components/box-builder/`

- Grid visual 3×3 y 4×4
- Paleta de chocolates (usar `DEMO_CHOCOLATES`)
- Drag & drop con dnd-kit → slot placement
- Cambio de tamaño de caja (reset o migración de slots)
- Conectar todo a `useBoxStore`

### Dev 2 — `feature/customization`

**Carpetas:** `src/features/customization/`, `src/components/customization/`

- Upload y preview de logo
- Posicionamiento del logo (x, y, scale, rotation)
- Selector de ribbon (color, estilo)
- Editor de tarjeta (mensaje, font)
- Preferencias de packaging
- Extender store o crear slice de customization

### Dev 3 — `feature/production-export`

**Carpetas:** `src/features/production/`, `src/components/production/`

- Generar `ProductionSpecification` desde el store
- Cantidad de pedido
- Export JSON descargable
- Vista/documento imprimible para producción
- Proof visual compartible (screenshot o link)

---

## Reglas del equipo (recordatorio)

1. Trabajar en **tu feature branch**, no en `main`
2. Integrar en **`develop`**, nunca feature → `main` directo
3. No force-push en ramas compartidas
4. `main` solo cuando el equipo decida release
5. Coordinar cambios en `src/types/` y `src/stores/`

---

## Deploy (pendiente manual)

Vercel no está conectado todavía. Cuando quieran deployar:

1. Importar repo en [vercel.com/new](https://vercel.com/new)
2. **Production branch** = `main`
3. Preview en `develop` y `feature/*`
4. Variables Supabase solo cuando las necesiten

---

## Checklist rápido "¿estamos listos para el hackathon?"

| Item | ¿Listo? |
| --- | --- |
| Repo clonable | ✅ |
| `npm run dev` funciona | ✅ |
| Tipos compartidos | ✅ |
| Store base | ✅ |
| Landing + /builder placeholder | ✅ |
| Ramas de feature creadas | ✅ |
| Features implementadas | ❌ |
| Vercel deploy | ❌ |
| Supabase live | ❌ |

---

## Próximo paso inmediato (para vos)

1. `git checkout develop`
2. Decidir si implementás box-builder primero en `develop` o en `feature/box-builder`
3. Cuando tengas algo estable, mergear a `develop` y avisar al equipo qué rama tomar
4. Actualizar este archivo (`ESTADO.md`) cuando cambie el status

---

Más detalle técnico y comandos Git → ver [`README.md`](./README.md).
