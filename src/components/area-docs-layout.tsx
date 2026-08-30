import { DocsLayout } from "@/components/docs-layout";
import { getSidebarTree } from "@/lib/docs";
import { getServerLocale } from "@/lib/locale-server";
import type { AreaKey } from "@/lib/i18n";

/**
 * Layout de área dirigido por markdown: a sidebar é gerada a partir da pasta
 * de `.md` da área (ver `getSidebarTree`), não de um `sidebar-tree.ts` fixo.
 */
export async function AreaDocsLayout({ area, children }: { area: AreaKey; children: React.ReactNode }) {
  const locale = await getServerLocale();
  return (
    <DocsLayout activeHref={`/${area}`} area={area} sidebarTree={getSidebarTree(area, locale)}>
      {children}
    </DocsLayout>
  );
}
