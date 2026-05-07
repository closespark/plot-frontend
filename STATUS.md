# Plot Frontend — Status (2026-05-07)

## What's deployed

| Layer | URL | Host |
|---|---|---|
| **Frontend** | https://get-plot.com (+ www) | Vercel |
| Backend API | https://api.get-plot.com | Fly.io (`get-plot-api`) |
| CDN (NAIP marketing tiles) | https://cdn.get-plot.com | Cloudflare R2 |
| Email | hello@get-plot.com | Cloudflare Email Routing → Gmail |

Default Vercel URL: https://plot-psi.vercel.app (also live, same build).

## Repo + deploy mechanism

- Working dir: `~/aerial-lead-scout/frontend/`
- GitHub: `closespark/plot-frontend` (private)
- Vercel project: `christabb83s-projects/plot` (id `prj_3t15UVW2rTA1a1xmf548vl0MRrvN`)
- **Deploy**: any `git push` to `main` auto-deploys via Vercel. No CLI needed.
- Don't use `vercel` CLI in Claude Code — there's a stale-token issue with the `vercel@claude-plugins-official` plugin. Push-to-deploy works cleanly.

## Stack

- Next.js 16 App Router
- React 19
- Tailwind CSS v4 (beta) via `@tailwindcss/postcss`
- TypeScript 5.7
- Fonts: Instrument Serif (display) + IBM Plex (body/mono)
- Aesthetic: editorial-cartographic, off-white background, hairline borders, restrained typography

## File layout

```
app/
  layout.tsx              # root layout, font setup, header/footer
  page.tsx                # marketing home
  run/page.tsx            # run-an-order flow (county picker, form)
  imagery-privacy/page.tsx
components/
  Header.tsx
  Footer.tsx
  OrderForm.tsx           # county select + email + min_score, posts to /v1/orders
  OrderStatusLive.tsx     # polls /v1/orders/{id} for status
  ProofTile.tsx           # NAIP image tile component
lib/
  api.ts                  # backend client; reads PLOT_API_BASE + PLOT_API_KEY (server-side)
  naip.ts                 # builds CDN URLs from NEXT_PUBLIC_NAIP_BASE
```

## Env vars (set in Vercel dashboard, Production scope)

| Name | Value | Notes |
|---|---|---|
| `PLOT_API_BASE` | `https://api.get-plot.com` | server-side only (lib/api.ts) |
| `PLOT_API_KEY` | `pl_O4L6UODaT6T28aTd2JM3Lljq71Fdp_-EftKXUYCSSOQ` | server-side only |
| `NEXT_PUBLIC_NAIP_BASE` | `https://cdn.get-plot.com` | client-bundled (NEXT_PUBLIC_ prefix) |

Local dev: copy `.env.example` → `.env.local`, point `PLOT_API_BASE` at `http://localhost:8000` if running the API locally, otherwise leave it pointed at production.

## Backend contract (api.get-plot.com)

Auth: `X-API-Key: pl_...` header on all `/v1/*` requests (`/healthz` and Stripe webhook are exempt).

```
GET  /v1/counties                  → { counties: [{key, state, county, fips}] }
POST /v1/orders                    → create order (body: {customer_email, county, min_score})
GET  /v1/orders/{id}               → status snapshot (state machine: queued → running → done)
GET  /v1/orders/{id}/leads.csv     → 302 redirect to signed R2 URL
POST /v1/orders/{id}/refund        → record refund request
POST /v1/stripe/webhook            → Stripe-signature gated, marks paid + enqueues
```

24 counties currently supported (pool model coverage). Worker thread polls SQLite for queued orders and runs the v32 pool detector.

## NAIP marketing tiles

Pre-rendered in R2 at `naip-marketing/<label>__<lat>_<lon>_<fov>_<size>.jpg`.
Frontend builds URLs from `NEXT_PUBLIC_NAIP_BASE` (= cdn.get-plot.com).
Render new tiles via `python3 ~/aerial-lead-scout/scripts/render_naip.py --preset marketing` (separate utility, not part of the runtime API).

Live tiles include 10 county-anchor heroes (phoenix, atlanta, riverside, santa-ana, los-angeles, salt-lake, albuquerque, charlotte, charleston, tampa) + 2 sample residential pools (scottsdale, glendale).

## Pricing / brand commitments (preserve)

- $0.15/verified pool lead, flat (matches/undercuts broker floor of $0.02–0.20)
- $15 minimum order
- **Image on every row** + **per-lead refund** for any miss — load-bearing wedge vs broker pricing. Don't escalate, cap, or add tiers.
- Postal-only ICP (no phone/email append in v1) — pool/solar SMBs work direct-mail, not cold-call
- Optional postcard add-on planned (provider TBD: Stannp / Click2Mail / PostGrid)

## What works end-to-end (verified 2026-05-07)

- Live site loads at https://get-plot.com with valid TLS
- `<title>` renders correctly
- DNS, CDN, email, API, frontend all serving 200s on independent checks

## Suggested next steps for frontend work

- Click through the live site and confirm NAIP imagery actually renders (not just `<img>` tags but real R2 fetches)
- Confirm the run-order flow actually posts to /v1/orders and polls status
- Polish/iterate on visual design (current state is editorial-cartographic, but largely untouched since first build)
- Wire Stripe checkout (env var `STRIPE_SECRET_KEY` not set on Fly yet — backend currently auto-enqueues in dev mode without payment)
- Add proper error states for failed orders / stuck workers
- Add "examples" gallery using the scottsdale/glendale sample tiles + actual detection overlays

## Don't reload

Top-level `~/aerial-lead-scout/STATUS.md` is the model-training log (very long, frontend-irrelevant). Don't load it for frontend work.
