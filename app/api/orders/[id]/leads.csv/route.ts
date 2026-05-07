/**
 * Server route — proxies the FastAPI signed-URL redirect for the leads CSV
 * so the browser never sees the API key.
 */
import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.PLOT_API_BASE ?? "http://localhost:8000";
const API_KEY = process.env.PLOT_API_KEY ?? "";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const r = await fetch(`${API_BASE}/v1/orders/${id}/leads.csv`, {
    headers: { "X-API-Key": API_KEY },
    redirect: "manual", // we want to forward the 302
  });
  if (r.status === 302 || r.status === 301) {
    const loc = r.headers.get("location");
    if (loc) return NextResponse.redirect(loc, 302);
  }
  // Forward the backend's body so the user sees "order is done, no leads yet"
  // (or whatever the real reason is) instead of "unexpected upstream status N".
  const raw = await r.text().catch(() => "");
  let detail = raw || `upstream returned ${r.status} with no body`;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.detail === "string") detail = parsed.detail;
  } catch { /* not JSON */ }
  return NextResponse.json({ detail }, { status: r.status });
}
