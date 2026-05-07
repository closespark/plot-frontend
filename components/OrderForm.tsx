"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type County = { key: string; state: string; county: string };

type ConnectedCrm = { id: string; name: string };

// Postcard volume tiers — flat $1.50/piece, no tier discounts.
// Per `feedback_smb_simple_pricing`: SMB self-serve = flat per-unit, no tiers.
// These are *volume* selections (how many postcards/month), not price tiers.
//
// Tier ladder spans the 1-10-truck pool ICP. A 1-truck shop with ~200
// accounts mailing just-sold neighbor batches lands at 50-200/mo. A multi-
// truck shop running freeze + just-sold + permit triggers across a metro
// county lands at 500-2,500/mo. 5,000/mo is the largest single-county
// addressable footprint we sell at this stage. Bigger volumes are
// multi-county routes — those go through `hello@get-plot.com`.
const VOLUME_TIERS = [
  { value: 50, label: "50", monthly: "$75" },
  { value: 200, label: "200", monthly: "$300" },
  { value: 500, label: "500", monthly: "$750" },
  { value: 1000, label: "1,000", monthly: "$1,500" },
  { value: 2500, label: "2,500", monthly: "$3,750" },
  { value: 5000, label: "5,000", monthly: "$7,500" },
];

export function OrderForm({
  counties,
  connectedCrms = [],
}: {
  counties: County[];
  connectedCrms?: ConnectedCrm[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pushToCrm, setPushToCrm] = useState(false);
  const [volume, setVolume] = useState<number>(200);

  async function action(form: FormData) {
    setError(null);
    const email = form.get("email") as string;
    const county = form.get("county") as string;
    const postcard_volume_monthly = Number(form.get("postcard_volume_monthly") || volume);
    // crm_destination only sent if user opted in; backend ignores unknown
    // fields so this is forward-compatible with the API endpoint that
    // doesn't yet accept it.
    const crm_destination = pushToCrm
      ? (form.get("crm_destination") as string) || null
      : null;

    // Backend `CreateOrderRequest` (api/main.py) does not (yet) accept
    // postcard_volume_monthly or recurring-subscription fields. Pydantic v2
    // defaults to ignoring unknown fields, so we send it anyway — the backend
    // dev wiring up the per-volume Stripe price will already see it in the
    // payload. min_score is pinned at the production default (0.30); the
    // confidence-threshold knob has been removed from the customer surface.
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customer_email: email,
        county,
        min_score: 0.30,
        postcard_volume_monthly,
        ...(crm_destination ? { crm_destination } : {}),
      }),
    });
    if (!r.ok) {
      // Surface the backend's `detail` (e.g. "unsupported county: ...") instead
      // of just the status code. 4xx is the user's fix, 5xx is ours.
      const body = await r.json().catch(() => null);
      const detail = body?.detail || r.statusText || "unknown error";
      const prefix = r.status >= 500 ? "Server error" : "Couldn't start order";
      setError(`${prefix}: ${detail} — if this persists, email hello@get-plot.com`);
      return;
    }
    const order = await r.json();
    if (order.stripe_checkout_url) {
      window.location.href = order.stripe_checkout_url;
    } else {
      router.push(`/orders/${order.id}` as any);
    }
  }

  return (
    <form
      action={(fd) => startTransition(() => action(fd) as unknown as void)}
      className="space-y-px"
    >
      <Field label="Email">
        <input
          name="email"
          type="email"
          required
          placeholder="you@yourcompany.com"
          className="w-full bg-[var(--color-paper)] border-0 outline-none px-6 py-5 font-display text-2xl placeholder:text-[var(--color-muted)]/50"
        />
      </Field>

      <Field label="County">
        <select
          name="county"
          required
          defaultValue=""
          className="w-full bg-[var(--color-paper)] border-0 outline-none px-6 py-5 font-display text-2xl appearance-none cursor-pointer"
        >
          <option value="" disabled>Choose a market…</option>
          {counties.length === 0 && (
            <option disabled>(API offline — try again)</option>
          )}
          {counties.map((c) => (
            <option key={c.key} value={c.key}>
              {c.county} County, {c.state}
            </option>
          ))}
        </select>
      </Field>

      <div className="border rule bg-[var(--color-paper)] px-6 pt-4 pb-5">
        <p className="legend mb-4">Postcards per month — $1.50/piece, all-in</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px bg-[var(--color-hairline)] border rule">
          {VOLUME_TIERS.map((t) => {
            const selected = volume === t.value;
            return (
              <label
                key={t.value}
                className={`cursor-pointer px-4 py-4 flex flex-col items-start justify-between gap-2 transition-colors ${
                  selected
                    ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                    : "bg-[var(--color-paper)] hover:bg-[var(--color-paper)]"
                }`}
              >
                <input
                  type="radio"
                  name="postcard_volume_monthly"
                  value={t.value}
                  checked={selected}
                  onChange={() => setVolume(t.value)}
                  className="sr-only"
                />
                <span
                  className={`font-display text-3xl leading-none ${
                    selected ? "text-[var(--color-paper)]" : "text-[var(--color-ink)]"
                  }`}
                >
                  {t.label}
                </span>
                <span
                  className={`font-mono text-xs tracking-wider uppercase ${
                    selected ? "text-[var(--color-signal)]" : "text-[var(--color-muted)]"
                  }`}
                >
                  {t.monthly}/mo
                </span>
              </label>
            );
          })}
        </div>
        <p className="text-sm text-[var(--color-muted)] mt-3">
          Recurring monthly. Cancel any time. Review every row in your dashboard
          before we mail — reject anything wrong, pay only for what mails.
        </p>
      </div>

      <div className="border rule bg-[var(--color-paper)] px-6 py-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pushToCrm}
            onChange={(e) => setPushToCrm(e.target.checked)}
            className="mt-1.5 accent-[var(--color-signal)]"
          />
          <span>
            <span className="legend block mb-1">Push responses straight to my CRM</span>
            <span className="text-base text-[var(--color-muted)]">
              Tracked-number and QR-code responses land in your CRM tagged{" "}
              <span className="font-mono text-[var(--color-ink)]">Plot</span> as the source.
            </span>
          </span>
        </label>

        {pushToCrm && (
          <div className="mt-5 pl-7">
            {connectedCrms.length > 0 ? (
              <select
                name="crm_destination"
                defaultValue={connectedCrms[0]?.id}
                className="w-full bg-[var(--color-paper)] border rule outline-none px-4 py-3 font-display text-lg appearance-none cursor-pointer"
              >
                {connectedCrms.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            ) : (
              <div className="border rule bg-[var(--color-paper)] px-4 py-3 flex items-center justify-between gap-4">
                <span className="text-sm text-[var(--color-muted)]">
                  No CRMs connected yet — Jobber, Housecall Pro, and HubSpot are supported.
                </span>
                <Link href={"/settings/integrations" as any} className="btn-ghost shrink-0">
                  Connect one →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="border rule bg-[var(--color-paper)] px-6 py-4 mt-6 text-[var(--color-signal)] font-mono text-sm">
          {error}
        </p>
      )}

      <div className="pt-8 flex flex-col sm:flex-row gap-3 items-start">
        <button
          type="submit"
          disabled={pending}
          className="btn-ink disabled:opacity-50"
        >
          {pending ? "Starting…" : `Start mailing — ${VOLUME_TIERS.find((t) => t.value === volume)?.monthly}/mo →`}
        </button>
        <p className="legend pt-4">
          You'll be redirected to Stripe Checkout. Cancel any time. You review every batch before it mails.
        </p>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border rule bg-[var(--color-paper)]">
      <label className="block px-6 pt-4">
        <span className="legend">{label}</span>
      </label>
      {children}
    </div>
  );
}
