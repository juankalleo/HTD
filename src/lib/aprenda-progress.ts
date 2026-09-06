const STORAGE_KEY = "htd-aprenda-progress";

/**
 * Progresso do Aprenda — só existe no localStorage do próprio navegador
 * (o site não tem login/backend). `tracks` guarda conclusão/nota de quiz
 * por lição; `lastVisited` é um campo à parte porque não dá pra derivar
 * "última lição visitada" só olhando o que está marcado como concluído.
 */
export type LessonProgress = {
  completed: boolean;
  quizScore?: { correct: number; total: number };
};

export type Progress = {
  tracks: {
    [track: string]: {
      [lessonSlug: string]: LessonProgress;
    };
  };
  lastVisited?: { track: string; lessonSlug: string; at: number };
};

function readProgress(): Progress {
  if (typeof window === "undefined") return { tracks: {} };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tracks: {} };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return { tracks: parsed.tracks ?? {}, lastVisited: parsed.lastVisited };
  } catch {
    return { tracks: {} };
  }
}

function writeProgress(progress: Progress): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // localStorage indisponível (modo privado, quota etc.) — falha silenciosa
  }
}

export function markLessonComplete(track: string, lessonSlug: string): void {
  const progress = readProgress();
  const trackProgress = progress.tracks[track] ?? {};
  trackProgress[lessonSlug] = { ...trackProgress[lessonSlug], completed: true };
  progress.tracks[track] = trackProgress;
  writeProgress(progress);
}

export function saveQuizScore(track: string, lessonSlug: string, correct: number, total: number): void {
  const progress = readProgress();
  const trackProgress = progress.tracks[track] ?? {};
  trackProgress[lessonSlug] = { ...trackProgress[lessonSlug], quizScore: { correct, total } };
  progress.tracks[track] = trackProgress;
  writeProgress(progress);
}

export function setLastVisited(track: string, lessonSlug: string): void {
  const progress = readProgress();
  progress.lastVisited = { track, lessonSlug, at: Date.now() };
  writeProgress(progress);
}

export function getLastVisitedLesson(): { track: string; lessonSlug: string } | null {
  const { lastVisited } = readProgress();
  return lastVisited ? { track: lastVisited.track, lessonSlug: lastVisited.lessonSlug } : null;
}

export function getLessonProgress(track: string, lessonSlug: string): LessonProgress | undefined {
  return readProgress().tracks[track]?.[lessonSlug];
}

export function isLessonCompleted(track: string, lessonSlug: string): boolean {
  return !!getLessonProgress(track, lessonSlug)?.completed;
}

export function getTrackPercent(track: string, totalLessons: number): number {
  if (totalLessons <= 0) return 0;
  const trackProgress = readProgress().tracks[track] ?? {};
  const completedCount = Object.values(trackProgress).filter((lesson) => lesson.completed).length;
  return Math.round((completedCount / totalLessons) * 100);
}
