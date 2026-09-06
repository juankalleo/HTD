import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-primeiro-repositorio",
  title: "Primeiro repositório: init, add, commit",
  summary: "O ciclo que se repete o tempo todo: mudar arquivo, adicionar à staging area, commitar.",
  estimatedMinutes: 14,
};

export default function Licao02PrimeiroRepositorio() {
  return (
    <LessonBody>
      <h2>git init — transforma uma pasta num repositório</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Initialized empty Git repository in /Users/ana/projeto/.git/`}
        code={`cd projeto
git init`}
      />
      <p>
        Isso cria uma pasta oculta <code>.git</code> — é ali que todo o histórico vive. Apagar essa pasta apaga todo
        o histórico de versionamento (o código em si continua existindo, só perde a história).
      </p>

      <h2>O ciclo: status → add → commit</h2>
      <CodeExample
        label="terminal — depois de criar um arquivo"
        language="bash"
        result={`On branch main
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        index.html`}
        code={`git status`}
      />
      <p>
        <code>git status</code> é o comando que você vai rodar mais nesta vida — mostra o que mudou, o que está
        "staged" (pronto pra commit) e o que ainda não.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`git add index.html    # move o arquivo pra "staging area"
git add .              # ou: adiciona TODOS os arquivos modificados

git commit -m "Cria página inicial"`}
      />

      <h2>Por que existe uma staging area (git add) separada do commit?</h2>
      <p>
        Você pode ter mudado 3 arquivos, mas só quer commitar 2 deles agora (o terceiro ainda está pela metade). A
        staging area é exatamente esse espaço intermediário — <code>git add</code> escolhe o que vai entrar no{" "}
        <strong>próximo</strong> commit; arquivos modificados mas não adicionados ficam de fora.
      </p>

      <h2>Vendo o histórico</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`a3f9e2b (HEAD -> main) Cria página inicial
c519747 Commit inicial`}
        code={`git log --oneline`}
      />

      <Exercise
        prompt={
          <p>
            Você editou 3 arquivos: <code>a.js</code>, <code>b.js</code>, <code>c.js</code>. Quer commitar só{" "}
            <code>a.js</code> e <code>b.js</code> agora, deixando <code>c.js</code> de fora. Quais comandos rodar?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`git add a.js b.js
git commit -m "Atualiza a e b"
# c.js continua modificado, fora do commit — aparece em "git status"
# como modificado, esperando um commit futuro`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Pra que serve a staging area (git add), em vez de commit direto?",
            options: [
              "Não serve pra nada, é uma etapa burocrática",
              "Permite escolher exatamente quais mudanças entram no próximo commit, mesmo com vários arquivos modificados",
              "É obrigatório esperar 1 minuto entre add e commit",
              "Só existe pra arquivos grandes",
            ],
            correctIndex: 1,
          },
          {
            question: "O que a pasta .git guarda?",
            options: [
              "Uma cópia de backup na nuvem",
              "Todo o histórico de versionamento do repositório — apagá-la apaga o histórico (o código em si continua)",
              "Só as configurações do editor",
              "Nada importante, pode ser apagada sem problema",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
