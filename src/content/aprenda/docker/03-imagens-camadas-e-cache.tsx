import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-imagens-camadas-e-cache",
  title: "Imagens, camadas e cache de build",
  summary: "Cada instrução do Dockerfile vira uma camada — a ordem delas decide se seu build demora 2s ou 2min.",
  estimatedMinutes: 16,
};

export default function Licao03ImagensCamadasECache() {
  return (
    <LessonBody>
      <p>
        Cada instrução do Dockerfile (<code>RUN</code>, <code>COPY</code>...) gera uma <strong>camada</strong> —
        empilhada sobre a anterior. Docker guarda cache dessas camadas: se uma instrução e tudo que veio antes dela
        não mudou, o build reusa o resultado em cache em vez de reexecutar. Isso é a diferença entre um rebuild de 2
        segundos e um de 2 minutos.
      </p>

      <h2>O erro clássico: copiar tudo antes de instalar dependência</h2>
      <CodeExample
        label="Dockerfile — cache quebrado a cada mudança de código"
        language="dockerfile"
        code={`FROM node:20-alpine
WORKDIR /app
COPY . .                              # QUALQUER mudança de código invalida esta camada
RUN corepack enable && pnpm install   # ...e força reinstalar TODAS as dependências de novo`}
      />
      <p>
        Como <code>COPY . .</code> copia o projeto inteiro, qualquer arquivo alterado (até um <code>.md</code> sem
        relação nenhuma com dependência) invalida essa camada — e Docker invalida <strong>tudo depois dela</strong>{" "}
        também, incluindo o <code>pnpm install</code>, que reinstala tudo do zero mesmo que nenhuma dependência tenha
        mudado.
      </p>

      <h2>A correção: copiar só o que o install precisa, primeiro</h2>
      <CodeExample
        label="Dockerfile — cache aproveitado"
        language="dockerfile"
        code={`FROM node:20-alpine
WORKDIR /app

COPY package.json pnpm-lock.yaml ./      # só isso muda quando dependência muda
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .                                  # mudança de código não afeta mais o install acima
RUN pnpm build`}
      />
      <p>
        Agora <code>pnpm install</code> só reroda quando <code>package.json</code>/<code>pnpm-lock.yaml</code> mudam
        de verdade — mudar um componente React não invalida mais essa camada, e o rebuild pula direto pro que
        realmente mudou.
      </p>

      <Exercise
        prompt={
          <p>
            Reordene este Dockerfile Rails pra aproveitar cache: hoje ele copia tudo antes de rodar{" "}
            <code>bundle install</code>.
            <br />
            <code>{"FROM ruby:3.3-slim \\ WORKDIR /app \\ COPY . . \\ RUN bundle install"}</code>
          </p>
        }
        solutionLanguage="dockerfile"
        solutionCode={`FROM ruby:3.3-slim
WORKDIR /app
COPY Gemfile Gemfile.lock ./
RUN bundle install
COPY . .`}
      />

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que acontece quando uma camada do Dockerfile é invalidada?",
            options: [
              "Só ela reroda, o resto do cache continua valendo",
              "Ela e TODAS as instruções seguintes rerodam, mesmo que não tenham relação com a mudança",
              "O build inteiro falha",
              "Nada, cache nunca é invalidado",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que copiar só package.json/lockfile antes do install, e o resto do código depois, melhora o cache?",
            options: [
              "Não faz diferença nenhuma",
              "Porque mudar código (sem mudar dependência) não invalida mais a camada de install, que é a mais lenta",
              "Porque reduz o tamanho da imagem final",
              "Porque é obrigatório pelo Docker",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
