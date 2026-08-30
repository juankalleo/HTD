import { notFound } from "next/navigation";
import { ArticleLayout } from "@/components/article-layout";
import { MarkdownView } from "@/components/markdown-view";
import { getDoc, getHeadings, getAreaConfig } from "@/lib/docs";
import { getServerLocale } from "@/lib/locale-server";

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
  // Diretório que contém o doc atual (sem o próprio arquivo) — base pra
  // resolver link relativo entre `.md`s (ver `resolveDocHref` em MarkdownView).
  const basePath = `/${area}/${doc.baseSlug.join("/")}`;
  return (
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
  );
}
