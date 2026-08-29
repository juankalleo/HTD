import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MarkdownView } from "@/components/markdown-view";
import { getDoc, getHeadings, getAreaConfig } from "@/lib/docs";

/**
 * Renderiza um documento de área a partir do markdown. Reutiliza o
 * `ArticleLayout` existente (header, TOC, tema) — o conteúdo vem 100% do `.md`.
 */
export function AreaDoc({ area, slug }: { area: string; slug: string[] | undefined }) {
  const s = slug ?? [];
  const doc = getDoc(area, s);
  if (!doc) notFound();
  const cfg = getAreaConfig(area);
  const toc = getHeadings(doc.content);
  // Diretório que contém o doc atual (sem o próprio arquivo) — base pra
  // resolver link relativo entre `.md`s (ver `resolveDocHref` em MarkdownView).
  const basePath = `/${area}/${doc.baseSlug.join("/")}`;
  return (
    <ArticleLayout title={doc.title} data={doc.date} cargo={cfg.cargo} area={cfg.area} toc={toc} video={doc.video}>
      <MarkdownView content={doc.content} basePath={basePath} />
    </ArticleLayout>
  );
}
