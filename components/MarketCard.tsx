import Link from "next/link";

export type MarketCardData = {
  key: string;        // "AZ:maricopa"
  state: string;
  county: string;
  parcels: number;    // 0 = scoping (registry hasn't been re-probed)
};

/** AirDNA-style market card: state badge, county name as headline, the
 * dominant parcel-count number, an "Order pilot" deep link. Cards stack
 * in a responsive grid on the homepage market explorer. */
export function MarketCard({ market }: { market: MarketCardData }) {
  const scoping = market.parcels <= 0;
  // /run pre-selects the county via querystring; OrderForm doesn't read it
  // yet — TODO once that's wired, this becomes a true one-click flow.
  const orderHref = `/run?county=${encodeURIComponent(market.key)}`;

  return (
    <Link
      href={orderHref as any}
      className="group block bg-[var(--color-paper)] p-6 hover:bg-[var(--color-deep)] hover:text-[var(--color-paper)] transition-colors"
    >
      <div className="flex items-baseline justify-between mb-4">
        <span className="legend group-hover:legend-on-ink">{market.state}</span>
        {scoping && (
          <span className="legend text-[var(--color-signal)] group-hover:text-[var(--color-signal)]">
            ○ Coming online
          </span>
        )}
      </div>
      <h3 className="mb-6 text-3xl group-hover:text-[var(--color-paper)]">
        {titleCase(market.county)} County
      </h3>
      <div className="border-t rule pt-4 group-hover:border-[var(--color-paper)]/20">
        {scoping ? (
          <p className="font-mono text-xs text-[var(--color-muted)] group-hover:text-[var(--color-paper)]/70">
            Sellable. Parcel count refresh in flight — scan still runs on order.
          </p>
        ) : (
          <>
            <p className="font-display text-4xl text-[var(--color-signal)]">
              {market.parcels.toLocaleString()}
            </p>
            <p className="legend mt-1 group-hover:legend-on-ink">parcels indexed</p>
          </>
        )}
      </div>
      <p className="legend mt-6 group-hover:text-[var(--color-signal)]">
        Order pilot →
      </p>
    </Link>
  );
}

function titleCase(s: string) {
  return s.toLowerCase().replace(/(^|[\s_-])(\w)/g, (_, sep, ch) => sep + ch.toUpperCase()).replace(/_/g, " ");
}
