"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, type SidebarItem } from "./sidebar";
import { useLocale } from "./locale-provider";
import type { AreaKey } from "@/lib/i18n";

/**
 * No mobile (≤996px) a sidebar de conteúdo não fica mais sempre visível
 * inline (uma caixa de 460px com scroll próprio, cortando item de
 * árvore no meio — a queixa real de "sidebar bugada no mobile"). Vira
 * um botão "Contents" que abre a mesma Sidebar como um painel cheio,
 * do mesmo jeito que o menu do navbar — inclusive a busca por título
 * dela, que antes ficava espremida numa caixinha, agora abre em tela
 * cheia e funciona igual no mobile.
 */
export function DocsSidebarPanel({ area, tree }: { area: AreaKey; tree: SidebarItem[] }) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("nexttech-no-scroll");
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("nexttech-no-scroll");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button type="button" className="nexttech-sidebar-toggle" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        {t.sidebar.contentLabel}
      </button>

      {open && <div className="nexttech-sidebar-backdrop" onClick={() => setOpen(false)} />}

      <aside className={`col col--3 nexttech-space-sidebar${open ? " nexttech-space-sidebar--open" : ""}`}>
        {open && (
          <button type="button" aria-label="Close" className="nexttech-sidebar-panel-close" onClick={() => setOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        )}
        <Sidebar area={area} tree={tree} />
      </aside>
    </>
  );
}
