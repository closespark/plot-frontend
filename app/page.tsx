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

      {/* WHAT THE SCAN SEES -------------------------------------- */}
      <section id="how" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <p className="legend mb-6">/ What the scan sees</p>
            <h2 className="mb-6">Every pool, pinned.</h2>
            <p className="text-lg leading-relaxed mb-6">
              One block in Maricopa County. Each marker is a verified pool, tied
              to an address, with the current image attached to the row.
              Multiply this across the metro and you have the database.
            </p>
            <p className="legend">
              MARICOPA · SAMPLE BLOCK · 96.5% PRECISION VS ASSESSOR
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

      {/* HOW IT WORKS — 3 STEPS ---------------------------------- */}
      <section className="border-b rule bg-[var(--color-deep)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend-on-ink mb-6">/ Three steps</p>
          <h2 className="mb-16 max-w-3xl">From market to CSV in hours, not days.</h2>
          <ol className="grid md:grid-cols-3 gap-px bg-[var(--color-paper)]/15">
            <Step
              n="01"
              title="Pick a market"
              body="Choose a county. We support 65–70% of US population today; missing markets get prioritized on request."
            />
            <Step
              n="02"
              title="Pay the pilot"
              body="$15 minimum to start. Your county runs on demand — every single-family parcel scanned with current satellite imagery."
            />
            <Step
              n="03"
              title="Download the list"
              body="Address, owner data where available, current satellite image of the pool on every row. CSV out, ready for mail or door."
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

      {/* VS BROKERS ---------------------------------------------- */}
      <section id="pricing" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ Vs brokers</p>
          <h2 className="mb-16 max-w-4xl">
            $0.10 stale data,<br />
            or <span className="italic text-[var(--color-signal)]">$0.15 with proof</span>.
          </h2>
          <div className="grid md:grid-cols-2 gap-px bg-[var(--color-hairline)] border rule">
            <Compare
              heading="Typical broker"
              price="$0.10"
              bullets={[
                "Assessor records, often years out of date",
                "Pool flag may be missing, wrong, or outdated",
                "No visual confirmation",
                "No refund — they've never seen the property",
              ]}
              accent={false}
            />
            <Compare
              heading="Plot"
              price="$0.15"
              bullets={[
                "Current satellite imagery on every row",
                "96.5% precision vs assessor records",
                "Surfaces pools the county missed (built without permits)",
                "Refunded if the photo doesn't show what we said",
              ]}
              accent={true}
            />
          </div>
        </div>
      </section>

      {/* OFFER --------------------------------------------------- */}
      <section id="refund" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="legend mb-6">/ The offer</p>
            <h2 className="mb-8">
              Try it.<br /><span className="italic">Refund</span> what's wrong.
            </h2>
            <p className="text-lg leading-relaxed">
              The visual confirmation isn't a marketing line. It's a refund promise.
              Brokers can't make it. We do.
            </p>
          </div>
          <div className="lg:col-span-7 grid md:grid-cols-2 gap-px bg-[var(--color-hairline)] border rule">
            <OfferCard
              tag="● Pilot"
              title="$15 minimum"
              body="Pick a county, scan starts on payment. We deliver leads within 24 hours of order — usually faster."
            />
            <OfferCard
              tag="● Validity guarantee"
              title="Wrong? Refunded."
              body="If a row's photo doesn't show what we said it shows — no pool — flag it. We refund the record. No tickets, no escalation."
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

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="bg-[var(--color-deep)] p-10">
      <div className="flex items-baseline gap-4 mb-6">
        <span className="legend-on-ink text-[var(--color-signal)] text-sm">{n}</span>
        <span className="h-px flex-1 bg-[var(--color-paper)]/20" />
      </div>
      <h3 className="text-[var(--color-paper)] mb-4">{title}</h3>
      <p className="text-[var(--color-paper)]/70 leading-relaxed">{body}</p>
    </li>
  );
}

function Compare({ heading, price, bullets, accent }: { heading: string; price: string; bullets: string[]; accent: boolean }) {
  return (
    <div className={accent ? "bg-[var(--color-paper)] p-10" : "bg-[var(--color-paper)] p-10"}>
      <p className={accent ? "legend text-[var(--color-signal)]" : "legend"}>
        / {heading}
      </p>
      <p className={`font-display text-7xl mt-4 mb-8 ${accent ? "text-[var(--color-signal)]" : "text-[var(--color-muted)]"}`}>
        {price}
      </p>
      <ul className="space-y-3">
        {bullets.map((b) => (
          <li key={b} className="flex gap-3 text-base">
            <span className={`mt-2 block w-2 h-px ${accent ? "bg-[var(--color-signal)]" : "bg-[var(--color-muted)]"}`} />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function OfferCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <div className="bg-[var(--color-paper)] p-10">
      <p className="legend mb-6">{tag}</p>
      <h3 className="mb-4">{title}</h3>
      <p className="leading-relaxed text-[var(--color-muted)]">{body}</p>
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
