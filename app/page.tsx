import Link from "next/link";
import { ProofTile } from "@/components/ProofTile";
import { naipTileUrl } from "@/lib/naip";

const HERO_PINS = [
  { x: 18, y: 32, n: 1 }, { x: 41, y: 21, n: 2 }, { x: 64, y: 36, n: 3 },
  { x: 77, y: 22, n: 4 }, { x: 30, y: 58, n: 5 }, { x: 52, y: 64, n: 6 },
  { x: 73, y: 71, n: 7 }, { x: 25, y: 84, n: 8 }, { x: 60, y: 88, n: 9 },
];

const SAMPLE_BOXES = [
  { x: 38, y: 46, w: 14, h: 18 }, // a single backyard pool detection
];

const MARKETS = [
  { name: "Phoenix metro", county: "AZ:Maricopa", pools: "approx tens of thousands", note: "live" },
  { name: "Riverside",     county: "CA:Riverside", pools: "approx tens of thousands", note: "live" },
  { name: "Orange County", county: "CA:Orange",    pools: "approx tens of thousands", note: "live" },
  { name: "LA County",     county: "CA:LosAngeles",pools: "approx hundreds of thousands", note: "live" },
  { name: "Hillsborough",  county: "FL:Hillsborough", pools: "approx tens of thousands", note: "live" },
  { name: "Charleston",    county: "SC:Charleston", pools: "approx tens of thousands", note: "live" },
  { name: "Mecklenburg",   county: "NC:Mecklenburg", pools: "approx tens of thousands", note: "live" },
];

export default function Page() {
  return (
    <>
      {/* HERO ----------------------------------------------------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-16 pb-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <p className="legend mb-8">
              Verified property data <span className="text-[var(--color-signal)]">·</span> Self-serve
            </p>
            <h1 className="mb-8">
              Pool leads.<br />
              <span className="italic text-[var(--color-signal)]">A photo</span> on every row.
            </h1>
            <p className="text-xl leading-relaxed max-w-2xl mb-10">
              <span className="em-dash" />Brokers sell stale assessor records at $0.10. We sell records
              with a current satellite image proving the pool is actually there.
              Refunded if the photo doesn't match. Brokers can't make that promise.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/run" className="btn-ink">Run a pilot →</Link>
              <Link href="#pricing" className="btn-ghost">See pricing ↓</Link>
            </div>
            <dl className="grid grid-cols-3 gap-8 mt-16 pt-10 border-t rule">
              <Stat label="Per verified lead" value="$0.15" />
              <Stat label="Precision vs assessor" value="96.5%" />
              <Stat label="Proof on every row" value="Photo" mono />
            </dl>
          </div>
          <div className="lg:col-span-5">
            <ProofTile
              src={naipTileUrl({ lat: 33.6053, lon: -111.9214, label: "scottsdale-pool-sample" })}
              alt="Scottsdale residential block with verified backyard pools"
              pins={HERO_PINS}
              className="aspect-square"
            />
            <p className="legend mt-3">
              SCOTTSDALE · SAMPLE NEIGHBORHOOD SCAN · 9 verified pools
            </p>
          </div>
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
              className="aspect-[4/3]"
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

      {/* MARKETS ------------------------------------------------- */}
      <section id="sample" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend mb-6">/ Live markets</p>
          <h2 className="mb-12 max-w-3xl">
            Counties that <em>cover</em> the operators we serve.
          </h2>
          <div className="border rule">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b rule">
                  <th className="text-left py-4 px-6 legend">Market</th>
                  <th className="text-left py-4 px-6 legend">County</th>
                  <th className="text-left py-4 px-6 legend">Estimated pools</th>
                  <th className="text-right py-4 px-6 legend">Status</th>
                </tr>
              </thead>
              <tbody>
                {MARKETS.map((m) => (
                  <tr key={m.county} className="border-b rule last:border-b-0">
                    <td className="py-4 px-6 font-display text-2xl leading-none">{m.name}</td>
                    <td className="py-4 px-6 font-mono text-xs">{m.county}</td>
                    <td className="py-4 px-6 text-[var(--color-muted)]">{m.pools}</td>
                    <td className="py-4 px-6 text-right">
                      <span className="legend text-[var(--color-signal)]">● {m.note}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

function Stat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="legend mb-2">{label}</dt>
      <dd className={mono ? "font-mono text-2xl tracking-tight" : "font-display text-5xl leading-none"}>
        {value}
      </dd>
    </div>
  );
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
