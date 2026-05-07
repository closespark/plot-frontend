# Plot website rewrite — done-for-you positioning

**Decision date:** 2026-05-07
**Authoritative memory:** `project_plot_done_for_you_pivot.md`

The current site sells a self-serve data product ($0.15/raw verified lead).
Plot's new positioning is a **done-for-you qualified lead engine** —
detection + outbound (postcard + D2D) + engagement + CRM hand-off, billed
per qualified lead. The site needs a rewrite to match.

## What's wrong with the current site (as of cb3f895)

Most of the current homepage explicitly contradicts the new positioning:

| Current section | Why it's now wrong |
|---|---|
| Hero: "Every pool, photographed. Every storm, mapped." | Frames Plot as a data product. New frame is delivery, not data. |
| 4-stat strip: "$0.15 per verified lead" | Wrong unit (raw lead) and wrong number (per-qualified-lead is 100-1000× higher). |
| Vertical row: "Pool live · Solar Q3" cards with $0.15/lead | Same — wrong product shape. |
| Market explorer: clickable county cards → /run | Self-serve checkout flow. New flow is sales-led for first cohort. |
| What the scan sees: image + 4 stat callouts | Stays — visual proof remains the wedge. Reframe as "what every qualified lead ships with." |
| Storm overlay section | Stays as content, but reframes as "trigger that drives time-sensitive qualified leads" not "$1/match add-on." |
| 3-step "How it works" (24 markets · $15 minimum · <24h delivery) | All three numbers are wrong. New funnel is 4-step: Detect → Outbound → Engage → Hand-off. |
| Integrations (CRM + Postcard + D2D) | Stays — but reframes from "connect your stack" to "where Plot delivers your qualified leads." |
| Full markets index (sortable table) | Stays as proof of coverage, but de-emphasizes (it's not the buy flow anymore). |
| Vs brokers attribute table | **Stays — strongest section.** Just needs the comparison adjusted. We're no longer competing with $0.10 brokers; we're competing with traditional lead-gen agencies at $50-200+. Rebuild the table accordingly. |
| Pricing table (L1/L2/L3) | Wrong unit. Rewrite around per-qualified-lead. |
| Refund stat row ($0.15 / No cap / 1 email) | Refund stays as commitment but the dollar amount changes. |

## What stays / extends / replaces

**Stays unchanged:**
- Header / Footer chrome
- Visual proof commitment (extends — now backs qualified-lead claim, not just pool-detected claim)
- Refund commitment (extends — refund per qualified lead, not per raw lead)
- Examples page (`/examples` — proof artifacts)
- Imagery/privacy page

**Extends (reframe but keep content):**
- Storm overlay section → reframe as "the trigger engine for time-sensitive qualified leads"
- Market explorer → reframe as "markets we currently service"
- Integrations → reframe as "where Plot delivers"
- Vs-brokers comparison → rebuild as vs-traditional-lead-gen-agencies + vs-brokers (two-axis)

**Fully replaces:**
- Hero copy (new headline + value prop)
- Pricing model (per-qualified-lead, not per-raw-lead)
- Stat strip numbers (parcels-indexed becomes leads-delivered-this-month or similar)
- "How it works" (3 steps → 4-stage funnel)
- /run flow (currently self-serve checkout → becomes "request a pilot" sales-led intake)

**New sections:**
- Funnel visual (the 4-stage qualification flow as a diagram)
- "Done-for-you" callout — what Plot does so you don't have to (postcards designed, mailed, dispositions captured, etc.)
- Sales-led intake form (replaces self-serve `/run`)
- ROI calculator? (cost per qualified lead × close rate × AOV → ROI)
- Case studies / pilot results (when available)

## Three-phase rewrite plan

### Phase A — Positioning brief + copy direction (1-2 hours, foreground)
Lock the new headline, value prop, 4-stage funnel language. Get user sign-off on copy direction before any frontend work. Output: a single doc `frontend/POSITIONING_BRIEF.md`.

### Phase B — Hero + pricing rewrite (2 sub-agents, parallel)
Once copy is locked:
- **Agent X** rewrites hero, vertical row, "how it works," pricing table.
- **Agent Y** rebuilds vs-brokers as a two-axis comparison (vs raw broker + vs traditional lead-gen agency), updates refund section copy.

### Phase C — /run flow + new sections (3 sub-agents, parallel)
- **Agent Z** rewrites `/run` from self-serve checkout to sales-led pilot intake (Calendly link or form → booking).
- **Agent AA** builds the funnel diagram component.
- **Agent BB** builds the ROI calculator + done-for-you callout section.

Phase C can run in parallel with Phase B once copy is locked.

### Phase D — Polish + deploy
- Header / Footer copy tweaks
- /examples page reframe ("here's what every qualified lead looks like")
- Final TS check + build
- Push to GitHub → Vercel auto-deploy

## Pre-rewrite blockers

These need answers before Phase A copy:
1. **Pricing number** — pending Agent H research (D2D economics + lead-gen benchmarks). Without this, the pricing table is a placeholder.
2. **D2D rep model** — does Plot supply canvassers, contract them per-knock, or use customer's existing reps? Agent H research informs this.
3. **First-vertical scope confirmation** — pool only at launch (CPO decision), but copy needs to NOT promise solar/roofing prematurely.
4. **Sales-led intake mechanics** — Calendly? form → manual follow-up? booking widget?

CPO will lock these as Agent H research returns.

## What does NOT block the rewrite

- Phase 3 storm orchestration (worker, refund endpoint, freeze + wildfire ingesters) — paused but content can describe it as "in flight"
- Enrichment Phase 1 (FEMA + ACS + county records) — paused but content can describe enrichment as a feature
- Solar L1 detector training — not on launch homepage
- Roofing — not on launch homepage

## Order of operations from here

1. **Now** — Agent H researches D2D economics + benchmarks (background)
2. **When research returns** — CPO writes positioning brief + locks pricing + scopes Phase A
3. **After Phase A copy is locked** — fan out Phase B + C agents in parallel
4. **After Phases B + C return** — CPO reviews + integrates + Phase D ships
5. **Parallel** — Phase 3 storm work + Enrichment Phase 1 can resume once positioning is done; same code path serves the new product

Total scope: 5-10 sub-agent invocations across 2-3 sessions. Bigger than any prior chunk. Worth it if pricing is right.
