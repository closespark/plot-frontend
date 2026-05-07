import { NextRequest, NextResponse } from "next/server";
import { ApiError, getOrder } from "@/lib/api";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const o = await getOrder(id);
    return NextResponse.json(o);
  } catch (e: any) {
    // Forward upstream status (404 for unknown id, 503 for backend down, etc).
    // Never blanket-404 — that hid backend outages as "order not found".
    if (e instanceof ApiError) {
      return NextResponse.json({ detail: e.detail }, { status: e.status });
    }
    return NextResponse.json({ detail: e?.message ?? "lookup failed" }, { status: 502 });
  }
}
