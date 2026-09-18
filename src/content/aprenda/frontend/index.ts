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
import Lesson11, { meta as meta11 } from "./11-estado-global-context-e-zustand";
import Lesson12, { meta as meta12 } from "./12-hooks-avancados-usememo-usecallback-useref";
import Lesson13, { meta as meta13 } from "./13-acessibilidade-na-pratica";
import Lesson14, { meta as meta14 } from "./14-performance-e-core-web-vitals";
import Lesson15, { meta as meta15 } from "./15-server-actions";
import Lesson16, { meta as meta16 } from "./16-middleware-e-protecao-de-rotas";
import Lesson17, { meta as meta17 } from "./17-testando-componentes";
import Lesson18, { meta as meta18 } from "./18-upload-de-arquivos-e-imagens";
import Lesson19, { meta as meta19 } from "./19-tabelas-de-dados-avancadas";
import Lesson20, { meta as meta20 } from "./20-projeto-guiado-dashboard";

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
  { meta: meta11, Component: Lesson11 },
  { meta: meta12, Component: Lesson12 },
  { meta: meta13, Component: Lesson13 },
  { meta: meta14, Component: Lesson14 },
  { meta: meta15, Component: Lesson15 },
  { meta: meta16, Component: Lesson16 },
  { meta: meta17, Component: Lesson17 },
  { meta: meta18, Component: Lesson18 },
  { meta: meta19, Component: Lesson19 },
  { meta: meta20, Component: Lesson20 },
];
