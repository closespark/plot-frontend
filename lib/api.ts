/**
 * Thin client for the Plot FastAPI backend.
 *
 * The frontend never talks directly to the backend with the API key —
 * Next.js server actions / route handlers proxy the call so the secret
 * stays server-side. Each function below runs in a Server Component or
 * a route handler.
 */
const API_BASE = process.env.PLOT_API_BASE ?? "http://localhost:8000";
const API_KEY = process.env.PLOT_API_KEY ?? "";

export type Order = {
  id: string;
  state: "pending_payment" | "queued" | "running" | "done" | "failed";
  county: string;
  customer_email: string;
  min_score: number;
  created_at: number;
  updated_at: number;
  started_at: number | null;
  finished_at: number | null;
  leads_count: number | null;
  parcels_total: number | null;
  error_message: string | null;
  leads_url: string | null;
  stripe_checkout_url: string | null;
};

export type County = {
  key: string;          // "AZ:maricopa"
  state: string;
  county: string;
  fips: string;
  // Total parcels per the assessor. 0 means "scoping" — county is sellable
  // but the rosetta worker hasn't re-probed since the field shipped. UI
  // should branch on === 0 to show a "Coming online" badge instead of "0".
  row_count?: number;
};

/** Thrown by `call()` on non-2xx upstream responses. Proxy route handlers
 * catch this and forward both `status` and `detail` so the browser sees the
 * real backend status code (404 stays 404, 400 stays 400) instead of a
 * blanket 500. */
export class ApiError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(`api ${status}: ${detail}`);
    this.status = status;
    this.detail = detail;
  }
}

async function call(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("X-API-Key", API_KEY);
  headers.set("content-type", "application/json");
  const r = await fetch(`${API_BASE}${path}`, { ...init, headers, cache: "no-store" });
  if (!r.ok) {
    // FastAPI returns {"detail": "..."} on errors. Fall back to raw text or
    // status text if the body isn't JSON.
    const raw = await r.text().catch(() => "");
    let detail = raw || r.statusText;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.detail === "string") detail = parsed.detail;
    } catch { /* not JSON, keep raw */ }
    throw new ApiError(r.status, detail);
  }
  return r.json();
}

export async function listCounties(): Promise<{ counties: County[] }> {
  return call("/v1/counties");
}

export async function createOrder(input: {
  customer_email: string;
  county: string;
  min_score?: number;
}): Promise<Order> {
  return call("/v1/orders", {
    method: "POST",
    body: JSON.stringify({ min_score: 0.30, ...input }),
  });
}

export async function getOrder(id: string): Promise<Order> {
  return call(`/v1/orders/${id}`);
}
