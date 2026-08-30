import type { MetadataRoute } from "next";
import { listAreaHrefs } from "@/lib/docs";

const SITE_URL = "https://htd.vercel.app";
const AREAS = ["padrao-frontend", "padrao-api", "padrao-infraestrutura", "examples"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/creditos`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const docRoutes: MetadataRoute.Sitemap = AREAS.flatMap((area) =>
    listAreaHrefs(area).map((href) => ({
      url: `${SITE_URL}${href}`,
      changeFrequency: "monthly" as const,
      priority: area === "padrao-frontend" ? 0.8 : 0.5,
    })),
  );

  return [...staticRoutes, ...docRoutes];
}
