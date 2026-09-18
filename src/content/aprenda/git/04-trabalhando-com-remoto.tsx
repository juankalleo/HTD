import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-trabalhando-com-remoto",
  title: "Trabalhando com remoto (push/pull/clone)",
  summary: "Como o repositório local conversa com uma cópia hospedada no GitHub.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao04TrabalhandoComRemoto() {
  return (
    <LessonBody>
      <h2>clone — copiar um repositório que já existe</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Cloning into 'meu-projeto'...
remote: Enumerating objects: 142, done.
Receiving objects: 100% (142/142), done.`}
        code={`git clone https://github.com/usuario/meu-projeto.git`}
      />
      <p>
        Isso baixa o repositório inteiro — todo o histórico, todas as branches — e já configura o GitHub como{" "}
        <code>origin</code> (o nome padrão do remoto).
      </p>

      <h2>push — mandar seus commits locais pro remoto</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Enumerating objects: 5, done.
To github.com:usuario/meu-projeto.git
   a3f9e2b..d4c8f1a  main -> main`}
        code={`git push origin main`}
      />

      <h2>pull — trazer commits que outra pessoa já mandou</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Updating a3f9e2b..f8e2c91
Fast-forward
 checkout.html | 15 +++++++++++++++`}
        code={`git pull origin main`}
      />
      <p>
        <code>git pull</code> é, na prática, <code>git fetch</code> (baixa as mudanças do remoto) seguido de{" "}
        <code>git merge</code> (junta na sua branch local) — os dois passos disfarçados de um comando só.
      </p>

      <h2>O fluxo do dia a dia numa equipe</h2>
      <CodeExample
        label="rotina típica"
        language="plaintext"
        code={`1. git pull origin main          — traz o que mudou antes de começar
2. git checkout -b feature/x      — cria sua branch
3. ...trabalha, commita...
4. git push origin feature/x      — manda sua branch pro remoto
5. Abre um Pull Request no GitHub (próxima lição)
6. Depois de aprovado: merge pelo próprio GitHub (ou localmente)`}
      />

      <Exercise
        prompt={
          <p>
            Você clonou um repositório ontem. Hoje, antes de começar a trabalhar, o que você deveria rodar primeiro,
            e por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`git pull origin main

Motivo: outras pessoas podem ter commitado desde ontem. Sem puxar essas
mudanças primeiro, você corre o risco de trabalhar em cima de uma
versão desatualizada e ter mais conflito de merge depois.`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que git pull realmente faz por baixo dos panos?",
            options: [
              "Apenas um git fetch, baixando as mudanças sem aplicá-las na branch local",
              "Apaga todas as mudanças locais não commitadas e substitui pela versão do remoto",
              "É idêntico a git clone, mas reaproveitando a pasta .git já existente",
              "git fetch (baixa as mudanças do remoto) seguido de git merge (junta essas mudanças na sua branch local) — dois passos disfarçados de um só",
            ],
            correctIndex: 3,
          },
          {
            question: "O que git clone configura automaticamente?",
            options: [
              "Apenas a branch main, sem trazer o histórico de commits anteriores",
              "O remoto chamado 'origin' apontando para o repositório clonado, além de baixar todo o histórico e todas as branches",
              "Um arquivo .gitignore padrão com as configurações mais comuns do projeto",
              "As credenciais de acesso salvas permanentemente, sem precisar autenticar de novo",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
