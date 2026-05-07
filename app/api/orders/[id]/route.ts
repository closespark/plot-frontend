import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/api";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const o = await getOrder(id);
    return NextResponse.json(o);
  } catch (e: any) {
    return NextResponse.json({ detail: e?.message ?? "lookup failed" }, { status: 404 });
  }
}
