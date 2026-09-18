import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-rebase-interativo",
  title: "Rebase interativo: reescrevendo commits antes de compartilhar",
  summary:
    "merge preserva o histórico exatamente como aconteceu; rebase reescreve — e isso é ótimo até você pushar.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao08RebaseInterativo() {
  return (
    <LessonBody>
      <p>
        Você trabalhou numa feature por dois dias e o <code>git log</code> mostra 14 commits: "wip", "funciona
        parcial", "corrige typo", "tenta de novo"... Isso é normal enquanto você trabalha sozinho na branch. O
        problema é abrir um PR assim — quem revisa não devia precisar entender sua história de tentativa e erro,
        só o resultado final. <strong>Rebase interativo</strong> é a ferramenta pra limpar isso antes de compartilhar.
      </p>

      <h2>merge vs. rebase: dois jeitos de trazer commits</h2>
      <p>
        <code>git merge</code> junta duas branches criando (na maioria dos casos) um commit de merge novo — o
        histórico das duas linhas do tempo fica preservado exatamente como aconteceu, lado a lado. <code>git rebase</code>{" "}
        faz outra coisa: pega os commits da sua branch e os "reaplica" em cima da ponta atual de outra branch, como
        se você tivesse começado a trabalhar a partir dali — o resultado é um histórico linear, sem bifurcação.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Successfully rebased and updated refs/heads/feature/checkout.`}
        code={`git checkout feature/checkout
git rebase main   # reaplica os commits da feature em cima do main atual`}
      />
      <p>
        Nenhum dos dois é "o certo" — são ferramentas diferentes. Histórico linear (rebase) é mais fácil de ler
        depois; histórico com merges preserva o contexto real de quando cada branch existiu. Muitos times usam
        rebase pra limpar a branch local antes do PR, e squash merge (próxima lição) pra fechar o PR — assim o{" "}
        <code>main</code> nunca vê os commits intermediários de qualquer jeito.
      </p>

      <h2>git rebase -i — editando o passado</h2>
      <p>
        O modo interativo abre uma lista dos últimos N commits, e você escolhe o que fazer com cada um: manter (
        <code>pick</code>), juntar com o commit anterior (<code>squash</code> ou <code>fixup</code>), reescrever a
        mensagem (<code>reword</code>), reordenar as linhas, ou remover a linha inteira pra descartar o commit.
      </p>
      <CodeExample
        label="terminal — pegando os últimos 4 commits"
        language="bash"
        code={`git rebase -i HEAD~4`}
      />
      <CodeExample
        label="editor que abre — antes"
        language="plaintext"
        code={`pick a1b2c3d Adiciona formulário de checkout
pick e4f5a6b wip
pick 7c8d9e0 corrige typo
pick f0a1b2c funciona parcial, ajustando validação`}
      />
      <CodeExample
        label="editor — depois de reescrever pra squash"
        language="plaintext"
        code={`pick a1b2c3d Adiciona formulário de checkout
squash e4f5a6b wip
squash 7c8d9e0 corrige typo
squash f0a1b2c funciona parcial, ajustando validação`}
      />
      <p>
        Ao salvar, o git abre outro editor pedindo a mensagem final do commit combinado — você escreve uma mensagem
        só, como se tivesse feito tudo num commit desde o início. O resultado: 4 commits bagunçados viram 1 commit
        limpo, com uma mensagem que descreve o que a mudança faz de verdade.
      </p>

      <h2>A regra de ouro: nunca rebase histórico já compartilhado</h2>
      <p>
        Rebase <strong>reescreve</strong> commits — cada commit reaplicado ganha um hash novo, mesmo que o conteúdo
        seja idêntico. Isso é inofensivo numa branch que só existe na sua máquina. Mas se você já deu <code>push</code>{" "}
        e outra pessoa já puxou (<code>pull</code>) aquela branch, rebase local + <code>push --force</code> depois
        apaga os commits antigos do remoto e substitui por versões novas com hash diferente — o histórico da outra
        pessoa diverge do seu, e ela vai ter conflitos difíceis de entender na próxima sincronização.
      </p>
      <CodeExample
        label="regra prática"
        language="plaintext"
        code={`Rebase é seguro em:
  - commits que só existem localmente, nunca pushados
  - sua própria branch de feature, antes de abrir o PR

Rebase é perigoso em:
  - main, develop, ou qualquer branch compartilhada
  - qualquer branch que outra pessoa já clonou/puxou`}
      />

      <Exercise
        prompt={
          <p>
            Você fez 5 commits numa branch de feature que ainda não foi pushada (só existe na sua máquina). Quer
            transformar os 3 últimos commits num só, mantendo os 2 primeiros separados. Qual comando abre a lista
            de commits pra você editar?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`git rebase -i HEAD~5
# na lista que abrir, mantenha "pick" nos 2 primeiros commits
# e troque para "squash" (ou "fixup") nos 3 últimos`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença essencial entre git merge e git rebase?",
            options: [
              "merge é mais rápido tecnicamente; rebase é só uma preferência estética de alguns times",
              "rebase só funciona em repositórios pequenos; merge funciona em qualquer tamanho de projeto",
              "merge exige que as duas branches tenham o mesmo número de commits; rebase não tem essa exigência",
              "merge preserva o histórico das duas branches como aconteceu, criando um commit de merge; rebase reaplica os commits como se a branch tivesse começado do ponto atual, deixando o histórico linear",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que nunca fazer rebase numa branch que já foi pushada e que outra pessoa já puxou?",
            options: [
              "Rebase reescreve os commits com hash novo; forçar isso no remoto faz o histórico da outra pessoa divergir do seu e gera conflitos difíceis",
              "Porque o GitHub bloqueia tecnicamente qualquer push --force em branches com mais de um colaborador",
              "Porque rebase apaga arquivos do disco da outra pessoa automaticamente na próxima sincronização",
              "Porque rebase em branch compartilhada consome a cota de armazenamento do repositório remoto mais rápido",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
