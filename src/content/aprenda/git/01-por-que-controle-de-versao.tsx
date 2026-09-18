import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-por-que-controle-de-versao",
  title: "Por que controle de versão",
  summary: "O problema que git resolve: histórico, colaboração e a possibilidade real de desfazer qualquer coisa.",
  estimatedMinutes: 10,
  level: "fundamentos",
};

export default function Licao01PorQueControleDeVersao() {
  return (
    <LessonBody>
      <p>
        Antes de git, o jeito comum de "versionar" um projeto era isso:
      </p>
      <CodeExample
        label="o problema"
        language="plaintext"
        code={`projeto/
projeto-final/
projeto-final-v2/
projeto-final-v2-CORRIGIDO/
projeto-final-USAR-ESSE/`}
      />
      <p>
        Isso não escala — ninguém sabe o que mudou entre uma pasta e outra, não dá pra colaborar sem sobrescrever o
        trabalho de alguém, e "desfazer" significa procurar manualmente a pasta certa (se ela ainda existir).
      </p>

      <h2>O que git resolve</h2>
      <CodeExample
        label="com git"
        language="plaintext"
        code={`Histórico completo    → toda mudança fica registrada, com autor, data e o que mudou exatamente
Reverter qualquer coisa → dá pra voltar pra qualquer ponto anterior, mesmo meses depois
Trabalhar em paralelo  → duas pessoas mexem no mesmo projeto sem sobrescrever uma a outra
Rastrear "quem mudou o quê" → cada linha de código tem um autor e um motivo (a mensagem do commit)`}
      />

      <h2>Git é local; GitHub é só um lugar pra hospedar</h2>
      <p>
        Uma confusão comum no início: git e GitHub não são a mesma coisa. <strong>Git</strong> é a ferramenta que
        roda na sua máquina, versiona seus arquivos localmente — funciona até sem internet. <strong>GitHub</strong>{" "}
        (ou GitLab, Bitbucket) é um serviço que hospeda uma <em>cópia remota</em> do seu repositório git, pra
        backup e colaboração. Você pode usar git sem nunca tocar no GitHub; não dá pra usar GitHub sem git por
        baixo.
      </p>

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a relação entre git e GitHub?",
            options: [
              "GitHub é a ferramenta de versionamento que roda local, e o git é o serviço que hospeda a cópia remota",
              "Git e GitHub são a mesma ferramenta, só muda o nome comercial dependendo do sistema operacional",
              "Git é a ferramenta de versionamento que roda local, na sua máquina; GitHub é um serviço que hospeda uma cópia remota do repositório git",
              "Git é um plugin que só funciona instalado dentro do GitHub Desktop, sem uso via linha de comando",
            ],
            correctIndex: 2,
          },
          {
            question: "Qual problema do 'projeto-final-v2-CORRIGIDO' o git resolve?",
            options: [
              "Histórico real de mudanças com autor e data, a possibilidade de reverter para qualquer ponto anterior, e colaboração sem sobrescrever o trabalho de outra pessoa",
              "Apenas a organização visual das pastas do projeto, sem guardar histórico de mudanças de fato",
              "Redução do tamanho total dos arquivos do projeto, já que o git comprime tudo automaticamente",
              "Sincronização automática de nomes de pasta entre os computadores de todos os membros do time",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
