"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarItem = {
  label: string;
  href?: string;
  children?: SidebarItem[];
};

/**
 * Filtra a árvore da sidebar por título. Mantém um nó se o próprio rótulo
 * bate com a busca (e aí preserva todos os filhos) ou se algum descendente
 * bate (e aí repassa só os filhos que combinam). Busca insensível a maiúsculas.
 */
function filterTree(items: SidebarItem[], query: string): SidebarItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  const result: SidebarItem[] = [];
  for (const item of items) {
    const children = item.children ? filterTree(item.children, query) : undefined;
    const selfMatch = item.label.toLowerCase().includes(q);
    if (selfMatch) {
      result.push(item);
    } else if (children && children.length > 0) {
      result.push({ ...item, children });
    }
  }
  return result;
}

function SidebarNode({
  item,
  depth = 0,
  forceOpen = false,
}: {
  item: SidebarItem;
  depth?: number;
  forceOpen?: boolean;
}) {
  const pathname = usePathname();
  const hasChildren = !!item.children?.length;
  const isPage = item.href ? !item.href.includes("#") : false;
  const active = isPage && pathname === item.href;
  const childClass = !hasChildren && depth > 0 ? " nexttech-tree-item--child" : "";
  const [openState, setOpen] = useState(true);
  const open = forceOpen || openState;

  return (
    <>
      <div className={`nexttech-tree-item${childClass}${active ? " nexttech-tree-item--active" : ""}`}>
        {hasChildren ? (
          <button
            type="button"
            className={`nexttech-tree-chevron${open ? " nexttech-tree-chevron--open" : " nexttech-tree-chevron--closed"}`}
            aria-label={open ? "Recolher" : "Expandir"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "⌄" : "›"}
          </button>
        ) : (
          <span className="nexttech-tree-dot" aria-hidden="true">
            •
          </span>
        )}
        <span className={hasChildren ? "nexttech-title-icon" : "nexttech-page-icon"} aria-hidden="true" />
        {item.href ? (
          <Link href={item.href} className={hasChildren ? "nexttech-tree-title" : undefined}>
            {item.label}
          </Link>
        ) : (
          <span className={hasChildren ? "nexttech-tree-title" : undefined}>{item.label}</span>
        )}
      </div>
        {hasChildren && open
          ? item.children!.map((child, i) => (
              <SidebarNode key={child.href ?? `${child.label}-${i}`} item={child} depth={depth + 1} forceOpen={forceOpen} />
            ))
          : null}
    </>
  );
}

export function Sidebar({ title, tree }: { title: string; tree: SidebarItem[] }) {
  const [query, setQuery] = useState("");
  const searching = query.trim() !== "";
  const filtered = filterTree(tree, query);

  return (
    <nav className="nexttech-confluence-sidebar thin-scrollbar" aria-label="Navegação de conteúdo">
      <div className="nexttech-sidebar-section">
        <div className="nexttech-space-heading">
          <svg className="nexttech-developer-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}>
            <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Z" />
            <path d="M8.5 9.5 6.5 12l2 2.5M15.5 9.5l2 2.5-2 2.5M13.5 8.5l-3 7" />
          </svg>
          <span>{title}</span>
          <button type="button" aria-label="Mais opções">
            ...
          </button>
        </div>

        <div className="nexttech-content-label">
          <span className="nexttech-content-icon" aria-hidden="true" />
          <span>Conteúdo</span>
        </div>

        <label className="nexttech-search">
          <span className="nexttech-search-icon" aria-hidden="true" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQuery("");
            }}
            placeholder="Pesquisar por título"
            aria-label="Pesquisar por título"
          />
          {searching && (
            <button type="button" className="nexttech-search-clear" aria-label="Limpar busca" onClick={() => setQuery("")}>
              ×
            </button>
          )}
        </label>

        <div className="nexttech-tree">
          {filtered.length > 0 ? (
            filtered.map((item, i) => <SidebarNode key={item.href ?? `${item.label}-${i}`} item={item} forceOpen={searching} />)
          ) : (
            <p className="nexttech-search-empty">Nenhum resultado para “{query}”.</p>
          )}
        </div>
      </div>
    </nav>
  );
}
