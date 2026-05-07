import { listCounties } from "@/lib/api";
import { OrderForm } from "@/components/OrderForm";

export const metadata = {
  title: "Run a pilot · Plot",
};

export const dynamic = "force-dynamic"; // counties list comes live from API

export default async function RunPage() {
  let counties: { key: string; state: string; county: string }[] = [];
  let apiError: string | null = null;
  try {
    const r = await listCounties();
    counties = r.counties;
  } catch (e: any) {
    apiError = e?.message ?? "API unreachable";
  }

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <p className="legend mb-6">/ Run a pilot</p>
          <h1 className="mb-8">
            Pick a county.<br />
            <span className="italic text-[var(--color-signal)]">Get the list.</span>
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-10">
            <span className="em-dash" />Every single-family parcel in your chosen county scanned with current
            satellite imagery. CSV delivered by email within 24 hours of payment.
            $15 minimum to start. $0.15 per verified lead beyond that.
          </p>

          {apiError && (
            <div className="border-2 rule bg-[var(--color-paper)] p-6 mb-8">
              <p className="legend text-[var(--color-signal)] mb-2">/ API unreachable</p>
              <p className="text-sm font-mono text-[var(--color-muted)]">{apiError}</p>
              <p className="text-sm mt-2">
                The county picker can't load right now. Email{" "}
                <a href="mailto:hello@get-plot.com" className="underline">
                  hello@get-plot.com
                </a>{" "}
                and we'll start your order manually.
              </p>
            </div>
          )}

          <OrderForm counties={counties} />
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border rule bg-[var(--color-paper)] p-8">
            <p className="legend mb-6">/ What you get</p>
            <ul className="space-y-4">
              <Bullet label="Address">
                Site address + city + ZIP
              </Bullet>
              <Bullet label="Owner data">
                Where assessor exposes it (~80% of counties)
              </Bullet>
              <Bullet label="Coordinates">
                Lat/lon for each verified pool
              </Bullet>
              <Bullet label="Confidence">
                v32 detection score
              </Bullet>
              <Bullet label="Image URL">
                Current satellite photo of the pool
              </Bullet>
            </ul>
          </div>
          <div className="border rule bg-[var(--color-deep)] text-[var(--color-paper)] p-8 mt-px">
            <p className="legend-on-ink mb-4">/ Validity guarantee</p>
            <p className="leading-relaxed">
              If a row's photo doesn't show a pool, flag it. We refund $0.15
              per row. No tickets, no escalation.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function Bullet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li>
      <p className="legend mb-1">{label}</p>
      <p className="text-base">{children}</p>
    </li>
  );
}
