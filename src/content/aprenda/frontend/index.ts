import type { LessonModule } from "../types";
import Lesson01, { meta as meta01 } from "./01-por-que-tailwind";
import Lesson02, { meta as meta02 } from "./02-classes-fundamentais";
import Lesson03, { meta as meta03 } from "./03-responsividade-e-variantes";
import Lesson04, { meta as meta04 } from "./04-componentizando-com-tailwind";
import Lesson05, { meta as meta05 } from "./05-nextjs-app-router";
import Lesson06, { meta as meta06 } from "./06-rotas-layouts-e-grupos";
import Lesson07, { meta as meta07 } from "./07-server-vs-client-components";
import Lesson08, { meta as meta08 } from "./08-data-fetching-e-cache";
import Lesson09, { meta as meta09 } from "./09-formularios-com-rhf-e-zod";
import Lesson10, { meta as meta10 } from "./10-projeto-guiado-crud";

export const FRONTEND_LESSONS: LessonModule[] = [
  { meta: meta01, Component: Lesson01 },
  { meta: meta02, Component: Lesson02 },
  { meta: meta03, Component: Lesson03 },
  { meta: meta04, Component: Lesson04 },
  { meta: meta05, Component: Lesson05 },
  { meta: meta06, Component: Lesson06 },
  { meta: meta07, Component: Lesson07 },
  { meta: meta08, Component: Lesson08 },
  { meta: meta09, Component: Lesson09 },
  { meta: meta10, Component: Lesson10 },
];
