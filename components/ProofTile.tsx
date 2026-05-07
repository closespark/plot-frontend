/**
 * The visual hook: a satellite tile with v32 detection boxes overlaid.
 * Used in the hero and "what the scan sees" section. Boxes are rendered
 * as SVG over the image so the orange signal color matches the rest of
 * the design system (no PNG-baked overlays).
 *
 * Pass `pins` for numbered map-pin markers (the "every pool, pinned" effect)
 * or `boxes` for individual detection rectangles (the "v32 fired here" effect).
 */
type Pin = { x: number; y: number; n: number };
type Box = { x: number; y: number; w: number; h: number; score?: number };

export function ProofTile({
  src,
  alt,
  pins = [],
  boxes = [],
  className = "",
}: {
  src: string;
  alt: string;
  pins?: Pin[];
  boxes?: Box[];
  className?: string;
}) {
  return (
    <figure className={`relative bg-[var(--color-deep)] overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="block w-full h-auto" />
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {boxes.map((b, i) => (
          <rect
            key={`b-${i}`}
            x={b.x} y={b.y} width={b.w} height={b.h}
            fill="none"
            stroke="#ff5500"
            strokeWidth="0.4"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      {pins.map((p, i) => (
        <div
          key={`p-${i}`}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        >
          <span className="pin">{p.n}</span>
        </div>
      ))}
    </figure>
  );
}
