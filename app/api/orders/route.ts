/**
 * Server route — proxies POST /v1/orders to the FastAPI backend so the
 * PLOT_API_KEY stays server-side. The browser never sees the key.
 */
import { NextRequest, NextResponse } from "next/server";
import { ApiError, createOrder } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    return NextResponse.json(order);
  } catch (e: any) {
    // Forward upstream 4xx (bad county, validation error) verbatim. Only
    // map unknown exceptions to 502 (bad-gateway), since the proxy itself
    // can't tell the difference between a backend outage and a bug here.
    if (e instanceof ApiError) {
      return NextResponse.json({ detail: e.detail }, { status: e.status });
    }
    return NextResponse.json(
      { detail: e?.message ?? "create_order failed" },
      { status: 502 },
    );
  }
}
