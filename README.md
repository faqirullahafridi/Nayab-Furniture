# Nayab Furniture

A luxury furniture showroom website for Nayab Furniture in Peshawar — public catalog, gallery, contact inquiries, and a Clerk-protected admin dashboard.

## Features

- **Public site:** Home, About, Collections (products), Showcase (gallery), Contact form
- **Admin panel:** `/admin` — manage products, gallery images, and customer inquiries
- **Image uploads:** Admin images go to **Supabase Storage** (S3-compatible API) with public CDN URLs
- **Performance:** Lazy-loaded images, mobile load queue, WebP thumbnails, localStorage catalog cache, route prefetching
- **API:** Express REST API with OpenAPI spec and generated React Query hooks
- **Database:** PostgreSQL + Drizzle ORM with seed data

## Quick start

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL database (Supabase recommended)
- [Clerk](https://clerk.com) account for admin authentication
- Supabase Storage bucket (`uploads`, public) for admin image uploads

### Environment variables

Copy `.env.example` to `.env` and fill in values. The repo loads `.env` from the workspace root automatically.

| Variable | Service | Description |
|---|---|---|
| `DATABASE_URL` | API + DB | Postgres connection (Supabase pooler, port 6543) |
| `DIRECT_URL` | DB push | Postgres session/direct URL for Drizzle schema push |
| `SUPABASE_URL` | API uploads | Supabase project URL |
| `S3_ENDPOINT` | API uploads | Supabase S3 endpoint (`…storage.supabase.co/storage/v1/s3`) |
| `S3_REGION` | API uploads | Storage region (e.g. `ap-northeast-1`) |
| `S3_ACCESS_KEY_ID` | API uploads | Supabase S3 access key |
| `S3_SECRET_ACCESS_KEY` | API uploads | Supabase S3 secret key |
| `S3_BUCKET` | API uploads | Public bucket name (default `uploads`) |
| `S3_TLS_INSECURE` | API uploads | Dev only — set `true` if local uploads fail with TLS cert errors |
| `CLERK_PUBLISHABLE_KEY` | API | Clerk publishable key |
| `CLERK_SECRET_KEY` | API | Clerk secret key |
| `CLERK_JWT_KEY` | API | Optional — networkless Clerk JWT verification |
| `VITE_CLERK_PUBLISHABLE_KEY` | Frontend | Clerk publishable key (required at build time) |
| `VITE_CLERK_PROXY_URL` | Frontend | Clerk proxy path — `/api/__clerk` for production/Vercel |
| `PORT` | API | API server port (default `8080`) |
| `WEB_PORT` | Frontend dev | Vite dev server port (default `19064`) |
| `BASE_PATH` | Frontend | Base path for deployment (default `/`) |

### Supabase setup

1. Create a Supabase project and copy connection strings from **Project Settings → Database**
2. URL-encode special characters in your database password
3. Set `DATABASE_URL` (transaction pooler, port 6543) and `DIRECT_URL` (session pooler, port 5432)
4. Create a public Storage bucket named `uploads` and add S3 credentials from **Project Settings → Storage → S3**
5. Push schema and seed:

```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/db run seed
```

### Setup

```bash
pnpm install
pnpm --filter @workspace/db run push    # create tables
pnpm --filter @workspace/db run seed    # seed sample products & gallery
```

### Development

Run both services (in separate terminals):

```bash
# API server (port 8080)
pnpm --filter @workspace/api-server run dev

# Frontend (port 19064, proxies /api and /uploads to API)
pnpm --filter @workspace/nayab-furniture run dev
```

Open http://localhost:19064 — sign in at `/sign-in` to access `/admin`.

On startup the API logs `imageStorage: "supabase-s3"` when S3 env vars are loaded correctly. New uploads should return full `https://…supabase.co/storage/…` URLs.

### Build

```bash
pnpm run build
pnpm run typecheck
```

The frontend build compresses images in `public/generated/` and regenerates favicons automatically.

## Deploy to Vercel

The repo includes a root `vercel.json` that builds the SPA and deploys the Express API as a serverless function (`api/index.ts`).

1. Import the repo in Vercel with **root directory = repo root** (not `artifacts/`)
2. Framework preset: **Other** (`vercel.json` controls install/build)
3. Add all required env vars from `.env.example` in **Vercel → Settings → Environment Variables** (Production)
4. Set build-time vars: `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_CLERK_PROXY_URL=/api/__clerk`, `BASE_PATH=/`
5. In Clerk Dashboard, add your Vercel URL to **Allowed origins**
6. Deploy and verify:
   - `GET /api/healthz` → `{"status":"ok"}`
   - Site loads, admin sign-in works, uploads return Supabase URLs

Do **not** set `S3_TLS_INSECURE` on Vercel. Do **not** commit `.env`.

## Project structure

```
api/                 # Vercel serverless entry (imports Express app)
artifacts/
  nayab-furniture/   # React + Vite frontend
  api-server/        # Express API
lib/
  db/                # Drizzle schemas + seed
  api-spec/          # OpenAPI spec
  api-client-react/  # Generated React Query hooks
  api-zod/           # Generated Zod schemas
attached_assets/     # Brand logo and static assets
vercel.json          # Vercel build + rewrite config
```

## Admin

1. Create a Clerk application and add your keys to `.env`
2. Sign up / sign in at `/sign-in`
3. Open `/admin` to manage catalog, gallery, and inquiries
4. Upload product/gallery images — they are stored in Supabase and served via public URLs

## API

- Health: `GET /api/healthz`
- Products: `GET/POST/PATCH/DELETE /api/products`
- Gallery: `GET/POST/DELETE /api/gallery`
- Uploads: `POST /api/uploads` (auth required) → Supabase public URL
- Inquiries: `POST /api/inquiries` (public), admin routes require auth
- Admin summary: `GET /api/admin/summary` (auth required)

Regenerate API client after OpenAPI changes:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Notes

- `.pnpm-store/` in the project root is pnpm’s local package cache — safe to delete; run `pnpm install` to restore
- Legacy `/uploads/…` paths are still served for older images; new uploads use Supabase Storage
