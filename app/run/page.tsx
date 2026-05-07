import { listCounties } from "@/lib/api";
import { OrderForm } from "@/components/OrderForm";
import { listConnections, getVendor } from "@/lib/integrations";

export const metadata = {
  title: "Start a campaign · Plot",
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

  // Disconnected mode: listConnections() returns []. Once OAuth ships,
  // this resolves to the tenant's actual connected CRMs and the OrderForm
  // dropdown surfaces them without any other change.
  const connections = await listConnections();
  const connectedCrms = connections
    .map((c) => ({ id: c.vendorId, name: getVendor(c.vendorId)?.name || c.vendorId }))
    .filter((c) => {
      const v = getVendor(c.id);
      return v?.kind === "crm";
    });

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <p className="legend mb-6">/ Start a campaign</p>
          <h1 className="mb-8">
            Pick a market.<br />
            <span className="italic text-[var(--color-signal)]">We mail.</span><br />
            Responses hit your CRM.
          </h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-10">
            <span className="em-dash" />$1.50 per postcard, all-in. Verified pool addresses,
            designed creative, mailed for you, tracked, refunded if the photo lies.
            Recurring monthly — cancel any time.
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
                and we'll start your campaign manually.
              </p>
            </div>
          )}

          <OrderForm counties={counties} connectedCrms={connectedCrms} />
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
          <div className="border rule bg-[var(--color-paper)] p-8">
            <p className="legend mb-6">/ What you get</p>
            <ul className="space-y-4">
              <Bullet label="Verified pool address + photo">
                The brand commitment — every lead row carries the satellite image
                of the actual pool. If the photo doesn't back the claim, refund.
              </Bullet>
              <Bullet label="Designed postcard creative">
                Stannp template with full address personalization. No design work
                on your end.
              </Bullet>
              <Bullet label="Tracking number + QR code">
                Every piece is uniquely tracked. Calls and scans flow back to Plot
                and on to your CRM as response signal.
              </Bullet>
              <Bullet label="Responses pushed to your CRM">
                Jobber, Housecall Pro, or HubSpot. New leads land tagged{" "}
                <span className="font-mono text-[var(--color-ink)]">Plot</span> as the source.
              </Bullet>
              <Bullet label="Government enrichment quality filter">
                FEMA flood zones, ACS income tier, code violations, tax delinquency —
                pre-removed from the mail list. Free, baked into $1.50.
              </Bullet>
              <Bullet label="Refund any wrong row, no cap">
                One email. No tickets, no escalation. The whole reason this
                business exists.
              </Bullet>
            </ul>
          </div>
          <div className="border rule bg-[var(--color-deep)] text-[var(--color-paper)] p-8 mt-px">
            <p className="legend-on-ink mb-4">/ Validity guarantee</p>
            <p className="leading-relaxed">
              Any postcard where the lead-row photo doesn't show a pool, flagged
              within 30 days of delivery — we refund $1.50 per row. No cap. No
              tickets. One email.
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
