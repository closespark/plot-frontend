import Link from "next/link";
import { MarketCard, type MarketCardData } from "@/components/MarketCard";
import { ROICalculator } from "@/components/ROICalculator";
import { listCounties } from "@/lib/api";

// Server-fetched at request time so the markets list mirrors what /v1/counties
// actually serves (24 today, growing). No Vercel cache window — counties drift
// only on backend deploys, but stale data here would mis-sell coverage.
export const dynamic = "force-dynamic";

export default async function Page() {
  // Fetch live markets server-side. If the backend is unreachable, render an
  // empty list rather than 500 the page — user can still order via /run.
  let markets: MarketCardData[] = [];
  try {
    const r = await listCounties();
    markets = r.counties
      // Hide archived/internal adapters from public marketing surface.
      .filter((c) => !/_archived$|_legacy$|^_/.test(c.key))
      .map((c) => ({
        key: c.key, state: c.state, county: c.county,
        parcels: c.row_count ?? 0,
      }));
  } catch {
    markets = [];
  }

  // Aggregate stats — the hero's main job. Numbers come from the live
  // /v1/counties response so they reflect today's coverage.
  const totalParcels = markets.reduce((sum, m) => sum + m.parcels, 0);
  const liveCounties = markets.length;
  const statesCovered = new Set(markets.map((m) => m.state)).size;

  // Top-12 for the explorer grid: parcel-count desc.
  const featured = [...markets]
    .sort((a, b) => (b.parcels || 0) - (a.parcels || 0))
    .slice(0, 12);

  return (
    <>
      {/* 1. HERO — through-line headline, three pillars in one breath ---- */}
      {/* The italic-orange accent lands on "See the photos" — the load-bearing
          visual-proof wedge no competitor matches. Pillar 1 (set the rules)
          and pillar 3 (we mail when work shows up) read as the bookends. */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-16 pb-20">
          <p className="legend mb-8">
            Verified pool and panel homeowners · auto-triggered postcards · review before mail
          </p>
          <h1 className="mb-10 max-w-5xl">
            Set the rules.<br />
            <span className="italic text-[var(--color-signal)]">See the photos.</span><br />
            We mail when the work shows up.
          </h1>

          {/* Live coverage + price unit, four cells. */}
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-hairline)] border rule">
            <BigStat
              value={totalParcels > 0 ? compact(totalParcels) : "—"}
              label="parcels indexed"
              tone="signal"
            />
            <BigStat
              value={liveCounties.toString()}
              label={`counties live · ${statesCovered} states`}
            />
            <BigStat value="96.5%" label="precision vs assessor" />
            <BigStat value="$1.50" label="per postcard delivered · all-in" />
          </dl>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link href="/run" className="btn-ink">Run a pilot →</Link>
            <Link href="#explorer" className="btn-ghost">Browse markets ↓</Link>
            <Link href="#photos" className="btn-ghost">See the photos ↓</Link>
          </div>
        </div>
      </section>

      {/* 2. PHOTO ROW — visual proof elevated to hero prominence -------- */}
      {/* This is THE wedge. Pull it before everything else so the
          commitment lands while attention is still high. The lead-row
          mockup is visually dominant — the satellite tile column gets the
          accent treatment, not buried as a footnote. */}
      <section id="photos" className="border-b rule bg-[var(--color-paper)]/40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ The visual-proof commitment</p>
          <h2 className="mb-8 max-w-4xl">
            A photo for every door,<br />
            <span className="italic text-[var(--color-signal)]">before a stamp goes on</span>.
          </h2>
          <p className="text-lg leading-relaxed text-[var(--color-muted)] max-w-3xl mb-12">
            <span className="em-dash" />Every row in your dashboard ships with the satellite tile of
            the actual parcel. You see what you're paying to mail to. Reject
            anything wrong; we mail only what you approve. No competitor in
            pool or solar lead-gen attaches a verified image to the row — that's
            the entire wedge.
          </p>

          <LeadRowMockup />

          <p className="legend mt-6 text-[var(--color-muted)] max-w-3xl">
            Every row carries lat/lon, parcel ID, confidence score, government
            enrichment fields, and the satellite tile. CompanyCam-shaped:
            the photo IS the record.
          </p>
        </div>
      </section>

      {/* 3. VERTICAL ROW — pool + solar parity, both validated --------- */}
      {/* Equal-weight cards. Same engine, different validated trigger
          menus per vertical. Drops the prior "pool live · solar Q3" muted
          treatment — both verticals are real product. */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <p className="legend mb-6">/ Two verticals · one engine</p>
          <h2 className="mb-12 max-w-3xl">
            Pool and solar.<br />
            <span className="italic text-[var(--color-signal)]">Same rails.</span>{" "}
            Different triggers.
          </h2>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-hairline)] border rule">
            <VerticalCardEx
              tag="● Pool"
              status="Live"
              title="Verified pool homeowners, mailed when the work shows up"
              icp="Pool service · cleaning · repair · screen-enclosure restoration"
              triggers={[
                "Freeze events (TX-Uri pattern · 500% repair-estimate spike)",
                "Hurricane wind on screen enclosures (FL/GA · $20–50K AOV)",
                "Pool permit pulled (renovation signal · no free national feed)",
                "Just-sold homeowner with a verified pool",
                "Spring opening + pump age 8–10 yrs (calendar-driven)",
              ]}
              cta={{ label: "Run a pool pilot →", href: "/run" }}
              live
            />
            <VerticalCardEx
              tag="● Solar"
              status="Live"
              title="Verified solar homeowners, mailed when the work shows up"
              icp="Panel cleaning · maintenance · battery retrofit · post-storm O&M"
              triggers={[
                "Solar permit pulled (battery / expansion signal)",
                "NEM 3.0 deadline pressure (CA · April 2026 cohort)",
                "NEM interconnection age (CA + NY · LBNL national baseline)",
                "Panels installed 7+ years ago (LBNL Tracking the Sun)",
                "Post-PTO 90-day O&M attach window",
              ]}
              cta={{ label: "Run a solar pilot →", href: "/run" }}
              live
            />
          </div>
        </div>
      </section>

      {/* 4. MARKET EXPLORER — top 12 county cards ---------------------- */}
      <section id="explorer" className="border-b rule bg-[var(--color-paper)]/40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <div className="grid lg:grid-cols-12 gap-12 mb-12">
            <div className="lg:col-span-7">
              <p className="legend mb-6">/ Market explorer</p>
              <h2 className="mb-4">
                Counties we mail into,<br />
                <span className="italic text-[var(--color-signal)]">ranked by scale</span>.
              </h2>
              <p className="text-lg leading-relaxed max-w-2xl text-[var(--color-muted)]">
                <span className="em-dash" />Each card is a county we scan and mail into. Pilots run on
                request — verified list, designed creative, postcards in
                the mail, responses routed to your CRM.
              </p>
            </div>
          </div>

          {featured.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[var(--color-hairline)] border rule">
              {featured.map((m) => (
                <MarketCard key={m.key} market={m} />
              ))}
            </div>
          ) : (
            <p className="border rule p-8 font-mono text-sm text-[var(--color-muted)]">
              Markets list temporarily unavailable. Visit{" "}
              <Link href="/run" className="text-[var(--color-ink)] underline underline-offset-4">/run</Link>{" "}
              to see all live counties.
            </p>
          )}

          <p className="legend mt-6">
            Don't see your market?{" "}
            <Link href="mailto:hello@get-plot.com" className="text-[var(--color-ink)] underline underline-offset-4">
              We'll prioritize it →
            </Link>
          </p>
        </div>
      </section>

      {/* 5. TRIGGER MENU — source of truth for what fires campaigns --- */}
      {/* This is where pillar 1 ("set the rules") lives. Two columns,
          per-vertical validated trigger lists. Each row: name, source,
          sample event, response window. Replaces the old storm-overlay
          section, which framed weather as the only trigger axis. */}
      <section id="triggers" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ Triggers</p>
          <h2 className="mb-6 max-w-4xl">
            Set the rule.<br />
            <span className="italic text-[var(--color-signal)]">We watch the signals</span>.
          </h2>
          <p className="text-lg leading-relaxed text-[var(--color-muted)] max-w-3xl mb-12">
            <span className="em-dash" />Pick the events that matter. We monitor public feeds — NWS,
            CPUC dockets, county permit portals, LBNL system age — and fire
            the postcard batch into your dashboard for review. You approve
            the batch. We mail.
          </p>

          <div className="grid lg:grid-cols-2 gap-px bg-[var(--color-hairline)] border rule">
            <div className="bg-[var(--color-paper)] p-8 lg:p-10">
              <p className="legend text-[var(--color-signal)] mb-6">● Pool triggers</p>
              <div className="space-y-px">
                <TriggerRow
                  name="Freeze events"
                  source="NWS LSR · hard-freeze warning"
                  event="Freeze warning issued for [zip]"
                  window="~24h response"
                  note="500% historical service-call spike (TX-Uri pattern)"
                />
                <TriggerRow
                  name="Hurricane wind"
                  source="NHC tracks · post-event"
                  event="Cat-1+ wind crossing your service zips"
                  window="24–72h"
                  note="Pool screen enclosures · $20–50K AOV"
                />
                <TriggerRow
                  name="Pool permit pulled"
                  source="County permit portal · daily"
                  event="Renovation / equipment / re-plaster permit"
                  window="7 days"
                  note="No free national feed — most defensible trigger"
                />
                <TriggerRow
                  name="Just-sold + pool"
                  source="County recorder · ATTOM intersection"
                  event="Deed recorded for parcel with verified pool"
                  window="30 days"
                  note="6-month higher-spend window"
                />
                <TriggerRow
                  name="Spring open + pump age"
                  source="Calendar · permit-date + 8 yrs"
                  event="Region's spring-open window + 8-yr pump cycle"
                  window="14 days ahead"
                  note="Highest-revenue pool weeks of the year"
                />
              </div>
            </div>

            <div className="bg-[var(--color-paper)] p-8 lg:p-10">
              <p className="legend text-[var(--color-signal)] mb-6">● Solar triggers</p>
              <div className="space-y-px">
                <TriggerRow
                  name="Solar permit pulled"
                  source="County permit portal · daily"
                  event="Battery / expansion / re-roof solar permit"
                  window="7 days"
                  note="Pre-existing panels = retrofit; none = new install"
                />
                <TriggerRow
                  name="NEM 3.0 deadline"
                  source="CA CPUC · regulatory calendar"
                  event="T-30 days to grandfathering cutoff"
                  window="30 days"
                  note="Closest 2026 analog to a HailTrace event"
                />
                <TriggerRow
                  name="NEM interconnection age"
                  source="CA-DGStats + NY Open Data"
                  event="Interconnection filing 7+ years ago"
                  window="Calendar"
                  note="CA + NY only at v1 · LBNL national fallback"
                />
                <TriggerRow
                  name="Panels older than 7 yrs"
                  source="LBNL Tracking the Sun · ~4.5M systems"
                  event="System age threshold met"
                  window="Calendar"
                  note="Nobody assembles this product today"
                />
                <TriggerRow
                  name="Post-PTO 90-day window"
                  source="PTO date · per-utility"
                  event="90 days after permission-to-operate"
                  window="90 days"
                  note="Solar O&M fastest-growing labor category"
                />
              </div>
            </div>
          </div>

          <p className="legend mt-6 text-[var(--color-muted)] max-w-3xl">
            Tax delinquency, foreclosure, code violations are also wired up —
            used as quality filters that exclude bad-fit parcels, not as
            primary triggers.
          </p>
        </div>
      </section>

      {/* 6. WORKFLOW — Detect → Filter → Trigger → Mail ---------------- */}
      {/* Implicit "approve" gate sits inside stage 4. Each stage anchored
          by one signal-orange metric. */}
      <section id="how" className="border-b rule bg-[var(--color-deep)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend-on-ink mb-6">/ Four stages</p>
          <h2 className="mb-16 max-w-3xl text-[var(--color-paper)]">
            Detect → Filter → Trigger → <span className="italic text-[var(--color-signal)]">Mail</span>.
          </h2>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-paper)]/15">
            <NumStep
              n="01"
              metric={liveCounties.toString()}
              metricLabel={`live counties · ${compact(totalParcels)} parcels`}
              title="Detect"
              body="Visual ML on every parcel in your market. v32 model, 96.5% precision vs assessor — every pool and panel gets a satellite tile and a confidence score."
            />
            <NumStep
              n="02"
              metric="5+"
              metricLabel="free public sources"
              title="Filter"
              body="FEMA flood zones · ACS income tract · code violations · tax delinquency · NOAA storm history. Bad-fit parcels pre-removed. Bundled into the per-piece price."
            />
            <NumStep
              n="03"
              metric="Set"
              metricLabel="the rules · we watch"
              title="Trigger"
              body="Freeze · permit pulled · just-sold · NEM 3.0 · post-PTO. Pick the events that matter. We monitor and fire the batch into your dashboard for review."
            />
            <NumStep
              n="04"
              metric="$1.50"
              metricLabel="per piece · all-in"
              title="Mail"
              body="You approve every batch. We design, print, mail (Stannp), and route responses to your CRM — Jobber, Housecall Pro, HubSpot."
            />
          </ol>
        </div>
      </section>

      {/* 7. VS — three-axis comparison -------------------------------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ The economic story</p>
          <h2 className="mb-6 max-w-4xl">
            3× the per-piece price.<br />
            <span className="italic text-[var(--color-signal)]">3–7× cheaper</span> per response.
          </h2>
          <p className="text-lg leading-relaxed text-[var(--color-muted)] max-w-3xl mb-12">
            <span className="em-dash" />Commodity DM blasts every house in a ZIP. Lead-gen brokers
            sell the same lead 3–8 ways. Plot mails to verified, enriched,
            event-triggered pool and panel homeowners — exclusively. The math
            falls out of the audience, not the printing.
          </p>

          <div className="border rule bg-[var(--color-paper)] overflow-x-auto">
            <div className="min-w-[820px]">
              <div className="grid grid-cols-[minmax(180px,1.2fr)_1fr_1fr_1fr] border-b rule">
                <div className="px-6 py-5 legend">Attribute</div>
                <div className="px-6 py-5 legend">Commodity direct mail</div>
                <div className="px-6 py-5 legend">Lead-gen broker</div>
                <div className="px-6 py-5 legend text-[var(--color-signal)]">Plot</div>
              </div>

              <ThreeAxisRow
                label="Example"
                a="Vistaprint-style"
                b="Angi · HomeAdvisor · Modernize"
                c="Plot"
              />
              <ThreeAxisRow
                label="Audience"
                a="Every house in a ZIP"
                b="Self-reported homeowner intent"
                c="Verified pool / panel · enriched + filtered"
                cAccent
              />
              <ThreeAxisRow
                label="Refresh cadence"
                a="Static dump"
                b="Static dump"
                c="Event-triggered (freeze · permit · NEM · just-sold)"
                cAccent
              />
              <ThreeAxisRow
                label="Exclusivity"
                a="N/A — blast"
                b="Sold 3–8 contractors / lead"
                c="1:1 — never shared"
                cAccent
              />
              <ThreeAxisRow
                label="Per-piece / per-lead"
                a={<span className="font-display text-3xl text-[var(--color-muted)]">$0.50</span>}
                b={<span className="font-display text-3xl text-[var(--color-muted)]">$25–80</span>}
                c={<span className="font-display text-3xl text-[var(--color-signal)]">$1.50</span>}
                isPriceRow
              />
              <ThreeAxisRow
                label="Typical response rate"
                a="~0.5%"
                b="Variable — 30%+ unreached"
                c="~5% (warm + filtered + triggered)"
                cAccent
              />
              <ThreeAxisRow
                label="Cost per response"
                a={<span className="font-display text-2xl text-[var(--color-muted)]">~$100</span>}
                b={<span className="font-display text-2xl text-[var(--color-muted)]">$80–300</span>}
                c={<span className="font-display text-2xl text-[var(--color-signal)]">~$30</span>}
                isPriceRow
                cAccent
              />
              <ThreeAxisRow
                label="Image on each row"
                a="None"
                b="None"
                c="Current satellite tile · linked from dashboard"
                cAccent
              />
              <ThreeAxisRow
                label="Regulatory posture"
                a="Standard postal"
                b="2023 FTC $7.2M (HomeAdvisor) · 2025 VT AG $2M (Angi)"
                c="Image-backed, evidence-tied"
                cAccent
              />
            </div>
          </div>

          <p className="legend mt-6 text-[var(--color-muted)] max-w-3xl">
            Commodity DM benchmark: USPS Marketing Mail + 0.5% response.
            Broker rates per Agent J's demand-side research; FTC + VT AG
            settlements public record. Plot numbers live as of {new Date().toLocaleDateString("en-US", {
              month: "long", year: "numeric",
            })}.
          </p>
        </div>
      </section>

      {/* 8. ROI CALCULATOR — interactive math (component renders own
          section + kicker + headline) -------------------------------- */}
      <ROICalculator />

      {/* 9. PRICING — single primary unit + storm add-on -------------- */}
      <section id="pricing" className="border-b rule bg-[var(--color-paper)]/40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ Pricing</p>
          <h2 className="mb-12 max-w-3xl">
            One unit.<br />
            <span className="italic text-[var(--color-signal)]">$1.50</span> per postcard delivered.
          </h2>

          <div className="grid lg:grid-cols-3 gap-px bg-[var(--color-hairline)] border rule">
            <div className="lg:col-span-2 bg-[var(--color-paper)] p-10">
              <p className="legend text-[var(--color-signal)] mb-6">● Primary unit · live</p>
              <p className="font-display text-7xl text-[var(--color-signal)] leading-none mb-2">
                $1.50
              </p>
              <p className="legend mb-8">per postcard delivered · all-in</p>
              <ul className="space-y-3 border-t rule pt-6 text-sm leading-relaxed">
                <IncludedRow>Verified pool / panel address generation (visual ML on parcel-level satellite)</IncludedRow>
                <IncludedRow>Government-data quality filtering (FEMA · ACS · code violations · tax delinquency · storm history)</IncludedRow>
                <IncludedRow>Trigger monitoring (freeze · permit · just-sold · NEM 3.0 · post-PTO)</IncludedRow>
                <IncludedRow>Postcard design (templated; per-batch approval)</IncludedRow>
                <IncludedRow>Print + USPS Marketing Mail postage</IncludedRow>
                <IncludedRow>Response capture: tracking number · QR code · reply mailer</IncludedRow>
                <IncludedRow>CRM hand-off (Jobber · Housecall Pro · HubSpot)</IncludedRow>
                <IncludedRow>
                  <span className="text-[var(--color-signal)]">Review every row before we mail</span> · reject anything wrong, pay only for what mails
                </IncludedRow>
              </ul>
            </div>
            <div className="bg-[var(--color-paper)] p-10">
              <p className="legend text-[var(--color-muted)] mb-6">○ Add-on · subscription</p>
              <p className="font-display text-5xl leading-none mb-2">$1</p>
              <p className="legend mb-8">per matched address · per event</p>
              <p className="text-sm leading-relaxed text-[var(--color-muted)] mb-6">
                Storm-event alerts on addresses you've already mailed. NOAA
                hail / wind / freeze / wildfire crosses your list, we ping
                you within 24 hours. Monthly cap TBD.
              </p>
              <p className="legend text-[var(--color-muted)]">
                Opt-in after first pilot.
              </p>
            </div>
          </div>

          <p className="legend mt-6 text-[var(--color-muted)] max-w-3xl">
            No subscription on the primary unit. No minimums beyond a pilot
            run. No platform commission on the work you win. Same{" "}
            <Link href="#review" className="text-[var(--color-ink)] underline underline-offset-4">
              review-before-mail commitment
            </Link>{" "}
            covers every postcard.
          </p>
        </div>
      </section>

      {/* 10. QUALITY CONTROL / REVIEW-BEFORE-MAIL --------------------- */}
      {/* Replaces the old refund section. No cash-refund language anywhere.
          The commitment is upstream: you approve every row, we mail what
          you approve. Photos already shown in section 2 — this section
          codifies the policy. */}
      <section id="review" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="legend mb-6">/ Quality control</p>
            <h2 className="mb-8">
              You see every row.<br />
              <span className="italic text-[var(--color-signal)]">Before we mail.</span>
            </h2>
            <p className="text-lg leading-relaxed text-[var(--color-muted)]">
              <span className="em-dash" />Every row in your dashboard ships with the satellite tile
              of the actual parcel. Reject anything that doesn't look right;
              we mail only what you approve. No refunds, no escalation, no
              broken-trust moment — because you've already seen the photo
              before any postcards ship.
            </p>
          </div>
          <div className="lg:col-span-7 grid md:grid-cols-3 gap-px bg-[var(--color-hairline)] border rule">
            <RefundStat
              value="100%"
              label="of rows reviewable before mail"
              note="Every row in the dashboard carries the satellite photo of the parcel — you see what you're paying to mail to."
            />
            <RefundStat
              value="$0"
              label="for rows you reject"
              accent
              note="Plot mails only what you approve. Rejected rows never ship and never bill."
            />
            <RefundStat
              value="1 click"
              label="to remove a row"
              note={(<>Inline reject button on every row in the dashboard. Approve the rest and we mail the next morning. Reach <a href="mailto:hello@get-plot.com" className="text-[var(--color-ink)] underline underline-offset-4">hello@get-plot.com</a> with anything bigger.</>)}
            />
          </div>
        </div>
      </section>

      {/* 11. HPPA TAILWIND — small, dated band ------------------------ */}
      {/* Honest dated context. Not a hero claim. Pre-empts the "why now"
          question for buyers thinking about postcard channel saturation. */}
      <section className="border-b rule bg-[var(--color-paper)]/40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
          <div className="grid lg:grid-cols-12 gap-12 items-baseline">
            <div className="lg:col-span-5">
              <p className="legend mb-4">/ Timing</p>
              <h3 className="mb-0">
                Mailboxes just got <span className="italic text-[var(--color-signal)]">quieter</span>.
              </h3>
            </div>
            <div className="lg:col-span-7">
              <p className="text-base leading-relaxed text-[var(--color-muted)]">
                <span className="em-dash" />The Homebuyers Privacy Protection Act (March 2026) cut
                cash-out-refi mortgage spam in arms-length channels.
                12–18 months of less competition for the postcards landing on
                your prospects' kitchen tables. The next class of direct
                mailers wins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 12. INTEGRATIONS — CRM destinations only --------------------- */}
      {/* D2D rail dropped from the card row per CPO scope — Plot doesn't
          supply canvassers. Postcard rail (Stannp) + CRM rail are the
          two integrations the homepage needs to surface. */}
      <section id="integrations" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-7">
              <p className="legend mb-6">/ Integrations</p>
              <h2 className="mb-6">
                The rails Plot ships on,<br />
                <span className="italic text-[var(--color-signal)]">end to end</span>.
              </h2>
              <p className="text-lg leading-relaxed max-w-2xl">
                <span className="em-dash" />Postcard rail mails the piece. CRM rail routes the
                response. Two integrations, one connect step each. Every
                future campaign runs through the same plumbing.
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end">
              <Link href={"/settings/integrations" as any} className="btn-ink">
                Connect your stack →
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-hairline)] border rule">
            <IntegrationGroup
              tag="● Postcard rail"
              title="The mail piece, done for you."
              body="Stannp prints and mails on your behalf — USPS Marketing Mail, postage included. Design + print + tracking number + QR + reply mailer. Bundled into the $1.50 per-piece price."
              vendors={["Stannp"]}
              comingSoon={["Click2Mail", "PostGrid"]}
            />
            <IntegrationGroup
              tag="● CRM destinations"
              title="Where the response lands."
              body="Pool and solar shops run their day on Jobber or Housecall Pro. Marketing-mature ops layer HubSpot on top. Responses land in the CRM tagged 'Plot' as the source — your reps work warm leads from the tool they already use."
              vendors={["Jobber", "Housecall Pro", "HubSpot"]}
            />
          </div>
        </div>
      </section>

      {/* 13. CTA dark band -------------------------------------------- */}
      <section className="border-b rule bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="legend-on-ink mb-6">/ Run a pilot</p>
            <h2 className="mb-6 text-[var(--color-paper)]">
              Verified pool and panel homeowners.{" "}
              <span className="italic text-[var(--color-signal)]">$1.50</span> a postcard.
              You approve every row.
            </h2>
            <p className="text-lg text-[var(--color-paper)]/80">
              Detection · enrichment · trigger monitoring · design · print · mail · CRM hand-off.
              One per-piece price. Nothing else to manage.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href="/run" className="btn-ink bg-[var(--color-signal)] border-[var(--color-signal)] hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]">
              Run a pilot →
            </Link>
            <Link href="#pricing" className="btn-ghost text-[var(--color-paper)] border-[var(--color-paper)]/20 hover:border-[var(--color-paper)]">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---- helper components ------------------------------------------------- */

/** Lead-row mockup — the load-bearing visual-proof artifact. Shows the
 * surface the SMB actually reviews: parcel ID, address, lat/lon, confidence,
 * enrichment context, satellite tile column. Tile column gets the
 * signal-orange treatment so the photo reads as the dominant element. */
function LeadRowMockup() {
  const cols =
    "grid-cols-[110px_minmax(220px,2fr)_minmax(140px,1fr)_minmax(110px,1fr)_minmax(150px,1fr)_minmax(120px,1fr)]";
  const rows: Array<{
    parcel: string;
    address: string;
    latlon: string;
    conf: string;
    enrich: string;
    photo: string;
  }> = [
    {
      parcel: "14-32-118-009",
      address: "5821 W Cactus Rd, Glendale AZ 85304",
      latlon: "33.5722, -112.1391",
      conf: "0.92",
      enrich: "FEMA X · ACS $$$ · No code violations",
      photo: "tile.png",
    },
    {
      parcel: "21-08-204-117",
      address: "9244 Lakeshore Blvd, Tampa FL 33619",
      latlon: "27.9506, -82.4572",
      conf: "0.88",
      enrich: "FEMA AE · ACS $$ · Hurricane Helene crossing",
      photo: "tile.png",
    },
    {
      parcel: "07-15-330-042",
      address: "412 Sunset Ave, Sacramento CA 95819",
      latlon: "38.5816, -121.4944",
      conf: "0.95",
      enrich: "Solar · NEM 2018 · age 7 yr · LBNL match",
      photo: "tile.png",
    },
  ];

  return (
    <div className="border rule bg-[var(--color-paper)] overflow-x-auto">
      <div className="min-w-[920px]">
        <div className={`grid ${cols} border-b rule`}>
          <div className="px-4 py-3 legend">Parcel ID</div>
          <div className="px-4 py-3 legend">Address</div>
          <div className="px-4 py-3 legend">Lat / Lon</div>
          <div className="px-4 py-3 legend">Confidence</div>
          <div className="px-4 py-3 legend">Enrichment</div>
          <div className="px-4 py-3 legend text-[var(--color-signal)]">Photo</div>
        </div>
        {rows.map((r, i) => (
          <div
            key={r.parcel}
            className={`grid ${cols} ${i < rows.length - 1 ? "border-b rule" : ""}`}
          >
            <div className="px-4 py-5 font-mono text-xs">{r.parcel}</div>
            <div className="px-4 py-5 text-sm">{r.address}</div>
            <div className="px-4 py-5 font-mono text-xs">{r.latlon}</div>
            <div className="px-4 py-5 font-display text-xl text-[var(--color-signal)]">
              {r.conf}
            </div>
            <div className="px-4 py-5 text-xs leading-relaxed text-[var(--color-muted)]">
              {r.enrich}
            </div>
            <div className="px-4 py-5">
              <span className="legend text-[var(--color-signal)]">● {r.photo}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Per-vertical card with its own validated trigger menu. Pool + solar
 * use this as equal sibling cards in the vertical-row section. */
function VerticalCardEx({
  tag, status, title, icp, triggers, cta, live,
}: {
  tag: string;
  status: string;
  title: string;
  icp: string;
  triggers: string[];
  cta: { label: string; href: string };
  live?: boolean;
}) {
  return (
    <div className={`p-8 lg:p-10 ${live ? "bg-[var(--color-paper)]" : "bg-[var(--color-paper)]/60"}`}>
      <div className="flex items-baseline justify-between mb-6">
        <p className={`legend ${live ? "text-[var(--color-signal)]" : "text-[var(--color-muted)]"}`}>
          {tag}
        </p>
        <p className="legend">{status}</p>
      </div>
      <h3 className="mb-3">{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--color-muted)] mb-8">{icp}</p>
      <p className="legend mb-4">Triggers shipping at v1</p>
      <ul className="space-y-3 border-t rule pt-6 text-sm leading-relaxed">
        {triggers.map((t) => (
          <li key={t} className="flex items-baseline gap-3">
            <span className="text-[var(--color-signal)] font-display flex-shrink-0">+</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <Link href={cta.href as any} className="mt-8 inline-block btn-ink">
        {cta.label}
      </Link>
    </div>
  );
}

/** Trigger-menu row used inside the per-vertical column. */
function TriggerRow({
  name, source, event, window, note,
}: {
  name: string;
  source: string;
  event: string;
  window: string;
  note: string;
}) {
  return (
    <div className="border-t rule pt-4 pb-4 first:border-t-0 first:pt-0">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <p className="font-display text-lg leading-snug">{name}</p>
        <p className="legend text-[var(--color-signal)] whitespace-nowrap">{window}</p>
      </div>
      <p className="text-xs font-mono text-[var(--color-muted)] mb-2">{source}</p>
      <p className="text-sm leading-relaxed mb-2">{event}</p>
      <p className="text-xs leading-relaxed text-[var(--color-muted)]">{note}</p>
    </div>
  );
}

/** AirDNA-style headline number — the dominant text on the page. */
function BigStat({
  value, label, tone,
}: {
  value: string;
  label: string;
  tone?: "signal";
}) {
  return (
    <div className="bg-[var(--color-paper)] p-6 lg:p-8">
      <dd className={`font-display text-5xl lg:text-6xl leading-none ${
        tone === "signal" ? "text-[var(--color-signal)]" : ""
      }`}>
        {value}
      </dd>
      <dt className="legend mt-3">{label}</dt>
    </div>
  );
}

/** Compact number formatter — 2_041_141 → "2.04M", 142_000 → "142K". */
function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  return n.toLocaleString();
}

/** AirDNA-style step card — leads with a metric, then the action. */
function NumStep({
  n, metric, metricLabel, title, body,
}: {
  n: string;
  metric: string;
  metricLabel: string;
  title: string;
  body: string;
}) {
  return (
    <li className="bg-[var(--color-deep)] p-10">
      <div className="flex items-baseline gap-4 mb-8">
        <span className="legend-on-ink text-[var(--color-signal)] text-sm">{n}</span>
        <span className="h-px flex-1 bg-[var(--color-paper)]/20" />
      </div>
      <p className="font-display text-6xl text-[var(--color-signal)] leading-none mb-2">
        {metric}
      </p>
      <p className="legend-on-ink mb-8">{metricLabel}</p>
      <h3 className="text-[var(--color-paper)] mb-3">{title}</h3>
      <p className="text-[var(--color-paper)]/70 leading-relaxed text-base">{body}</p>
    </li>
  );
}

/** Three-axis comparison row: commodity DM × broker × Plot. */
function ThreeAxisRow({
  label, a, b, c, cAccent, isPriceRow,
}: {
  label: string;
  a: React.ReactNode;
  b: React.ReactNode;
  c: React.ReactNode;
  cAccent?: boolean;
  isPriceRow?: boolean;
}) {
  return (
    <div className={`grid grid-cols-[minmax(180px,1.2fr)_1fr_1fr_1fr] border-b rule last:border-b-0 ${
      isPriceRow ? "bg-[var(--color-paper)]" : ""
    }`}>
      <div className="px-6 py-5 legend">{label}</div>
      <div className="px-6 py-5 text-sm text-[var(--color-muted)]">{a}</div>
      <div className="px-6 py-5 text-sm text-[var(--color-muted)]">{b}</div>
      <div className={`px-6 py-5 text-sm ${
        cAccent ? "text-[var(--color-ink)] font-medium" : ""
      }`}>{c}</div>
    </div>
  );
}

/** Quality-control stat card. */
function RefundStat({
  value, label, note, accent,
}: {
  value: string;
  label: string;
  note: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="bg-[var(--color-paper)] p-8">
      <p className={`font-display text-5xl leading-none mb-2 ${
        accent ? "text-[var(--color-signal)]" : ""
      }`}>
        {value}
      </p>
      <p className="legend mb-4">{label}</p>
      <p className="text-sm leading-relaxed text-[var(--color-muted)]">{note}</p>
    </div>
  );
}

/** Integration-card group with supported + coming-soon vendors. */
function IntegrationGroup({
  tag, title, body, vendors, comingSoon = [],
}: {
  tag: string;
  title: string;
  body: string;
  vendors: string[];
  comingSoon?: string[];
}) {
  return (
    <div className="bg-[var(--color-paper)] p-10">
      <p className="legend mb-6">{tag}</p>
      <h3 className="mb-4">{title}</h3>
      <p className="leading-relaxed text-[var(--color-muted)] mb-8">{body}</p>
      <ul className="space-y-px">
        {vendors.map((v) => (
          <li key={v} className="border-t rule pt-3 flex items-center justify-between">
            <span className="font-display text-xl">{v}</span>
            <span className="legend">● Supported</span>
          </li>
        ))}
        {comingSoon.map((v) => (
          <li key={v} className="border-t rule pt-3 flex items-center justify-between">
            <span className="font-display text-xl text-[var(--color-muted)]">{v}</span>
            <span className="legend text-[var(--color-muted)]">○ Coming soon</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Pricing-card included-feature row. Signal-orange check + body. */
function IncludedRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-baseline gap-3">
      <span className="text-[var(--color-signal)] font-display flex-shrink-0">+</span>
      <span>{children}</span>
    </li>
  );
}
