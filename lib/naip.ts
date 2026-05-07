/**
 * NAIP tile URL helper. Mirrors `api/naip_url.py` server-side.
 *
 * Tiles are pre-rendered by `scripts/render_naip.py` into R2 under
 * `naip-marketing/`. The frontend embeds the public URL directly — no
 * API roundtrip.
 *
 * Set NEXT_PUBLIC_NAIP_BASE in the environment to your R2 public bucket
 * URL or CDN domain (e.g. https://cdn.get-plot.com).
 */
const BASE = (process.env.NEXT_PUBLIC_NAIP_BASE ?? "").replace(/\/$/, "");
const PREFIX = "naip-marketing";

function safe(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export function naipTileUrl(opts: {
  lat: number;
  lon: number;
  label?: string;
  fov?: number;
  size?: number;
  format?: "jpeg" | "png";
}): string {
  const { lat, lon, label = "adhoc", fov = 160, size = 640, format = "jpeg" } = opts;
  const ext = format === "png" ? "png" : "jpg";
  return `${BASE}/${PREFIX}/${safe(label)}__${lat.toFixed(5)}_${lon.toFixed(5)}_${fov}_${size}.${ext}`;
}
