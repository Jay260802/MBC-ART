# MBC ART — Backend Architecture

## Stack

| Concern | Technology |
|---------|-----------|
| Runtime | Node.js (via Next.js API Routes — Edge-compatible where noted) |
| Language | TypeScript 5 |
| API style | REST — versioned at `/api/v1/` |
| ORM | Prisma v7.7 |
| Database | SQLite (local `prisma/dev.db`) — swap to Postgres via single env var |
| Auth | Auth.js v5 (next-auth@beta) · JWT strategy · PrismaAdapter |
| Validation | Zod v4 (schemas in `src/server/validators/`) |
| Password hashing | bcryptjs (cost 12) |
| File storage | Local filesystem `public/uploads/` — served at `/uploads/*` |
| Payment | Mock Razorpay (UUID ref) — real integration is a drop-in |

---

## Directory Layout

```
src/
├── auth.ts                      # Auth.js v5 config (Credentials, JWT callbacks, role)
├── middleware.ts                # Edge middleware — route-level auth gates
│
├── server/
│   ├── services/                # Business logic layer (thin routes delegate here)
│   │   ├── product.service.ts   # CRUD, slug generation, JSON deserialization
│   │   ├── order.service.ts     # Order creation, MOQ validation, GST calculation
│   │   └── auth.service.ts      # User management, B2B promotion/rejection
│   │
│   └── validators/              # Zod schemas — shared by API handlers and services
│       ├── product.validator.ts # ProductCreateSchema, ProductUpdateSchema
│       ├── order.validator.ts   # OrderCreateSchema (validates items, quantities)
│       └── auth.validator.ts    # RegisterSchema, B2BApplicationSchema, GSTIN regex
│
├── lib/
│   ├── prisma.ts                # Global PrismaClient singleton
│   ├── gst-calc.ts              # Pure GST math functions
│   ├── constants.ts             # CATEGORIES, USER_ROLES, MOQ_BY_CATEGORY, etc.
│   └── utils.ts                 # Shadcn `cn()` helper
│
├── generated/
│   └── prisma/                  # Auto-generated Prisma client (gitignored)
│       └── client.ts            # Import via: import { PrismaClient } from "@/generated/prisma"
│
└── app/api/v1/                  # API route handlers (thin — delegate to services)
    ├── auth/[...nextauth]/      # Auth.js v5 catch-all (GET + POST)
    ├── products/route.ts        # GET /api/v1/products · POST /api/v1/products
    ├── orders/route.ts          # POST /api/v1/orders (auth-gated by middleware)
    └── users/register/route.ts  # POST /api/v1/users/register

prisma/
├── schema.prisma                # Data model
├── seed.ts                      # Seed: admin, retail, B2B users + sample products
└── dev.db                       # SQLite database (gitignored)

prisma.config.ts                 # Prisma v7 config (datasource, dotenv)
```

---

## Data Models

### User
```
id, email (unique), name?, passwordHash?, role, businessName?, gstin?,
status, emailVerified?, image?, createdAt, updatedAt
```
Roles: `guest` | `retail` | `b2b_pending` | `b2b_approved` | `admin`

### Product
```
id, slug (unique), title, description?, category, images (JSON string),
retailPrice (GST-inclusive), wholesalePricePerPiece (GST-exclusive),
sizesInSet (JSON string), moq, gstRate, isActive, createdAt, updatedAt
```
Categories: `kurtis` | `leggings` | `two_piece_suits` | `three_piece_suits`

### Variant
```
id, productId, size, color, stockQuantity, sku (unique)
```
One variant per (product, size, color) combination.

### Order
```
id, userId, orderType (B2C|B2B), subtotal, taxAmount, total,
status, shippingAddressId?, paymentRef?, notes?, createdAt, updatedAt
```
Statuses: `pending` | `confirmed` | `shipped` | `delivered` | `cancelled` | `refunded`

### OrderItem
```
id, orderId, productId, variantId, quantity, priceAtPurchase, gstRate
```
`priceAtPurchase` and `gstRate` are **snapshots** — insulated from future price changes.

### B2BApplication
```
id, userId (unique), businessName, gstin, businessType, status,
documents (JSON string), reviewNotes?, submittedAt, reviewedAt?
```
Business types: `retailer` | `wholesaler` | `distributor`

### Auth.js models
`Account`, `Session`, `VerificationToken` — required by PrismaAdapter, do not rename fields.

### Address
```
id, userId, label, line1, line2?, city, state, pincode, isDefault, createdAt
```

---

## Prisma v7 Architecture Notes

Prisma v7 is a **breaking change** from v5/v6:

1. **`prisma.config.ts`** — CLI-only config. Imports dotenv, sets `datasource.url` for migrate/studio/generate.
2. **`schema.prisma` datasource**: has **no `url` field** — that would cause an error in v7.
3. **Generated client location**: `src/generated/prisma/` — generated TypeScript source files.
4. **Import path**: `import { PrismaClient } from "@/generated/prisma/client"` (point to `client.ts` specifically, not the directory — there is no `index.ts`).
5. **Driver adapter required at runtime**: `new PrismaClient()` without an adapter throws. For SQLite, use `@prisma/adapter-libsql` + `@libsql/client`.

```ts
// src/lib/prisma.ts — correct Prisma v7 singleton for SQLite
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const url = process.env.DATABASE_URL!;
  const adapter = new PrismaLibSql({ url });  // { url } object, not raw string
  return new PrismaClient({ adapter });
}
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

### Seed script note
The seed script (`prisma/seed.ts`) must `import "dotenv/config"` as its first line to load `DATABASE_URL` from `.env`, since Node.js doesn't read `.env` files automatically.

---

## SQLite JSON Workaround

SQLite has no native JSON column type. Fields stored as `String` in schema:

| Field | Model | Type in DB |
|-------|-------|-----------|
| `images` | Product | `String` (JSON array) |
| `sizesInSet` | Product | `String` (JSON array) |
| `documents` | B2BApplication | `String` (JSON array) |

**Rule**: always `JSON.parse()` on read, `JSON.stringify()` on write. Never access raw field directly in components — always go through the service layer which returns deserialized types.

---

## API Reference

### `GET /api/v1/products`
Query params: `category`, `page`, `limit`  
Returns: `{ data: Product[], meta: { total, page, limit } }`

### `POST /api/v1/products`
Body: `ProductCreateSchema` (Zod)  
Auth: admin only  
Returns: `{ data: Product }`

### `POST /api/v1/orders`
Body: `OrderCreateSchema`  
Auth: any authenticated user (middleware)  
Returns: `{ data: Order }` or `422 { code: "MOQ_NOT_MET", ... }` for B2B violations

### `POST /api/v1/users/register`
Body: `{ email, password, name? }`  
Returns: `{ data: { id, email, name } }`

### `POST /api/v1/auth/[...nextauth]`
Auth.js v5 catch-all — handles sign-in, sign-out, CSRF, callbacks.

---

## GST Logic (`src/lib/gst-calc.ts`)

| Scenario | Price field | Rate rule | Tax treatment |
|----------|------------|-----------|--------------|
| B2C retail | `retailPrice` | 5% if < ₹1000, 12% if ≥ ₹1000 | **GST-inclusive** (extract from price) |
| B2B wholesale | `wholesalePricePerPiece` | Per product `gstRate` | **GST-exclusive** (add at checkout) |

```ts
// B2C: extract base and tax from inclusive retail price
extractBasePrice(retailPrice, gstRate)   // base = price / (1 + rate/100)
extractGstAmount(retailPrice, gstRate)   // tax  = price - base

// B2B: add tax to exclusive wholesale price
calculateB2BOrderTotal(items)            // returns { subtotal, taxAmount, total }
```

`gstRate` is also stored **denormalized** on `OrderItem` to snapshot the rate at purchase time.

---

## Authentication & Authorization

### Auth.js v5 (`src/auth.ts`)
- **Credentials provider**: verifies email + bcrypt password against `User.passwordHash`
- **JWT callbacks**: attach `user.id` and `user.role` to the JWT token
- **Session callback**: expose `id` and `role` on `session.user`
- **PrismaAdapter**: stores Account/Session for OAuth (future-proof)

### Edge Middleware (`src/middleware.ts`)
Route protection without hitting the database on every request:

| Route | Required role |
|-------|--------------|
| `/admin/*` | `admin` |
| `/b2b-portal/*` | `b2b_approved` or `admin` |
| `/checkout/*` | any authenticated user |
| `/api/v1/orders/*` | any authenticated user |

Unauthenticated → redirect `/login`. Wrong role → redirect `/` (homepage).

---

## MOQ Enforcement (B2B)

Minimum Order Quantity is enforced server-side in `order.service.ts`:

```
kurtis:           min 6 pieces per set
leggings:         min 12 pieces per set
two_piece_suits:  min 6 pieces per set
three_piece_suits: min 4 pieces per set
```

If any item violates MOQ, the service throws `{ code: "MOQ_NOT_MET", productId, required, actual }`.  
The API handler returns HTTP 422 with this payload.

---

## File Uploads

- Upload directory: `public/uploads/` (served statically by Next.js)
- Upload API (Phase 2): `POST /api/v1/admin/upload`
- Stored as: `/uploads/<uuid>.<ext>` (using `crypto.randomUUID()`)
- Max size: `MAX_UPLOAD_SIZE_MB` env var (default 5 MB)
- Gitignored via `public/uploads/*` + `!public/uploads/.gitkeep`

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | Yes | SQLite path or Postgres URL |
| `AUTH_SECRET` | Yes | JWT signing secret (32 random bytes) |
| `NEXTAUTH_URL` | Yes | Full base URL for auth callbacks |
| `NEXT_PUBLIC_APP_URL` | Yes | Base URL for sitemap/SEO |
| `NEXT_PUBLIC_APP_NAME` | No | App display name |
| `NEXT_PUBLIC_DEFAULT_GST_RATE` | No | Fallback GST rate % |
| `UPLOAD_DIR` | No | Upload directory (default: `public/uploads`) |
| `MAX_UPLOAD_SIZE_MB` | No | Max file size in MB (default: 5) |

---

## Coding Rules

1. **Thin route handlers** — all logic lives in `src/server/services/`, handlers only parse + respond
2. **Zod validates at boundary** — validate in route handler before calling service
3. **Services never import `next/headers`** — keep them framework-agnostic
4. **No `@prisma/client` imports** — always `@/generated/prisma`
5. **JSON fields always deserialized** — raw string never returned to components
6. **`crypto.randomUUID()`** for all ID generation (not nanoid — ESM-only incompatible)
7. **bcryptjs cost 12** for password hashing
8. **Atomic DB operations** via `prisma.$transaction([...])` for multi-step writes
9. **Never trust client role claims** — always re-read from session (server) or DB
