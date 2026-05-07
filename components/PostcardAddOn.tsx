"use client";

import { useState } from "react";

// Per-piece pricing snapshot (cents). Mirrors api/postcards/stannp.py
// _PRICE_CENTS_BY_SIZE; refresh together when USPS rates change (Jan/Jul).
const PRICE_CENTS_BY_SIZE = {
  ECONOMY_4X6: 50,
  STANDARD_5X7: 65,
  JUMBO_6X11: 110,
} as const;

type Size = keyof typeof PRICE_CENTS_BY_SIZE;

const SIZE_LABEL: Record<Size, string> = {
  ECONOMY_4X6: "Economy 4×6 — cheapest, USPS Marketing Mail",
  STANDARD_5X7: "Standard 5×7 — bigger image, mid tier",
  JUMBO_6X11: "Jumbo 6×11 — full-bleed, highest open rate",
};

export function PostcardAddOn({
  orderId,
  leadCount,
  postcardConnected,
}: {
  orderId: string;
  leadCount: number;
  postcardConnected: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [size, setSize] = useState<Size>("ECONOMY_4X6");

  if (leadCount <= 0) return null;

  const totalCents = PRICE_CENTS_BY_SIZE[size] * leadCount;
  const totalUsd = (totalCents / 100).toFixed(2);

  return (
    <div className="mt-12 border rule bg-[var(--color-paper)]">
      <div className="p-6 md:p-8">
        <p className="legend mb-3">/ Postcard add-on</p>
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          <div className="flex-1">
            <h3 className="mb-2">
              Mail postcards to all{" "}
              <span className="text-[var(--color-signal)]">{leadCount.toLocaleString()}</span> leads.
            </h3>
            <p className="text-sm leading-relaxed text-[var(--color-muted)] max-w-xl">
              We orchestrate the print and mail. You upload a design once, we
              ship it through Stannp's USPS Marketing Mail rail. Postage included.
            </p>
          </div>
          <div className="md:text-right shrink-0">
            <p className="legend mb-1">From</p>
            <p className="font-display text-3xl text-[var(--color-signal)]">
              ${(0.5 * leadCount).toFixed(2)}
            </p>
            <p className="legend mt-1">{leadCount.toLocaleString()} × $0.50 economy</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {postcardConnected ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn-ink"
            >
              Configure mail-out →
            </button>
          ) : (
            <a href="/settings/integrations" className="btn-ghost">
              Connect Stannp to enable →
            </a>
          )}
          <span className="legend pt-3">
            Optional. Skip and use the CSV download below if you have a mail
            vendor already.
          </span>
        </div>
      </div>

      {open && postcardConnected && (
        <Modal onClose={() => setOpen(false)}>
          <p className="legend mb-3">/ Configure postcard batch</p>
          <h3 className="mb-6">
            Order <span className="font-mono text-base">{orderId}</span> · {leadCount.toLocaleString()} pieces
          </h3>

          <label className="block mb-6">
            <span className="legend mb-2 block">Size</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value as Size)}
              className="w-full bg-[var(--color-paper)] border rule outline-none px-4 py-3 font-display text-lg appearance-none cursor-pointer"
            >
              {(Object.keys(PRICE_CENTS_BY_SIZE) as Size[]).map((s) => (
                <option key={s} value={s}>
                  {SIZE_LABEL[s]} — ${(PRICE_CENTS_BY_SIZE[s] / 100).toFixed(2)}/piece
                </option>
              ))}
            </select>
          </label>

          <div className="border rule bg-[var(--color-deep)] text-[var(--color-paper)] p-6 mb-6">
            <p className="legend-on-ink mb-2">/ Total</p>
            <p className="font-display text-5xl text-[var(--color-signal)]">${totalUsd}</p>
            <p className="legend-on-ink mt-1">
              {leadCount.toLocaleString()} × ${(PRICE_CENTS_BY_SIZE[size] / 100).toFixed(2)} ·
              postage included · USPS Marketing Mail
            </p>
          </div>

          <div className="border rule bg-[var(--color-paper)] p-4 mb-6 font-mono text-xs text-[var(--color-muted)]">
            <p className="legend mb-1 text-[var(--color-signal)]">/ Disconnected mode</p>
            <p className="leading-relaxed">
              Postcard sends aren't wired to a live Stannp account yet. The
              modal demos the flow; clicking "Send" below logs to console
              instead of actually mailing. Email{" "}
              <a href="mailto:hello@get-plot.com" className="text-[var(--color-ink)] underline underline-offset-4">
                hello@get-plot.com
              </a>{" "}
              if you want early access.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                console.log("postcard send (stub)", { orderId, size, totalCents, leadCount });
                setOpen(false);
              }}
              className="btn-ink"
            >
              Send {leadCount.toLocaleString()} postcards · ${totalUsd} →
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-ghost"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-[var(--color-ink)]/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--color-paper)] border rule max-w-xl w-full max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
