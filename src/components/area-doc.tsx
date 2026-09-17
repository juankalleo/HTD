import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MarkdownView } from "@/components/markdown-view";
import { getDoc, getHeadings, getAreaConfig } from "@/lib/docs";
import { getServerLocale } from "@/lib/locale-server";
import { siteUrl } from "@/lib/seo";

/**
 * Renderiza um documento de área a partir do markdown. Reutiliza o
 * `ArticleLayout` existente (header, TOC, tema) — o conteúdo vem 100% do `.md`,
 * na versão `-en` quando ela existe e o locale é inglês (ver `getDoc`).
 */
export async function AreaDoc({ area, slug }: { area: string; slug: string[] | undefined }) {
  const s = slug ?? [];
  const locale = await getServerLocale();
  const doc = getDoc(area, s, locale);
  if (!doc) notFound();
  const cfg = getAreaConfig(area);
  const toc = getHeadings(doc.content);
  const path = `/${area}${s.length ? `/${s.join("/")}` : ""}`;
  const canonical = siteUrl(path);
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${canonical}#article`,
        headline: doc.title,
        description: doc.description,
        mainEntityOfPage: canonical,
        url: canonical,
        inLanguage: locale === "pt" ? "pt-BR" : "en",
        author: { "@id": siteUrl("/#person") },
        publisher: { "@id": siteUrl("/#website") },
        isPartOf: { "@id": siteUrl("/#website") },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "How to Dev",
            item: siteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: cfg.area,
            item: siteUrl(`/${area}`),
          },
          ...(s.length
            ? [
                {
                  "@type": "ListItem",
                  position: 3,
                  name: doc.title,
                  item: canonical,
                },
              ]
            : []),
        ],
      },
    ],
  };
  // Diretório que contém o doc atual (sem o próprio arquivo) — base pra
  // resolver link relativo entre `.md`s (ver `resolveDocHref` em MarkdownView).
  const basePath = `/${area}/${doc.baseSlug.join("/")}`;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      <ArticleLayout
        title={doc.title}
        data={doc.date}
        cargo={cfg.cargo}
        area={cfg.area}
        toc={toc}
        video={doc.video}
        videoEn={doc.videoEn}
        translated={doc.translated}
      >
        <MarkdownView content={doc.content} basePath={basePath} />
      </ArticleLayout>
    </>
  );
}
