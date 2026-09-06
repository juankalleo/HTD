import type { TrackSlug } from "./tracks";
import type { LessonModule } from "./types";
import { FRONTEND_LESSONS } from "./frontend";
import { RAILS_LESSONS } from "./rails";
import { DOCKER_LESSONS } from "./docker";

export const TRACK_LESSONS: Record<TrackSlug, LessonModule[]> = {
  frontend: FRONTEND_LESSONS,
  rails: RAILS_LESSONS,
  docker: DOCKER_LESSONS,
};

export function getTrackLessons(track: string): LessonModule[] {
  return TRACK_LESSONS[track as TrackSlug] ?? [];
}

export function getLesson(track: string, lessonSlug: string): LessonModule | undefined {
  return getTrackLessons(track).find((lesson) => lesson.meta.slug === lessonSlug);
}
