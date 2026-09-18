import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-hooks-e-automacao",
  title: "Hooks de git: automatizando antes do commit/push",
  summary:
    "Esperar o CI reprovar pra descobrir que esqueceu um console.log é lento — hooks rodam a checagem antes, na sua máquina.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao13HooksEAutomacao() {
  return (
    <LessonBody>
      <p>
        Você commita, dá push, espera o CI rodar (às vezes minutos), e só então descobre que o lint reprovou por
        causa de um <code>console.log</code> esquecido. O feedback existe, mas chegou tarde — depois de já ter
        saído da sua máquina. <strong>Hooks</strong> são scripts que o git roda automaticamente em certos momentos
        (antes do commit, antes do push...) — a mesma checagem, só que rodando na hora, antes de qualquer coisa sair
        do seu computador.
      </p>

      <h2>O que é um hook, na prática</h2>
      <p>
        Todo repositório git tem uma pasta <code>.git/hooks/</code> com exemplos desativados. Um hook é só um
        script executável com um nome específico — o git chama esse script sozinho no momento certo, e se ele
        terminar com erro, a ação (commit, push...) é cancelada.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`.git/hooks/pre-commit.sample
.git/hooks/commit-msg.sample
.git/hooks/pre-push.sample
...`}
        code={`ls .git/hooks/`}
      />
      <p>
        Os principais: <code>pre-commit</code> (roda antes do commit ser criado — ótimo pra lint e formatação),{" "}
        <code>commit-msg</code> (roda depois de escrever a mensagem — valida se ela segue um padrão), e{" "}
        <code>pre-push</code> (roda antes de mandar pro remoto — ótimo pra rodar os testes).
      </p>

      <h2>O problema de configurar isso manualmente</h2>
      <p>
        A pasta <code>.git/hooks/</code> <strong>não é versionada</strong> — ela fica de fora do repositório, então
        cada pessoa do time precisaria copiar os scripts manualmente depois de clonar. Isso não escala: é fácil
        esquecer, e não tem como forçar todo mundo a ter os hooks ativos.
      </p>

      <h2>Husky + lint-staged: a automação que o time inteiro compartilha</h2>
      <p>
        <strong>Husky</strong> resolve o problema de distribuição — ele guarda a configuração dos hooks dentro do
        próprio repositório (versionada, num arquivo de configuração), e se instala automaticamente pra todo mundo
        que rodar <code>npm install</code>. <strong>lint-staged</strong> complementa rodando o lint só nos arquivos
        que estão na staging area, não no projeto inteiro — muito mais rápido.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`npx husky init
echo "npx lint-staged" > .husky/pre-commit`}
      />
      <CodeExample
        label="package.json"
        language="json"
        code={`{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}`}
      />
      <CodeExample
        label="terminal — o que acontece num commit com erro de lint"
        language="bash"
        result={`✖ eslint --fix:
  src/checkout.tsx
    12:5  error  'total' is never reassigned. Use 'const' instead  prefer-const

husky - pre-commit hook exited with code 1 (error)`}
        code={`git commit -m "Adiciona cálculo de frete"`}
      />
      <p>
        O commit é bloqueado antes mesmo de existir — nenhum código com erro de lint chega a entrar no histórico,
        muito menos a subir pro CI.
      </p>

      <h2>Por que isso é mais rápido que esperar o CI</h2>
      <p>
        CI roda numa máquina remota, geralmente depois do <code>push</code> — o ciclo é: escrever código, commitar,
        pushar, esperar a pipeline (build + testes + lint), só então ver o resultado. Um hook roda{" "}
        <strong>local</strong>, em segundos, antes do commit sequer existir. O erro mais comum (lint, formatação,
        teste quebrado óbvio) é pego no ponto mais barato possível de corrigir — antes de qualquer coisa sair da sua
        máquina. CI continua necessário como rede de segurança final, mas hooks evitam que a maioria dos erros
        triviais cheguem até lá.
      </p>

      <Exercise
        prompt={
          <p>
            Um time quer garantir que ninguém commite código com erro de ESLint, e que essa checagem funcione
            automaticamente para qualquer pessoa que clonar o repositório, sem configuração manual. Que combinação
            de ferramentas resolve isso, e por que copiar scripts manualmente pra <code>.git/hooks/</code> não seria
            suficiente?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Husky + lint-staged, configurados via npm install.

Motivo: .git/hooks/ não é versionada pelo git — fica de fora do
repositório. Copiar scripts manualmente ali exigiria que cada pessoa
lembrasse de fazer isso depois de clonar, e não haveria garantia de
que todo mundo tem a checagem ativa. Husky guarda a configuração
dentro do repositório (versionada) e se instala sozinho no
"npm install", garantindo que o hook existe pra qualquer um do time.`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que copiar scripts manualmente para .git/hooks/ não é uma solução confiável para um time inteiro?",
            options: [
              "Porque o git limita a pasta hooks a no máximo 3 scripts por repositório",
              "Porque hooks manuais só funcionam em sistemas operacionais baseados em Linux",
              "Porque .git/hooks/ não é versionada pelo git, então cada pessoa precisaria copiar os scripts manualmente após clonar, sem garantia de que todos fariam isso",
              "Porque scripts em .git/hooks/ são apagados automaticamente a cada git pull",
            ],
            correctIndex: 2,
          },
          {
            question: "Qual a vantagem principal de um hook pre-commit em relação a esperar o CI reprovar?",
            options: [
              "O hook roda localmente, em segundos, antes do commit existir — pega erros comuns no ponto mais barato de corrigir, sem depender de subir código pro remoto",
              "O hook substitui completamente a necessidade de ter CI configurado no projeto",
              "O hook garante que o código nunca terá bugs, diferente do CI que só pega parte deles",
              "O hook roda mais testes do que o CI seria capaz de rodar em uma pipeline normal",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
