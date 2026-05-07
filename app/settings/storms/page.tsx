import Link from "next/link";
import {
  eventKindLabel,
  formatCents,
  listWatches,
  recentMatches,
  severityLabel,
  type RecentMatchSummary,
  type WatchSummary,
} from "@/lib/storms";

export const dynamic = "force-dynamic";

export default async function StormsPage() {
  const [watches, matches] = await Promise.all([
    listWatches(),
    recentMatches(),
  ]);

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <p className="legend mb-6">/ Settings · Storm overlay</p>
          <h1 className="mb-8">
            Watch the storms.{" "}
            <span className="italic text-[var(--color-signal)]">We'll find</span>{" "}
            your homes.
          </h1>
          <p className="text-lg leading-relaxed text-[var(--color-muted)]">
            <span className="em-dash" />Plot keeps an eye on NOAA hail, hurricane,
            freeze, and wildfire feeds. When a qualifying event passes within
            range of a parcel you've already bought, we notify you within 24
            hours and bill <span className="font-mono text-[var(--color-ink)]">$1</span>{" "}
            per matched address. Refunds are unconditional if the swath didn't
            actually touch the property.
          </p>
        </div>

        <div className="lg:col-span-8 space-y-12">
          <div>
            <p className="legend mb-6">/ Active watches</p>
            <p className="text-base leading-relaxed mb-8 max-w-2xl text-[var(--color-muted)]">
              Each watch monitors one event type in one county against the lead
              list from a single L1 order. Pause anytime — no penalty, no
              prorated refund needed.
            </p>
            {watches.length === 0 ? (
              <EmptyWatches />
            ) : (
              <ul className="space-y-px">
                {watches.map((w) => (
                  <WatchRow key={w.id} watch={w} />
                ))}
              </ul>
            )}
          </div>

          <div>
            <p className="legend mb-6">/ Recent matches</p>
            <p className="text-base leading-relaxed mb-8 max-w-2xl text-[var(--color-muted)]">
              The last 30 days of billed matches across every watch on this
              account. Flag a row to dispute — we re-query the canonical NOAA
              record and refund if the geometry didn't actually intersect.
            </p>
            {matches.length === 0 ? (
              <EmptyMatches hasWatches={watches.length > 0} />
            ) : (
              <MatchesTable matches={matches} />
            )}
          </div>

          {/* Disconnected-mode banner — remove once Phase 2/3 ship the API. */}
          <div className="border rule bg-[var(--color-paper)] p-6 font-mono text-xs text-[var(--color-muted)]">
            <p className="legend mb-2 text-[var(--color-signal)]">/ Coming soon</p>
            <p className="leading-relaxed">
              Storm watches aren't live yet — we're finalizing NOAA ingestion
              and the per-match billing rail. Drop us a note at{" "}
              <a
                href="mailto:hello@get-plot.com"
                className="text-[var(--color-ink)] underline underline-offset-4"
              >
                hello@get-plot.com
              </a>{" "}
              if you want first-batch access; we'll wire your watches by hand
              against your existing L1 orders in the meantime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyWatches() {
  return (
    <div className="border rule bg-[var(--color-paper)] p-8">
      <p className="legend mb-3">/ No watches yet</p>
      <p className="text-base leading-relaxed text-[var(--color-muted)] max-w-xl mb-6">
        Watches start from a delivered order. Once an L1 scan completes, you'll
        be able to subscribe its parcels to hail, hurricane, freeze, or
        wildfire alerts from the order's detail page.
      </p>
      <Link href={"/run" as any} className="btn-ghost">
        Start a pilot →
      </Link>
    </div>
  );
}

function EmptyMatches({ hasWatches }: { hasWatches: boolean }) {
  return (
    <div className="border rule bg-[var(--color-paper)] p-8">
      <p className="legend mb-3">/ Nothing in the last 30 days</p>
      <p className="text-base leading-relaxed text-[var(--color-muted)] max-w-xl">
        {hasWatches
          ? "Quiet skies. Your watches are armed — the moment a qualifying event crosses one of your parcels, it'll show up here and you'll get a notification within 24 hours."
          : "Once you start a watch, every NOAA event that lands inside your parcel radius will appear here with the source URL, distance, and notification status."}
      </p>
    </div>
  );
}

function WatchRow({ watch }: { watch: WatchSummary }) {
  return (
    <li className="border rule bg-[var(--color-paper)]">
      <div className="px-6 py-5 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
        <div className="md:w-56 flex items-center gap-3 shrink-0">
          <span
            className={`block w-2 h-2 ${
              watch.paused
                ? "bg-[var(--color-hairline)]"
                : "bg-[var(--color-signal)]"
            }`}
            aria-hidden
          />
          <div>
            <span className="font-display text-2xl block leading-tight">
              {watch.county_label}
            </span>
            <span className="legend">
              {eventKindLabel(watch.event_kind)} ·{" "}
              {severityLabel(watch.event_kind, watch.min_severity)}+
            </span>
          </div>
        </div>
        <div className="flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
          <div>
            <span className="font-mono text-[var(--color-ink)]">
              {watch.match_count}
            </span>{" "}
            {watch.match_count === 1 ? "match" : "matches"} ·{" "}
            <span className="font-mono text-[var(--color-ink)]">
              {formatCents(watch.billed_cents)}
            </span>{" "}
            billed (last 30d)
          </div>
          <div className="text-xs mt-1">
            {watch.radius_meters}m radius · created{" "}
            {new Date(watch.created_at * 1000).toLocaleDateString()}
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          {/* Pause toggle no-op until POST /v1/storms/watches/:id/pause ships. */}
          <button
            type="button"
            disabled
            className="btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={`${watch.paused ? "Resume" : "Pause"} watch (coming soon)`}
          >
            {watch.paused ? "Resume" : "Pause"}
          </button>
          {/* Disconnect no-op until DELETE /v1/storms/watches/:id ships. */}
          <button
            type="button"
            disabled
            className="legend disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Disconnect watch (coming soon)"
          >
            Disconnect
          </button>
        </div>
      </div>
    </li>
  );
}

function MatchesTable({ matches }: { matches: RecentMatchSummary[] }) {
  return (
    <div className="border rule bg-[var(--color-paper)] overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b rule">
            <Th>Date</Th>
            <Th>Event</Th>
            <Th>Parcel</Th>
            <Th>Distance</Th>
            <Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m) => (
            <tr key={m.id} className="border-b rule last:border-b-0">
              <Td>
                <span className="font-mono text-xs">
                  {new Date(m.matched_at * 1000).toLocaleDateString()}
                </span>
              </Td>
              <Td>{eventKindLabel(m.event_kind)}</Td>
              <Td>
                <span className="block">
                  {m.parcel_address ?? (
                    <span className="text-[var(--color-muted)]">
                      address pending
                    </span>
                  )}
                </span>
                <span className="font-mono text-xs text-[var(--color-muted)]">
                  {m.parcel_id}
                </span>
              </Td>
              <Td>
                <span className="font-mono text-xs">
                  {Math.round(m.distance_meters)}m
                </span>
              </Td>
              <Td>
                <MatchStatus match={m} />
              </Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MatchStatus({ match }: { match: RecentMatchSummary }) {
  if (match.refunded_at) {
    return (
      <span className="legend text-[var(--color-muted)]">● Refunded</span>
    );
  }
  if (match.notified_at) {
    return (
      <span className="legend text-[var(--color-signal)]">● Notified</span>
    );
  }
  return <span className="legend">○ Queued</span>;
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left legend px-6 py-4 font-normal">{children}</th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-4 align-top">{children}</td>;
}
