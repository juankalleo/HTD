"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLastVisitedLesson, getTrackPercent, isLessonCompleted } from "@/lib/aprenda-progress";
import type { LessonMeta } from "@/content/aprenda/types";
import type { TrackMeta } from "@/content/aprenda/tracks";

export type TrackWithLessons = { track: TrackMeta; lessons: LessonMeta[] };

/**
 * "Árvore de estudo" — as 3 trilhas lado a lado com os capítulos de cada
 * uma, usada tanto na home quanto no hub /aprenda. Progresso só existe no
 * localStorage do visitante, então percentuais/checks/"continuar de onde
 * parei" só aparecem depois do mount (client), pra não dar mismatch com o
 * HTML gerado no servidor.
 */
export function StudyTree({
  tracksWithLessons,
  maxChaptersShown = 3,
}: {
  tracksWithLessons: TrackWithLessons[];
  maxChaptersShown?: number;
}) {
  const [percents, setPercents] = useState<Record<string, number>>({});
  const [completed, setCompleted] = useState<Record<string, Set<string>>>({});
  const [continueHref, setContinueHref] = useState<string | null>(null);

  useEffect(() => {
    const nextPercents: Record<string, number> = {};
    const nextCompleted: Record<string, Set<string>> = {};
    for (const { track, lessons } of tracksWithLessons) {
      nextPercents[track.slug] = getTrackPercent(track.slug, lessons.length);
      nextCompleted[track.slug] = new Set(
        lessons.filter((lesson) => isLessonCompleted(track.slug, lesson.slug)).map((lesson) => lesson.slug),
      );
    }
    setPercents(nextPercents);
    setCompleted(nextCompleted);

    const last = getLastVisitedLesson();
    if (last) setContinueHref(`/aprenda/${last.track}/${last.lessonSlug}`);
  }, [tracksWithLessons]);

  return (
    <div className="nexttech-study-tree">
      {continueHref && (
        <Link href={continueHref} className="nexttech-study-tree__continue">
          Continuar de onde parei →
        </Link>
      )}
      <div className="nexttech-study-tree__grid">
        {tracksWithLessons.map(({ track, lessons }) => {
          const percent = percents[track.slug] ?? 0;
          const doneSet = completed[track.slug] ?? new Set<string>();
          const visible = lessons.slice(0, maxChaptersShown);
          const remaining = lessons.length - visible.length;
          const entryHref = lessons[0] ? `/aprenda/${track.slug}/${lessons[0].slug}` : `/aprenda/${track.slug}`;
          return (
            <div key={track.slug} className="nexttech-study-tree__track">
              <div className="nexttech-study-tree__track-header">
                <strong>{track.title}</strong>
                <span>{percent}%</span>
              </div>
              <p className="nexttech-study-tree__track-summary">{track.summary}</p>
              {lessons.length === 0 ? (
                <p className="nexttech-study-tree__empty">Em construção</p>
              ) : (
                <ul>
                  {visible.map((lesson) => (
                    <li key={lesson.slug}>
                      <Link href={`/aprenda/${track.slug}/${lesson.slug}`}>
                        <span aria-hidden="true">{doneSet.has(lesson.slug) ? "✓" : "○"}</span> {lesson.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <div className="nexttech-study-tree__track-footer">
                {remaining > 0 && (
                  <Link href={`/aprenda/${track.slug}`} className="nexttech-study-tree__more">
                    ver todas as {lessons.length} lições
                  </Link>
                )}
                <Link href={entryHref} className="nexttech-study-tree__cta">
                  {percent > 0 ? "Continuar" : "Começar"} →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
