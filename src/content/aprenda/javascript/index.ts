import type { LessonModule } from "../types";
import Lesson01, { meta as meta01 } from "./01-variaveis-tipos-e-operadores";
import Lesson02, { meta as meta02 } from "./02-condicionais-e-loops";
import Lesson03, { meta as meta03 } from "./03-funcoes-e-arrow-functions";
import Lesson04, { meta as meta04 } from "./04-arrays-e-metodos";
import Lesson05, { meta as meta05 } from "./05-objetos-e-destructuring";
import Lesson06, { meta as meta06 } from "./06-dom-e-eventos";
import Lesson07, { meta as meta07 } from "./07-assincrono-promises-async-await";
import Lesson08, { meta as meta08 } from "./08-projeto-guiado-lista-de-tarefas";

export const JAVASCRIPT_LESSONS: LessonModule[] = [
  { meta: meta01, Component: Lesson01 },
  { meta: meta02, Component: Lesson02 },
  { meta: meta03, Component: Lesson03 },
  { meta: meta04, Component: Lesson04 },
  { meta: meta05, Component: Lesson05 },
  { meta: meta06, Component: Lesson06 },
  { meta: meta07, Component: Lesson07 },
  { meta: meta08, Component: Lesson08 },
];
