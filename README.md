# Plot Frontend

Lightweight Next.js 15 storefront for the pool-leads product. Hits the
FastAPI backend (`api/main.py`) for orders, polls the order state, redirects
to Stripe Checkout for payment, delivers the leads CSV via signed R2 URL.

## Aesthetic

Editorial-cartographic. Hard grid, big serif (Instrument Serif), warm
off-white paper background (#fafaf9), signal orange accent (#ff5500),
mono labels in small caps (IBM Plex Mono). No purple gradients. No Inter.
No stacked shadcn cards.

The design is photo-driven — the satellite imagery IS the marketing.

## Files

```
frontend/
├── app/
│   ├── layout.tsx                   # global shell (header, footer, fonts)
│   ├── page.tsx                     # landing
│   ├── globals.css                  # Tailwind v4 + design tokens
│   ├── run/page.tsx                 # county picker + order form
│   ├── orders/[id]/page.tsx         # order status (live-polls)
│   ├── imagery-privacy/page.tsx     # imagery & privacy policy
│   └── api/
│       └── orders/
│           ├── route.ts             # POST proxy → backend (hides API key)
│           └── [id]/
│               ├── route.ts         # GET proxy
│               └── leads.csv/route.ts # CSV download proxy
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ProofTile.tsx                # satellite tile with overlay
│   ├── OrderForm.tsx                # client component, posts to /api/orders
│   └── OrderStatusLive.tsx          # client component, polls /api/orders/{id}
├── lib/
│   ├── api.ts                       # FastAPI client (server-side only)
│   └── naip.ts                      # NAIP tile URL helper
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── .env.example
```

## Local dev

```bash
cd frontend
cp .env.example .env.local      # set PLOT_API_KEY to a real value
npm install
npm run dev                     # http://localhost:3000
```

Make sure the FastAPI backend is running too:

```bash
# In the repo root, separate shell:
export API_KEYS=$(python -m api.gen_key)
export R2_ENDPOINT=...
# ... other env from api/README.md
uvicorn api.main:app --port 8000

# Set the same pl_... key in frontend/.env.local as PLOT_API_KEY
```

## Architecture

```
[Browser]
  ↓ (no API key in browser)
Next.js Server Routes (/app/api/*)
  ↓ (X-API-Key header — server-side only)
FastAPI (api/main.py)
  ↓
[SQLite orders.db, Modal v32 inference, R2 leads.csv]
```

## Pages

| Path | Purpose | State |
|---|---|---|
| `/` | Landing page (the conversion piece) | static |
| `/run` | County picker → order creation | dynamic (live counties from API) |
| `/orders/[id]` | Order status, live-polled | dynamic |
| `/imagery-privacy` | Imagery & privacy notes | static |

## What's NOT in the MVP

- Pricing page (folded into landing)
- About page (folded into landing)
- Case studies (no customers yet)
- For Operators / For Agencies splits (single audience)
- Stripe success/cancel routes (default to `/orders/[id]` after redirect)
- FAQ (no organic questions yet)
- Sample inventory page (browse without buying — not on-demand-friendly)

## Deploy (Vercel)

```bash
cd frontend
vercel --prod
# Set the same env vars from .env.example in Vercel project settings.
```

Or Fly.io / Cloudflare Pages — Next.js 15 is portable.

## Pre-render NAIP marketing tiles

Before deploy, populate the `naip-marketing/` prefix in R2 so the hero
images don't 404:

```bash
# In repo root:
python3 scripts/render_naip.py --preset marketing
# ~40s, free (NAIP is USDA public domain)
```

Then make `naip-marketing/*` publicly readable and set `NEXT_PUBLIC_NAIP_BASE`.
