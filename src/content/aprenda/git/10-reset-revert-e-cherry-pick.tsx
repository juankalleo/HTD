import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-reset-revert-e-cherry-pick",
  title: "reset, revert e cherry-pick: as três formas de desfazer",
  summary:
    "'Desfazer no git' não é um comando só — são três ferramentas diferentes, e usar a errada em histórico compartilhado causa dor de cabeça.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao10ResetRevertECherryPick() {
  return (
    <LessonBody>
      <p>
        "Preciso desfazer isso" pode significar coisas bem diferentes: desfazer um commit que só existe localmente,
        desfazer um commit que já foi pushado e outras pessoas já viram, ou trazer só uma mudança específica de
        outra branch sem trazer tudo. Cada caso tem uma ferramenta certa — usar a errada pode reescrever histórico
        que não devia ser reescrito.
      </p>

      <h2>git reset — move o ponteiro da branch pra trás</h2>
      <p>
        <code>reset</code> move o <code>HEAD</code> (e a branch atual) pra um commit anterior, como se os commits
        depois dele nunca tivessem existido nessa branch. As três variantes controlam o que acontece com as
        mudanças desses commits "desfeitos":
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`git reset --soft HEAD~1    # desfaz o commit, mas mantém as mudanças staged (prontas pra commitar de novo)
git reset --mixed HEAD~1   # desfaz o commit e a staging area, mas mantém as mudanças no arquivo (padrão)
git reset --hard HEAD~1    # desfaz o commit E descarta as mudanças completamente — perde o trabalho`}
      />
      <p>
        <code>--hard</code> é o único destrutivo de verdade — os outros dois só reorganizam onde a mudança "mora"
        (commit, staging, ou arquivo), sem apagar código.
      </p>

      <h2>git revert — desfaz publicamente, criando um commit novo</h2>
      <p>
        <code>revert</code> não apaga nem reescreve nada — ele cria um <strong>commit novo</strong> que aplica o
        efeito contrário do commit escolhido. O commit problemático continua no histórico (pra quem quiser auditar),
        e o revert some por cima dele.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`[main a1b2c3d] Revert "Adiciona cache agressivo no endpoint de login"
 1 file changed, 3 deletions(-)`}
        code={`git revert a3f9e2b   # cria um commit que desfaz a3f9e2b`}
      />

      <h2>reset vs. revert: a regra que importa em equipe</h2>
      <p>
        <code>reset</code> reescreve o histórico da branch (os commits desfeitos deixam de existir nela) —{" "}
        <strong>seguro só em commits locais, não pushados</strong>, exatamente pela mesma razão do rebase (lição
        anterior). <code>revert</code> não reescreve nada, só adiciona — por isso é a ferramenta certa pra desfazer
        algo em <code>main</code> ou qualquer branch que outras pessoas já têm localmente.
      </p>
      <CodeExample
        label="regra prática"
        language="plaintext"
        code={`Commit só local, ainda não pushado, quer apagar de vez → git reset
Commit já em main / já pushado / outras pessoas já viram → git revert`}
      />

      <h2>git cherry-pick — traz um commit específico, sem trazer a branch toda</h2>
      <p>
        Às vezes você quer só <strong>um</strong> commit de outra branch — não a branch inteira via merge.{" "}
        <code>cherry-pick</code> pega esse commit específico e reaplica na sua branch atual, como um commit novo com
        o mesmo conteúdo.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`[hotfix/producao d4c8f1a] Corrige validação de e-mail com espaço em branco`}
        code={`git checkout hotfix/producao
git cherry-pick a3f9e2b   # traz só esse commit específico, feito originalmente em outra branch`}
      />
      <p>
        Uso clássico: alguém corrigiu um bug numa branch de feature ainda não finalizada, mas esse fix específico
        precisa ir pra produção agora — sem esperar o resto da feature ficar pronto.
      </p>

      <Exercise
        prompt={
          <p>
            Um commit com um bug sério já foi pushado pra <code>main</code> há 2 dias, e outras 3 pessoas já deram{" "}
            <code>pull</code>. Você precisa desfazer o efeito desse commit agora. Por que <code>git reset</code> seria
            uma escolha arriscada aqui, e o que usar no lugar?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`git revert <hash-do-commit>

Motivo: reset reescreveria o histórico de main removendo o commit —
como as outras 3 pessoas já têm esse commit localmente, o histórico
delas divergiria do remoto após um push --force, causando conflitos.
revert cria um commit novo que desfaz o efeito, sem apagar nada do
histórico já compartilhado.`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença essencial entre git revert e git reset?",
            options: [
              "Não há diferença real, são apelidos para o mesmo comando em versões diferentes do git",
              "revert cria um commit novo que desfaz o efeito de outro, sem reescrever histórico; reset move a branch pra trás, reescrevendo o que existe nela",
              "reset só funciona em main; revert funciona em qualquer branch",
              "revert exige conexão com o remoto; reset funciona apenas localmente",
            ],
            correctIndex: 1,
          },
          {
            question: "Para que serve git cherry-pick?",
            options: [
              "Para apagar um commit específico do histórico de todas as branches de uma vez",
              "Para renomear a mensagem de um commit já existente sem alterar seu conteúdo",
              "Para escolher automaticamente qual branch deve ser priorizada num merge com conflito",
              "Para trazer um commit específico de outra branch e reaplicá-lo na branch atual, sem trazer o restante da branch de origem",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
