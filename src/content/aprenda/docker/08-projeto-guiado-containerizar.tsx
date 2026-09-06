import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-projeto-guiado-containerizar",
  title: "Projeto guiado: containerizar a app Rails + Next.js",
  summary: "Junta as trilhas: a API de Pedidos (Rails) e a tela de Tarefas (Next.js) rodando juntas via compose.",
  estimatedMinutes: 24,
};

export default function Licao08ProjetoGuiadoContainerizar() {
  return (
    <LessonBody>
      <p>
        Aqui as 3 trilhas se encontram: a API de <code>Pedidos</code> construída na trilha Rails e a tela construída
        na trilha Frontend sobem juntas, com banco de dados próprio, através de um único{" "}
        <code>docker-compose.yml</code>.
      </p>

      <h2>1. Dockerfile de cada app</h2>
      <CodeExample
        label="api/Dockerfile (Rails)"
        language="dockerfile"
        code={`FROM ruby:3.3-slim
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .
EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]`}
      />
      <CodeExample
        label="web/Dockerfile (Next.js)"
        language="dockerfile"
        code={`FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]`}
      />

      <h2>2. Um compose pra orquestrar os três serviços</h2>
      <CodeExample
        label="docker-compose.yml"
        language="yaml"
        code={`services:
  web:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001   # o NAVEGADOR acessa via localhost
    depends_on:
      - api

  api:
    build: ./api
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/app_production  # containers se falam por nome
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

      <p>
        Repare a diferença entre as duas variáveis de URL — é o resumo de toda a trilha: <code>DATABASE_URL</code>{" "}
        usa <code>db</code> (nome do serviço, resolvido pela rede interna do compose, lição 6);{" "}
        <code>NEXT_PUBLIC_API_URL</code> usa <code>localhost:3001</code> porque quem faz essa chamada é o{" "}
        <strong>navegador do usuário</strong>, que está fora da rede Docker — ele não sabe o que é "api", só enxerga
        a porta publicada da sua máquina.
      </p>

      <CodeExample
        label="terminal"
        language="bash"
        result={`[+] Running 4/4
 ✔ Network app_default   Created
 ✔ Container app-db-1    Started
 ✔ Container app-api-1   Started
 ✔ Container app-web-1   Started`}
        code={`docker compose up -d --build`}
      />

      <Exercise
        prompt={
          <p>
            A tela de Tarefas (Frontend, lição 10) precisa buscar dado da API dentro de um Server Component (roda no
            servidor Next.js, não no navegador). Nesse caso específico, o fetch deveria usar{" "}
            <code>localhost:3001</code> ou o nome do serviço <code>api</code>?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Dentro de um Server Component, o fetch roda no CONTAINER do Next.js
(dentro da rede Docker), não no navegador do usuário — então deveria
usar http://api:3000 (nome do serviço + porta INTERNA do container,
não a publicada). Só chamadas feitas pelo navegador (client-side)
precisam de localhost:3001.`}
      />

      <Callout href="/padrao-infraestrutura/tecnologias/nginx">
        Em produção real, um proxy reverso (nginx) costuma ficar na frente dos dois serviços, roteando por domínio —
        documentado no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que NEXT_PUBLIC_API_URL usa localhost:3001 em vez do nome do serviço 'api'?",
            options: [
              "Não tem motivo, poderia ser qualquer um dos dois",
              "Porque quem faz essa chamada é o navegador do usuário, que está fora da rede interna do Docker",
              "localhost sempre funciona melhor que nome de serviço",
              "Porque NEXT_PUBLIC sempre precisa de localhost",
            ],
            correctIndex: 1,
          },
          {
            question: "Um fetch feito DENTRO de um Server Component do Next.js (não no navegador) deveria usar qual endereço pra falar com a API no mesmo compose?",
            options: [
              "Sempre localhost, como o navegador",
              "O nome do serviço da API (ex.: http://api:3000) e a porta interna do container, pela rede do compose",
              "O IP público do servidor de produção",
              "Não é possível fazer essa chamada",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
