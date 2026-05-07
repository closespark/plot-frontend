"use client";

import { useEffect, useState } from "react";
import type { Order } from "@/lib/api";

const POLL_MS = 8000;
// Show a "lost connection" banner after this many back-to-back failed polls.
// 3 * 8s = ~24s of silence — long enough to ride out a brief network blip,
// short enough that the user knows the page isn't dead.
const POLL_FAIL_WARN_THRESHOLD = 3;
// After this long in `running`, show stuck-worker copy (typical run is
// 30 min – 6 hr depending on county size; past 6h something's wrong).
const STUCK_RUNNING_AFTER_SEC = 6 * 60 * 60;
const TERMINAL = new Set(["done", "failed"]);

export function OrderStatusLive({ initial }: { initial: Order }) {
  const [order, setOrder] = useState<Order>(initial);
  const [pollFails, setPollFails] = useState(0);

  useEffect(() => {
    if (TERMINAL.has(order.state)) return;
    const t = setInterval(async () => {
      try {
        const r = await fetch(`/api/orders/${order.id}`, { cache: "no-store" });
        if (!r.ok) {
          setPollFails((n) => n + 1);
          return;
        }
        const o: Order = await r.json();
        setOrder(o);
        setPollFails(0);
      } catch {
        setPollFails((n) => n + 1);
      }
    }, POLL_MS);
    return () => clearInterval(t);
  }, [order.id, order.state]);

  const stuckRunning =
    order.state === "running" &&
    order.started_at != null &&
    Date.now() / 1000 - order.started_at > STUCK_RUNNING_AFTER_SEC;

  return (
    <>
      <Progress order={order} />
      {pollFails >= POLL_FAIL_WARN_THRESHOLD && !TERMINAL.has(order.state) && (
        <p className="border rule mt-6 px-6 py-4 font-mono text-sm text-[var(--color-signal)]">
          Can't reach the status API right now ({pollFails} failed checks). Your
          scan is unaffected — refresh in a moment, or check back via the email
          we'll send when it's done.
        </p>
      )}
      {stuckRunning && (
        <p className="border rule mt-6 px-6 py-4 font-mono text-sm text-[var(--color-signal)]">
          This scan has been running longer than expected. Your data is safe and
          we've been alerted — email hello@get-plot.com with order id{" "}
          <span className="text-[var(--color-ink)]">{order.id}</span> if you'd
          like an update.
        </p>
      )}
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
