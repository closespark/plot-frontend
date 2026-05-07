import Link from "next/link";
import { ProofTile } from "@/components/ProofTile";
import { MarketsTable } from "@/components/MarketsTable";
import { MarketCard, type MarketCardData } from "@/components/MarketCard";
import { ROICalculator } from "@/components/ROICalculator";
import { naipTileUrl } from "@/lib/naip";
import { listCounties } from "@/lib/api";

// Server-fetched at request time so the markets list mirrors what /v1/counties
// actually serves (24 today, growing). No Vercel cache window — counties drift
// only on backend deploys, but stale data here would mis-sell coverage.
export const dynamic = "force-dynamic";

const SAMPLE_BOXES = [
  { x: 38, y: 46, w: 14, h: 18 }, // a single backyard pool detection
];

export default async function Page() {
  // Fetch live markets server-side. If the backend is unreachable, render an
  // empty list rather than 500 the page — user can still order via /run.
  let markets: MarketCardData[] = [];
  try {
    const r = await listCounties();
    markets = r.counties
      // Hide archived/internal adapters from public marketing surface.
      // Backend filter is by `pool_x_parcel` block presence; archived rows
      // sometimes still carry that block during deprecation.
      .filter((c) => !/_archived$|_legacy$|^_/.test(c.key))
      .map((c) => ({
        key: c.key, state: c.state, county: c.county,
        parcels: c.row_count ?? 0,
      }));
  } catch {
    markets = [];
  }

  // Aggregate stats — the hero's main job. Numbers come from the live
  // /v1/counties response so they reflect today's coverage, not a frozen
  // snapshot. Counties with row_count=0 still count as "live" — they're
  // sellable, the parcel count just hasn't re-probed yet.
  const totalParcels = markets.reduce((sum, m) => sum + m.parcels, 0);
  const liveCounties = markets.length;
  const statesCovered = new Set(markets.map((m) => m.state)).size;

  // Top-N for the explorer grid: parcel-count desc, "scoping" rows last.
  // Cap at 12 cards so the section reads as a curated above-the-fold view
  // — full sortable table sits below for power users.
  const featured = [...markets]
    .sort((a, b) => (b.parcels || 0) - (a.parcels || 0))
    .slice(0, 12);

  return (
    <>
      {/* HERO — done-for-you postcard delivery, $1.50 unit ------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-16 pb-20">
          <p className="legend mb-8">
            Verified pool homeowners · pre-filtered · mailed for you
            <span className="text-[var(--color-signal)]"> · </span>
            Sales-led pilots
          </p>
          <h1 className="mb-10 max-w-5xl">
            Direct mail to pools{" "}
            <span className="italic text-[var(--color-signal)]">that actually exist</span>.<br />
            $1.50 a postcard. Refunded if the photo lies.
          </h1>

          {/* Headline number row — three live aggregates anchor the
              coverage claim; the fourth slot lands the new $1.50 unit
              economic so it reads as "this is the price" not buried. */}
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
            <BigStat
              value="96.5%"
              label="precision vs assessor"
            />
            <BigStat
              value="$1.50"
              label="per postcard delivered · all-in"
            />
          </dl>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link href="/run" className="btn-ink">Run a pilot →</Link>
            <Link href="#explorer" className="btn-ghost">Browse markets ↓</Link>
            <Link href="/examples" className="btn-ghost">See a sample scan ↓</Link>
          </div>
        </div>
      </section>

      {/* VERTICAL ROW — pool live, solar muted to a quiet roadmap nod */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16">
          <p className="legend mb-6">/ Launch vertical</p>
          <h2 className="mb-12 max-w-3xl">
            Pool service, end-to-end.<br />
            <span className="italic text-[var(--color-signal)]">Detection through delivery.</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-px bg-[var(--color-hairline)] border rule">
            <div className="md:col-span-2 bg-[var(--color-paper)] p-8 lg:p-10">
              <div className="flex items-baseline justify-between mb-6">
                <p className="legend text-[var(--color-signal)]">● Pool</p>
                <p className="legend">Live</p>
              </div>
              <h3 className="mb-3">Verified pool homeowners, mailed for you</h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)] mb-8">
                Pool service · cleaning · repair · screen-enclosure restoration
              </p>
              <dl className="space-y-3 border-t rule pt-6">
                <SpecRow label="Audience" value="Verified pool addresses · enriched + filtered before mail" />
                <SpecRow label="Coverage" value={`${liveCounties} counties · ${compact(totalParcels)} parcels`} />
                <SpecRow label="Channel" value="Postcards · designed, printed, mailed (Stannp)" />
                <SpecRow label="Response capture" value="Tracking number · QR code · reply mailer" />
                <SpecRow label="Hand-off" value="Jobber · Housecall Pro · HubSpot" />
                <SpecRow label="Refund" value="Per-piece, if the lead-row photo doesn't show a pool" />
              </dl>
              <Link href="/run" className="mt-8 inline-block btn-ink">
                Run a pool pilot →
              </Link>
            </div>
            <div className="bg-[var(--color-paper)]/60 p-8 lg:p-10">
              <div className="flex items-baseline justify-between mb-6">
                <p className="legend text-[var(--color-muted)]">○ Next vertical</p>
                <p className="legend">Roadmap</p>
              </div>
              <h3 className="mb-3 text-[var(--color-muted)]">Solar maintenance</h3>
              <p className="text-sm leading-relaxed text-[var(--color-muted)] mb-8">
                Cleaning, panel inspection, post-storm repair, battery retrofit.
                Same engine, second vertical — no homepage promise yet.
              </p>
              <p className="legend text-[var(--color-muted)]">
                <a
                  href="mailto:hello@get-plot.com?subject=Plot%20solar%20early%20access"
                  className="text-[var(--color-ink)] underline underline-offset-4"
                >
                  Get notified →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARKET EXPLORER ---------------------------------------- */}
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
                request — verified pool list, designed creative, postcards in
                the mail, responses routed to your CRM. Full sortable index
                sits below.
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
        </div>
      </section>

      {/* WHAT THE SCAN SEES — image + inline stat callouts ------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <p className="legend mb-6">/ What the scan sees</p>
            <h2 className="mb-6">
              One block.<br />
              <span className="italic text-[var(--color-signal)]">Every pool</span>, pinned.
            </h2>
            <p className="text-lg leading-relaxed text-[var(--color-muted)] mb-8">
              <span className="em-dash" />Glendale, AZ — one residential block. The orange box is
              the v32 model's detection; the pin is the verified pool tied
              to a parcel record. Multiply this across a county, layer
              government enrichment on top, and you have the mail list.
            </p>

            {/* Stat callouts — inline product attestation. Now leans on
                enrichment context (FEMA / ACS) so the proof tile reads as
                "every row is filtered, not just detected." */}
            <dl className="grid grid-cols-2 gap-px bg-[var(--color-hairline)] border rule">
              <SmallStat value="0.92" label="confidence on this pool" />
              <SmallStat value="FEMA X" label="flood zone (excluded by default)" />
              <SmallStat value="ACS" label="tract income tier · $$$" />
              <SmallStat value="May 2026" label="imagery date" />
            </dl>

            <p className="legend mt-6">
              <Link href="/examples" className="text-[var(--color-ink)] underline underline-offset-4">
                See more sample scans →
              </Link>
            </p>
          </div>
          <div className="lg:col-span-7">
            <ProofTile
              src={naipTileUrl({ lat: 33.5722, lon: -112.1391, label: "glendale-pool-sample" })}
              alt="Glendale block with v32 pool detection box overlaid"
              boxes={SAMPLE_BOXES}
              pins={[{ x: 45, y: 55, n: 1 }]}
              className="aspect-square"
            />
            <p className="legend mt-3">
              GLENDALE · POOL DETECTION · CONF 0.92 · MAY 2026 IMAGERY
            </p>
          </div>
        </div>
      </section>

      {/* LEAD-ROW PROOF ----------------------------------------- */}
      {/* Reinforces "photo on every row" without requiring a new image
          asset. One stylized lead row showing the surface area the SMB
          actually reviews. */}
      <section className="border-b rule bg-[var(--color-paper)]/40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <p className="legend mb-6">/ Every dashboard row looks like this</p>
          <h2 className="mb-10 max-w-3xl">
            One row, one pool,<br />
            <span className="italic text-[var(--color-signal)]">one refundable promise</span>.
          </h2>
          <div className="border rule bg-[var(--color-paper)]">
            <div className="grid grid-cols-[120px_minmax(220px,2fr)_minmax(140px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)] border-b rule">
              <div className="px-4 py-3 legend">Parcel ID</div>
              <div className="px-4 py-3 legend">Address</div>
              <div className="px-4 py-3 legend">Lat / Lon</div>
              <div className="px-4 py-3 legend">Confidence</div>
              <div className="px-4 py-3 legend">Enrichment</div>
              <div className="px-4 py-3 legend">Photo</div>
            </div>
            <div className="grid grid-cols-[120px_minmax(220px,2fr)_minmax(140px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)_minmax(120px,1fr)]">
              <div className="px-4 py-5 font-mono text-xs">14-32-118-009</div>
              <div className="px-4 py-5 text-sm">5821 W Cactus Rd, Glendale AZ 85304</div>
              <div className="px-4 py-5 font-mono text-xs">33.5722, -112.1391</div>
              <div className="px-4 py-5 font-display text-xl text-[var(--color-signal)]">0.92</div>
              <div className="px-4 py-5 text-xs leading-relaxed text-[var(--color-muted)]">
                FEMA X · ACS $$$ · No code violations
              </div>
              <div className="px-4 py-5">
                <span className="legend text-[var(--color-signal)]">● tile.png</span>
              </div>
            </div>
          </div>
          <p className="legend mt-6 text-[var(--color-muted)] max-w-3xl">
            Every row carries the satellite tile. If the photo doesn't show a
            pool, the postcard mailed against that row gets refunded — one
            email, no escalation.
          </p>
        </div>
      </section>

      {/* STORM OVERLAY — quieter add-on framing ----------------- */}
      <section id="storm-overlay" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <div className="grid lg:grid-cols-12 gap-12 mb-12">
            <div className="lg:col-span-7">
              <p className="legend mb-6">/ Optional add-on · storm-event alerts</p>
              <h2 className="mb-6">
                When the storm crosses your list,<br />
                <span className="italic text-[var(--color-signal)]">we tell you first</span>.
              </h2>
              <p className="text-lg leading-relaxed text-[var(--color-muted)] max-w-2xl">
                <span className="em-dash" />Subscription add-on for customers who already mail with
                us. We watch NOAA hail / wind / wildfire / freeze data and
                notify you within 24 hours when a qualifying event passes
                over an address you've already mailed. $1 per matched
                address per event · monthly cap TBD.
              </p>
            </div>
            <div className="lg:col-span-5 lg:flex lg:items-end lg:justify-end">
              <span className="legend text-[var(--color-muted)]">
                ○ Subscription add-on · not the headline
              </span>
            </div>
          </div>

          {/* Event × damage × geography table — still a useful reference
              for which storms drive demand in which markets. */}
          <div className="border rule bg-[var(--color-paper)]">
            <div className="grid grid-cols-[140px_1fr_minmax(160px,1fr)] md:grid-cols-[200px_1fr_minmax(200px,1fr)] border-b rule">
              <div className="px-6 py-4 legend">Event</div>
              <div className="px-6 py-4 legend">What it damages</div>
              <div className="px-6 py-4 legend">Geography</div>
            </div>
            <EventRow
              event="Hurricane wind"
              damage="Pool screen enclosures · $20–50K AOV. Solar racking, panel mounts."
              geography="FL, GA, SC, TX coastal"
            />
            <EventRow
              event="Hail ≥1.75″"
              damage="Pool liners, fiberglass shells, covers, equipment."
              geography="National · esp. TX, CO, OK"
            />
            <EventRow
              event="Freeze events"
              damage="Pumps, heaters, salt cells, pipes."
              geography="TX, SE, mid-South"
            />
            <EventRow
              event="Wildfire perimeter"
              damage="Equipment, ash cleanup."
              geography="CA, AZ, CO, OR"
            />
          </div>

          <p className="legend mt-6 text-[var(--color-muted)] max-w-3xl">
            Data sources: NOAA SPC + NWS MESH (hail) · NHC tracks (hurricane) ·
            NWS LSRs (freeze) · USFS / Cal Fire / NIFC perimeters (wildfire).
            All free, public, ~24-hour latency post-event.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS — 4-stage funnel -------------------------- */}
      <section id="how" className="border-b rule bg-[var(--color-deep)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend-on-ink mb-6">/ Four stages</p>
          <h2 className="mb-16 max-w-3xl text-[var(--color-paper)]">
            Detect → Filter → Mail → <span className="italic text-[var(--color-signal)]">Hand off</span>.
          </h2>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-paper)]/15">
            <NumStep
              n="01"
              metric={liveCounties.toString()}
              metricLabel={`live counties · ${compact(totalParcels)} parcels`}
              title="Detect"
              body="Visual ML on every parcel in your market. v32 model, 96.5% precision vs assessor — every pool gets a satellite tile and a confidence score."
            />
            <NumStep
              n="02"
              metric="6+"
              metricLabel="government data sources"
              title="Filter"
              body="FEMA flood zone · ACS income tract · code violations · tax delinquency · NOAA storm history · disaster declarations. Bad-fit addresses pre-removed before mail."
            />
            <NumStep
              n="03"
              metric="$1.50"
              metricLabel="per piece · all-in"
              title="Mail"
              body="Stannp prints and mails on your behalf. Design + print + USPS postage + tracking number + QR + reply mailer — included in the per-piece price."
            />
            <NumStep
              n="04"
              metric="3"
              metricLabel="CRM destinations"
              title="Hand off"
              body="Responses route to Jobber, Housecall Pro, or HubSpot — tagged ‘Plot' as the source. Your reps work warm leads from the CRM they already use."
            />
          </ol>
        </div>
      </section>

      {/* INTEGRATIONS ------------------------------------------- */}
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
              body="Pool shops run their day on Jobber or Housecall Pro. Marketing-mature ops layer HubSpot on top. Responses land in the CRM tagged ‘Plot' as the source — your reps work warm leads from the tool they already use."
              vendors={["Jobber", "Housecall Pro", "HubSpot"]}
            />
          </div>

          <p className="legend mt-6 text-[var(--color-muted)] max-w-3xl">
            If you already run a door-to-door team, we can push the same
            verified addresses into SalesRabbit or SPOTIO on request — Plot
            doesn't supply canvassers, but the data plays nicely if you do.
          </p>
        </div>
      </section>

      {/* MARKETS — full sortable index --------------------------- */}
      <section id="sample" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ Full index</p>
          <h2 className="mb-12 max-w-3xl">
            All <span className="italic text-[var(--color-signal)]">{liveCounties}</span> live
            counties. Searchable.
          </h2>
          {markets.length > 0 ? (
            <MarketsTable markets={markets} />
          ) : (
            <p className="border rule p-8 font-mono text-sm text-[var(--color-muted)]">
              Markets list temporarily unavailable. Visit{" "}
              <Link href="/run" className="text-[var(--color-ink)] underline underline-offset-4">
                /run
              </Link>{" "}
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

      {/* PRICING — single primary unit + storm add-on ----------- */}
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
                <IncludedRow>Verified pool address generation (visual ML on parcel-level satellite)</IncludedRow>
                <IncludedRow>Government-data quality filtering (FEMA · ACS · code violations · tax delinquency · storm history)</IncludedRow>
                <IncludedRow>Postcard design (templated; per-batch approval)</IncludedRow>
                <IncludedRow>Print + USPS Marketing Mail postage</IncludedRow>
                <IncludedRow>Response capture: tracking number · QR code · reply mailer</IncludedRow>
                <IncludedRow>CRM hand-off (Jobber · Housecall Pro · HubSpot)</IncludedRow>
                <IncludedRow>
                  <span className="text-[var(--color-signal)]">Refunded</span> per piece if the
                  lead-row photo doesn't show a pool · no cap, no escalation
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
            <Link href="#refund" className="text-[var(--color-ink)] underline underline-offset-4">
              refund commitment
            </Link>{" "}
            covers every postcard.
          </p>
        </div>
      </section>

      {/* VS — three-axis comparison ----------------------------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ The economic story</p>
          <h2 className="mb-6 max-w-4xl">
            3× the per-piece price.<br />
            <span className="italic text-[var(--color-signal)]">3–7× cheaper</span> per response.
          </h2>
          <p className="text-lg leading-relaxed text-[var(--color-muted)] max-w-3xl mb-12">
            <span className="em-dash" />Commodity direct mail blasts every house in a ZIP.
            Lead-gen brokers sell the same lead 3–8 ways. Plot mails to
            verified, enriched pool homeowners — exclusively. The math
            falls out of the audience, not the printing.
          </p>

          <div className="border rule bg-[var(--color-paper)] overflow-x-auto">
            <div className="min-w-[820px]">
              {/* Header row */}
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
                c="Verified pool · enriched + filtered"
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
                c="~5% (warm + filtered)"
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
                label="Refund policy"
                a="None"
                b="Capped · time-windowed · process-heavy"
                c="Per-piece, no cap, 1 email"
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
            Commodity DM benchmark: USPS Marketing Mail + 0.5% response is
            industry-standard direct-mail math. Broker rates per Agent J's
            demand-side research; FTC + VT AG settlements public record.
            Plot numbers live as of {new Date().toLocaleDateString("en-US", {
              month: "long", year: "numeric",
            })} — see <Link href="/imagery-privacy" className="text-[var(--color-ink)] underline underline-offset-4">methodology ↗</Link>.
          </p>
        </div>
      </section>

      {/* ROI CALCULATOR — interactive math after vs-brokers (component
          renders its own section + kicker + headline) ------------- */}
      <ROICalculator />

      {/* REFUND — promise quantified ----------------------------- */}
      <section id="refund" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="legend mb-6">/ The promise, in numbers</p>
            <h2 className="mb-8">
              Refund what's wrong.<br />
              <span className="italic text-[var(--color-signal)]">Quantified.</span>
            </h2>
            <p className="text-lg leading-relaxed text-[var(--color-muted)]">
              <span className="em-dash" />The only refund tied to the actual image of your
              property. Brokers can't make this promise — they've never
              looked at the parcel. We have. So we put numbers on it.
            </p>
          </div>
          <div className="lg:col-span-7 grid md:grid-cols-3 gap-px bg-[var(--color-hairline)] border rule">
            <RefundStat
              value="$1.50"
              label="refunded per wrong piece"
              note="Same price you paid — credited back, per postcard mailed against a row whose photo doesn't show a pool."
            />
            <RefundStat
              value="No cap"
              label="on refunds per order"
              note="Up to 100% of the order if every row is wrong."
              accent
            />
            <RefundStat
              value="1 email"
              label="to claim · no tickets"
              note={(<>Reply to your delivery, list bad parcel IDs, we credit. Reach <a href="mailto:hello@get-plot.com" className="text-[var(--color-ink)] underline underline-offset-4">hello@get-plot.com</a> directly.</>)}
            />
          </div>
        </div>
      </section>

      {/* CTA ---------------------------------------------------- */}
      <section className="border-b rule bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="legend-on-ink mb-6">/ Run a pilot</p>
            <h2 className="mb-6 text-[var(--color-paper)]">
              Verified pool homeowners.{" "}
              <span className="italic text-[var(--color-signal)]">$1.50</span> a postcard.
              Refunded if the photo lies.
            </h2>
            <p className="text-lg text-[var(--color-paper)]/80">
              Detection · enrichment · design · print · mail · CRM hand-off.
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

/** Pricing-table row: layer × description × price × status. `statusAccent`
 * lights the status cell signal-orange to mark "live" or "shipping this
 * month" rows. `dim` mutes everything for the L3 roadmap row.
 *
 * NOTE: not currently mounted — pricing section was rebuilt as a single
 * primary-unit card. Helper kept in place for future layered SKUs. */
function PricingRow({
  layer, what, price, status, statusAccent, dim,
}: {
  layer: string;
  what: React.ReactNode;
  price: React.ReactNode;
  status: string;
  statusAccent?: boolean;
  dim?: boolean;
}) {
  return (
    <div className={`grid grid-cols-[80px_minmax(160px,2fr)_minmax(140px,1fr)_minmax(140px,1fr)] md:grid-cols-[120px_minmax(220px,2fr)_minmax(180px,1fr)_minmax(180px,1fr)] border-b rule last:border-b-0 ${
      dim ? "opacity-60" : ""
    }`}>
      <div className={`px-4 md:px-6 py-6 font-display text-2xl ${
        statusAccent ? "text-[var(--color-signal)]" : "text-[var(--color-muted)]"
      }`}>
        {layer}
      </div>
      <div className="px-4 md:px-6 py-6 text-sm leading-relaxed">{what}</div>
      <div className="px-4 md:px-6 py-6">{price}</div>
      <div className="px-4 md:px-6 py-6">
        <span className={`legend ${statusAccent ? "text-[var(--color-signal)]" : ""}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

/** Storm-overlay table row: event × damage × geography. */
function EventRow({
  event, damage, geography,
}: {
  event: string;
  damage: string;
  geography: string;
}) {
  return (
    <div className="grid grid-cols-[140px_1fr_minmax(160px,1fr)] md:grid-cols-[200px_1fr_minmax(200px,1fr)] border-b rule last:border-b-0">
      <div className="px-6 py-5 font-display text-lg leading-snug">{event}</div>
      <div className="px-6 py-5 text-sm leading-relaxed text-[var(--color-muted)]">{damage}</div>
      <div className="px-6 py-5 text-sm legend">{geography}</div>
    </div>
  );
}

/** Vertical card: kept in place from the prior 2-card layout. The new
 * page uses a bespoke pool/solar layout above; helper preserved for the
 * cleanup pass. */
function VerticalCard({
  status, tag, title, icp, specs, cta,
}: {
  status: "live" | "coming";
  tag: string;
  title: string;
  icp: string;
  specs: { label: string; value: string }[];
  cta: { label: string; href: string };
}) {
  const isLive = status === "live";
  return (
    <div className={`p-8 lg:p-10 ${isLive ? "bg-[var(--color-paper)]" : "bg-[var(--color-paper)]/60"}`}>
      <div className="flex items-baseline justify-between mb-6">
        <p className={`legend ${isLive ? "text-[var(--color-signal)]" : "text-[var(--color-muted)]"}`}>
          {tag}
        </p>
        <p className="legend">{isLive ? "Live" : "Coming Q3"}</p>
      </div>
      <h3 className={`mb-3 ${isLive ? "" : "text-[var(--color-muted)]"}`}>{title}</h3>
      <p className="text-sm leading-relaxed text-[var(--color-muted)] mb-8">{icp}</p>
      <dl className="space-y-3 border-t rule pt-6">
        {specs.map((s) => (
          <div key={s.label} className="flex items-baseline justify-between gap-4 text-sm">
            <dt className="legend">{s.label}</dt>
            <dd className={`text-right ${isLive ? "" : "text-[var(--color-muted)]"}`}>{s.value}</dd>
          </div>
        ))}
      </dl>
      <a href={cta.href} className={`mt-8 inline-block ${isLive ? "btn-ink" : "btn-ghost"}`}>
        {cta.label}
      </a>
    </div>
  );
}

/** Compact stat card used inline within content sections (e.g. under the
 * scan-sees block). Smaller than BigStat — sized to live next to body
 * copy without dominating it. */
function SmallStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-[var(--color-paper)] p-4">
      <dd className="font-display text-2xl leading-none">{value}</dd>
      <dt className="legend mt-2 text-[10px] tracking-[0.16em]">{label}</dt>
    </div>
  );
}

/** AirDNA-style headline number — the dominant text on the page. Used in
 * the hero stat strip. `tone="signal"` reserves the orange accent for the
 * single most "wow" stat in the row (typically the parcel count). */
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

/** One row of the broker-vs-Plot comparison table. Default cell type is
 * a plain string; pass JSX for the price row to drop in display-sized
 * digits. `plotAccent` highlights the Plot side in signal-orange when the
 * difference is the headline.
 *
 * NOTE: not currently mounted — vs-section was rebuilt as a 3-axis
 * comparison (`ThreeAxisRow`). Helper kept for future cleanup pass. */
function CompareRow({
  label, broker, plot, plotAccent, isPriceRow,
}: {
  label: string;
  broker: React.ReactNode;
  plot: React.ReactNode;
  plotAccent?: boolean;
  isPriceRow?: boolean;
}) {
  return (
    <div className={`grid grid-cols-[minmax(140px,1fr)_1fr_1fr] md:grid-cols-[minmax(220px,1fr)_1fr_1fr] border-b rule last:border-b-0 ${
      isPriceRow ? "bg-[var(--color-paper)]" : ""
    }`}>
      <div className="px-6 py-5 legend">{label}</div>
      <div className="px-6 py-5 text-sm text-[var(--color-muted)]">{broker}</div>
      <div className={`px-6 py-5 text-sm ${
        plotAccent ? "text-[var(--color-ink)] font-medium" : ""
      }`}>{plot}</div>
    </div>
  );
}

/** Three-axis comparison row: commodity DM × broker × Plot. Mirrors the
 * shape of `CompareRow` but adds a third column so the page can show the
 * full Section 5.5 economic story (price + response rate + cost-per-
 * response) across the two real competitors. `cAccent` highlights the
 * Plot column when the difference is the headline. */
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

/** Refund-section stat card. */
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

/** Spec row for the rebuilt pool vertical card — label left, value right.
 * Keeps the same baseline-aligned shape as VerticalCard's internal dl. */
function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-sm">
      <dt className="legend whitespace-nowrap">{label}</dt>
      <dd className="text-right">{value}</dd>
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
