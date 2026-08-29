import type { ReactNode } from "react";
import { ArticleHeader } from "./article-header";
import { Toc, type TocItem } from "./toc";

export function ArticleLayout({
  title,
  data,
  cargo,
  area = "Padrão Frontend",
  toc,
  video,
  children,
}: {
  title: string;
  data: string;
  cargo?: string;
  area?: string;
  toc?: TocItem[];
  video?: string;
  children: ReactNode;
}) {
  const visibleToc = toc && toc.length > 0 ? toc : [{ id: "visao-geral", label: "Visão geral" }];

  return (
    <>
      <main className="col col--7 nexttech-content-main">
        <article>
          <ArticleHeader title={title} data={data} cargo={cargo} area={area} />
          <div id="__blog-post-container" className="markdown">
            {children}
          </div>
        </article>
      </main>
      <div className="col col--2 nexttech-glossary-column">
        <Toc label="Glossário" items={visibleToc} video={video} />
      </div>
    </>
  );
}
