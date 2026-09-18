import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-multi-stage-builds",
  title: "Multi-stage builds: imagens menores e mais seguras",
  summary: "Sua imagem de produção não precisa carregar compilador nem devDependencies — multi-stage builds descartam isso automaticamente.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao10MultiStageBuilds() {
  return (
    <LessonBody>
      <p>
        Um Dockerfile de um único estágio, como os que você escreveu até aqui, faz o trabalho — mas carrega pra
        imagem final tudo que serviu só pra <strong>construir</strong> o app: o código-fonte não compilado, as
        devDependencies, o cache do gerenciador de pacotes. Nada disso é necessário pra rodar em produção, e tudo isso
        deixa a imagem maior e com mais superfície de ataque (mais pacotes instalados = mais CVEs em potencial).
      </p>

      <h2>O problema com um único estágio</h2>
      <CodeExample
        label="Dockerfile — tudo num estágio só"
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
      <p>
        Essa imagem final contém o pnpm, todo o cache de instalação, as devDependencies (tipos do TypeScript,
        linters, bibliotecas de teste) e o código-fonte original — nenhuma dessas coisas é usada por{" "}
        <code>pnpm start</code>, que só precisa do resultado do build e das dependências de produção.
      </p>

      <h2>FROM ... AS builder — mais de um estágio, uma imagem final</h2>
      <p>
        Um Dockerfile pode ter várias instruções <code>FROM</code>, cada uma iniciando um <strong>estágio</strong>{" "}
        novo. Nomeando um estágio com <code>AS nome</code>, um estágio posterior consegue copiar arquivos específicos
        dele com <code>COPY --from=nome</code> — só os arquivos escolhidos, nada mais. Tudo que ficou no estágio
        anterior e não foi copiado simplesmente não existe na imagem final.
      </p>
      <CodeExample
        label="Dockerfile — multi-stage (Next.js com output standalone)"
        language="dockerfile"
        code={`# Estágio 1: builder — tem tudo que o build precisa, mas nunca vai pra imagem final
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# Estágio 2: runner — só o necessário pra RODAR o app
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]`}
      />
      <p>
        O estágio <code>runner</code> nunca roda <code>pnpm install</code> nem tem o pnpm instalado — ele só recebe,
        via <code>COPY --from=builder</code>, exatamente os arquivos que o Next.js já preparou pra rodar sozinho (o
        modo <code>standalone</code> do Next.js empacota um <code>server.js</code> com só as dependências de produção
        que ele de fato usa).
      </p>

      <h2>O ganho é visível no tamanho da imagem</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`REPOSITORY   TAG              SIZE
minha-app    single-stage     1.24GB
minha-app    multi-stage      187MB`}
        code={`docker images minha-app`}
      />
      <p>
        Uma imagem de <strong>187MB</strong> em vez de <strong>1.24GB</strong> significa pull mais rápido no deploy,
        menos espaço em disco no servidor e, principalmente, menos coisa instalada que pudesse ter uma
        vulnerabilidade — um compilador ou gerenciador de pacotes a mais na imagem final é uma ferramenta a mais que
        um atacante teria disponível se conseguisse rodar comandos dentro do container.
      </p>

      <Exercise
        prompt={
          <p>
            Um SPA feito com Vite (<code>npm run build</code> gera arquivos estáticos em <code>dist/</code>) hoje é
            servido rodando <code>npm run preview</code> dentro do próprio container Node — carregando o Node
            inteiro só pra servir HTML/CSS/JS estático. Reescreva como multi-stage: primeiro estágio builda com Node,
            segundo estágio serve os arquivos estáticos com <code>nginx:alpine</code> (que nem precisa de Node
            instalado).
          </p>
        }
        solutionLanguage="dockerfile"
        solutionCode={`# Estágio 1: builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Estágio 2: runner — nginx nem tem Node instalado
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`}
      />

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que a imagem final não deveria carregar o toolchain de build (compilador, devDependencies)?",
            options: [
              "Porque o Docker recusa builds que ultrapassem um tamanho máximo de imagem",
              "Porque aumenta o tamanho e a superfície de ataque da imagem sem nenhum benefício em produção — só o artefato final precisa ser executado",
              "Porque toolchains de build sempre entram em conflito com o comando definido em CMD",
              "Porque isso impede o container de reiniciar automaticamente em caso de falha",
            ],
            correctIndex: 1,
          },
          {
            question: "O que COPY --from=builder faz num Dockerfile multi-stage?",
            options: [
              "Copia arquivos da máquina host que fez o build, ignorando qualquer estágio anterior",
              "Reexecuta todas as instruções RUN do estágio builder dentro do estágio atual",
              "Copia arquivos específicos de um estágio anterior (nomeado com AS) pra dentro do estágio atual, sem trazer o resto dele",
              "Combina os dois estágios numa única camada final para reduzir o número de camadas",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
