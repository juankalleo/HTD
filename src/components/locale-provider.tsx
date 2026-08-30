"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_STORAGE_KEY, dictionaries, type Locale } from "@/lib/i18n";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof dictionaries)[Locale];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * `initialLocale` vem do server (root `layout.tsx`, que já leu o cookie
 * `htd-locale` via `next/headers` pra renderizar a página inteira — chrome
 * E conteúdo markdown — no idioma certo). Nascer com esse valor em vez de
 * um padrão fixo é o que evita tanto hydration mismatch (client e server
 * concordam de cara) quanto o flash de idioma errado que existia antes.
 */
export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  function setLocale(next: Locale) {
    setLocaleState(next);
    document.documentElement.setAttribute("lang", next === "pt" ? "pt-BR" : "en");
    try {
      document.cookie = `${LOCALE_STORAGE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`;
    } catch {
      // cookie indisponível — troca só não persiste entre visitas.
    }
    // Conteúdo de página (markdown, sidebar) é lido no server a partir do
    // cookie — sem isso a troca só mudaria o chrome client-side e o corpo
    // do artigo continuaria no idioma antigo até a próxima navegação.
    router.refresh();
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
