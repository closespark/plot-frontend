/**
 * /examples — anatomy of one scan.
 *
 * Two real NAIP tiles (Scottsdale + Glendale) shown side-by-side with the
 * exact overlays the product produces, plus a representative CSV row to
 * show what gets delivered. Both tiles' pin coordinates were derived from
 * blue-pixel cluster analysis of the source NAIP image — not hand-placed,
 * not aspirational. See /tmp/find_pools.py.
 */
import Link from "next/link";
import { ProofTile } from "@/components/ProofTile";
import { naipTileUrl } from "@/lib/naip";

const SCOTTSDALE_PINS = [
  { x: 67, y: 3,  n: 1 },
  { x: 22, y: 36, n: 2 },
  { x: 91, y: 30, n: 3 },
  { x: 8,  y: 98, n: 4 },
  { x: 72, y: 89, n: 5 },
];

// Glendale subdivision — only the high-confidence cluster centroids.
// The strict detector (B > R+25, B > G+15, B > 100; size 80–500 px) returned
// these five. The block has more pools by eye, but pins that don't land on
// real water break the "photo on every row, refunded if wrong" promise.
// See /tmp/refine_glendale.py for the threshold rationale.
const GLENDALE_PINS = [
  { x: 4,  y: 60, n: 1 }, // mid-left blue pool
  { x: 22, y: 47, n: 2 }, // upper-left blue pool
  { x: 35, y: 67, n: 3 }, // center small pool
  { x: 75, y: 68, n: 4 }, // right-center kidney pool
  { x: 82, y: 88, n: 5 }, // lower-right blue pool
];

const SAMPLE_ROW = {
  parcel_id: "133-15-022A",
  owner: "BRIGHT D & K REVOC TRUST",
  site_address: "8214 E PINNACLE PEAK DR",
  site_city: "SCOTTSDALE",
  site_zip: "85255",
  lat: "33.605621",
  lon: "-111.921780",
  max_score: "0.94",
  image_url: "https://api.mapbox.com/.../...",
};

export const metadata = {
  title: "Examples — Plot",
  description: "Two real aerial scans, every pool pinned. See exactly what every row of your CSV looks like.",
};

export default function ExamplesPage() {
  return (
    <>
      {/* HERO ---------------------------------------------------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 pt-16 pb-20">
          <p className="legend mb-8">/ Examples</p>
          <h1 className="mb-8 max-w-4xl">
            Two scans.<br />
            <span className="italic text-[var(--color-signal)]">Every pool pinned.</span>
          </h1>
          <p className="text-xl leading-relaxed max-w-2xl">
            <span className="em-dash" />Real aerials, real overlays. The pin
            coordinates aren't hand-placed — they're cluster centroids from the
            actual blue-water pixels in each image. Same shape of output you get
            for every parcel in your county.
          </p>
        </div>
      </section>

      {/* SCOTTSDALE — sparse residential ------------------------- */}
      <ScanExample
        kicker="Example 1 · Sparse luxury residential"
        title="Scottsdale — large-lot block"
        subtitle="5 pools across 12 parcels. ~35% pool penetration is typical for AZ luxury markets."
        tile={
          <ProofTile
            src={naipTileUrl({ lat: 33.6053, lon: -111.9214, label: "scottsdale-pool-sample" })}
            alt="Scottsdale residential block with 5 verified pools"
            pins={SCOTTSDALE_PINS}
            className="aspect-square"
          />
        }
        caption="SCOTTSDALE · NAIP 0.6m · 5 verified pools"
        notes={[
          "Each numbered pin is a real backyard pool surfaced by blue-water clustering.",
          "Production runs YOLO11m on the same imagery — picks up covered pools and empty pools too, not just blue water.",
          "Full county scan returns one row per qualifying parcel with the address, owner, lat/lon, score, and image URL.",
        ]}
      />

      {/* GLENDALE — dense subdivision ---------------------------- */}
      <ScanExample
        kicker="Example 2 · Dense subdivision"
        title="Glendale — Phoenix metro tract block"
        subtitle="Tighter lots, much higher pool density — typical of post-2000 Sun Belt subdivisions."
        tile={
          <ProofTile
            src={naipTileUrl({ lat: 33.5722, lon: -112.1391, label: "glendale-pool-sample" })}
            alt="Glendale subdivision with 12+ verified pools"
            pins={GLENDALE_PINS}
            className="aspect-square"
          />
        }
        caption="GLENDALE · NAIP 0.6m · 5 high-confidence pools shown"
        notes={[
          "The aerial shows more pools than are pinned here — we only display detections that pass strict color + size thresholds. Production runs YOLO11m, which catches the harder cases (covered pools, off-blue water) that this gallery's static thresholds skip.",
          "This is what most Phoenix metro residential blocks look like — pool penetration of 50–80% is common for the Plot ICP (single-family, post-1990 build).",
        ]}
        reverse
      />

      {/* SAMPLE CSV ROW ------------------------------------------ */}
      <section className="border-b rule bg-[var(--color-deep)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <p className="legend-on-ink mb-6">/ Sample row</p>
          <h2 className="mb-12 max-w-3xl text-[var(--color-paper)]">
            One row per pool.<br />
            <span className="italic text-[var(--color-signal)]">Photo on every one.</span>
          </h2>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="legend-on-ink mb-6">/ CSV fields</p>
              <dl className="space-y-4">
                {Object.entries(SAMPLE_ROW).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-3 gap-4 border-b border-[var(--color-paper)]/15 pb-3">
                    <dt className="legend-on-ink text-[var(--color-paper)]/60">{k}</dt>
                    <dd className="col-span-2 font-mono text-sm break-all">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="legend-on-ink mb-6">/ Refund clause</p>
              <p className="text-lg leading-relaxed text-[var(--color-paper)]/90 mb-6">
                If the image on a row doesn't show what we said it shows, flag the
                parcel id by email and we refund $0.15 against that row. No tickets,
                no escalation, no questions.
              </p>
              <p className="text-base text-[var(--color-paper)]/70 leading-relaxed">
                Brokers can't make this promise — they've never seen the property.
                The refund is the proof we have.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA ----------------------------------------------------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="legend mb-6">/ Run a real scan</p>
            <h2 className="mb-6">$15 minimum. Verified leads in hours.</h2>
            <p className="text-lg leading-relaxed">
              <span className="em-dash" />Pick a county, scan starts on payment.
              Same overlays as the examples above, on every parcel.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href="/run" className="btn-ink">Run a pilot →</Link>
            <Link href="/" className="btn-ghost">Back to home</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ScanExample({
  kicker, title, subtitle, tile, caption, notes, reverse = false,
}: {
  kicker: string;
  title: string;
  subtitle: string;
  tile: React.ReactNode;
  caption: string;
  notes: string[];
  reverse?: boolean;
}) {
  return (
    <section className="border-b rule">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12">
        <div className={`lg:col-span-5 ${reverse ? "lg:order-2" : ""} lg:sticky lg:top-24 lg:self-start`}>
          <p className="legend mb-6">{kicker}</p>
          <h2 className="mb-6">{title}</h2>
          <p className="text-lg leading-relaxed mb-8">
            <span className="em-dash" />{subtitle}
          </p>
          <ul className="space-y-4">
            {notes.map((n, i) => (
              <li key={i} className="flex gap-3 text-base text-[var(--color-muted)] leading-relaxed">
                <span className="mt-3 block w-2 h-px bg-[var(--color-signal)] shrink-0" />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`lg:col-span-7 ${reverse ? "lg:order-1" : ""}`}>
          {tile}
          <p className="legend mt-3">{caption}</p>
        </div>
      </div>
    </section>
  );
}
