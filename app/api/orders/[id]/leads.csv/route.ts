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
  return NextResponse.json(
    { detail: `unexpected upstream status ${r.status}` },
    { status: r.status },
  );
}
