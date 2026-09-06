import type { Metadata } from "next";
import { StudyTree } from "@/components/aprenda/study-tree";
import { TRACKS } from "@/content/aprenda/tracks";
import { getTrackLessons } from "@/content/aprenda/registry";

export const metadata: Metadata = {
  title: "Aprenda | How to Dev",
  description:
    "Aprenda Frontend (Tailwind e Next.js), Ruby on Rails e Docker do zero — exemplos de código, exercícios e quiz, do básico ao avançado.",
};

export default function AprendaPage() {
  const tracksWithLessons = TRACKS.map((track) => ({
    track,
    lessons: getTrackLessons(track.slug).map((lessonModule) => lessonModule.meta),
  }));
  const totalLessons = tracksWithLessons.reduce((acc, t) => acc + t.lessons.length, 0);

  return (
    <div className="nexttech-aprenda-hub">
      <header className="nexttech-aprenda-hub__header">
        <p className="nexttech-aprenda-hub__eyebrow">Aprenda</p>
        <h1>Do básico ao avançado, com exemplos de verdade</h1>
        <p>
          {totalLessons} {totalLessons === 1 ? "lição" : "lições"} em 3 trilhas — Frontend (Tailwind e Next.js), Ruby
          on Rails e Docker. Cada aula tem exemplo de código, exercício e um quiz rápido no final.
        </p>
      </header>
      <StudyTree tracksWithLessons={tracksWithLessons} maxChaptersShown={10} />
    </div>
  );
}
