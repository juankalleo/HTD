import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n";

/**
 * Locale visto pelo servidor — lido do cookie `htd-locale` (setado por
 * `locale-provider.tsx` a cada troca, além do `localStorage`). Sem isso o
 * server component nunca saberia qual idioma o visitante escolheu, e
 * conteúdo (markdown, sidebar) sempre voltaria em português mesmo com a
 * interface em inglês.
 */
export async function getServerLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_STORAGE_KEY)?.value;
  return value === "pt" || value === "en" ? value : DEFAULT_LOCALE;
}
