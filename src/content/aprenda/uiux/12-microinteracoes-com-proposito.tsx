import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-microinteracoes-com-proposito",
  title: "Microinterações com propósito",
  summary: "Uma animação bonita e lenta não é sinal de cuidado — é quase sempre sinal de que ninguém testou a velocidade.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao12MicrointeracoesComProposito() {
  return (
    <LessonBody>
      <p>
        Microinterações são as pequenas respostas visuais que acontecem a cada ação: um botão que reage ao hover, uma
        aba que desliza ao trocar, um checkbox que confirma que foi marcado. A distinção que importa não é "tem
        animação ou não" — é se essa animação <strong>comunica uma mudança de estado real</strong> ou só decora.
      </p>

      <h2>Com propósito vs. decorativa</h2>
      <p>
        Uma animação com propósito responde a uma pergunta concreta: "o que mudou?". O botão ficou mais escuro porque
        foi clicado; a aba deslizou porque o conteúdo trocou; o card cresceu levemente porque foi selecionado. Uma
        animação decorativa não responde nada — ela só está lá, geralmente porque "parece mais dinâmico", e na
        prática distrai de quem está tentando completar uma tarefa.
      </p>

      <h2>Timing: rápido quase sempre vence</h2>
      <p>
        A duração de uma transição de interface comum (hover, troca de estado, abrir um menu) funciona melhor entre{" "}
        <strong>150ms e 250ms</strong>. Abaixo disso, a mudança parece abrupta demais pra o olho perceber que houve
        uma transição; acima de 300-400ms, a interface começa a parecer lenta e "pesada" — a pessoa sente que está
        esperando a interface, em vez de a interface responder a ela.
      </p>
      <CodeExample
        label="Timing de transição comum"
        language="css"
        code={`.aba {
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}

/* uma animação de 1200ms na mesma interação faria a troca de aba
   parecer arrastada, mesmo que o efeito em si seja "bonito" isoladamente */`}
      />
      <p>
        Isso não significa que toda animação precisa ser curta — uma transição de página inteira, ou uma celebração
        de conclusão de uma tarefa rara e importante, pode justificar mais tempo. A regra prática é: quanto mais{" "}
        <strong>frequente</strong> a interação (hover, clique comum), mais curta ela deveria ser; quanto mais{" "}
        <strong>rara e significativa</strong> (finalizar uma compra, completar um cadastro), mais espaço ela ganha
        pra respirar.
      </p>

      <Exercise
        prompt={
          <p>
            Um menu suspenso (dropdown) abre com uma animação de 900ms de duração, com um efeito de "quique"
            (bounce) exagerado. Os usuários reclamam que o menu "demora pra aparecer". Qual ajuste de timing você
            faria, e por quê?
          </p>
        }
        solutionLanguage="css"
        solutionCode={`.dropdown {
  transition: transform 180ms ease-out, opacity 180ms ease-out;
}
/* reduzir a duração pra faixa de 150-250ms e trocar o easing de "bounce"
   por algo mais direto (ease-out) — um dropdown é uma interação frequente,
   então precisa parecer imediato, não ser uma demonstração de animação. */`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que diferencia uma microinteração 'com propósito' de uma puramente decorativa?",
            options: [
              "A microinteração com propósito sempre usa uma biblioteca externa de animação",
              "Ela comunica uma mudança de estado real, como confirmar uma ação ou indicar que um elemento mudou",
              "Ela dura sempre mais de um segundo pra a pessoa perceber que algo aconteceu",
              "Ela é aplicada em todos os elementos da tela ao mesmo tempo, sem exceção",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que uma transição de 150-250ms costuma funcionar melhor que uma animação longa e 'bonita' de 1-2 segundos numa interação comum?",
            options: [
              "Porque navegadores antigos não conseguem processar animações mais longas que isso",
              "Porque animações curtas usam automaticamente menos código CSS",
              "Porque a interação precisa parecer imediata e responsiva; uma animação longa faz a interface parecer lenta",
              "Porque o WCAG exige uma duração máxima fixa para qualquer animação de interface",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
