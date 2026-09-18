import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-projeto-guiado-fluxo-de-feature",
  title: "Projeto guiado: da branch à release",
  summary:
    "Junta tudo — fundamentos e intermediário — num fluxo só, do jeito que acontece de verdade num time.",
  estimatedMinutes: 22,
  level: "intermediario",
};

export default function Licao14ProjetoGuiadoFluxoDeFeature() {
  return (
    <LessonBody>
      <p>
        As lições anteriores mostraram cada ferramenta isolada. Na prática, um dia de trabalho normal usa várias
        delas em sequência, sem parar pra pensar em qual comando é "de fundamentos" e qual é "avançado". Este
        projeto guiado percorre o fluxo completo: criar a branch, trabalhar, limpar o histórico, abrir PR, mergear e
        publicar uma release — como se você estivesse implementando uma feature real de ponta a ponta.
      </p>

      <h2>1. Sincronizar e criar a branch</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`git checkout main
git pull origin main            # garante que main está atualizada antes de ramificar
git switch -c feature/cupom-desconto`}
      />

      <h2>2. Trabalhar e commitar em pedaços pequenos</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`# implementa o formulário de cupom...
git add src/checkout/cupom-form.tsx
git commit -m "wip: formulário de cupom"

# implementa a validação...
git add src/checkout/validar-cupom.ts
git commit -m "wip: valida formato do cupom"

# corrige um typo que só percebeu depois
git add src/checkout/cupom-form.tsx
git commit -m "corrige typo no placeholder"

# integra os dois
git add src/checkout/checkout-page.tsx
git commit -m "integra validação de cupom no checkout"`}
      />
      <p>
        Quatro commits, alguns com mensagem provisória ("wip") — normal durante o trabalho. Ninguém além de você
        precisa ver essa história de tentativa, então antes de abrir o PR vale limpar.
      </p>

      <h2>3. Limpar o histórico com rebase interativo</h2>
      <CodeExample label="terminal" language="bash" code={`git rebase -i HEAD~4`} />
      <CodeExample
        label="editor — reescrevendo pra 1 commit só"
        language="plaintext"
        code={`pick a1b2c3d wip: formulário de cupom
squash e4f5a6b wip: valida formato do cupom
squash 7c8d9e0 corrige typo no placeholder
squash f0a1b2c integra validação de cupom no checkout`}
      />
      <p>
        Como esses commits só existem localmente (ainda não houve <code>push</code>), reescrever é seguro — é
        exatamente o caso de uso descrito na lição de rebase. O resultado: um commit único, com mensagem final
        clara.
      </p>
      <CodeExample
        label="terminal — depois do rebase"
        language="bash"
        result={`a9f1c2d (HEAD -> feature/cupom-desconto) Adiciona validação de cupom de desconto no checkout`}
        code={`git log --oneline -1`}
      />

      <h2>4. Push e Pull Request</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`branch 'feature/cupom-desconto' set up to track 'origin/feature/cupom-desconto'.`}
        code={`git push -u origin feature/cupom-desconto`}
      />
      <p>
        Depois do push, abre-se o PR no GitHub: <code>feature/cupom-desconto → main</code>. O CI roda, alguém
        revisa, pede um ajuste pequeno — você commita a correção normalmente na mesma branch e dá push de novo (sem
        precisar de rebase agora, porque a branch já foi compartilhada no PR).
      </p>

      <h2>5. Squash merge — main só vê o resultado final</h2>
      <CodeExample
        label="terminal — depois do PR aprovado (squash merge feito pelo GitHub)"
        language="bash"
        result={`Updating d4c8f1a..b7e3a90
Fast-forward
 src/checkout/cupom-form.tsx      | 40 ++++++++++++++++++
 src/checkout/validar-cupom.ts    | 22 ++++++++++
 src/checkout/checkout-page.tsx   |  6 +++--
 3 files changed, 66 insertions(+), 2 deletions(-)`}
        code={`git checkout main
git pull origin main`}
      />
      <p>
        "Squash merge" (opção comum no botão de merge do GitHub) junta todos os commits do PR — mesmo que tivessem
        sobrado vários — num único commit em <code>main</code>. Combinado com o rebase que você já fez, o histórico
        de <code>main</code> fica com um commit por feature, fácil de ler meses depois.
      </p>

      <h2>6. Tag de release</h2>
      <p>
        Depois de acumular algumas features mergeadas, chega o momento de publicar uma versão. A feature de cupom é
        funcionalidade nova e compatível com o que já existia — segundo semver, isso incrementa o <code>MINOR</code>.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`git tag -a v1.6.0 -m "Adiciona cupom de desconto no checkout"
git push origin v1.6.0`}
      />
      <p>
        No GitHub, essa tag vira a base de uma Release, com as notas do que mudou desde a <code>v1.5.0</code> — o
        fluxo inteiro, de uma linha de código nova até uma versão publicada, rastreável do primeiro commit até a
        tag final.
      </p>

      <h2>Resumo do fluxo</h2>
      <CodeExample
        label="do início ao fim"
        language="plaintext"
        code={`git pull origin main             → sincroniza antes de começar
git switch -c feature/x           → cria a branch de trabalho
...commits pequenos durante o desenvolvimento...
git rebase -i HEAD~N              → limpa o histórico local (só antes do push)
git push -u origin feature/x      → compartilha a branch
Pull Request → review → CI        → checagem antes de afetar main
Squash merge                       → main recebe 1 commit limpo por feature
git tag -a vX.Y.Z                 → marca a versão publicada
git push origin vX.Y.Z            → compartilha a tag`}
      />

      <Exercise
        prompt={
          <p>
            Você fez 6 commits "wip" numa branch de feature que <strong>já foi pushada</strong> e já está com um PR
            aberto, com um colega revisando. Você quer limpar o histórico antes do merge. É seguro rodar{" "}
            <code>git rebase -i HEAD~6</code> e depois <code>git push --force</code> nessa branch? Por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Depende de quem mais já baixou essa branch — mas geralmente ainda é
aceitável numa branch de feature PESSOAL com PR aberto, DESDE QUE
seu colega não tenha dado "git pull" nela localmente (revisar no
GitHub não conta, isso não baixa a branch).

Se ele já tiver puxado a branch localmente para testar, um push
--force depois do rebase vai divergir o histórico dele do remoto —
aí a alternativa mais segura é avisar antes, ou simplesmente não
reescrever depois que alguém começou a trabalhar em cima daquela
branch. A regra de ouro continua: rebase é seguro em histórico que
só você usa; fica arriscado assim que mais alguém depende dele.`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Nesse fluxo, em que momento faz sentido usar rebase interativo, e por quê?",
            options: [
              "Depois do PR já ter sido aprovado e mergeado em main, para simplificar o histórico já publicado",
              "Antes do push da branch de feature, enquanto os commits ainda são só locais — é o momento seguro para reescrever, antes de compartilhar",
              "Nunca — squash merge no GitHub já torna o rebase local desnecessário em qualquer situação",
              "Somente depois que outra pessoa já revisou e comentou no PR, para incorporar o feedback",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que criar uma tag de release depois do squash merge, em vez de marcar a branch de feature diretamente?",
            options: [
              "Porque tags só podem ser criadas em branches que já foram apagadas",
              "Porque branches de feature não podem receber merge sem uma tag associada",
              "Porque squash merge apaga automaticamente o histórico de tags anteriores",
              "Porque a tag marca um ponto estável e publicado em main — a branch de feature é só um trabalho em andamento, sem esse significado",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
