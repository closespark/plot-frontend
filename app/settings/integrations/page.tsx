import Link from "next/link";
import { INTEGRATIONS, listConnections, type IntegrationVendor } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const connections = await listConnections();
  const connectedIds = new Set(connections.map((c) => c.vendorId));

  const crm = INTEGRATIONS.filter((v) => v.kind === "crm");
  const postcard = INTEGRATIONS.filter((v) => v.kind === "postcard");

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <p className="legend mb-6">/ Settings · Integrations</p>
          <h1 className="mb-8">
            Send leads <span className="italic text-[var(--color-signal)]">where</span> the work happens.
          </h1>
          <p className="text-lg leading-relaxed text-[var(--color-muted)]">
            <span className="em-dash" />Connect once. Every Plot scan you run from then on
            pushes verified leads into your CRM and (optionally) mails postcards on
            your behalf — no CSV download, no copy-paste.
          </p>
        </div>

        <div className="lg:col-span-8 space-y-12">
          <div>
            <p className="legend mb-6">/ CRM destinations</p>
            <p className="text-base leading-relaxed mb-8 max-w-2xl text-[var(--color-muted)]">
              Pick the CRM your team uses every day. New leads land tagged{" "}
              <span className="font-mono text-[var(--color-ink)]">Plot</span> as the
              source so reps recognize where they came from.
            </p>
            <ul className="space-y-px">
              {crm.map((v) => (
                <IntegrationRow
                  key={v.id}
                  vendor={v}
                  connected={connectedIds.has(v.id)}
                />
              ))}
            </ul>
          </div>

          <div>
            <p className="legend mb-6">/ Postcard rail</p>
            <p className="text-base leading-relaxed mb-8 max-w-2xl text-[var(--color-muted)]">
              Optional — Plot orchestrates the print and mail through an API
              provider on your behalf. You set the design once and approve the
              cost per batch.
            </p>
            <ul className="space-y-px">
              {postcard.map((v) => (
                <IntegrationRow
                  key={v.id}
                  vendor={v}
                  connected={connectedIds.has(v.id)}
                />
              ))}
            </ul>
          </div>

          {/* Disconnected-mode banner — remove once OAuth ships. */}
          <div className="border rule bg-[var(--color-paper)] p-6 font-mono text-xs text-[var(--color-muted)]">
            <p className="legend mb-2 text-[var(--color-signal)]">/ Coming soon</p>
            <p className="leading-relaxed">
              Connections aren't live yet — we're finalizing the OAuth flow with
              each vendor. Drop us a note at{" "}
              <a href="mailto:hello@get-plot.com" className="text-[var(--color-ink)] underline underline-offset-4">
                hello@get-plot.com
              </a>{" "}
              if you want early access; we'll wire your account by hand in the
              meantime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationRow({ vendor, connected }: { vendor: IntegrationVendor; connected: boolean }) {
  return (
    <li className="border rule bg-[var(--color-paper)]">
      <div className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
        <div className="md:w-48 flex items-center gap-3 shrink-0">
          <span className={`block w-2 h-2 ${connected ? "bg-[var(--color-signal)]" : "bg-[var(--color-hairline)]"}`} />
          <span className="font-display text-2xl">{vendor.name}</span>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
          {vendor.blurb}
          {vendor.docsUrl && (
            <>
              {" "}
              <a
                href={vendor.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-ink)] underline underline-offset-4"
              >
                Docs ↗
              </a>
            </>
          )}
        </p>
        <div className="shrink-0">
          {connected ? (
            <span className="legend text-[var(--color-signal)]">● Connected</span>
          ) : (
            // OAuth start endpoint doesn't exist yet — keep the button so the
            // page demos correctly, but it's a no-op until the API ships.
            // Once the endpoint exists, swap to <a href={vendor.oauthStartPath}>.
            <button
              type="button"
              disabled
              className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Connect ${vendor.name} (coming soon)`}
            >
              Connect →
            </button>
          )}
        </div>
      </div>
    </li>
  );
}
