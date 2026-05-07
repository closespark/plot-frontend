import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Allow R2 + Mapbox + Microsoft Planetary Computer images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "api.mapbox.com" },
      { protocol: "https", hostname: "*.blob.core.windows.net" },
    ],
  },
  // Pin the workspace root so Turbopack ignores any stray ~/package-lock.json
  turbopack: { root: path.resolve(__dirname) },
  // Promoted from experimental in Next 16
  typedRoutes: true,
};

export default nextConfig;
