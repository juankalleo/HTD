import { getSidebarTree } from "@/lib/docs";
import { dictionaries, type Locale } from "@/lib/i18n";
import type { SidebarItem } from "@/components/sidebar";
import type { AreaKey } from "@/lib/i18n";

/**
 * Índice global de busca do command palette (⌘K). Reusa `getSidebarTree`
 * (mesma árvore que a sidebar de cada área já mostra) em vez de escanear o
 * disco de novo — só achata em uma lista única, com o nome da área como
 * grupo.
 */

export type SearchEntry = {
  label: string;
  href: string;
  group: string;
};

const SEARCHABLE_AREAS: AreaKey[] = [
  "padrao-frontend",
  "padrao-api",
  "padrao-banco-de-dados",
  "padrao-infraestrutura",
  "examples",
];

function flattenEntries(items: SidebarItem[], group: string, out: SearchEntry[]): void {
  for (const item of items) {
    if (item.href) out.push({ label: item.label, href: item.href, group });
    if (item.children) flattenEntries(item.children, group, out);
  }
}

export function getGlobalSearchIndex(locale: Locale): SearchEntry[] {
  const groupNames = dictionaries[locale].nav.areas;
  const entries: SearchEntry[] =
    locale === "pt"
      ? [
          { label: "How to Dev", href: "/", group: "How to Dev" },
          { label: "Aprenda desenvolvimento de software", href: "/aprenda", group: "How to Dev" },
          { label: "Desenvolvimento frontend", href: "/frontend", group: "How to Dev" },
          { label: "Desenvolvimento de API", href: "/api", group: "How to Dev" },
          { label: "Banco de dados", href: "/database", group: "How to Dev" },
          { label: "Segurança de software", href: "/security", group: "How to Dev" },
          { label: "Infraestrutura e deploy", href: "/infrastructure", group: "How to Dev" },
          { label: "Sobre o How to Dev", href: "/about", group: "How to Dev" },
        ]
      : [
          { label: "How to Dev", href: "/", group: "How to Dev" },
          { label: "Learn Software Development", href: "/aprenda", group: "How to Dev" },
          { label: "Frontend Development", href: "/frontend", group: "How to Dev" },
          { label: "API Development", href: "/api", group: "How to Dev" },
          { label: "Database Development", href: "/database", group: "How to Dev" },
          { label: "Software Security", href: "/security", group: "How to Dev" },
          { label: "Infrastructure and Deployment", href: "/infrastructure", group: "How to Dev" },
          { label: "About How to Dev", href: "/about", group: "How to Dev" },
        ];
  for (const area of SEARCHABLE_AREAS) {
    const tree = getSidebarTree(area, locale);
    flattenEntries(tree, groupNames[area], entries);
  }
  return entries;
}
