"use client";

/**
 * ROI calculator — interactive widget that shows the Section 5.5 economic
 * story live. User picks postcard volume, close rate, and AOV; widget
 * computes Plot's expected return and lays it next to commodity direct mail.
 *
 * The narrative anchor: Plot is 3x the per-piece price ($1.50 vs $0.50)
 * but 3-7x cheaper per response because enrichment-filtered audiences
 * convert at ~5% vs 0.5% blast.
 *
 * All math is dollar-denominated, integer-rounded for display, but kept
 * as floats internally so the per-response cost reads correctly when
 * volumes and rates are small.
 */

import { useState } from "react";

const PLOT_PRICE = 1.5;          // per piece
const PLOT_RESPONSE = 0.05;      // 5% — Plot enrichment-filtered baseline
const COMMODITY_PRICE = 0.75;    // mid-range Vistaprint-style
const COMMODITY_RESPONSE = 0.005; // 0.5% — blast direct mail to ZIP

const VOLUME_MIN = 500;
const VOLUME_MAX = 25_000;
const VOLUME_STEP = 500;
const VOLUME_DEFAULT = 5_000;

const CLOSE_MIN = 10;
const CLOSE_MAX = 50;
const CLOSE_STEP = 1;
const CLOSE_DEFAULT = 25;

// $400 reflects a typical residential pool service ticket (clean + minor
// repair). Customers tune for their own job mix; this number is a sane
// pool-vertical default rather than industry-wide truth.
const AOV_DEFAULT = 400;

type Vendor = {
  label: string;
  pricePerPiece: number;
  responseRate: number;
  // What the audience filter is — distinguishes the two columns visually.
  audience: string;
};

const PLOT: Vendor = {
  label: "Plot",
  pricePerPiece: PLOT_PRICE,
  responseRate: PLOT_RESPONSE,
  audience: "Verified pool · enrichment-filtered",
};

const COMMODITY: Vendor = {
  label: "Commodity direct mail",
  pricePerPiece: COMMODITY_PRICE,
  responseRate: COMMODITY_RESPONSE,
  audience: "Every house in the ZIP · no filter",
};

type Outcome = {
  cost: number;
  responses: number;
  closedJobs: number;
  revenue: number;
  roi: number;            // multiple of cost
  costPerResponse: number;
};

function computeOutcome(
  v: Vendor,
  volume: number,
  closeRate: number,
  aov: number,
): Outcome {
  const cost = v.pricePerPiece * volume;
  const responses = v.responseRate * volume;
  const closedJobs = responses * closeRate;
  const revenue = closedJobs * aov;
  const roi = cost > 0 ? revenue / cost : 0;
  const costPerResponse = responses > 0 ? cost / responses : 0;
  return { cost, responses, closedJobs, revenue, roi, costPerResponse };
}

export function ROICalculator() {
  const [volume, setVolume] = useState<number>(VOLUME_DEFAULT);
  const [closePct, setClosePct] = useState<number>(CLOSE_DEFAULT);
  const [aov, setAov] = useState<number>(AOV_DEFAULT);

  const closeRate = closePct / 100;

  const plotOutcome = computeOutcome(PLOT, volume, closeRate, aov);
  const commodityOutcome = computeOutcome(COMMODITY, volume, closeRate, aov);

  // Multiple-cheaper-per-response — the headline number.
  const cheaperBy =
    plotOutcome.costPerResponse > 0
      ? commodityOutcome.costPerResponse / plotOutcome.costPerResponse
      : 0;

  return (
    <section
      id="roi"
      className="border-b rule bg-[var(--color-paper)]"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
        <div className="grid lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-7">
            <p className="legend mb-6">/ ROI calculator</p>
            <h2 className="mb-6">
              $1.50 a postcard.{" "}
              <span className="italic text-[var(--color-signal)]">
                ~$30 per response
              </span>
              .
            </h2>
            <p className="text-lg leading-relaxed max-w-2xl">
              <span className="em-dash" />
              Plot costs 3× commodity direct mail per piece, and earns it back
              5-10× over because the audience is filtered before mailing. Tune
              the inputs to your business and watch the cost-per-response
              gap widen.
            </p>
          </div>
        </div>

        <div className="border rule bg-[var(--color-paper)]">
          <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            {/* Inputs ---------------------------------------------- */}
            <div className="p-8 lg:p-10 lg:border-r rule">
              <p className="legend mb-6">/ Your inputs</p>

              <FieldSlider
                label="Postcards per month"
                value={volume}
                min={VOLUME_MIN}
                max={VOLUME_MAX}
                step={VOLUME_STEP}
                onChange={setVolume}
                format={(n) => n.toLocaleString()}
              />

              <FieldStatic
                label="Expected response rate"
                value="5%"
                hint="Plot's enrichment-filtered baseline (warm + filtered audience). Not user-tunable — locked to the brief."
              />

              <FieldSlider
                label="Close rate"
                value={closePct}
                min={CLOSE_MIN}
                max={CLOSE_MAX}
                step={CLOSE_STEP}
                onChange={setClosePct}
                format={(n) => `${n}%`}
                hint="Of the prospects who respond, the share you close into a paid job."
              />

              <FieldNumber
                label="Average job value"
                value={aov}
                onChange={setAov}
                prefix="$"
                hint="Default $400 reflects a typical residential pool service ticket. Override for your mix."
              />
            </div>

            {/* Outputs --------------------------------------------- */}
            <div className="p-8 lg:p-10 bg-[var(--color-deep)] text-[var(--color-paper)]">
              <p className="legend-on-ink mb-6">/ Your projected month</p>

              <div className="grid grid-cols-2 gap-px bg-[var(--color-paper)]/15 mb-8">
                <BigStat
                  value={`${cheaperBy.toFixed(1)}×`}
                  label="cheaper per response vs commodity mail"
                  signal
                />
                <BigStat
                  value={`$${Math.round(plotOutcome.costPerResponse).toLocaleString()}`}
                  label="Plot cost per response"
                  signal
                />
                <BigStat
                  value={`${plotOutcome.roi.toFixed(1)}×`}
                  label="ROI multiple (revenue / cost)"
                />
                <BigStat
                  value={`$${Math.round(plotOutcome.revenue).toLocaleString()}`}
                  label="projected monthly revenue"
                />
              </div>

              <p className="legend-on-ink mb-3">/ Side-by-side</p>
              <ComparisonRow
                vendor={PLOT}
                outcome={plotOutcome}
                highlight
              />
              <ComparisonRow
                vendor={COMMODITY}
                outcome={commodityOutcome}
              />

              <p className="legend-on-ink mt-6 text-[var(--color-paper)]/60 text-xs leading-relaxed">
                Commodity baseline: ~$0.75/piece, 0.5% response — typical
                Vistaprint-style blast to a full ZIP with no audience
                filtering. Plot's response rate assumes the enrichment
                stack (FEMA flood zone, ACS income tier, code violations,
                tax delinquency, storm history) running before mail.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Subcomponents                                                       */
/* ------------------------------------------------------------------ */

function FieldSlider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (n: number) => void;
  format: (n: number) => string;
  hint?: string;
}) {
  return (
    <label className="block mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <span className="legend">{label}</span>
        <span className="font-display text-2xl text-[var(--color-ink)]">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--color-signal)]"
      />
      {hint && (
        <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
          {hint}
        </p>
      )}
    </label>
  );
}

function FieldNumber({
  label,
  value,
  onChange,
  prefix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  hint?: string;
}) {
  return (
    <label className="block mb-6">
      <span className="legend mb-2 block">{label}</span>
      <div className="flex items-baseline">
        {prefix && (
          <span className="font-display text-2xl text-[var(--color-muted)] mr-1">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => {
            const n = Number(e.target.value);
            onChange(Number.isFinite(n) && n >= 0 ? n : 0);
          }}
          className="w-full bg-transparent border-b rule outline-none px-0 py-1 font-display text-2xl text-[var(--color-ink)] focus:border-[var(--color-signal)]"
        />
      </div>
      {hint && (
        <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
          {hint}
        </p>
      )}
    </label>
  );
}

function FieldStatic({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="block mb-6">
      <div className="flex items-baseline justify-between mb-2">
        <span className="legend">{label}</span>
        <span className="font-display text-2xl text-[var(--color-muted)]">
          {value}
        </span>
      </div>
      <div className="w-full h-px bg-[var(--color-hairline)]" />
      {hint && (
        <p className="text-xs text-[var(--color-muted)] mt-2 leading-relaxed">
          {hint}
        </p>
      )}
    </div>
  );
}

function BigStat({
  value,
  label,
  signal,
}: {
  value: string;
  label: string;
  signal?: boolean;
}) {
  return (
    <div className="bg-[var(--color-deep)] p-6">
      <p
        className={`font-display text-4xl lg:text-5xl leading-none mb-2 ${
          signal ? "text-[var(--color-signal)]" : "text-[var(--color-paper)]"
        }`}
      >
        {value}
      </p>
      <p className="legend-on-ink text-[var(--color-paper)]/70">{label}</p>
    </div>
  );
}

function ComparisonRow({
  vendor,
  outcome,
  highlight,
}: {
  vendor: Vendor;
  outcome: Outcome;
  highlight?: boolean;
}) {
  return (
    <div
      className={`grid grid-cols-[minmax(140px,1.4fr)_1fr_1fr_1fr] gap-4 py-4 border-b border-[var(--color-paper)]/15 last:border-b-0 ${
        highlight ? "" : "opacity-70"
      }`}
    >
      <div>
        <p
          className={`text-base ${
            highlight
              ? "text-[var(--color-signal)] font-medium"
              : "text-[var(--color-paper)]"
          }`}
        >
          {vendor.label}
        </p>
        <p className="legend-on-ink text-xs mt-1 text-[var(--color-paper)]/60">
          {vendor.audience}
        </p>
      </div>
      <Cell
        big={`$${Math.round(outcome.cost).toLocaleString()}`}
        small="cost / mo"
      />
      <Cell
        big={`${Math.round(outcome.responses).toLocaleString()}`}
        small="responses"
      />
      <Cell
        big={`$${Math.round(outcome.costPerResponse).toLocaleString()}`}
        small="$ / response"
        signal={highlight}
      />
    </div>
  );
}

function Cell({
  big,
  small,
  signal,
}: {
  big: string;
  small: string;
  signal?: boolean;
}) {
  return (
    <div>
      <p
        className={`font-display text-xl leading-none ${
          signal ? "text-[var(--color-signal)]" : "text-[var(--color-paper)]"
        }`}
      >
        {big}
      </p>
      <p className="legend-on-ink text-xs mt-1 text-[var(--color-paper)]/60">
        {small}
      </p>
    </div>
  );
}
