import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-pull-requests-e-code-review",
  title: "Pull requests e code review",
  summary: "O mecanismo que transforma 'juntar código' numa conversa, em vez de um merge silencioso.",
  estimatedMinutes: 12,
};

export default function Licao06PullRequestsECodeReview() {
  return (
    <LessonBody>
      <p>
        Um <strong>Pull Request</strong> (PR) — "Merge Request" no GitLab — não é um comando git, é um recurso do
        GitHub (ou similar): um pedido pra juntar uma branch na outra, que vira uma tela onde dá pra comentar linha
        por linha, rodar testes automáticos, e exigir aprovação antes do merge acontecer de verdade.
      </p>

      <h2>O fluxo típico</h2>
      <CodeExample
        label="da branch ao merge"
        language="plaintext"
        code={`1. git push origin feature/checkout       — manda a branch pro GitHub
2. Abre um PR: feature/checkout → main
3. CI roda automaticamente (build, testes, lint)
4. Alguém revisa: comenta, pede mudança, ou aprova
5. Depois de aprovado + CI verde: merge (pelo botão do GitHub, ou localmente)
6. A branch pode ser apagada — o histórico do PR fica registrado pra sempre`}
      />

      <h2>Por que revisar antes de juntar, em vez de push direto em main</h2>
      <p>
        Um PR cria um ponto de checagem antes do código virar parte da branch principal — um segundo par de olhos
        pega bug, sugestão de nome melhor, ou uma abordagem mais simples, <strong>antes</strong> de afetar todo mundo
        que trabalha em cima de <code>main</code>. Times sérios travam <code>main</code> pra só aceitar mudança via
        PR aprovado — nunca commit direto.
      </p>

      <h2>Uma boa descrição de PR</h2>
      <CodeExample
        label="exemplo de descrição"
        language="plaintext"
        code={`## O que mudou
Adiciona validação de e-mail no formulário de cadastro.

## Por quê
Usuários estavam conseguindo cadastrar com e-mail inválido (bug #142).

## Como testar
1. Ir em /cadastro
2. Tentar cadastrar com "não-é-email"
3. Deve mostrar erro antes de enviar`}
      />
      <p>
        "O quê" o diff já mostra sozinho — a descrição existe pra explicar o <strong>porquê</strong>, que ninguém
        adivinha só olhando código.
      </p>

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Um Pull Request é um comando do git?",
            options: [
              "Sim, é 'git pull-request'",
              "Não — é um recurso do GitHub/GitLab, uma tela pra revisar e discutir antes de juntar uma branch na outra",
              "É sinônimo de git merge",
              "Só existe no GitLab",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que travar main pra só aceitar mudança via PR aprovado?",
            options: [
              "Só burocracia, sem benefício real",
              "Cria um ponto de checagem (revisão + CI) antes do código afetar todo mundo que trabalha em cima de main",
              "É mais rápido que commit direto",
              "GitHub exige isso obrigatoriamente",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
