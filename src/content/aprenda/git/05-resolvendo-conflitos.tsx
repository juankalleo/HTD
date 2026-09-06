import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-resolvendo-conflitos",
  title: "Resolvendo conflitos de merge",
  summary: "O que acontece quando duas pessoas mudam a MESMA linha — e como resolver sem entrar em pânico.",
  estimatedMinutes: 16,
};

export default function Licao05ResolvendoConflitos() {
  return (
    <LessonBody>
      <p>
        Um conflito acontece quando duas branches mudam a <strong>mesma linha</strong> de um arquivo de jeitos
        diferentes — o git não sabe qual versão manter, e para o merge no meio, pedindo pra você decidir.
      </p>

      <h2>Como o conflito aparece no arquivo</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Auto-merging config.js
CONFLICT (content): Merge conflict in config.js
Automatic merge failed; fix conflicts and then commit the result.`}
        code={`git merge feature/nova-api`}
      />
      <CodeExample
        label="config.js — como o git marca o conflito"
        language="javascript"
        code={`<<<<<<< HEAD
const API_URL = "https://api.producao.com";
=======
const API_URL = "https://api-v2.producao.com";
>>>>>>> feature/nova-api`}
      />
      <p>
        Tudo entre <code>{"<<<<<<< HEAD"}</code> e <code>=======</code> é a versão da sua branch atual; entre{" "}
        <code>=======</code> e <code>{">>>>>>> feature/nova-api"}</code> é a versão que veio de fora. Resolver
        significa editar o arquivo pra ficar do jeito certo, e apagar essas marcações.
      </p>

      <h2>Resolvendo</h2>
      <CodeExample
        label="config.js — depois de resolver (decidiu manter a v2)"
        language="javascript"
        code={`const API_URL = "https://api-v2.producao.com";`}
      />
      <CodeExample
        label="terminal — finalizando"
        language="bash"
        code={`git add config.js       # marca como resolvido
git commit                # finaliza o merge (o git já sugere uma mensagem)`}
      />

      <h2>Evitando conflito na origem</h2>
      <p>
        Conflito é mais comum quanto mais tempo uma branch fica sem sincronizar com <code>main</code>. Puxar (
        <code>git pull</code>) com frequência, e manter branches de vida curta (feature pequena, merge rápido) reduz
        drasticamente a chance de dois trechos de código colidirem.
      </p>

      <Exercise
        prompt={
          <p>
            Depois de um <code>git merge</code> que gerou conflito em 2 arquivos, você já editou e resolveu os dois
            manualmente. Quais os próximos 2 comandos?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`git add arquivo1.js arquivo2.js   # (ou "git add ." pra tudo de uma vez)
git commit                         # finaliza o merge com os conflitos resolvidos`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Quando um conflito de merge acontece?",
            options: [
              "Toda vez que duas branches são mescladas",
              "Quando duas branches mudam a mesma linha de um arquivo de jeitos diferentes, e o git não sabe qual manter",
              "Só quando o repositório é muito grande",
              "Nunca acontece se você usar git pull sempre",
            ],
            correctIndex: 1,
          },
          {
            question: "O que fica entre <<<<<<< HEAD e ======= num arquivo com conflito?",
            options: [
              "A versão que veio de fora (da outra branch)",
              "A versão da sua branch atual, antes do merge",
              "Um erro de sintaxe do git",
              "Nada, essa parte é sempre vazia",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
