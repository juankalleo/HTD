import type { ComponentType } from "react";

export type LessonLevel = "fundamentos" | "intermediario";

export const LEVEL_LABELS: Record<LessonLevel, string> = {
  fundamentos: "Fundamentos",
  intermediario: "Intermediário",
};

export type LessonMeta = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  /**
   * Fundamentos = suficiente pra usar a tecnologia sem se machucar; intermediário
   * aprofunda o que fundamentos deixou em aberto (rede, performance, produção...).
   * Cada trilha tem as duas — controla o agrupamento em /aprenda/[track].
   */
  level: LessonLevel;
};

export type LessonModule = {
  meta: LessonMeta;
  Component: ComponentType;
};
