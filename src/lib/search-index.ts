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
  const entries: SearchEntry[] = [
    { label: "How to Dev", href: "/", group: "How to Dev" },
    { label: "Developer Roadmap", href: "/developer-roadmap", group: "How to Dev" },
    { label: "Learn Software Development", href: "/aprenda", group: "How to Dev" },
  ];
  for (const area of SEARCHABLE_AREAS) {
    const tree = getSidebarTree(area, locale);
    flattenEntries(tree, groupNames[area], entries);
  }
  return entries;
}
