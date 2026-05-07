import Link from "next/link";
import { DashboardMockup, DashboardRowZoom } from "@/components/DashboardMockup";

export const metadata = {
  title: "Plot — pool customer software that finds homes for you",
  description:
    "We watch every pool in your service area. When a homeowner just sold, " +
    "fired their pool guy, or a freeze hit — we mail them a postcard you've " +
    "approved. $1.50 per postcard, all-in. Built for the pool guy with one truck and a route.",
};

export default function Page() {
  return (
    <>
      {/* 1. HERO — split-pane, screenshot right, copy left ------------- */}
      <section className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="legend mb-6">/ Plot for pool service</p>
            <h1 className="mb-8">
              Find pool customers before<br />they go shopping.
            </h1>
            <p className="text-lg leading-relaxed max-w-[48ch] mb-10">
              Plot watches every pool in your service area. When a homeowner
              just sold, fired their pool guy, or a freeze rolls in — we mail
              them a postcard you've approved. You see every row before it
              ships.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link href={"/start" as any} className="btn-ink">Start free trial →</Link>
              <Link href={"/proof" as any} className="btn-ghost">See a sample</Link>
            </div>
            <p className="legend">
              Card on file. No charge until you approve your first paid batch.
              First 5 postcards on us.
            </p>
          </div>
          <div className="lg:pl-4">
            <DashboardMockup />
          </div>
        </div>
      </section>

      {/* 2. WHAT YOU'LL SEE — single row at full size ------------------ */}
      <section className="border-b rule bg-[var(--color-paper)]/40">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <div className="max-w-3xl mb-12">
            <p className="legend mb-6">/ What you'll see</p>
            <h2 className="mb-6">This is the row you approve.</h2>
            <p className="text-lg leading-relaxed text-[var(--color-muted)]">
              Every row in your dashboard ships with the satellite photo of the
              pool, the address, and the reason we'd mail it. Reject anything
              that doesn't look right. We only mail what you approve.
            </p>
          </div>
          <DashboardRowZoom />
        </div>
      </section>

      {/* 3. HOW IT WORKS — three plain-verb steps --------------------- */}
      <section id="how" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-20">
          <div className="max-w-3xl mb-12">
            <p className="legend mb-6">/ How it works</p>
            <h2 className="mb-6">Three steps. No tech background needed.</h2>
            <p className="text-lg leading-relaxed text-[var(--color-muted)]">
              You pick the county, you pick the rule, we mail the postcard. The
              dashboard shows you every address before a stamp goes on.
            </p>
          </div>
          <ol className="grid md:grid-cols-3 gap-px bg-[var(--color-hairline)] border rule">
            <Step
              n="01"
              title="Spot the pools"
              body="We watch every pool in your county from satellite. You see what's on the map before anything ships."
            />
            <Step
              n="02"
              title="Pick the rule"
              body="Just-sold homes with pools. Pools that just got a permit pulled. Freeze events. Pick the moments that matter."
            />
            <Step
              n="03"
              title="Mail the postcard"
              body="We design, print, and mail. Tracked phone number and QR on every piece. Responses land back in your CRM."
            />
          </ol>
        </div>
      </section>

      {/* 4. SOCIAL-PROOF STRIP --------------------------------------- */}
      <section className="border-b rule bg-[var(--color-paper)]/60">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-hairline)] border rule">
          <ProofStat label="Counties live" value="24" />
          <ProofStat label="Pools indexed" value="2.04M" />
          <ProofStat label="Beta cohort" value="First 50 pool guys" />
          <ProofStat label="Built for" value="Pool only" />
        </div>
      </section>

      {/* 5. PRICING TEASER ------------------------------------------- */}
      <section id="pricing" className="border-b rule">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
          <div className="max-w-3xl mb-12">
            <p className="legend mb-6">/ Pricing</p>
            <h2 className="mb-6">One price. Cancel anytime.</h2>
            <p className="text-lg leading-relaxed text-[var(--color-muted)]">
              No setup fee. No platform commission. No per-tier feature gating —
              every shop gets the same dashboard, the same review surface, the
              same tracked phone number.
            </p>
          </div>
          <div className="border rule bg-[var(--color-paper)] p-10 max-w-[720px] mx-auto">
            <p className="font-display text-7xl text-[var(--color-signal)] leading-none mb-2">
              $1.50
            </p>
            <p className="legend mb-8">per postcard mailed · all-in</p>
            <ul className="space-y-3 border-t rule pt-6 mb-8">
              <Bullet>Verified pool address with the satellite photo</Bullet>
              <Bullet>Designed postcard, print, and USPS postage</Bullet>
              <Bullet>Tracked phone number, QR code, and reply mailer</Bullet>
              <Bullet>Review every row before we mail · cancel any time</Bullet>
            </ul>
            <Link href={"/pricing" as any} className="btn-ghost">See full pricing →</Link>
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA dark band -------------------------------------- */}
      <section className="border-b rule bg-[var(--color-ink)] text-[var(--color-paper)]">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <p className="legend-on-ink mb-6">/ Stop renting leads</p>
            <h2 className="mb-6 text-[var(--color-paper)]">
              Stop renting leads.<br />Own your route.
            </h2>
            <p className="text-lg leading-relaxed text-[var(--color-paper)]/80 max-w-2xl">
              The first 50 pool guys in the beta get a free county scan and the
              first 5 postcards on us. Card on file, no charge until you
              approve your first paid batch. Cancel any time.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
            <Link href={"/start" as any} className="btn-ink-on-ink">
              Start free trial →
            </Link>
            <Link href={"/proof" as any} className="btn-ghost-on-ink">
              See a sample
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

/* ---- helpers ----------------------------------------------------------- */

function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <li className="bg-[var(--color-paper)] p-8 lg:p-10">
      <p className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--color-muted)] mb-6">
        {n}
      </p>
      <h3 className="font-display text-3xl mb-4 leading-tight">{title}</h3>
      <p className="text-base leading-relaxed text-[var(--color-muted)]">{body}</p>
    </li>
  );
}

function ProofStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-paper)] px-6 py-6 flex flex-col gap-1">
      <p className="legend">{label}</p>
      <p className="font-display text-2xl leading-tight">{value}</p>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-base">
      <span className="text-[var(--color-signal)] font-mono">+</span>
      <span>{children}</span>
    </li>
  );
}
