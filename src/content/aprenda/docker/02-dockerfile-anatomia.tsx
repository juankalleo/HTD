import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-dockerfile-anatomia",
  title: "Dockerfile: anatomia",
  summary: "Cada instrução do Dockerfile é um passo de montagem da imagem, executado em ordem, uma vez.",
  estimatedMinutes: 16,
};

export default function Licao02DockerfileAnatomia() {
  return (
    <LessonBody>
      <p>
        Um <code>Dockerfile</code> é a receita que gera uma imagem: uma sequência de instruções, cada uma
        executada em ordem, uma vez, no momento do <code>build</code> — não em toda execução do container.
      </p>

      <CodeExample
        label="Dockerfile — app Next.js"
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

      <h2>Instrução por instrução</h2>
      <CodeExample
        label="o que cada linha faz"
        language="plaintext"
        code={`FROM        imagem-base a partir da qual a sua é construída (aqui: Node 20 numa distro leve, Alpine)
WORKDIR     define o diretório de trabalho dentro do container — todo comando depois roda a partir dali
COPY        copia arquivo(s) da sua máquina pra dentro da imagem
RUN         executa um comando DURANTE o build (ex.: instalar dependências) — vira parte da imagem
EXPOSE      documenta qual porta o container escuta (não abre a porta sozinho — isso é o -p do "docker run")
CMD         o comando que roda quando o CONTAINER inicia (não durante o build) — só pode haver um CMD por Dockerfile`}
      />

      <p>
        A diferença entre <code>RUN</code> e <code>CMD</code> é a que mais confunde no começo: <code>RUN</code>{" "}
        acontece uma vez, na hora de <strong>construir</strong> a imagem (instalar dependência, compilar). <code>CMD</code>{" "}
        acontece toda vez que um container <strong>inicia</strong> a partir dessa imagem.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva um Dockerfile mínimo pra uma API Rails: imagem base <code>ruby:3.3-slim</code>, copia{" "}
            <code>Gemfile</code>/<code>Gemfile.lock</code>, roda <code>bundle install</code>, copia o resto do
            código, expõe a porta 3000 e inicia com <code>rails server -b 0.0.0.0</code>.
          </p>
        }
        solutionLanguage="dockerfile"
        solutionCode={`FROM ruby:3.3-slim

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY . .

EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]`}
      />

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre RUN e CMD?",
            options: [
              "São sinônimos, tanto faz qual usar",
              "RUN executa durante o build da imagem; CMD executa quando o container inicia",
              "CMD só existe em imagens Node",
              "RUN só pode aparecer uma vez por Dockerfile, CMD várias",
            ],
            correctIndex: 1,
          },
          {
            question: "O que EXPOSE 3000 faz sozinho, sem o -p na hora de rodar o container?",
            options: [
              "Abre a porta 3000 pro mundo externo automaticamente",
              "Só documenta qual porta o container escuta — não publica a porta pra fora sozinho",
              "Impede o container de iniciar",
              "É o mesmo que CMD",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
