"use client";

import { useLocale } from "./locale-provider";

/**
 * `translated` vem do server (`getDoc`, ver `docs.ts`): `true` quando a
 * página realmente tem uma versão `-en` e ela foi servida, `false` quando
 * caiu pro `.md` em português por falta de tradução ainda. Só mostra o
 * aviso nesse segundo caso — sem isso o aviso aparecia em toda página com
 * locale=en, mesmo nas que já foram traduzidas de verdade.
 */
export function PtOnlyNotice({ translated }: { translated: boolean }) {
  const { locale, t } = useLocale();
  if (locale !== "en" || translated) return null;
  return <div className="pt-only-notice">{t.ptOnlyNotice}</div>;
}
