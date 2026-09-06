import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { LessonLayout } from "@/components/aprenda/lesson-layout";
import { getLesson, getTrackLessons } from "@/content/aprenda/registry";
import { getTrackMeta, TRACKS } from "@/content/aprenda/tracks";

type Props = { params: Promise<{ track: string; lesson: string }> };

export function generateStaticParams() {
  return TRACKS.flatMap((track) =>
    getTrackLessons(track.slug).map((lessonModule) => ({ track: track.slug, lesson: lessonModule.meta.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track, lesson } = await params;
  const lessonModule = getLesson(track, lesson);
  if (!lessonModule) return { title: "Aprenda | How to Dev" };
  return { title: `${lessonModule.meta.title} | Aprenda | How to Dev`, description: lessonModule.meta.summary };
}

export default async function LessonPage({ params }: Props) {
  const { track, lesson } = await params;
  const trackMeta = getTrackMeta(track);
  const lessonModule = getLesson(track, lesson);
  if (!trackMeta || !lessonModule) notFound();

  const lessons = getTrackLessons(track).map((mod) => mod.meta);
  const LessonComponent = lessonModule.Component;

  return (
    <LessonLayout track={trackMeta} lessons={lessons} currentSlug={lesson}>
      <LessonComponent />
    </LessonLayout>
  );
}
