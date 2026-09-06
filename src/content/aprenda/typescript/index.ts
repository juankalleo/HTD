import type { LessonModule } from "../types";
import Lesson01, { meta as meta01 } from "./01-por-que-tipos";
import Lesson02, { meta as meta02 } from "./02-tipos-basicos-e-inferencia";
import Lesson03, { meta as meta03 } from "./03-interfaces-e-type-aliases";
import Lesson04, { meta as meta04 } from "./04-funcoes-tipadas-e-union-types";
import Lesson05, { meta as meta05 } from "./05-generics";
import Lesson06, { meta as meta06 } from "./06-tipos-utilitarios";
import Lesson07, { meta as meta07 } from "./07-projeto-guiado-tipando-uma-api";

export const TYPESCRIPT_LESSONS: LessonModule[] = [
  { meta: meta01, Component: Lesson01 },
  { meta: meta02, Component: Lesson02 },
  { meta: meta03, Component: Lesson03 },
  { meta: meta04, Component: Lesson04 },
  { meta: meta05, Component: Lesson05 },
  { meta: meta06, Component: Lesson06 },
  { meta: meta07, Component: Lesson07 },
];
