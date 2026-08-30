import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  async headers() {
    return [
      {
        // Site público de propósito (ver docs-frontend/seguranca/
        // PROTECAO-DA-WIKI.md) — sem Basic Auth e sem noindex. Estes
        // headers continuam por padrão de higiene, não como barreira.
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
