/**
 * Storm overlay (L2) — types + connection state.
 *
 * Disconnected-mode placeholder: the watch + match lists always return empty
 * until the API endpoints in `api/storms/` ship and `api/main.py` exposes them.
 * The shape here mirrors the canonical schemas in
 * `api/storms/CHIEF_PLAN.md` (Watch + Match) so flipping the stub to a live
 * call is a one-line swap.
 *
 * When the API ships, replace `listWatches()` / `recentMatches()` with calls
 * to `GET /v1/storms/watches` and `GET /v1/storms/matches` (the existing
 * `lib/api.ts` exports `ApiError` + an authenticated fetch pattern to mirror).
 */

export type EventKind = "hail" | "hurricane_wind" | "freeze" | "wildfire";

export type WatchSummary = {
  id: number;
  /** county_registry key, e.g. "TX:dallas". Joins back to scan + parcel data. */
  county_key: string;
  /** Pre-formatted display string from the API, e.g. "Dallas County, TX". */
  county_label: string;
  event_kind: EventKind;
  /**
   * Event-specific severity floor. Units depend on event_kind:
   *   hail            — max stone diameter, inches
   *   hurricane_wind  — max sustained, mph
   *   freeze          — min temperature, °F
   *   wildfire        — burn area, acres
   */
  min_severity: number;
  radius_meters: number;
  created_at: number;
  paused: boolean;
  /** Rolling 30-day count of matches for this watch. */
  match_count: number;
  /** Rolling 30-day amount billed for this watch, in integer cents. */
  billed_cents: number;
};

export type RecentMatchSummary = {
  id: number;
  watch_id: number;
  event_kind: EventKind;
  /** FK back to storm_events.source_id — used for refund audit. */
  event_source_id: string;
  parcel_id: string;
  /** Resolved by the API from the L1 lead row; may be missing pre-resolution. */
  parcel_address?: string;
  distance_meters: number;
  matched_at: number;
  notified_at: number | null;
  refunded_at: number | null;
};

/**
 * Disconnected-mode stub. Once the API endpoint exists, replace with:
 *
 *     return call("/v1/storms/watches");
 *
 * Returning a stable empty array keeps the page rendering the "no watches yet"
 * branch — the empty state IS the real UI we're scaffolding right now.
 */
export async function listWatches(): Promise<WatchSummary[]> {
  return [];
}

/**
 * Disconnected-mode stub. Once the API endpoint exists, replace with:
 *
 *     const qs = watch_id ? `?watch_id=${watch_id}` : "";
 *     return call(`/v1/storms/matches${qs}`);
 */
export async function recentMatches(
  watch_id?: number,
): Promise<RecentMatchSummary[]> {
  void watch_id;
  return [];
}

/** UI-side display helpers — pure, no I/O. */

export function eventKindLabel(kind: EventKind): string {
  switch (kind) {
    case "hail":
      return "Hail";
    case "hurricane_wind":
      return "Hurricane wind";
    case "freeze":
      return "Freeze";
    case "wildfire":
      return "Wildfire";
  }
}

export function severityLabel(kind: EventKind, value: number): string {
  switch (kind) {
    case "hail":
      return `${value.toFixed(2)}″ stone`;
    case "hurricane_wind":
      return `${Math.round(value)} mph sustained`;
    case "freeze":
      return `${Math.round(value)}°F`;
    case "wildfire":
      return `${Math.round(value).toLocaleString()} acres`;
  }
}

export function formatCents(cents: number): string {
  const dollars = cents / 100;
  if (Number.isInteger(dollars)) return `$${dollars.toLocaleString()}`;
  return `$${dollars.toFixed(2)}`;
}
