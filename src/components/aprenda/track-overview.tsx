"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrackPercent, isLessonCompleted } from "@/lib/aprenda-progress";
import type { LessonMeta } from "@/content/aprenda/types";
import type { TrackMeta } from "@/content/aprenda/tracks";

export function TrackOverview({ track, lessons }: { track: TrackMeta; lessons: LessonMeta[] }) {
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setCompletedSlugs(
      new Set(lessons.filter((lesson) => isLessonCompleted(track.slug, lesson.slug)).map((lesson) => lesson.slug)),
    );
    setPercent(getTrackPercent(track.slug, lessons.length));
  }, [track.slug, lessons]);

  const firstLesson = lessons[0];

  return (
    <div className="nexttech-track-overview">
      <header className="nexttech-track-overview__header">
        <p className="nexttech-track-overview__breadcrumb">
          <Link href="/aprenda">Aprenda</Link>
        </p>
        <h1>{track.title}</h1>
        <p>{track.summary}</p>
        {lessons.length > 0 && (
          <div className="nexttech-lesson-chapters__progress">
            <div className="nexttech-lesson-chapters__bar">
              <div className="nexttech-lesson-chapters__bar-fill" style={{ width: `${percent}%` }} />
            </div>
            <span>{percent}% concluído</span>
          </div>
        )}
        {firstLesson && (
          <Link href={`/aprenda/${track.slug}/${firstLesson.slug}`} className="nexttech-track-overview__cta">
            {percent > 0 ? "Continuar trilha" : "Começar trilha"} →
          </Link>
        )}
      </header>

      {lessons.length === 0 ? (
        <p className="nexttech-track-overview__empty">As lições dessa trilha ainda estão sendo escritas.</p>
      ) : (
        <ol className="nexttech-track-overview__list">
          {lessons.map((lesson, i) => {
            const done = completedSlugs.has(lesson.slug);
            return (
              <li key={lesson.slug}>
                <Link
                  href={`/aprenda/${track.slug}/${lesson.slug}`}
                  className={`nexttech-track-overview__item${done ? " is-done" : ""}`}
                >
                  <span className="nexttech-lesson-chapters__index">{done ? "✓" : i + 1}</span>
                  <span className="nexttech-track-overview__item-text">
                    <strong>{lesson.title}</strong>
                    <small>{lesson.summary}</small>
                  </span>
                  <span className="nexttech-track-overview__minutes">{lesson.estimatedMinutes} min</span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
