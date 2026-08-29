import { DocsLayout } from "@/components/docs-layout";
import { getSidebarTree, getAreaConfig } from "@/lib/docs";

/**
 * Layout de área dirigido por markdown: a sidebar é gerada a partir da pasta
 * de `.md` da área (ver `getSidebarTree`), não de um `sidebar-tree.ts` fixo.
 */
export function AreaDocsLayout({ area, children }: { area: string; children: React.ReactNode }) {
  const cfg = getAreaConfig(area);
  return (
    <DocsLayout
      activeHref={`/${area}`}
      sidebarTitle={cfg.sidebarTitle}
      sidebarTree={getSidebarTree(area)}
    >
      {children}
    </DocsLayout>
  );
}
