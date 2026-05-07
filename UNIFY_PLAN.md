# UNIFY_PLAN — Plot pool-only website rewrite

**Locked decision (2026-05-07):** Plot public marketing is **pool-only**.
Founder is running solar on a separate workstream. Don't reintroduce
solar parity on get-plot.com.

---

## The locked positioning

**Audience:** the 1-10-truck pool service business owner. They call
themselves *"the pool guy."* They run a *route*. They take care of
*pools*, not "homeowners." Their tribe lives on r/sweatystartup and
r/pools, not on tech blogs.

**Anti-villain:** Angi, HomeAdvisor, Thumbtack, Modernize. The
verbatim Reddit phrase across the trade is *"Fuck Angi, fuck
HomeAdvisor."* Plot's positioning leans into that adversarial frame
— **Plot is not a lead-gen platform.**

**Wedge:** Plot is automating the manual workflow they already do —
*"newly sold homes that have pools, drive around looking for just-sold
signs, Google Earth and look for pools."* Plot describes itself in
their words.

**Locked trial mechanic (2026-05-07, post-CC return):** card-on-file at
signup, $0 hold (no charge), ~5 free postcards on first batch. Card
requirement filters fraud + signals real intent. Small free batch ≈
$3 in COGS — bounded risk. Trial converts on first paid batch
approval. **Do NOT use "first 50 free, no credit card required"** —
that imports a zero-marginal-cost software-SaaS pattern onto Plot's
real-COGS product (per `feedback_real_cogs_trial_mechanic` memo). Both
Agent BB's copy and Agent CC's UX flow defaulted to the wrong pattern;
the synthesis pass (CPO) corrects this everywhere it appears.

CTA copy lands as something like:
> *"Start free trial"* — primary
> *"Card on file, no charge until you approve your first paid batch.
> First 5 postcards on us."* — reinforcement

**Three signal-orange phrases to lift verbatim from Reddit (Agent V):**
1. *"Showing up at the right time with the right offer"* (the dream)
2. *"Catching people before they start shopping around"* (vs Angi)
3. *"Don't sleep on postcards"* (already viral inside the tribe)

**Words the site must NEVER use** (Agent V): leads, qualified leads,
premium leads, verified leads, high-intent leads, lead generation,
lead nurturing, pool service professionals, pool care providers,
homeowner (as marketing noun), EDDM, all-in-one platform, scale your
business, empower your team, run a pilot.

**Words the site MUST use** (Agent V): pool, pool guy, route,
accounts, customer, postcard, neighbor postcard, just-sold, fired
the pool guy, mailers, drive around, knock doors, tech, truck.

## The locked SaaS pattern

Per Agent X's site-audit + pattern study (Jobber / HCP / ServiceTitan
/ Skimmer / Workiz), the field-service-SaaS template:

- **H1 names the category in plain words.** Skimmer: *"All-in-one
  Pool Service Software for Routing, Scheduling & Billing."* Plot's
  H1 must follow that shape, not be a manifesto.
- **Subhead is one sentence, verb-shaped.**
- **Primary CTA is *Start free trial* + "no credit card required."**
  ("Run a pilot" is dead.)
- **Real product screenshots in the hero.** Plot's `/orders/[id]`
  review-rows surface is the most SaaS-shaped screen we have — that's
  the hero asset.
- **Customer-name social proof.** Skimmer leads with *"30,000+ pool
  pros."* Plot can't make that claim yet — use a beta-shaped
  variant ("First 50 pool guys ride free").
- **Plain verbs for sections** (Schedule · Bill · Get paid). Not
  "Detect → Filter → Trigger → Mail."
- **Page count: 5-9 sections, not 13.**

## The locked page set

| URL | One job | Inspired by |
|---|---|---|
| `/` | Introduce the product. Hero + one-screen "what it is" + 3-section overview + pricing teaser + signup CTA. Nothing else. | Skimmer homepage |
| `/pricing` | Single source of truth: $1.50/postcard subscription. Volume tiers. No "$15 minimum" anywhere. | Skimmer / HCP pricing |
| `/proof` (rename from `/examples`) | Real product screenshot of the leads-review table. One pool block, one neighborhood block. The visual-proof brand commitment lives here. | Skimmer "Why Skimmer?" |
| `/start` (rename from `/run`) | Sign-up flow. Pick county → pick volume → checkout. Nothing else. | HCP "Get started" flow |
| `/imagery-privacy` | Footer-only. Existing page is fine, just doesn't go in main nav. | n/a |

**Hide from public nav until OAuth ships:** `/settings/integrations`,
`/settings/storms`. They're post-login surfaces with disabled CTAs and
they make the site read as half-finished to a public visitor.

**Cut from `/`:** the trigger menu (move to `/pricing` as one bullet
in "what's included"), the three-axis comparison table, the HPPA
band, the workflow stage diagram, the model-stat callouts.

## Refund policy — single source of truth

Per Agent X: the homepage / `/examples` / `/imagery-privacy` /
`/settings/storms` currently disagree four ways. The user's
`project_plot_visual_proof_refund.md` memo says the per-lead refund
is the load-bearing brand commitment. Lock the homepage on:

> *"You see every postcard before we mail it. Reject anything wrong.
> You only pay for what mails."*

That's the review-before-mail model the founder already chose. Cash
refunds are NOT in this product. Strip cash-refund language from
every other page to match.

## Phase 2 — execution agents (dispatched 2026-05-07)

| Agent | Surface | Output |
|---|---|---|
| **Agent BB — Senior pool-vertical copywriter** | Every customer-facing string on `/`, `/pricing`, `/proof`, `/start`, `Header`, `Footer` | `/tmp/exec_pool_copy.md` — section-by-section copy doc, ready to drop into JSX |
| **Agent CC — UX + customer journey** | Page IA, section ordering, sign-up flow wireframe | `/tmp/exec_pool_ux.md` — page maps + flow diagrams (text/ascii) |
| **Agent DD — UI + SaaS-feel design language** | Visual cohesion spec — what does the hero look like, where do screenshots go, what's cut, what tightens | `/tmp/exec_pool_ui.md` — section-by-section visual spec |

CPO synthesizes the three outputs into final tsx edits in Phase 3.
