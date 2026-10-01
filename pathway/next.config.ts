import type { NextConfig } from "next";
import path from "node:path";

// PREVIEW_EXPORT=1 produces a static export (out/) — used for the Netlify review deployment.
const isExport = process.env.PREVIEW_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const, trailingSlash: true } : {}),
  images: { unoptimized: isExport },
  poweredByHeader: false,
  // This app is isolated from the Agency app at the repository root.
  turbopack: { root: path.join(__dirname) },
};

export default nextConfig;
