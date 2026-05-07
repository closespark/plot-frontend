# Plot — Blue Ocean Positioning Brief

**Date:** 2026-05-07
**Synthesizes:** Agent J (demand-side research) + Agent K (competitor deep-dive) + Agent L (campaign-orchestration mapping)
**Authoritative for:** website rewrite, sales conversations, future product scoping

---

## 1. The category Plot is creating

Plot is **not** a lead-gen vendor in the existing category sense (Angi, HomeAdvisor, Modernize, HailTrace, Networx).

Plot is **the first vertical-specific direct-response platform built on visual property intelligence** — every lead, postcard, email, and ad ships with a property-specific aerial image and a per-row image-backed refund.

There is no incumbent in this category. The closest adjacent players exist in two parallel categories that don't talk to each other:
- **Lead-gen vendors** (Angi/HomeAdvisor/Modernize/Networx/HailTrace) — sell leads, sometimes verified, never image-attached, never per-row refundable
- **Visual-property AI vendors** (Cape Analytics / Betterview / Loveland) — have the imagery + AI tech, but sell exclusively to insurance carriers, never to home-services SMBs

Plot is the first player to put both halves together for service contractors.

## 2. Plot in one sentence

> *Plot is the first lead-gen platform that ships a verified satellite image of the actual property on every lead, refunds unconditionally if the image doesn't back the claim, and never shares a lead with another contractor.*

That sentence is the entire wedge. Three structural firsts:

1. **Image-attached** — none of the lead-gen vendors do this; the AI vendors that could, sell to insurance instead
2. **Unconditional refund** — every competitor's refund is capped, time-windowed, or "all sales final"
3. **1:1 exclusive** — Angi/HomeAdvisor send each lead to 3-8 contractors; Plot's whole business model is the opposite

Each commitment is a brand promise a competitor structurally *can't* match.

## 3. The Four-Actions Framework (Blue Ocean)

| Action | What | Why |
|---|---|---|
| **Eliminate** | Annual contracts | Buyers describe these as the #1 stickiness friction; HailTrace + Networx + agency contracts all violate |
| **Eliminate** | Shared leads (3-8 contractors per lead) | Universal villain in J's research; Vermont AG settled with Angi for $2M (2025) over deceptive lead-quality marketing |
| **Eliminate** | Bureaucratic refund processes | Networx + HomeAdvisor refund only on technicalities; Plot does the opposite by structural commitment |
| **Eliminate** | Phone/email cold outreach | TCPA risk + post-Momentum $30M settlement makes solar phone-append a liability bomb |
| **Reduce** | Vertical sprawl | Plot picks pool first; competitors try to serve all home services and dilute lead quality |
| **Reduce** | CRM complexity | Plot integrates with Jobber/HCP/HubSpot; doesn't try to be a CRM itself |
| **Reduce** | Per-lead cost vs traditional lead-gen agencies | $125 (planned) vs Modernize $150-200 / HailTrace effective $250+ |
| **Raise** | Per-lead trust density | Image + parcel ID + lat/lon + verified detection on every row |
| **Raise** | Refund unconditionality | No caps, no time window, no escalation, single email |
| **Raise** | Address precision | Parcel-level lat/lon vs ZIP+4 (industry standard) |
| **Create** | Per-recipient property-image personalization on direct mail | NONE of HighLevel / CallRail / ActiveCampaign / Mailchimp / Hubspot / Klaviyo / Jobber / HCP do this |
| **Create** | Outcome-tied refund (image doesn't back claim → refund) | Industry-first; structurally absent from category |
| **Create** | Done-for-you postal orchestration with vision-grounded creative | Closest analog is direct-mail-only services; Plot adds vision + refund |
| **Create** | Storm-trigger campaign automation tied to household-level addresses | HailTrace has triggers but no per-property creative; Plot has both |

## 4. Why this is genuinely uncontested space

- **Lead-gen vendors don't have parcel imagery.** Cape Analytics + Betterview + Loveland have it but sell only to insurance.
- **Marketing-automation tools don't have parcel imagery either.** HighLevel, ActiveCampaign, Mailchimp, etc. would need a deep ML + GIS investment to compete on creative ground truth.
- **The two categories don't talk.** Plot is the first to put them together.
- **The 2023 FTC $7.2M settlement against HomeAdvisor** + the 2025 Vermont AG settlement against Angi establish that the legacy lead-gen category's whole model has lost regulatory cover. Plot's transparency posture (image-backed claim, refund-tied-to-evidence) is on the right side of the regulatory arc.

## 5. Imagery operating model (clarified — two surfaces, two requirements)

The brand commitment ("photo on every row") lives in the **lead deliverable**, not the postcard. Two distinct imagery surfaces with different requirements:

| Surface | Source | Audience | Role |
|---|---|---|---|
| **Lead row** (CSV / web app) | Mapbox z=20 satellite tile, per-property | SMB owner reviewing leads | **Brand commitment.** SMB sees the pool, can refund any row where the image doesn't back the claim. Covered by existing Mapbox digital-display ToS — no contract changes needed. |
| **Postcard creative** | Stock pool imagery + address personalization | Homeowner | **Outbound channel.** Standard direct-mail templating; Stannp does this natively. No per-property aerial required. |

**Why this works:**
- The visual-proof refund is tied to the image *the SMB sees* when reviewing their list. They can flag any row where the photo doesn't match.
- The postcard is just an outbound channel; the prospect already sees the address printed; per-property imagery on the physical card is a nice-to-have, not a brand commitment.
- Avoids the imagery-vendor blocker that briefly looked load-bearing — Mapbox digital ToS is enough.

**Postcard creative direction:**
- Generic pool / Plot-branded design with address personalization (mail-merge fields for street, city, zip)
- Stannp handles the personalization natively
- Optional: include a "we have the satellite image of your pool — see [URL]" line that drives prospects to a personalized landing page where the Mapbox tile shows up under digital ToS

**Marketing language:** "Photo on every row" / "Verified satellite image with every lead." Don't extend to "photo on every postcard" — that wasn't in the spec and adds operational complexity for no brand-commitment benefit.

**Cost moat (corrected):** Mapbox digital is bundled in the existing contract; postcard creative uses stock or generic art. Per-record imagery cost ≈ 0 beyond what Plot already pays. The five-deep moat (visual ML / refund-per-row / 1:1 exclusive / multi-channel orchestration / vertical specificity) is intact and cleaner without the imagery-cost asterisk.

**No paid imagery upgrade on the roadmap.** The lead-row Mapbox tile is the brand-commitment surface and is covered by existing digital ToS. Postcards stay on stock/generic creative indefinitely. Any future imagery vendor change reopens the unit-econ math — explicitly out of scope.

## 6. GTM sequence (per Agent J's white-space ranking, gated by what Plot can ship)

| Vertical | Competitive density | Plot ship status | Sequence |
|---|---|---|---|
| **Pool service** | Lowest in J's research | L1 live (23 counties, 2.04M parcels) | **Launch vertical (Q3 2026)** |
| **Solar maintenance** | "Near-zero" — entire category serves new-installs only | L1 detector training (Q3) | **Fast follow when L1 ships** |
| **Roofing** | Highest (HailTrace + Hook Agency + Blackstorm + Webmasters) | Blocked on z=20 | Defer — it's the saturated vertical |

Agent J's instinct was inverse-to-ticket-size (solar > pool > roofing) — but ship gates trump white-space rank. Pool first because the product exists.

## 7. SMB tier positioning — one product, three reads

Per Agent L's segmentation:

| Tier | Today's stack | Plot's role | Conversion story on the homepage |
|---|---|---|---|
| **1-3 trucks (no agency, no marketing tool)** | Word-of-mouth + door-hangers | **Replaces** — Plot is their first marketing tool | "We do your marketing. Verified leads, postcard mail-out, into your CRM." |
| **4-7 trucks (Jobber Marketing $79/mo or HCP postcards $0.86/each)** | FSM-native marketing | **Feeds** — Plot pushes parcel-level lists with image personalization into FSM | "Better lists for your existing FSM. Image on every row." |
| **8-10 trucks (HighLevel via agency $97-497/mo)** | Agency-mediated automation | **Sits alongside** — sell to the agency, push audience lists into the sub-account | "Power your agency's HighLevel campaigns with verified property data." |

The same homepage can serve all three reads — copy that says "verified property leads with image on every row, ships into Jobber / Housecall Pro / HighLevel." Each tier reads it differently.

## 8. The competitor Plot is actually competing with

Per Agent J: not Angi, not Modernize, not HailTrace.

Plot's real competition:
1. **Google Local Services Ads** — $168 cost-per-booked-job, 31% close rate, the only third-party channel SMBs defend. Plot's wedge is image-attached + exclusive (LSA gives neither).
2. **The contractor's own door-hanger budget** — pool door-hangers validated at $0.08-0.25/household, 1-3% response, $60-120 CPA. Plot's wedge is verified-only addresses (door-hanger today goes to every house regardless of pool ownership) + automation (Plot does the printing + mailing) + tracking.

Frame the homepage against THESE competitors, not against Angi/HomeAdvisor.

## 9. Pricing — locked

**Plot does not have door knockers and is not building/contracting them.** "Qualified pool lead at $125" required a phone-screen or door-knock step Plot can't honestly deliver. The actually-deliverable unit is **postcards mailed + responses captured + CRM hand-off**.

| Unit | Price | What it covers |
|---|---|---|
| **Postcard delivered** | **$1.50/piece** | Verified pool address generation + enrichment filtering + design + print + mail (Stannp) + response capture (tracking number / QR / reply mailer) + CRM hand-off (Jobber / HCP / HubSpot) |
| **Storm-trigger overlay (separate subscription)** | $1/match/event, monthly cap TBD | Phase 2 storm work shipped — opt-in alerts for hail / hurricane / freeze / wildfire crossings against the customer's existing list |

Refund: any postcard where the photo on the corresponding lead row doesn't show a pool gets credited. The visual-proof refund commitment lives on the lead deliverable (the dashboard row the SMB reviews) — refund maps cleanly back to the postcard piece.

**The economic story that justifies $1.50 vs commodity direct mail at $0.50-1.00:** enrichment-filtered verified pool addresses convert 5-10× better than blast direct mail to every house in a ZIP. See Section 5.5.

## 5.5. Enrichment as the lead-quality engine (free, baked into $1.50)

Per the locked decision in `project_plot_free_enrichment_layer.md`, government data enrichment is free — bundled into the $1.50/piece price, not a paid SKU. Enrichment does three jobs:

| Job | Mechanism | Customer sees |
|---|---|---|
| **Quality filter on the mail list** | FEMA flood zone / ACS income tier / code violations / tax delinquency / storm history → exclude or include parcels before mailing | Dashboard shows only the filtered set; bad-fit addresses are pre-removed |
| **Context on the dashboard lead row** | Enriched fields rendered next to each verified pool address | Sort/prioritize leads beyond just "has a pool" — by income tier, by recent code violations, by storm history |
| **Targeting input for postcard copy** | Different Stannp template variants per filter slice (e.g. "service-needed" copy for code-violation-flagged, "premium-tier" copy for high-ACS-income) | Customer optionally configures variant rules; Plot defaults to a single generic template |

### The economic story enrichment enables

| Vendor | Price/piece | What gets mailed | Expected response rate | Cost per response |
|---|---|---|---|---|
| Vistaprint / commodity direct mail | $0.50-1.00 | Every house in a ZIP, no filtering | ~0.5% | ~$100-200 |
| Plot | **$1.50** | Verified pool · income-filtered · no flood-zone-X · no tax delinquency · no open code violations | ~5% (10× lift, warm + filtered) | **~$30** |

Plot is **3× the per-piece price but ~3-7× cheaper per response** because enrichment makes the audience structurally better. That's the math the homepage should show.

### Sources baked in (free, public)

- FEMA NFHL (flood zone + base flood elevation)
- FEMA Disaster Declarations (last 24 months)
- Census ACS tract demographics (income, owner-occupied %, median home value)
- County tax delinquency (per-county scaffolding; TX-Harris and FL-Hillsborough first)
- County code-enforcement violations (per-county; same scaffolding)
- NOAA storm history (sales-pitch tool: "X hail events in your zip in the last decade")

All of these are free. Plot pays no per-record imagery or data cost beyond what's already in the existing Mapbox + AWS bills.

## 10. Website rewrite implications

Translates `frontend/REWRITE_PLAN.md` into specific copy direction:

**Hero (replace current):**
- Headline: "**Verified pool leads. Photo of every property. Refunded if wrong.**" — three structural firsts, one breath
- Italic accent on "every property" (current orange treatment)
- Sub: "First lead-gen platform built on visual property intelligence. 1:1 exclusive. Postcard + your CRM, automated. $125/qualified lead — or refunded."
- Stat strip: parcels indexed (live), counties (live), precision %, refund commitment ("$0 caps")

**4-stage funnel section (replaces current 3-step):**
1. **Detect** — visual ML on every parcel in your market
2. **Personalize** — postcard with the prospect's actual roof image
3. **Qualify** — track responses, capture interest signal
4. **Hand off** — push qualified leads into your CRM (Jobber / Housecall Pro / HighLevel)

**Vs-brokers comparison (rebuild):**
3-axis: broker (Angi-style shared-lead) vs traditional lead-gen agency (Modernize-style) vs Plot. Pull the FTC settlement reference into the broker column. Lean on the "shared 3-8 ways" data point — it's the strongest single number in the research.

**New section — "Built for [tier]":**
Three cards showing how Plot fits at the 1-3, 4-7, 8-10-truck tiers. Same product, three different conversion stories.

**New section — "Imagery provenance":**
Brief callout naming USDA NAIP. Pre-empts "where do you get the photo?" question. Establishes legal-by-construction posture.

**Refund section (lightly update):**
Stays as 3-stat ($125 / No cap / 1 email) but tighten the headline copy to lean on "the only refund tied to the actual image of your property."

**Drop:**
- The current "Pool storm overlay shipping this month" line in hero — storm overlay becomes a feature, not a headline
- The "$0.15 per verified lead" stat — wrong number, wrong unit
- The "Browse markets" CTA emphasis — replaces with "Request a pilot" (sales-led for first 10 customers)

## 11. What this brief explicitly does NOT do

- It does not propose new pricing tiers (per `feedback_smb_simple_pricing` — flat per-unit)
- It does not promise solar maintenance or roofing on the launch homepage (only pool until L1 ships for those verticals)
- It does not commit to specific SLAs on lead-delivery time (TBD)
- It does not define exactly what makes a lead "qualified" — that's a separate Phase 2 spec (postcard return? D2D positive disposition? Both?)
- It does not commit Plot to phone/email cold outreach (postal-only ICP stays)

## 12. Sequencing from here

1. **Now** — this brief is locked
2. **Next** — fan out frontend rewrite agents (Phase B + C from `frontend/REWRITE_PLAN.md`)
3. **Parallel** — write the qualified-lead-definition spec (which becomes the Phase 3 storm-orchestration + qualification logic)
4. **Parallel** — implement NAIP ingester for postcard renders (1 sub-agent, small scope)
5. **After website live** — Phase 3 storm orchestration + enrichment Phase 1 sub-agents resume

## Sources

- `/tmp/research_smb_buying.md` (Agent J, demand-side)
- `/tmp/research_competitors.md` (Agent K, competitor deep-dive)
- `/tmp/research_campaign_tools.md` (Agent L, orchestration mapping)
- `/tmp/research_d2d_economics.md` (Agent H, D2D + pricing benchmarks)
- `~/.claude/projects/-Users-christabb/memory/project_plot_done_for_you_pivot.md` (locked decisions)
- `~/.claude/projects/-Users-christabb/memory/project_plot_visual_proof_refund.md` (load-bearing wedge)
