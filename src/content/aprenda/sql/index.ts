import type { LessonModule } from "../types";
import Lesson01, { meta as meta01 } from "./01-banco-relacional";
import Lesson02, { meta as meta02 } from "./02-select-where-order-by";
import Lesson03, { meta as meta03 } from "./03-join";
import Lesson04, { meta as meta04 } from "./04-agregacoes";
import Lesson05, { meta as meta05 } from "./05-insert-update-delete";
import Lesson06, { meta as meta06 } from "./06-indices-e-performance";
import Lesson07, { meta as meta07 } from "./07-chaves-e-normalizacao";
import Lesson08, { meta as meta08 } from "./08-projeto-guiado-schema-ecommerce";
import Lesson09, { meta as meta09 } from "./09-subqueries-e-ctes";
import Lesson10, { meta as meta10 } from "./10-window-functions";
import Lesson11, { meta as meta11 } from "./11-transacoes-e-acid";
import Lesson12, { meta as meta12 } from "./12-constraints-e-enum-vs-tabela";
import Lesson13, { meta as meta13 } from "./13-migrations-seguras-em-producao";
import Lesson14, { meta as meta14 } from "./14-modelagem-e-multi-tenancy";
import Lesson15, { meta as meta15 } from "./15-explain-e-otimizacao-de-queries";
import Lesson16, { meta as meta16 } from "./16-projeto-guiado-otimizando-schema";

export const SQL_LESSONS: LessonModule[] = [
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
  { meta: meta11, Component: Lesson11 },
  { meta: meta12, Component: Lesson12 },
  { meta: meta13, Component: Lesson13 },
  { meta: meta14, Component: Lesson14 },
  { meta: meta15, Component: Lesson15 },
  { meta: meta16, Component: Lesson16 },
];
