import type { MetadataRoute } from "next";
import { listAreaHrefs } from "@/lib/docs";
import { TRACKS } from "@/content/aprenda/tracks";
import { getTrackLessons } from "@/content/aprenda/registry";
import { siteUrl } from "@/lib/seo";

const AREAS = ["padrao-frontend", "padrao-api", "padrao-banco-de-dados", "padrao-infraestrutura", "examples"];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("/frontend"), changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/api"), changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/database"), changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/security"), changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/infrastructure"), changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/aprenda"), changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/creditos"), changeFrequency: "monthly", priority: 0.3 },
  ];

  const docRoutes: MetadataRoute.Sitemap = AREAS.flatMap((area) =>
    listAreaHrefs(area).map((href) => ({
      url: siteUrl(href),
      changeFrequency: "monthly" as const,
      priority: area === "padrao-frontend" ? 0.8 : 0.5,
    })),
  );

  const aprendaRoutes: MetadataRoute.Sitemap = TRACKS.flatMap((track) => [
    { url: siteUrl(`/aprenda/${track.slug}`), changeFrequency: "weekly" as const, priority: 0.7 },
    ...getTrackLessons(track.slug).map((lessonModule) => ({
      url: siteUrl(`/aprenda/${track.slug}/${lessonModule.meta.slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  return [...staticRoutes, ...docRoutes, ...aprendaRoutes];
}
