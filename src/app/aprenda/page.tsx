import type { Metadata } from "next";
import { StudyTree } from "@/components/aprenda/study-tree";
import { LearningTree } from "@/components/aprenda/learning-tree";
import { TRACKS } from "@/content/aprenda/tracks";
import { getTrackLessons } from "@/content/aprenda/registry";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Aprenda Desenvolvimento de Software",
  description:
    "Aprenda desenvolvimento de software dos fundamentos ate Git, JavaScript, TypeScript, redes, frontend, SQL, Ruby on Rails e Docker com licoes praticas.",
  alternates: { canonical: siteUrl("/aprenda") },
  openGraph: {
    title: "Aprenda Desenvolvimento de Software",
    description:
      "Aprenda desenvolvimento de software dos fundamentos ate Git, JavaScript, TypeScript, redes, frontend, SQL, Ruby on Rails e Docker com licoes praticas.",
    url: siteUrl("/aprenda"),
  },
};

export default function AprendaPage() {
  const tracksWithLessons = TRACKS.map((track) => ({
    track,
    lessons: getTrackLessons(track.slug).map((lessonModule) => lessonModule.meta),
  }));
  const totalLessons = tracksWithLessons.reduce((acc, t) => acc + t.lessons.length, 0);
  const totalTracks = tracksWithLessons.length;

  return (
    <div className="nexttech-aprenda-hub">
      <header className="nexttech-aprenda-hub__header">
        <p className="nexttech-aprenda-hub__eyebrow">Aprenda desenvolvimento de software</p>
        <h1>Dos fundamentos da web ao software em produção</h1>
        <p>
          {totalLessons} {totalLessons === 1 ? "lição" : "lições"} em {totalTracks} trilhas de estudo: Git,
          JavaScript, TypeScript, redes, frontend, SQL, Ruby on Rails e Docker. Cada lição conecta um exemplo prático ao
          sistema de referência do How to Dev.
        </p>
      </header>
      <div className="nexttech-learning-tree-wrap">
        <LearningTree />
      </div>
      <StudyTree tracksWithLessons={tracksWithLessons} />
    </div>
  );
}
