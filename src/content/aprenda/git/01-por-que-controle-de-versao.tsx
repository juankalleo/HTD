import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-por-que-controle-de-versao",
  title: "Por que controle de versão",
  summary: "O problema que git resolve: histórico, colaboração e a possibilidade real de desfazer qualquer coisa.",
  estimatedMinutes: 10,
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
              "São a mesma ferramenta, nomes diferentes",
              "Git é a ferramenta de versionamento que roda local; GitHub é um serviço que hospeda uma cópia remota do repositório git",
              "GitHub substituiu completamente o git",
              "Git só funciona dentro do GitHub",
            ],
            correctIndex: 1,
          },
          {
            question: "Qual problema do 'projeto-final-v2-CORRIGIDO' o git resolve?",
            options: [
              "Nenhum, é só estética de nome de pasta",
              "Histórico real de mudanças com autor/data, capacidade de reverter qualquer ponto, e colaboração sem sobrescrever o trabalho alheio",
              "Só resolve o tamanho do arquivo",
              "Git não resolve esse problema",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
