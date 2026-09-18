import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-branches-e-merge",
  title: "Branches e merge",
  summary: "Trabalhar numa linha do tempo separada sem afetar o main, e depois juntar tudo de volta.",
  estimatedMinutes: 16,
  level: "fundamentos",
};

export default function Licao03BranchesEMerge() {
  return (
    <LessonBody>
      <p>
        Uma <strong>branch</strong> é uma linha do tempo paralela do projeto. <code>main</code> (ou{" "}
        <code>master</code>) é a branch principal, geralmente a versão "estável". Criar uma branch nova deixa você
        experimentar, quebrar coisa, tentar de novo — sem afetar <code>main</code> até você decidir juntar (merge)
        de volta.
      </p>

      <h2>Criando e trocando de branch</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Switched to a new branch 'feature/login'`}
        code={`git branch feature/login       # cria a branch
git checkout feature/login      # troca pra ela

# ou os dois de uma vez:
git checkout -b feature/login`}
      />
      <CodeExample
        label="terminal — versão mais nova do comando de troca"
        language="bash"
        code={`git switch -c feature/login   # cria e troca — substitui "checkout -b" nas versões recentes do git`}
      />

      <h2>Trabalhando na branch</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`# edita arquivos normalmente...
git add .
git commit -m "Adiciona formulário de login"
git commit -m "Adiciona validação de senha"

git log --oneline
# 2 commits novos aqui, main não tem eles ainda`}
      />

      <h2>Merge — juntando de volta</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Updating a3f9e2b..d4c8f1a
Fast-forward
 login.html | 20 ++++++++++++++++++
 1 file changed, 20 insertions(+)`}
        code={`git checkout main         # volta pra main
git merge feature/login    # traz os commits da feature pra main`}
      />
      <p>
        "Fast-forward" significa que <code>main</code> não tinha nenhum commit novo desde que a branch foi criada —
        o merge simplesmente "avança" o ponteiro de <code>main</code> até onde a feature já estava. Quando os dois
        lados mudaram coisas diferentes, o git tenta combinar automaticamente (e às vezes não consegue — próxima
        lição).
      </p>

      <Exercise
        prompt={
          <p>
            Você está em <code>main</code> e quer começar uma feature chamada "checkout". Escreva o comando que cria
            a branch e já troca pra ela, numa linha só.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`git checkout -b feature/checkout
# ou, em versões recentes do git:
git switch -c feature/checkout`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que trabalhar numa branch separada em vez de commitar direto em main?",
            options: [
              "Permite experimentar e até errar sem afetar a versão estável de main, até você decidir juntar as mudanças de volta",
              "main só aceita um número limitado de commits por dia, então branches evitam esse limite",
              "Branches são processadas mais rápido pelo git porque usam menos espaço em disco",
              "É a única forma de o git registrar o autor de cada commit corretamente",
            ],
            correctIndex: 0,
          },
          {
            question: "O que significa um merge 'fast-forward'?",
            options: [
              "É quando o git resolve automaticamente qualquer conflito de merge sem pedir confirmação a quem está commitando",
              "É quando o git cria dois commits de merge simultâneos para sincronizar o histórico das branches",
              "main não tinha nenhum commit novo desde a criação da branch, então o ponteiro de main apenas 'avança' até onde a branch já estava",
              "É o tipo de merge usado quando duas branches têm arquivos com nomes idênticos",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
