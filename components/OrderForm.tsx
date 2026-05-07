"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type County = { key: string; state: string; county: string };

export function OrderForm({ counties }: { counties: County[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function action(form: FormData) {
    setError(null);
    const email = form.get("email") as string;
    const county = form.get("county") as string;
    const min_score = Number(form.get("min_score") || 0.30);

    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ customer_email: email, county, min_score }),
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
