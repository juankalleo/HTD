import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TrackOverview } from "@/components/aprenda/track-overview";
import { getTrackLessons } from "@/content/aprenda/registry";
import { getTrackMeta, TRACKS } from "@/content/aprenda/tracks";

type Props = { params: Promise<{ track: string }> };

export function generateStaticParams() {
  return TRACKS.map((track) => ({ track: track.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track } = await params;
  const meta = getTrackMeta(track);
  if (!meta) return { title: "Aprenda | How to Dev" };
  return { title: `${meta.title} | Aprenda | How to Dev`, description: meta.summary };
}

export default async function TrackPage({ params }: Props) {
  const { track } = await params;
  const trackMeta = getTrackMeta(track);
  if (!trackMeta) notFound();

  const lessons = getTrackLessons(track).map((lessonModule) => lessonModule.meta);
  return <TrackOverview track={trackMeta} lessons={lessons} />;
}
