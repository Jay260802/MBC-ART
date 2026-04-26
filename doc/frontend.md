# MBC ART — Frontend Architecture

## Stack

| Concern | Technology |
|---------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (CSS-first config, no tailwind.config.js) |
| Component library | Shadcn UI v4 (Stone base → overridden with MBC ART tokens) |
| Animation | Motion (Framer Motion v12 rebranded) |
| Fonts | Playfair Display (headings) · Hind (UI / body) via `next/font/google` |
| Theme | next-themes (light/dark, persisted in `localStorage`) |
| State — server | TanStack Query v5 |
| State — client | Zustand v5 (`persist` to `localStorage`) |
| Forms | react-hook-form v7 + Zod v4 (`@hookform/resolvers`) |
| Toast | Sonner v2 |
| Icons | Lucide React |

---

## Directory Layout

```
src/
├── app/                         # Next.js App Router
│   ├── layout.tsx               # Root layout — fonts, ThemeProvider, QueryProvider, Toaster
│   ├── page.tsx                 # Homepage (hero, category grid, B2B banner)
│   ├── globals.css              # Tailwind v4 + MBC ART design tokens (oklch palette)
│   ├── sitemap.ts               # Auto-generated XML sitemap
│   ├── robots.ts                # Crawler rules
│   │
│   ├── (shop)/                  # Public-facing shop layout group
│   │   ├── loading.tsx          # Skeleton grid shown during navigation
│   │   ├── error.tsx            # Error boundary with retry
│   │   ├── shop/[category]/     # Category listing pages (ISR, revalidate=300s)
│   │   ├── product/[slug]/      # Product detail pages (ISR, revalidate=300s)
│   │   ├── cart/                # Cart review page
│   │   └── checkout/            # Order checkout (auth-gated via middleware)
│   │
│   ├── (auth)/                  # Authentication pages (no shared nav)
│   │   ├── login/
│   │   ├── register/
│   │   └── apply-b2b/           # B2B application form
│   │
│   ├── (dashboard)/             # Protected dashboards
│   │   ├── admin/               # Admin panel (role=admin)
│   │   └── b2b-portal/          # B2B buyer portal (role=b2b_approved)
│   │
│   └── api/v1/                  # REST API (thin handlers → services)
│       ├── auth/[...nextauth]/  # Auth.js v5 catch-all
│       ├── products/            # GET all / POST create
│       ├── orders/              # POST create (auth-gated by middleware)
│       └── users/register/      # POST register new user
│
├── components/
│   ├── ui/                      # Shadcn generated primitives (never edit directly)
│   ├── layout/
│   │   ├── Navbar.tsx           # Desktop top navigation
│   │   ├── BottomNav.tsx        # Mobile bottom tab bar (5 tabs)
│   │   ├── Footer.tsx           # Site footer
│   │   ├── ThemeProvider.tsx    # next-themes wrapper (client)
│   │   ├── ThemeToggle.tsx      # Sun/Moon icon button
│   │   └── QueryProvider.tsx    # TanStack Query provider (client)
│   ├── shop/                    # Product card, product grid, image carousel
│   ├── cart/                    # Cart item row, cart summary
│   └── common/                  # Reusable non-layout components
│
├── hooks/
│   └── useMediaQuery.ts         # Returns true/false for a CSS media query
│
├── store/
│   ├── cart.store.ts            # Cart items, order type (B2C/B2B), persisted
│   └── auth.store.ts            # Client-side auth state mirror
│
└── types/
    ├── next-auth.d.ts           # Module augmentation: session.user.role, JWT.id
    └── product.types.ts         # ProductImage, CartItem, parsed Product shape
```

---

## Design System

### Color Palette (MBC ART brand)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | Maroon `#8B1538` | Rose-maroon `#C44B6E` | Buttons, links |
| `--accent` | Gold `#C9A84C` | Bright gold `#E5C158` | Highlights, badges |
| `--background` | Ivory `#FAF9F7` | Warm dark `#1A1410` | Page background |
| `--card` | White | Warm charcoal `#2C2420` | Product cards |
| `--muted` | Warm gray `#F0EAE4` | Deep brown `#3D2E28` | Muted sections |
| `--border` | Warm taupe `#E5DDD4` | Dark border `#4A3830` | Dividers, inputs |
| `--foreground` | Warm black `#2C2420` | Cream `#F5F0E8` | Body text |

All values expressed in **oklch** color space (Tailwind v4 / Shadcn v4 standard).

### Typography

```
Playfair Display  → h1–h6, product titles, hero text      (--font-playfair)
Hind              → body, UI labels, nav, buttons          (--font-hind)
```

Loaded via `next/font/google` (zero-CLS, self-hosted). Applied as CSS variables on `<html>`.

### Tailwind v4 Class Notes

Tailwind v4 changed several class names from v3:

| v3 | v4 |
|----|----|
| `bg-gradient-to-br` | `bg-linear-to-br` |
| `aspect-[3/4]` | `aspect-3/4` |
| `font-[family-name:var(--x)]` | `font-(family-name:--x)` |

---

## Routing & ISR Strategy

| Route pattern | Rendering | Revalidate |
|---------------|-----------|-----------|
| `/` (homepage) | Server | On demand |
| `/shop/[category]` | ISR | 300 s |
| `/product/[slug]` | ISR | 300 s |
| `/cart` | Client | — |
| `/checkout` | Server (auth-gated) | — |
| `/admin/*` | Server (admin-gated) | — |
| `/b2b-portal/*` | Server (b2b-gated) | — |

`generateStaticParams()` pre-builds category and top product pages at build time.

---

## State Management

### Server state — TanStack Query v5
- All data fetching from `/api/v1/*` goes through React Query hooks
- `QueryProvider` wraps the tree in `src/components/layout/QueryProvider.tsx`
- Never call `fetch()` directly inside components

### Client state — Zustand v5

**`cart.store.ts`**
```
{ items: CartItem[], orderType: "B2C"|"B2B" }
Actions: addItem, removeItem, updateQuantity, clearCart, setOrderType
Computed: getItemCount(), getSubtotal()
```
Persisted to `localStorage` key `mbc-cart`.

**`auth.store.ts`**  
Client-side mirror of `session.user`. Do **not** use as source of truth for protected pages — the server session / middleware handles that.

---

## Authentication (Auth.js v5)

| File | Purpose |
|------|---------|
| `src/auth.config.ts` | Edge-safe, no Prisma import — used by proxy |
| `src/auth.ts` | Full config: Prisma adapter, Credentials provider, JWT callbacks |
| `src/proxy.ts` | Next.js 16 Edge proxy (replaced `middleware.ts`) — imports `authConfig` |

- Strategy: **JWT** (no DB session table hit on every request)
- Providers: Credentials (email + bcrypt password)
- `session.user.role` typed via `src/types/next-auth.d.ts`
- Route protection in `src/proxy.ts` — Edge-safe, reads JWT without DB calls
- `src/auth.ts` is Node.js-only (imports Prisma) — never imported in the proxy

---

## Performance Rules

1. All product/category pages use ISR — no SSR on hot paths
2. `optimizePackageImports: ["lucide-react", "motion"]` in `next.config.ts`
3. `next/image` for all product images (WebP, lazy by default)
4. `next/font` for fonts (zero CLS, self-hosted)
5. Only `"use client"` what must be interactive — keep as much as possible as Server Components
6. Zustand stores are **never** imported in Server Components
