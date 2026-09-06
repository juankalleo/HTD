import type { TrackSlug } from "./tracks";
import type { LessonModule } from "./types";
import { GIT_LESSONS } from "./git";
import { JAVASCRIPT_LESSONS } from "./javascript";
import { TYPESCRIPT_LESSONS } from "./typescript";
import { NETWORKING_LESSONS } from "./networking";
import { FRONTEND_LESSONS } from "./frontend";
import { SQL_LESSONS } from "./sql";
import { RAILS_LESSONS } from "./rails";
import { DOCKER_LESSONS } from "./docker";

export const TRACK_LESSONS: Record<TrackSlug, LessonModule[]> = {
  git: GIT_LESSONS,
  javascript: JAVASCRIPT_LESSONS,
  typescript: TYPESCRIPT_LESSONS,
  networking: NETWORKING_LESSONS,
  frontend: FRONTEND_LESSONS,
  sql: SQL_LESSONS,
  rails: RAILS_LESSONS,
  docker: DOCKER_LESSONS,
};

export function getTrackLessons(track: string): LessonModule[] {
  return TRACK_LESSONS[track as TrackSlug] ?? [];
}

export function getLesson(track: string, lessonSlug: string): LessonModule | undefined {
  return getTrackLessons(track).find((lesson) => lesson.meta.slug === lessonSlug);
}
