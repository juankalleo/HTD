import type { LessonModule } from "../types";
import Lesson01, { meta as meta01 } from "./01-por-que-containers";
import Lesson02, { meta as meta02 } from "./02-dockerfile-anatomia";
import Lesson03, { meta as meta03 } from "./03-imagens-camadas-e-cache";
import Lesson04, { meta as meta04 } from "./04-docker-compose";
import Lesson05, { meta as meta05 } from "./05-variaveis-de-ambiente-e-volumes";
import Lesson06, { meta as meta06 } from "./06-rede-entre-containers";
import Lesson07, { meta as meta07 } from "./07-deploy";
import Lesson08, { meta as meta08 } from "./08-projeto-guiado-containerizar";
import Lesson09, { meta as meta09 } from "./09-redes-customizadas-e-dns-interno";
import Lesson10, { meta as meta10 } from "./10-multi-stage-builds";
import Lesson11, { meta as meta11 } from "./11-healthcheck-e-restart-policy";
import Lesson12, { meta as meta12 } from "./12-limites-de-recursos-e-oom";
import Lesson13, { meta as meta13 } from "./13-logs-e-debug-em-producao";
import Lesson14, { meta as meta14 } from "./14-compose-avancado-profiles-e-overrides";
import Lesson15, { meta as meta15 } from "./15-cicd-com-docker";
import Lesson16, { meta as meta16 } from "./16-projeto-guiado-preparando-producao";

export const DOCKER_LESSONS: LessonModule[] = [
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
