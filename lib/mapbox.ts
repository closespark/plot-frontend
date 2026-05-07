/**
 * Mapbox marketing-tile URL helper. Mirrors `api/mapbox_url.py`.
 *
 * Tiles are pre-rendered by `scripts/render_mapbox_marketing.py` into R2
 * under `mapbox-marketing/` with the Mapbox attribution strip cropped off
 * (per locked product decision — attribution lives in the site footer for
 * Mapbox/OSM ToS compliance).
 *
 * Set NEXT_PUBLIC_MAPBOX_BASE in the environment to your R2 public bucket
 * URL or CDN domain (e.g. https://cdn.get-plot.com).
 */
const BASE = (process.env.NEXT_PUBLIC_MAPBOX_BASE ?? "").replace(/\/$/, "");
const PREFIX = "mapbox-marketing";

function safe(s: string) {
  return s.replace(/[^a-zA-Z0-9_-]/g, "_");
}

export function mapboxTileUrl(opts: {
  lat: number;
  lon: number;
  label?: string;
  zoom?: number;
  size?: number;
}): string {
  const { lat, lon, label = "adhoc", zoom = 19, size = 640 } = opts;
  return `${BASE}/${PREFIX}/${safe(label)}__${lat.toFixed(5)}_${lon.toFixed(5)}_${zoom}_${size}.jpg`;
}
