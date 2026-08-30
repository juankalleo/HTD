"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, dictionaries, type Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof dictionaries)[Locale];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Sempre nasce em `DEFAULT_LOCALE` (inglês) — igual no server e no client,
 * pra não dar hydration mismatch. Só depois de montado é que lê o
 * `localStorage` e troca pra "pt" se for a preferência salva; quem volta
 * já em PT vê um flash rápido de inglês na primeira carga, aceitável dado
 * que o padrão do site é inglês mesmo.
 */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (stored === "pt" || stored === "en") {
        setLocaleState(stored);
        document.documentElement.setAttribute("lang", stored === "pt" ? "pt-BR" : "en");
      }
    } catch {
      // localStorage indisponível — fica no padrão (inglês).
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    document.documentElement.setAttribute("lang", next === "pt" ? "pt-BR" : "en");
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // troca só não persiste entre visitas.
    }
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
