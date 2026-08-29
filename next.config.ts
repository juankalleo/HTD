import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  async headers() {
    return [
      {
        // A barreira real é o Basic Auth em proxy.ts — estes são
        // reforços de baixo custo (ver docs-frontend/seguranca/
        // PROTECAO-DA-WIKI.md#outras-camadas-defesa-em-profundidade-não-a-proteção-principal).
        source: "/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
