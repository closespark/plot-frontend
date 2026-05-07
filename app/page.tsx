import Link from "next/link";
import { ProofTile } from "@/components/ProofTile";
import { MarketsTable } from "@/components/MarketsTable";
import { MarketCard, type MarketCardData } from "@/components/MarketCard";
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
      {/* HERO — stats-heavy, AirDNA-shape ----------------------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-16 pb-20">
          <p className="legend mb-8">
            Verified property data <span className="text-[var(--color-signal)]">·</span>{" "}
            Updated on every order
          </p>
          <h1 className="mb-10 max-w-5xl">
            Every backyard pool in your county.<br />
            <span className="italic text-[var(--color-signal)]">Indexed</span>, photographed, $0.15.
          </h1>

          {/* Headline number row — the AirDNA "$54,300 avg revenue" move.
              Live aggregates first, brand commitments second. */}
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
              value="$0.15"
              label="per verified lead · refunded if wrong"
            />
          </dl>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link href="/run" className="btn-ink">Run a pilot →</Link>
            <Link href="#explorer" className="btn-ghost">Browse markets ↓</Link>
            <Link href="/examples" className="btn-ghost">See a sample scan ↓</Link>
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
                Top markets,<br />
                <span className="italic text-[var(--color-signal)]">ranked by scale</span>.
              </h2>
              <p className="text-lg leading-relaxed max-w-2xl text-[var(--color-muted)]">
                <span className="em-dash" />Each card is a county we scan on demand. Click to order;
                we deliver the verified pool list within 24 hours. The full
                sortable index sits below.
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
              to a parcel record. Multiply this across a county and you
              have the database.
            </p>

            {/* Stat callouts — inline product attestation */}
            <dl className="grid grid-cols-2 gap-px bg-[var(--color-hairline)] border rule">
              <SmallStat value="0.92" label="confidence on this pool" />
              <SmallStat value="96.5%" label="precision vs assessor" />
              <SmallStat value="v32" label="model version · current prod" />
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

      {/* HOW IT WORKS — number-anchored cards -------------------- */}
      <section id="how" className="border-b rule bg-[var(--color-deep)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend-on-ink mb-6">/ Three steps</p>
          <h2 className="mb-16 max-w-3xl text-[var(--color-paper)]">
            From market to CSV<br />
            <span className="italic text-[var(--color-signal)]">in hours</span>, not days.
          </h2>
          <ol className="grid md:grid-cols-3 gap-px bg-[var(--color-paper)]/15">
            <NumStep
              n="01"
              metric={liveCounties.toString()}
              metricLabel={`live counties · ${statesCovered} states`}
              title="Pick a market"
              body="Choose a county. Missing markets get prioritized on request."
            />
            <NumStep
              n="02"
              metric="$15"
              metricLabel="minimum pilot · Stripe"
              title="Pay & launch"
              body="Your county runs on demand — every single-family parcel scanned with current satellite imagery."
            />
            <NumStep
              n="03"
              metric="< 24h"
              metricLabel="typical delivery"
              title="Download leads"
              body="CSV with current satellite photo on every row. Or push directly to Jobber, Housecall Pro, or HubSpot."
            />
          </ol>
        </div>
      </section>

      {/* INTEGRATIONS -------------------------------------------- */}
      <section id="integrations" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-7">
              <p className="legend mb-6">/ Integrations</p>
              <h2 className="mb-6">
                Land in the tools<br />
                <span className="italic text-[var(--color-signal)]">your team already uses</span>.
              </h2>
              <p className="text-lg leading-relaxed max-w-2xl">
                <span className="em-dash" />Skip the CSV. Push verified leads straight to your CRM. Mail
                postcards through our printer rail without leaving Plot. Pick
                what fits your workflow — connect once, every future scan
                routes automatically.
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
              tag="● CRM destinations"
              title="Send leads where the work happens."
              body="Pool & solar shops run their day on Jobber or Housecall Pro. Marketing-mature ops layer HubSpot on top. We push to all three — leads land tagged ‘Plot' as the source, ready to dispatch."
              vendors={["Jobber", "Housecall Pro", "HubSpot"]}
            />
            <IntegrationGroup
              tag="● Postcard rail"
              title="Mail without the mailshop."
              body="Stannp prints and mails on your behalf — USPS Marketing Mail, postage included. From $0.50 per piece. You set the design once, approve cost per batch."
              vendors={["Stannp"]}
              comingSoon={["Click2Mail", "PostGrid"]}
            />
          </div>
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

      {/* VS BROKERS — attribute-row data table ------------------- */}
      <section id="pricing" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ Vs brokers</p>
          <h2 className="mb-12 max-w-4xl">
            Same county.<br />
            <span className="italic text-[var(--color-signal)]">Different data.</span>
          </h2>

          <div className="border rule bg-[var(--color-paper)]">
            {/* Header row */}
            <div className="grid grid-cols-[minmax(140px,1fr)_1fr_1fr] md:grid-cols-[minmax(220px,1fr)_1fr_1fr] border-b rule">
              <div className="px-6 py-5 legend">Attribute</div>
              <div className="px-6 py-5 legend">Typical broker</div>
              <div className="px-6 py-5 legend text-[var(--color-signal)]">Plot</div>
            </div>

            <CompareRow
              label="Records source"
              broker="Assessor exports, often years out of date"
              plot="Live satellite scan, refreshed per order"
            />
            <CompareRow
              label="Pool flag accuracy"
              broker="~70% (assessor drift over 5 years)"
              plot="96.5% precision vs assessor"
              plotAccent
            />
            <CompareRow
              label="Image on each row"
              broker="None"
              plot="Current satellite tile · linked from CSV"
              plotAccent
            />
            <CompareRow
              label="Catches unpermitted pools"
              broker="No — assessor never re-checks"
              plot="Yes — model sees what the records missed"
            />
            <CompareRow
              label="Refund policy"
              broker="None — they've never seen the property"
              plot="$0.15 per wrong row · no cap, no escalation"
              plotAccent
            />
            <CompareRow
              label="Per-record price"
              broker={<span className="font-display text-3xl text-[var(--color-muted)]">$0.10</span>}
              plot={<span className="font-display text-3xl text-[var(--color-signal)]">$0.15</span>}
              isPriceRow
            />
          </div>

          <p className="legend mt-6 text-[var(--color-muted)] max-w-2xl">
            Broker comparison is industry typical, not a specific vendor. Plot
            numbers are live as of {new Date().toLocaleDateString("en-US", {
              month: "long", year: "numeric",
            })} — see <Link href="/imagery-privacy" className="text-[var(--color-ink)] underline underline-offset-4">methodology ↗</Link>.
          </p>
        </div>
      </section>

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
              <span className="em-dash" />The visual confirmation isn't a marketing line. It's a
              refund promise. Brokers can't make it because they've never
              looked at the property. We have. So we put numbers on it.
            </p>
          </div>
          <div className="lg:col-span-7 grid md:grid-cols-3 gap-px bg-[var(--color-hairline)] border rule">
            <RefundStat
              value="$0.15"
              label="refunded per wrong row"
              note="Same price you paid — credited back."
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
            <p className="legend-on-ink mb-6">/ Get access</p>
            <h2 className="mb-6 text-[var(--color-paper)]">
              Self-serve. <span className="italic text-[var(--color-signal)]">$0.15</span> per
              verified lead. Photo on every row.
            </h2>
            <p className="text-lg text-[var(--color-paper)]/80">
              Refund anything we can't prove.
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

/** Compact number formatter — 2_041_141 → "2.04M", 142_000 → "142K". Used
 * in the hero so big numbers stay readable at display sizes. Below 10K we
 * keep full digits because "9,500 parcels" is more meaningful than "9.5K". */
function compact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`;
  if (n >= 10_000) return `${Math.round(n / 1000)}K`;
  return n.toLocaleString();
}

/** AirDNA-style step card — leads with a metric, then the action. The
 * metric is the dominant text; the title + body explain it. Steps stack
 * across the dark "How it works" band; the live counties number ties
 * step 1 back to the hero stats. */
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
 * difference is the headline. */
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

/** Refund-section stat card: leads with the metric (typically $-amount or
 * "No cap"), then the label, then a footnote justifying it. `accent`
 * marks the no-cap card since unconditional refund is the brand wedge. */
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
