"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { useLocale } from "./locale-provider";
import type { SearchEntry } from "@/lib/search-index";

function groupEntries(entries: SearchEntry[]): [string, SearchEntry[]][] {
  const groups = new Map<string, SearchEntry[]>();
  for (const entry of entries) {
    const list = groups.get(entry.group) ?? [];
    list.push(entry);
    groups.set(entry.group, list);
  }
  return Array.from(groups.entries());
}

/**
 * Busca global em command palette (⌘K/Ctrl+K). Botão-gatilho na topbar +
 * modal `cmdk` (headless — todo o visual vem do CSS `.nexttech-command-*`
 * em nexttech.css). `entries` já vem pronto do servidor (ver
 * `getGlobalSearchIndex` em lib/search-index.ts), então a filtragem aqui é
 * só client-side sobre uma lista fixa, sem round-trip nenhum.
 */
export function SearchCommand({ entries }: { entries: SearchEntry[] }) {
  const { t } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.classList.add("nexttech-no-scroll");
    return () => document.documentElement.classList.remove("nexttech-no-scroll");
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const groups = useMemo(() => groupEntries(entries), [entries]);

  const onSelect = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  return (
    <>
      <button type="button" className="nexttech-topbar-search" onClick={() => setOpen(true)}>
        <svg
          className="nexttech-topbar-search__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="nexttech-topbar-search__label">{t.search.buttonLabel}</span>
        <kbd className="nexttech-topbar-search__kbd">{t.search.shortcutHint}</kbd>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        label={t.search.buttonLabel}
        overlayClassName="nexttech-command-overlay"
        contentClassName="nexttech-command-dialog"
      >
        <Command.Input autoFocus value={query} onValueChange={setQuery} placeholder={t.search.placeholder} />
        <Command.List>
          <Command.Empty>{t.search.noResults(query)}</Command.Empty>
          {groups.map(([group, groupEntries]) => (
            <Command.Group key={group} heading={group}>
              {groupEntries.map((entry) => (
                <Command.Item
                  key={entry.href}
                  value={`${entry.group} ${entry.label}`}
                  onSelect={() => onSelect(entry.href)}
                >
                  {entry.label}
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
