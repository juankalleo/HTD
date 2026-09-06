"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrackPercent, isLessonCompleted, setLastVisited } from "@/lib/aprenda-progress";
import type { LessonMeta } from "@/content/aprenda/types";
import type { TrackMeta } from "@/content/aprenda/tracks";

/**
 * Chrome comum de uma lição: lista de capítulos do track (com progresso),
 * cabeçalho, navegação anterior/próxima. Progresso só existe no
 * localStorage do visitante, então tudo que depende dele é lido em
 * `useEffect` (depois do mount) pra não dar mismatch entre o HTML do
 * servidor e o que o client acaba mostrando.
 */
export function LessonLayout({
  track,
  lessons,
  currentSlug,
  children,
}: {
  track: TrackMeta;
  lessons: LessonMeta[];
  currentSlug: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [percent, setPercent] = useState(0);

  const currentIndex = lessons.findIndex((lesson) => lesson.slug === currentSlug);
  const previous = currentIndex > 0 ? lessons[currentIndex - 1] : undefined;
  const next = currentIndex >= 0 && currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : undefined;

  useEffect(() => {
    setLastVisited(track.slug, currentSlug);
    setCompletedSlugs(new Set(lessons.filter((lesson) => isLessonCompleted(track.slug, lesson.slug)).map((lesson) => lesson.slug)));
    setPercent(getTrackPercent(track.slug, lessons.length));
  }, [track.slug, currentSlug, lessons]);

  useEffect(() => {
    if (!mobileOpen) return;
    document.documentElement.classList.add("nexttech-no-scroll");
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("nexttech-no-scroll");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const chapterList = (
    <nav className="nexttech-lesson-chapters" aria-label={`Capítulos de ${track.title}`}>
      <div className="nexttech-lesson-chapters__track">{track.title}</div>
      <div className="nexttech-lesson-chapters__progress">
        <div className="nexttech-lesson-chapters__bar">
          <div className="nexttech-lesson-chapters__bar-fill" style={{ width: `${percent}%` }} />
        </div>
        <span>{percent}% concluído</span>
      </div>
      <ol>
        {lessons.map((lesson, i) => {
          const active = lesson.slug === currentSlug;
          const done = completedSlugs.has(lesson.slug);
          return (
            <li key={lesson.slug}>
              <Link
                href={`/aprenda/${track.slug}/${lesson.slug}`}
                className={`nexttech-lesson-chapters__link${active ? " is-active" : ""}${done ? " is-done" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <span className="nexttech-lesson-chapters__index">{done ? "✓" : i + 1}</span>
                <span>{lesson.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );

  return (
    <div className="nexttech-lesson-layout">
      <button type="button" className="nexttech-sidebar-toggle nexttech-lesson-toggle" onClick={() => setMobileOpen(true)}>
        Capítulos
      </button>
      {mobileOpen && <div className="nexttech-sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={`nexttech-lesson-chapters-panel${mobileOpen ? " is-open" : ""}`}>{chapterList}</aside>

      <article className="nexttech-lesson-content">
        <header className="nexttech-lesson-header">
          <p className="nexttech-lesson-breadcrumb">
            <Link href="/aprenda">Aprenda</Link> / <Link href={`/aprenda/${track.slug}`}>{track.title}</Link>
          </p>
          <h1>{lessons[currentIndex]?.title}</h1>
        </header>

        {children}

        <footer className="nexttech-lesson-footer">
          {previous ? (
            <Link href={`/aprenda/${track.slug}/${previous.slug}`} className="nexttech-lesson-nav-btn">
              ← {previous.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/aprenda/${track.slug}/${next.slug}`} className="nexttech-lesson-nav-btn nexttech-lesson-nav-btn--next">
              {next.title} →
            </Link>
          ) : (
            <Link href="/aprenda" className="nexttech-lesson-nav-btn nexttech-lesson-nav-btn--next">
              Voltar pro Aprenda →
            </Link>
          )}
        </footer>
      </article>
    </div>
  );
}
