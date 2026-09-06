import type { MetadataRoute } from "next";
import { listAreaHrefs } from "@/lib/docs";
import { TRACKS } from "@/content/aprenda/tracks";
import { getTrackLessons } from "@/content/aprenda/registry";

const SITE_URL = "https://howtodev.site";
const AREAS = ["padrao-frontend", "padrao-api", "padrao-banco-de-dados", "padrao-infraestrutura", "examples"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/aprenda`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/creditos`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const docRoutes: MetadataRoute.Sitemap = AREAS.flatMap((area) =>
    listAreaHrefs(area).map((href) => ({
      url: `${SITE_URL}${href}`,
      changeFrequency: "monthly" as const,
      priority: area === "padrao-frontend" ? 0.8 : 0.5,
    })),
  );

  const aprendaRoutes: MetadataRoute.Sitemap = TRACKS.flatMap((track) => [
    { url: `${SITE_URL}/aprenda/${track.slug}`, changeFrequency: "weekly" as const, priority: 0.7 },
    ...getTrackLessons(track.slug).map((lessonModule) => ({
      url: `${SITE_URL}/aprenda/${track.slug}/${lessonModule.meta.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  return [...staticRoutes, ...docRoutes, ...aprendaRoutes];
}
