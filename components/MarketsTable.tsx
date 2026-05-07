"use client";

/**
 * Live markets table — backed by /v1/counties (24 today, growing).
 * Client-side filter, sort, and pagination on a list passed from the server.
 *
 * No "estimated pools" column: backend doesn't ship per-county pool counts and
 * we don't want to fall back to hand-written ranges. Status column is "● live"
 * for everything in the list (the API only returns sellable counties).
 */
import { useMemo, useState } from "react";

type Market = { key: string; state: string; county: string };
type SortKey = "county" | "state";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 8;

export function MarketsTable({ markets }: { markets: Market[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("county");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = q
      ? markets.filter((m) =>
          m.county.toLowerCase().includes(q) ||
          m.state.toLowerCase().includes(q) ||
          m.key.toLowerCase().includes(q),
        )
      : markets;
    const sorted = [...rows].sort((a, b) => {
      const av = (a[sortKey] || "").toLowerCase();
      const bv = (b[sortKey] || "").toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [markets, query, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function toggleSort(k: SortKey) {
    if (sortKey === k) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
    setPage(0);
  }

  return (
    <>
      {/* Controls row */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-end mb-6">
        <label className="block flex-1">
          <span className="legend mb-2 block">/ Filter</span>
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="state code, county name, or key…"
            className="w-full bg-[var(--color-paper)] border rule outline-none px-4 py-3 font-mono text-sm placeholder:text-[var(--color-muted)]/50 focus:border-[var(--color-ink)]"
          />
        </label>
        <p className="legend sm:pb-3 sm:whitespace-nowrap">
          {filtered.length} of {markets.length} markets
        </p>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block border rule">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b rule">
              <SortHeader
                label="Market"
                active={sortKey === "county"}
                dir={sortKey === "county" ? sortDir : undefined}
                onClick={() => toggleSort("county")}
              />
              <SortHeader
                label="State"
                active={sortKey === "state"}
                dir={sortKey === "state" ? sortDir : undefined}
                onClick={() => toggleSort("state")}
              />
              <th className="text-left py-4 px-6 legend">County key</th>
              <th className="text-right py-4 px-6 legend">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((m) => (
              <tr key={m.key} className="border-b rule last:border-b-0">
                <td className="py-4 px-6 font-display text-2xl leading-none">
                  {m.county}
                </td>
                <td className="py-4 px-6 font-mono text-xs">{m.state}</td>
                <td className="py-4 px-6 font-mono text-xs text-[var(--color-muted)]">
                  {m.key}
                </td>
                <td className="py-4 px-6 text-right">
                  <span className="legend text-[var(--color-signal)]">● live</span>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={4} className="py-12 px-6 text-center text-[var(--color-muted)] text-sm">
                  No markets match "{query}". Try a state code (e.g. AZ, FL).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="md:hidden border rule divide-y rule">
        {visible.map((m) => (
          <li key={m.key} className="py-5 px-5 flex items-baseline justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-xl leading-tight truncate">{m.county}</p>
              <p className="font-mono text-[11px] text-[var(--color-muted)] mt-1">{m.key}</p>
            </div>
            <span className="legend text-[var(--color-signal)] shrink-0">● live</span>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-12 px-5 text-center text-[var(--color-muted)] text-sm">
            No markets match "{query}".
          </li>
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            type="button"
            onClick={() => setPage(Math.max(0, safePage - 1))}
            disabled={safePage === 0}
            className="legend disabled:opacity-40 hover:text-[var(--color-ink)]"
          >
            ← Prev
          </button>
          <p className="legend">
            page {safePage + 1} / {totalPages}
          </p>
          <button
            type="button"
            onClick={() => setPage(Math.min(totalPages - 1, safePage + 1))}
            disabled={safePage >= totalPages - 1}
            className="legend disabled:opacity-40 hover:text-[var(--color-ink)]"
          >
            Next →
          </button>
        </div>
      )}
    </>
  );
}

function SortHeader({
  label, active, dir, onClick,
}: {
  label: string;
  active: boolean;
  dir?: SortDir;
  onClick: () => void;
}) {
  return (
    <th className="text-left py-4 px-6">
      <button
        type="button"
        onClick={onClick}
        className={`legend ${active ? "text-[var(--color-ink)]" : "hover:text-[var(--color-ink)]"}`}
      >
        {label}
        {active && (
          <span className="ml-1">{dir === "asc" ? "↑" : "↓"}</span>
        )}
      </button>
    </th>
  );
}
