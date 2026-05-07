import { getOrder } from "@/lib/api";
import { OrderStatusLive } from "@/components/OrderStatusLive";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const STATE_COPY: Record<string, { tag: string; headline: string; body: string }> = {
  pending_payment: {
    tag: "/ Awaiting payment",
    headline: "Order created.\nFinish checkout to start the scan.",
    body: "Your county scan begins the moment Stripe confirms the charge. If you closed the tab by accident, hit the link in your confirmation email.",
  },
  queued: {
    tag: "/ Queued",
    headline: "Paid — your scan is up next.",
    body: "Worker will pick this up within a minute. You'll see live updates here, and an email when the leads are ready.",
  },
  running: {
    tag: "/ Scanning",
    headline: "We're scanning your county now.",
    body: "Pulling parcels, fetching satellite tiles, running v32 inference. ETA depends on county size — typically 30 minutes to 6 hours.",
  },
  done: {
    tag: "/ Complete",
    headline: "Your leads are ready.",
    body: "Download below. The CSV includes a current satellite image URL for every row. Refund anything wrong — flag the parcel ID by email.",
  },
  failed: {
    tag: "/ Issue",
    headline: "Something went wrong on our side.",
    body: "We don't charge for failed scans. Email hello@get-plot.com with this order ID and we'll investigate immediately.",
  },
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let order;
  try {
    order = await getOrder(id);
  } catch {
    notFound();
  }
  const copy = STATE_COPY[order.state] ?? STATE_COPY.queued;

  return (
    <section>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <p className="legend mb-6">{copy.tag}</p>
          <h1 className="mb-8 whitespace-pre-line">{copy.headline}</h1>
          <p className="text-lg leading-relaxed max-w-2xl mb-12">
            <span className="em-dash" />{copy.body}
          </p>

          <OrderStatusLive initial={order} />
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
          <div className="border rule bg-[var(--color-paper)]">
            <Detail label="Order ID" value={order.id} mono />
            <Detail label="County" value={order.county} mono />
            <Detail label="Email" value={order.customer_email} />
            <Detail label="Min confidence" value={order.min_score.toFixed(2)} mono />
            <Detail label="Created" value={fmt(order.created_at)} />
            {order.started_at && <Detail label="Started" value={fmt(order.started_at)} />}
            {order.finished_at && <Detail label="Finished" value={fmt(order.finished_at)} />}
            {order.parcels_total != null && (
              <Detail label="Parcels scanned" value={order.parcels_total.toLocaleString()} />
            )}
            {order.leads_count != null && (
              <Detail label="Verified leads" value={order.leads_count.toLocaleString()} accent />
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function Detail({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
  return (
    <div className="border-b rule last:border-b-0 px-6 py-4 flex justify-between items-baseline gap-4">
      <span className="legend">{label}</span>
      <span className={[
        mono ? "font-mono text-xs" : "text-sm",
        accent ? "text-[var(--color-signal)] font-display text-2xl" : "",
      ].filter(Boolean).join(" ")}>
        {value}
      </span>
    </div>
  );
}

function fmt(unix: number) {
  return new Date(unix * 1000).toLocaleString();
}
