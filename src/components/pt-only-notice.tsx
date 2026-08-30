"use client";

import { useLocale } from "./locale-provider";

/**
 * Conteúdo real das ~90 páginas ainda é só em português (ver decisão de
 * escopo: interface em inglês agora, tradução de conteúdo é etapa
 * separada). Sem isso, quem troca pra EN cai numa parede de texto em PT
 * sem explicação.
 */
export function PtOnlyNotice() {
  const { locale, t } = useLocale();
  if (locale !== "en") return null;
  return <div className="pt-only-notice">{t.ptOnlyNotice}</div>;
}
