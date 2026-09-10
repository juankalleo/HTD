import type { Metadata } from "next";
import { StudyTree } from "@/components/aprenda/study-tree";
import { LearningTree } from "@/components/aprenda/learning-tree";
import { TRACKS } from "@/content/aprenda/tracks";
import { getTrackLessons } from "@/content/aprenda/registry";

export const metadata: Metadata = {
  title: "Learn Software Development",
  description:
    "Learn software development from the fundamentals through Git, JavaScript, TypeScript, networking, frontend, SQL, Ruby on Rails and Docker with practical lessons.",
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
        <p className="nexttech-aprenda-hub__eyebrow">Learn software development</p>
        <h1>From web fundamentals to production software</h1>
        <p>
          {totalLessons} {totalLessons === 1 ? "lesson" : "lessons"} across {totalTracks} study tracks: Git,
          JavaScript, TypeScript, Networking, Frontend, SQL, Ruby on Rails and Docker. Each lesson connects a practical
          example to the larger developer roadmap.
        </p>
      </header>
      <div className="nexttech-learning-tree-wrap">
        <LearningTree />
      </div>
      <StudyTree tracksWithLessons={tracksWithLessons} />
    </div>
  );
}
