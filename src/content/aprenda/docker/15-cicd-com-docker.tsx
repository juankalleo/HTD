import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-cicd-com-docker",
  title: "CI/CD com Docker: build, push e deploy automatizado",
  summary: "Fazer build, push e deploy na mão funciona uma vez — um pipeline garante que funciona todas as vezes, do mesmo jeito.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao15CicdComDocker() {
  return (
    <LessonBody>
      <p>
        Na lição de deploy da trilha de fundamentos, os comandos <code>docker build</code>,{" "}
        <code>docker push</code> e <code>docker pull</code> foram digitados na mão. Isso ensina o que cada passo faz,
        mas não escala: alguém esquece um passo, roda numa ordem errada, ou builda com o código errado. Um pipeline
        de CI/CD automatiza exatamente essa sequência, sempre do mesmo jeito, disparado por um evento (um push, um
        merge de PR).
      </p>

      <h2>O pipeline: build → teste → push → deploy</h2>
      <CodeExample
        label=".github/workflows/deploy.yml (GitHub Actions)"
        language="yaml"
        code={`name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build da imagem
        run: docker build -t minha-api:${"${{ github.sha }}"} .

      - name: Rodar testes dentro do container
        run: docker run --rm minha-api:${"${{ github.sha }}"} npm test

      - name: Login no registry
        run: echo "${"${{ secrets.REGISTRY_TOKEN }}"}" | docker login registry.exemplo.com -u ci --password-stdin

      - name: Push da imagem
        run: |
          docker tag minha-api:${"${{ github.sha }}"} registry.exemplo.com/minha-api:${"${{ github.sha }}"}
          docker tag minha-api:${"${{ github.sha }}"} registry.exemplo.com/minha-api:latest
          docker push registry.exemplo.com/minha-api:${"${{ github.sha }}"}
          docker push registry.exemplo.com/minha-api:latest

      - name: Deploy no servidor
        run: ssh deploy@servidor "docker compose pull && docker compose up -d"`}
      />

      <h2>Rodar teste DENTRO do container, não fora dele</h2>
      <p>
        Repare que o passo de teste roda <code>docker run --rm minha-api:sha npm test</code> — dentro da própria
        imagem que acabou de ser buildada, não numa instalação separada de Node no runner do CI. Isso garante que o
        ambiente testado é <strong>exatamente</strong> o mesmo que vai pra produção: mesma versão de sistema
        operacional, mesmas bibliotecas nativas, mesma versão de runtime. Testar fora do container e depois buildar a
        imagem separadamente reabre a porta pro clássico "passou no CI, quebrou em produção".
      </p>

      <h2>Tag baseada no commit, não só 'latest'</h2>
      <p>
        Tagear com <code>github.sha</code> (o hash do commit) além de <code>latest</code> dá rastreabilidade: dá pra
        saber exatamente qual código gerou aquela imagem, e — se algo quebrar depois do deploy — fazer rollback pra
        uma tag anterior específica, em vez de "latest", que muda de significado a cada push.
      </p>
      <CodeExample
        label="terminal — rollback manual usando a tag do commit"
        language="bash"
        result={`[+] Running 2/2
 ✔ Container app-api-1   Started
 ✔ Container app-db-1    Started`}
        code={`# volta pra imagem do commit anterior, sem precisar rebuildar nada
docker pull registry.exemplo.com/minha-api:a1b2c3d
docker compose up -d`}
      />

      <h2>Redeploy automatizado no servidor</h2>
      <p>
        O último passo do pipeline conecta no servidor (via SSH, ou um webhook que dispara um script equivalente) e
        roda <code>docker compose pull</code> (baixa a imagem nova do registry) seguido de{" "}
        <code>docker compose up -d</code> (recria os containers que mudaram, mantendo os que não mudaram intactos).
        O servidor nunca precisa ter o código-fonte nem as ferramentas de build — só o Docker instalado e acesso ao
        registry.
      </p>

      <Exercise
        prompt={
          <p>
            O pipeline acima builda, testa, publica e faz deploy sempre que há um push na branch <code>main</code>.
            O time quer que pull requests também rodem o build e os testes (pra pegar erro antes do merge), mas sem
            nunca publicar imagem nem fazer deploy a partir de um PR. O que muda no <code>on:</code> e nos jobs desse
            workflow?
          </p>
        }
        solutionLanguage="yaml"
        solutionCode={`on:
  push:
    branches: [main]
  pull_request:          # PRs também disparam o workflow

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t minha-api:test .
      - run: docker run --rm minha-api:test npm test

  push-and-deploy:
    needs: build-and-test
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      # ... login, tag, push e deploy só rodam aqui,
      # que só executa em push direto na main, nunca em PR`}
      />

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/ci-cd">
        O fluxo de CI/CD completo do padrão — checks, ambientes, aprovação antes de produção — está documentado no
        Padrão Infraestrutura.
      </Callout>
      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/devops-e-cultura">
        Por que automatizar isso é mais uma questão de cultura de time do que de ferramenta está documentado no
        Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que rodar os testes dentro do mesmo container/imagem que vai pra produção, em vez de rodar só na máquina do CI?",
            options: [
              "Porque rodar testes fora do container é tecnicamente impossível no GitHub Actions",
              "Porque garante que o ambiente testado é exatamente o mesmo que vai rodar em produção, eliminando divergência de versão de dependência ou sistema",
              "Porque isso reduz o tamanho da imagem final gerada pelo pipeline",
              "Porque testes só conseguem acessar variáveis de ambiente de dentro de um container",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que tagear a imagem com o hash do commit, além de 'latest', no push pro registry?",
            options: [
              "Permite identificar exatamente qual código gerou aquela imagem e fazer rollback pra uma versão específica se algo der errado",
              "É uma exigência técnica do Docker Hub para aceitar qualquer push",
              "Faz o build rodar mais rápido porque usa menos camadas de cache",
              "Evita que a imagem precise ser reconstruída em cada novo deploy",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
