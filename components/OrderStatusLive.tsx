"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/api";

const POLL_MS = 8000;
const TERMINAL = new Set(["done", "failed"]);

export function OrderStatusLive({ initial }: { initial: Order }) {
  const [order, setOrder] = useState<Order>(initial);

  useEffect(() => {
    if (TERMINAL.has(order.state)) return;
    const t = setInterval(async () => {
      const r = await fetch(`/api/orders/${order.id}`, { cache: "no-store" });
      if (!r.ok) return;
      const o: Order = await r.json();
      setOrder(o);
    }, POLL_MS);
    return () => clearInterval(t);
  }, [order.id, order.state]);

  return (
    <>
      <Progress order={order} />
      {order.state === "done" && (
        <div className="mt-12 flex flex-col sm:flex-row gap-3">
          <a
            href={`/api/orders/${order.id}/leads.csv`}
            className="btn-ink"
            download
          >
            Download CSV →
          </a>
          <a href="mailto:hello@get-plot.com" className="btn-ghost">
            Report a wrong row ↳
          </a>
        </div>
      )}
      {order.state === "pending_payment" && order.stripe_checkout_url && (
        <a href={order.stripe_checkout_url} className="btn-ink">
          Continue to checkout →
        </a>
      )}
      {order.state === "failed" && order.error_message && (
        <pre className="mt-12 border rule p-6 font-mono text-xs whitespace-pre-wrap text-[var(--color-muted)] max-h-96 overflow-y-auto">
          {order.error_message}
        </pre>
      )}
    </>
  );
}

function Progress({ order }: { order: Order }) {
  const steps = ["pending_payment", "queued", "running", "done"] as const;
  const current = steps.indexOf(order.state as (typeof steps)[number]);
  const labels = ["Created", "Paid", "Scanning", "Delivered"];
  return (
    <div className="border rule bg-[var(--color-paper)] p-6 mt-2">
      <div className="grid grid-cols-4 gap-px bg-[var(--color-hairline)]">
        {steps.map((s, i) => {
          const active = order.state === s;
          const done = current > i && order.state !== "failed";
          const failed = order.state === "failed" && i === Math.max(current, 0);
          return (
            <div
              key={s}
              className={`p-6 ${active ? "bg-[var(--color-deep)] text-[var(--color-paper)]" :
                done ? "bg-[var(--color-paper)]" : "bg-[var(--color-paper)]/60"}`}
            >
              <p className={`legend ${active ? "legend-on-ink" : ""} ${
                failed ? "text-[var(--color-signal)]" : ""
              }`}>{i + 1}</p>
              <p className={`mt-2 font-display text-2xl leading-none ${
                done || active ? "" : "text-[var(--color-muted)]"
              } ${active ? "text-[var(--color-paper)]" : ""}`}>{labels[i]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
