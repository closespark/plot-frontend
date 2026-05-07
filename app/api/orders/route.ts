/**
 * Server route — proxies POST /v1/orders to the FastAPI backend so the
 * PLOT_API_KEY stays server-side. The browser never sees the key.
 */
import { NextRequest, NextResponse } from "next/server";
import { createOrder } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const order = await createOrder(body);
    return NextResponse.json(order);
  } catch (e: any) {
    return NextResponse.json(
      { detail: e?.message ?? "create_order failed" },
      { status: 500 },
    );
  }
}
