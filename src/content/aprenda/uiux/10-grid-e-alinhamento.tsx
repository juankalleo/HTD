import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-grid-e-alinhamento",
  title: "Grid e alinhamento",
  summary: "Ninguém consegue apontar o pixel torto, mas todo mundo sente que 'algo está errado' numa tela desalinhada.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao10GridEAlinhamento() {
  return (
    <LessonBody>
      <p>
        Um dos sinais mais subconscientes de "essa tela não foi bem cuidada" é o desalinhamento — nem sempre a pessoa
        consegue apontar exatamente o que está errado, mas ela sente. A regra prática por trás disso é simples de
        enunciar e fácil de esquecer no dia a dia: <strong>nada numa tela deveria "flutuar" sem se alinhar a alguma
        coisa</strong> — uma borda, uma coluna, o centro de outro elemento próximo.
      </p>

      <h2>Alinhamento como continuidade</h2>
      <p>
        Isso conecta direto com o princípio de <strong>continuidade</strong> da Gestalt (lição 5): o olho espera que
        elementos numa mesma região sigam uma linha imaginária. Quando um título começa 2px mais à esquerda que o
        parágrafo abaixo dele, ou um ícone não está centralizado com o texto ao lado, essa linha imaginária quebra —
        e é exatamente essa quebra sutil que o olho detecta como "errado" sem conseguir nomear.
      </p>

      <h2>Grid de 8px (ou 4px) pra espaçamento consistente</h2>
      <p>
        Uma prática comum pra evitar espaçamentos arbitrários (<code>13px</code>, <code>22px</code>,{" "}
        <code>7px</code> espalhados pelo projeto) é adotar uma escala de espaçamento em múltiplos de <code>8px</code>{" "}
        (ou <code>4px</code> pra mais granularidade). Isso não é regra técnica do CSS — é uma convenção que faz os
        espaçamentos se relacionarem entre si de forma previsível, então elementos parecem pertencer ao mesmo sistema,
        em vez de terem sido ajustados "no olho" um por um.
      </p>
      <CodeExample
        label="Escala de espaçamento em múltiplos de 8px"
        language="css"
        code={`--space-1: 4px;
--space-2: 8px;
--space-3: 16px;
--space-4: 24px;
--space-5: 32px;
--space-6: 48px;

/* em vez de margin-bottom: 13px, usa-se var(--space-2) ou var(--space-3) —
   o valor mais próximo da escala, nunca um número solto */`}
      />

      <h2>Grid de colunas pra estrutura da página</h2>
      <p>
        Além do espaçamento, uma grade de colunas (por exemplo, 12 colunas) dá aos elementos maiores — seções, cards,
        blocos de conteúdo — pontos de alinhamento comuns. Um card que ocupa 4 de 12 colunas e outro que ocupa 8 de 12
        continuam alinhados nas bordas externas da grade, mesmo tendo tamanhos diferentes — é isso que faz um layout
        com elementos de tamanhos variados ainda parecer organizado, em vez de aleatório.
      </p>

      <Exercise
        prompt={
          <p>
            Um card de dashboard tem <code>padding: 13px</code>, o título tem <code>margin-bottom: 11px</code> e o
            botão dentro dele tem <code>margin-top: 18px</code>. Reescreva esses três valores usando uma escala de
            8px, escolhendo o valor mais próximo do original.
          </p>
        }
        solutionLanguage="css"
        solutionCode={`.card    { padding: 16px; }         /* 13px → 16px (2 × 8) */
.titulo  { margin-bottom: 8px; }    /* 11px → 8px (1 × 8) */
.botao   { margin-top: 16px; }      /* 18px → 16px (2 × 8) */
/* nenhum dos três precisa ser exato ao original — o objetivo é que os
   espaçamentos do projeto inteiro sejam previsíveis entre si */`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que significa dizer que 'nada numa tela deveria flutuar sem alinhar a alguma coisa'?",
            options: [
              "Que todo elemento precisa ter position: absolute definido explicitamente",
              "Que elementos flutuantes (float: left/right) são proibidos em CSS moderno",
              "Que cada elemento precisa ter uma sombra para parecer conectado ao fundo",
              "Que cada elemento deve se alinhar a uma borda, coluna ou ao centro de outro elemento próximo, não ficar solto por conta própria",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que usar uma escala de espaçamento em múltiplos de 4px ou 8px (em vez de valores arbitrários como 13px, 22px) ajuda a consistência visual?",
            options: [
              "Porque múltiplos de 4 ou 8 são os únicos valores que o CSS aceita para margin e padding",
              "Porque isso reduz automaticamente o tempo de carregamento da página",
              "Porque os espaçamentos passam a se relacionar entre si de forma previsível, então os elementos parecem pertencer ao mesmo sistema",
              "Porque isso é exigido pela especificação oficial do WCAG para contraste",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
