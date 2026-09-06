import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-docker-compose",
  title: "docker-compose: orquestrando múltiplos serviços",
  summary: "Uma app real não é 1 container — é API + banco + cache, tudo precisando subir junto.",
  estimatedMinutes: 18,
};

export default function Licao04DockerCompose() {
  return (
    <LessonBody>
      <p>
        Uma aplicação de verdade quase nunca é um container sozinho — é a API, o banco de dados, talvez um Redis pra
        cache. Rodar cada um com <code>docker run</code> separado, na mão, configurando rede entre eles um por um, não
        escala. <code>docker-compose</code> descreve todos os serviços num único arquivo YAML e sobe tudo com um
        comando.
      </p>

      <CodeExample
        label="docker-compose.yml"
        language="yaml"
        code={`services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/app_development
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:`}
      />

      <h2>O que cada chave faz</h2>
      <CodeExample
        label="anotado"
        language="plaintext"
        code={`services       cada serviço vira um container próprio
build: .       constrói a partir do Dockerfile na pasta atual (em vez de baixar imagem pronta)
image: ...     usa uma imagem pronta do Docker Hub, sem Dockerfile próprio (caso do postgres aqui)
ports          mapeia porta do host:porta do container ("3000:3000")
environment    variáveis de ambiente injetadas no container
depends_on     garante que "db" suba antes de "api" tentar se conectar
volumes        dado do postgres sobrevive a docker compose down (sem isso, reiniciar apaga tudo)`}
      />

      <p>
        Repare em <code>DATABASE_URL</code>: o host não é <code>localhost</code>, é <code>db</code> — o próprio nome
        do serviço no compose. Containers na mesma rede do compose se enxergam pelo nome do serviço, não por IP
        fixo nem <code>localhost</code> (próxima lição detalha isso).
      </p>

      <CodeExample
        label="terminal"
        language="bash"
        result={`[+] Running 3/3
 ✔ Network htd_default    Created
 ✔ Container htd-db-1     Started
 ✔ Container htd-api-1    Started`}
        code={`docker compose up -d`}
      />

      <Exercise
        prompt={
          <p>
            Adicione um terceiro serviço <code>redis</code> (imagem <code>redis:7-alpine</code>) ao compose acima, e
            faça <code>api</code> depender dele também.
          </p>
        }
        solutionLanguage="yaml"
        solutionCode={`services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/app_development
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

volumes:
  postgres_data:`}
      />

      <Callout href="/padrao-infraestrutura/tecnologias/docker-compose">
        O compose de produção completo do padrão — healthcheck, restart policy, múltiplos ambientes — está
        documentado no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "No compose, por que DATABASE_URL usa 'db' como host em vez de 'localhost'?",
            options: [
              "'db' é obrigatório, um nome fixo do Docker",
              "Porque 'db' é o nome do serviço no compose, e serviços se enxergam pelo nome na mesma rede",
              "É só um apelido qualquer, poderia ser qualquer string",
              "localhost também funcionaria igual",
            ],
            correctIndex: 1,
          },
          {
            question: "Pra que serve a chave volumes no compose?",
            options: [
              "Definir a porta do serviço",
              "Fazer o dado (ex.: do banco) sobreviver a um docker compose down, em vez de ser apagado",
              "Instalar dependências",
              "Definir a rede entre containers",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
