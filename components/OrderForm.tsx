"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type County = { key: string; state: string; county: string };

type ConnectedCrm = { id: string; name: string };

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

  async function action(form: FormData) {
    setError(null);
    const email = form.get("email") as string;
    const county = form.get("county") as string;
    const min_score = Number(form.get("min_score") || 0.30);
    // crm_destination only sent if user opted in; backend ignores unknown
    // fields so this is forward-compatible with the API endpoint that
    // doesn't yet accept it.
    const crm_destination = pushToCrm
      ? (form.get("crm_destination") as string) || null
      : null;

    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        customer_email: email,
        county,
        min_score,
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

      <Field label="Minimum confidence — leave at default unless you know what this does">
        <select
          name="min_score"
          defaultValue="0.30"
          className="w-full bg-[var(--color-paper)] border-0 outline-none px-6 py-5 font-display text-2xl appearance-none cursor-pointer"
        >
          <option value="0.30">0.30 — broadest, includes harder cases (recommended)</option>
          <option value="0.50">0.50 — high confidence only</option>
          <option value="0.70">0.70 — only the obvious ones</option>
        </select>
      </Field>

      <div className="border rule bg-[var(--color-paper)] px-6 py-5">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pushToCrm}
            onChange={(e) => setPushToCrm(e.target.checked)}
            className="mt-1.5 accent-[var(--color-signal)]"
          />
          <span>
            <span className="legend block mb-1">Push leads straight to my CRM</span>
            <span className="text-base text-[var(--color-muted)]">
              Skip the CSV step. New leads land in your CRM tagged{" "}
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
          {pending ? "Starting…" : "Start scan — $15 minimum →"}
        </button>
        <p className="legend pt-4">
          You'll be redirected to Stripe Checkout. Refund anything that's wrong, no questions asked.
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
