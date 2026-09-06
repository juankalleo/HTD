import type { ComponentType } from "react";

export type LessonMeta = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
};

export type LessonModule = {
  meta: LessonMeta;
  Component: ComponentType;
};
