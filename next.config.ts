import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite ships WASM and data files that must be loaded from node_modules at runtime.
  serverExternalPackages: ["@electric-sql/pglite", "pg"],
  poweredByHeader: false,
  // Prepared listening mixes are read from disk by the admin importer.
  outputFileTracingIncludes: { "/admin/**": ["./content/audio/**/*"] },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Microphone is needed for the speaking simulator on our own origin only.
          { key: "Permissions-Policy", value: "camera=(), geolocation=(), microphone=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
