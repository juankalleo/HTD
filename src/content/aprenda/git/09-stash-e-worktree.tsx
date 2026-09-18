import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-stash-e-worktree",
  title: "git stash e worktree: trocando de contexto sem perder trabalho",
  summary:
    "Alguém pede um hotfix urgente no meio de uma mudança inacabada — dá pra pausar sem commitar lixo nem perder nada.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao09StashEWorktree() {
  return (
    <LessonBody>
      <p>
        Você está no meio de uma mudança que não compila ainda, e alguém pede pra corrigir um bug urgente em{" "}
        <code>main</code> agora. Trocar de branch com arquivos modificados nem sempre funciona — o git recusa o{" "}
        <code>checkout</code> se a mudança colidiria com o que já existe na outra branch. Commitar "pra guardar" cria
        um commit incompleto que você depois precisa desfazer. Existe uma terceira opção.
      </p>

      <h2>git stash — guarda as mudanças de lado, sem commitar</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Saved working directory and index state WIP on feature/checkout: a3f9e2b Adiciona validação`}
        code={`git stash`}
      />
      <p>
        Isso pega todas as mudanças não commitadas (arquivos já rastreados) e guarda numa pilha separada, deixando
        sua branch limpa — como se você nunca tivesse mexido em nada. Agora dá pra trocar de branch, resolver o
        hotfix, e voltar depois.
      </p>
      <CodeExample
        label="terminal — voltando depois"
        language="bash"
        code={`git checkout feature/checkout
git stash pop     # traz de volta as mudanças guardadas E remove da pilha`}
      />

      <h2>Arquivos novos (untracked) não entram no stash por padrão</h2>
      <p>
        <code>git stash</code> sozinho ignora arquivos que você criou mas nunca deu <code>git add</code> — eles
        continuam ali, sem serem guardados. Se a mudança pausada incluir arquivo novo, use{" "}
        <code>--include-untracked</code>.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`git stash --include-untracked
# ou, abreviado:
git stash -u`}
      />

      <h2>list, pop e apply — a diferença que confunde</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`stash@{0}: WIP on feature/checkout: a3f9e2b Adiciona validação
stash@{1}: WIP on main: c519747 Commit inicial`}
        code={`git stash list   # mostra tudo que está guardado — dá pra ter vários stashes ao mesmo tempo`}
      />
      <p>
        <code>git stash pop</code> aplica o stash mais recente <strong>e apaga ele da pilha</strong>.{" "}
        <code>git stash apply</code> aplica sem apagar — útil quando você quer levar a mesma mudança pra mais de uma
        branch, ou quer ter certeza de que aplicou certo antes de descartar o backup.
      </p>

      <h2>git worktree — duas branches ao vivo, sem clonar de novo</h2>
      <p>
        Stash resolve pausar rapidamente. Mas às vezes você quer literalmente trabalhar em duas branches{" "}
        <strong>ao mesmo tempo</strong> — rodar o app numa versão enquanto edita código em outra, sem ficar trocando
        de branch e reinstalando dependências toda hora. <code>git worktree</code> cria uma segunda pasta, ligada ao
        mesmo repositório <code>.git</code>, cada uma numa branch diferente.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Preparing worktree (new branch 'hotfix/login')
HEAD is now at c519747 Commit inicial`}
        code={`git worktree add ../projeto-hotfix hotfix/login`}
      />
      <p>
        Agora <code>../projeto-hotfix</code> é uma pasta separada no disco, com seus próprios arquivos, na branch{" "}
        <code>hotfix/login</code> — mas compartilhando o mesmo histórico e configuração do repositório original. Não
        precisa clonar de novo, não duplica o <code>.git</code> inteiro.
      </p>
      <CodeExample
        label="terminal — terminando de usar"
        language="bash"
        code={`git worktree remove ../projeto-hotfix`}
      />

      <Exercise
        prompt={
          <p>
            Você está com 2 arquivos modificados (já rastreados) e 1 arquivo novo (untracked) na branch{" "}
            <code>feature/relatorio</code>. Precisa trocar pra <code>main</code> agora e levar as 3 mudanças
            guardadas, incluindo a nova. Qual comando roda?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`git stash --include-untracked
# sem a flag, o arquivo novo (untracked) ficaria de fora do stash
# e continuaria "solto" na branch, sem ser guardado`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que git stash sozinho às vezes não guarda tudo que você esperava?",
            options: [
              "Porque ele só guarda arquivos com menos de 100 linhas modificadas",
              "Porque arquivos novos (untracked, nunca adicionados com git add) ficam de fora por padrão — é preciso usar --include-untracked",
              "Porque stash tem um limite de 1 arquivo por vez",
              "Porque ele só funciona em repositórios que já têm pelo menos um remoto configurado",
            ],
            correctIndex: 1,
          },
          {
            question: "Qual a vantagem de git worktree sobre simplesmente trocar de branch com checkout?",
            options: [
              "worktree é mais rápido porque não salva histórico de commits",
              "worktree substitui completamente a necessidade de branches no projeto",
              "worktree cria uma segunda pasta ligada ao mesmo .git, permitindo trabalhar em duas branches ao mesmo tempo sem clonar o repositório de novo",
              "worktree é obrigatório para repositórios com mais de uma branch remota",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
