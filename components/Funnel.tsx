/**
 * 4-stage workflow diagram for the Plot homepage.
 * Replaces the legacy 3-step "How it works" section.
 *
 * Stages: Detect -> Filter -> Mail -> Hand off.
 * Stage 02 (Filter) is the moat — government enrichment quality filter —
 * and gets a heavier border + signal-orange headline so the eye lands
 * there first.
 *
 * Pure presentational. Server-component compatible (no hooks, no state).
 */

type Stage = {
  n: string;
  metric: string;
  metricLabel: string;
  title: string;
  body: string;
  /** Visually elevate this stage as "the moat" — used for Filter. */
  emphasize?: boolean;
};

const STAGES: Stage[] = [
  {
    n: "01",
    metric: "2.04M",
    metricLabel: "parcels indexed · 23 counties",
    title: "Detect",
    body: "v32 visual ML identifies pools at parcel-level precision in 23 counties.",
  },
  {
    n: "02",
    metric: "5",
    metricLabel: "free public sources · baked in",
    title: "Filter",
    body: "FEMA flood zone, ACS income tier, code violations, tax delinquency, storm history — bad-fit addresses pre-removed before mailing.",
    emphasize: true,
  },
  {
    n: "03",
    metric: "$1.50",
    metricLabel: "per postcard · all-in",
    title: "Mail",
    body: "Design, print, USPS Marketing Mail, tracked phone numbers and QR codes — Stannp does the printing on your behalf.",
  },
  {
    n: "04",
    metric: "3",
    metricLabel: "native CRM integrations",
    title: "Hand off",
    body: "Jobber, Housecall Pro, or HubSpot — qualified responses land where your team already works.",
  },
];

export function Funnel() {
  return (
    <section
      id="funnel"
      className="border-b rule bg-[var(--color-deep)] text-[var(--color-paper)]"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-24">
        <p className="legend-on-ink mb-6">/ How Plot works</p>
        <h2 className="mb-16 max-w-3xl text-[var(--color-paper)]">
          Detect, filter, mail,{" "}
          <span className="italic text-[var(--color-signal)]">hand off</span>.
          <br />
          One pipeline. $1.50 a postcard.
        </h2>

        <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--color-paper)]/15">
          {STAGES.map((stage) => (
            <FunnelStage key={stage.n} stage={stage} />
          ))}
        </ol>

        <p className="legend-on-ink mt-10 max-w-3xl text-[var(--color-paper)]/70">
          The moat is stage 02. Detection is table stakes — every aerial-AI
          vendor has a model. Government-enrichment filtering on top of
          parcel-level detection is what makes a $1.50 mailpiece outperform
          $0.75 commodity direct mail by 5-10×.
        </p>
      </div>
    </section>
  );
}

function FunnelStage({ stage }: { stage: Stage }) {
  // Emphasized stage gets:
  //  - a thicker signal-orange top border (instead of the default hairline)
  //  - signal-orange title color
  //  - a "/ The moat" tag above the number
  //  - signal-orange right-pointing arrow on desktop only (between cards)
  const baseBg = "bg-[var(--color-deep)]";
  const emphasizedBorder = stage.emphasize
    ? "border-t-2 border-[var(--color-signal)]"
    : "border-t border-transparent";

  return (
    <li className={`relative ${baseBg} ${emphasizedBorder} p-10`}>
      <div className="flex items-baseline gap-4 mb-8">
        <span className="legend-on-ink text-[var(--color-signal)] text-sm">
          {stage.n}
        </span>
        <span className="h-px flex-1 bg-[var(--color-paper)]/20" />
        {stage.emphasize && (
          <span className="legend-on-ink text-[var(--color-signal)] text-xs">
            ● The moat
          </span>
        )}
      </div>

      <p className="font-display text-5xl lg:text-6xl text-[var(--color-signal)] leading-none mb-2">
        {stage.metric}
      </p>
      <p className="legend-on-ink mb-8">{stage.metricLabel}</p>

      <h3
        className={`mb-3 ${
          stage.emphasize
            ? "text-[var(--color-signal)]"
            : "text-[var(--color-paper)]"
        }`}
      >
        {stage.title}
      </h3>
      <p className="text-[var(--color-paper)]/70 leading-relaxed text-base">
        {stage.body}
      </p>
    </li>
  );
}
