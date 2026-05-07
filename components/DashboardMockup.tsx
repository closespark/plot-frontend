/**
 * Live HTML/CSS mock of the /orders/[id] review-rows surface.
 * Used as the hero asset on `/` and `/proof`. Not a screenshot —
 * a live, in-page panel that renders in the same palette as the
 * surrounding marketing.
 *
 * Per `feedback_dont_drop_visual_proof`, the photo column is the
 * load-bearing brand commitment. Per the address-blur work, photo
 * cells are CSS gradients (not real Mapbox tiles) and addresses are
 * redacted street-number-only — so the marketing surface never
 * exposes a real residence.
 */
type RowState = "approved" | "pending" | "rejected";

type Row = {
  address: string;
  signal: string;
  state: RowState;
};

const HERO_ROWS: Row[] = [
  { address: "•••• Sunset Ave, Sacramento CA 95819",  signal: "Just-sold · 11 days",     state: "approved" },
  { address: "•••• Cactus Rd, Glendale AZ 85304",     signal: "Pool · in-ground",         state: "pending"  },
  { address: "•••• Lakeshore Blvd, Tampa FL 33619",   signal: "Hurricane crossing · 48h", state: "rejected" },
];

const STATUS_PILL: Record<RowState, { label: string; cls: string }> = {
  approved: {
    label: "● Approved",
    cls: "bg-[var(--color-signal)]/15 text-[var(--color-signal)]",
  },
  pending: {
    label: "○ Review",
    cls: "bg-[var(--color-ink)]/8 text-[var(--color-ink)]",
  },
  rejected: {
    label: "× Rejected",
    cls: "bg-[var(--color-muted)]/15 text-[var(--color-muted)] line-through",
  },
};

/** Compact dashboard panel — used in the hero. */
export function DashboardMockup({ rows = HERO_ROWS }: { rows?: Row[] }) {
  return (
    <div className="border rule bg-[var(--color-paper)] shadow-[0_2px_0_var(--color-hairline)] overflow-hidden">
      <div className="border-b rule px-4 py-3 flex items-center justify-between bg-[var(--color-paper)]/60">
        <span className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">
          orders / 8d4a3c
        </span>
        <span className="font-mono text-xs tracking-[0.18em] uppercase bg-[var(--color-signal)]/15 text-[var(--color-signal)] px-2 py-1">
          ready · 47 rows
        </span>
      </div>
      <div className="grid grid-cols-[80px_1fr_auto_auto] gap-px bg-[var(--color-hairline)]">
        <Cell head>Photo</Cell>
        <Cell head>Address</Cell>
        <Cell head>Why</Cell>
        <Cell head className="text-right pr-4">Status</Cell>
        {rows.map((r, i) => (
          <RowCells key={i} row={r} />
        ))}
      </div>
      <div className="border-t rule px-4 py-3 flex items-center justify-between bg-[var(--color-paper)]/60">
        <span className="legend">3 of 47 shown</span>
        <span className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Reject</span>
          <span className="font-mono text-xs uppercase tracking-[0.18em] bg-[var(--color-ink)] text-[var(--color-paper)] px-3 py-1.5">Approve batch →</span>
        </span>
      </div>
    </div>
  );
}

/** Single row, large — for the "what you'll see" zoom-in section. */
export function DashboardRowZoom() {
  const r = HERO_ROWS[0];
  return (
    <div className="border rule bg-[var(--color-paper)] overflow-hidden max-w-[960px] mx-auto">
      <div className="border-b rule px-6 py-4 flex items-center justify-between bg-[var(--color-paper)]/60">
        <span className="font-mono text-xs tracking-[0.18em] uppercase text-[var(--color-muted)]">
          orders / 8d4a3c · row 1 of 47
        </span>
        <span className={`font-mono text-xs tracking-[0.18em] uppercase px-3 py-1 ${STATUS_PILL.approved.cls}`}>
          {STATUS_PILL.approved.label}
        </span>
      </div>
      <div className="grid grid-cols-[280px_1fr] gap-px bg-[var(--color-hairline)]">
        <div className="bg-[var(--color-paper)]">
          <PoolPhoto large />
        </div>
        <div className="bg-[var(--color-paper)] px-6 py-6 flex flex-col justify-between gap-6">
          <div>
            <p className="legend mb-2">Address</p>
            <p className="font-display text-2xl leading-tight">{r.address}</p>
          </div>
          <div>
            <p className="legend mb-2">Why we'd mail this one</p>
            <p className="font-mono text-sm">
              <span className="bg-[var(--color-signal)]/15 text-[var(--color-signal)] px-2 py-1 mr-2">●</span>
              {r.signal}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-ink" type="button">Approve</button>
            <button className="btn-ghost" type="button">Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RowCells({ row }: { row: Row }) {
  const dim = row.state === "rejected";
  return (
    <>
      <div className={`bg-[var(--color-paper)] flex items-center justify-center py-3 ${dim ? "opacity-40" : ""}`}>
        <PoolPhoto />
      </div>
      <div className={`bg-[var(--color-paper)] px-3 py-3 font-mono text-xs ${dim ? "opacity-40 line-through" : ""}`}>
        {row.address}
      </div>
      <div className={`bg-[var(--color-paper)] px-3 py-3 font-mono text-[10px] tracking-[0.12em] uppercase text-[var(--color-muted)] ${dim ? "opacity-40" : ""}`}>
        {row.signal}
      </div>
      <div className="bg-[var(--color-paper)] px-3 py-3 text-right">
        <span className={`font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-1 ${STATUS_PILL[row.state].cls}`}>
          {STATUS_PILL[row.state].label}
        </span>
      </div>
    </>
  );
}

function Cell({
  children, head = false, className = "",
}: { children: React.ReactNode; head?: boolean; className?: string }) {
  const base = "px-3 py-2 bg-[var(--color-paper)]";
  const headCls = head
    ? "font-mono text-[10px] tracking-[0.18em] uppercase text-[var(--color-muted)]"
    : "";
  return <div className={`${base} ${headCls} ${className}`}>{children}</div>;
}

/**
 * Stylized pool photo. Renders as a CSS-gradient block — never a
 * real satellite tile. Pool-blue water + concrete coping + grass
 * tones evoke a backyard pool from above without exposing any
 * specific parcel.
 */
function PoolPhoto({ large = false }: { large?: boolean }) {
  const dim = large ? "h-[280px] w-full" : "h-[56px] w-[56px]";
  return (
    <div
      className={`${dim} relative overflow-hidden`}
      style={{
        backgroundImage: [
          "radial-gradient(ellipse 55% 38% at 52% 55%, #4a9bb5 0%, #6db5cd 35%, transparent 65%)",
          "radial-gradient(ellipse 70% 50% at 50% 50%, #c8b896 0%, #b8a884 50%, transparent 100%)",
          "linear-gradient(135deg, #6f8a5a 0%, #8aa470 50%, #6f8a5a 100%)",
        ].join(", "),
        filter: "blur(0.6px) saturate(0.85)",
      }}
    >
      {/* Subtle noise via CSS — keeps the panel from looking like clipart. */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-conic-gradient(from 0deg at 50% 50%, rgba(0,0,0,0.05) 0deg 8deg, transparent 8deg 16deg)",
        }}
      />
    </div>
  );
}
