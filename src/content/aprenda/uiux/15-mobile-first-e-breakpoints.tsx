import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-mobile-first-e-breakpoints",
  title: "Mobile-first e breakpoints pensando em conteúdo",
  summary: "Desenhar pro espaço pequeno primeiro não é 'trabalho extra' — é o que te obriga a decidir o que realmente importa.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao15MobileFirstEBreakpoints() {
  return (
    <LessonBody>
      <p>
        Desenhar primeiro pro espaço grande (desktop) e "encolher" depois pro celular costuma resultar em telas
        cheias de elementos que não cabem de verdade em pouco espaço — a solução vira empilhar tudo em uma coluna
        infinita, sem nenhuma decisão real sobre prioridade. Desenhar <strong>mobile-first</strong> inverte isso: você
        começa pelo espaço mais restrito, que naturalmente força a pergunta "o que é essencial aqui?".
      </p>

      <h2>Por que a restrição ajuda a priorizar</h2>
      <p>
        Numa tela de 375px de largura, não cabe tudo que cabia numa tela de 1440px — e essa limitação é uma vantagem
        disfarçada. Ela obriga a decidir, por exemplo, que uma barra lateral de filtros vira um botão que abre um
        painel só quando necessário, que uma tabela densa vira uma lista de cards com a informação mais importante
        visível e o resto atrás de um "ver mais". Fazer esse exercício de priorização primeiro, e só depois adicionar
        elementos extras conforme o espaço cresce, tende a produzir uma versão desktop mais enxuta também.
      </p>

      <h2>Breakpoint decidido pelo conteúdo, não pelo dispositivo</h2>
      <p>
        Uma tentação comum é escolher breakpoints com base em dispositivos específicos ("largura de iPhone",
        "largura de iPad"). O problema é que existem centenas de tamanhos de tela reais, e novos aparelhos surgem o
        tempo todo — não dá pra cobrir todos com breakpoints fixos por dispositivo. A alternativa mais estável é
        deixar o <strong>conteúdo</strong> decidir: aumente a largura da janela gradualmente e observe em que ponto o
        layout começa a ficar estranho (texto espremido, cards apertados demais, muito espaço vazio sobrando) — esse
        ponto, não um tamanho de aparelho, é o breakpoint certo.
      </p>
      <CodeExample
        label="Breakpoint escolhido pelo ponto em que o conteúdo quebra"
        language="css"
        code={`.cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* em vez de "@media (min-width: 768px)" porque é a largura de um tablet
   específico, o valor abaixo foi escolhido observando que, a partir de
   640px, os cards já cabem lado a lado sem espremer o texto */
@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}`}
      />

      <Exercise
        prompt={
          <p>
            Um time definiu breakpoints como <code>@media (min-width: 414px)</code> porque "é a largura do iPhone 11".
            Seis meses depois, um card de produto fica visivelmente espremido em telas de 390px de largura, um
            tamanho comum de celular mais recente. O que isso revela sobre a escolha original do breakpoint?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Revela que o breakpoint foi escolhido em função de um dispositivo
específico, não do ponto em que o conteúdo realmente quebra — por isso ele
não cobre um tamanho de tela mais novo e comum. A correção é testar o
layout gradualmente em várias larguras e definir o breakpoint no ponto
exato em que o card começa a ficar espremido, não amarrado a um aparelho.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que desenhar primeiro pra tela pequena (mobile-first) ajuda a priorizar o conteúdo?",
            options: [
              "Porque telas pequenas carregam JavaScript mais rápido que telas grandes",
              "Porque o espaço limitado obriga a decidir o que é realmente essencial antes de adicionar o resto",
              "Porque o CSS mobile-first é obrigatório por especificação do W3C",
              "Porque isso elimina a necessidade de testar em qualquer outro tamanho de tela depois",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que é melhor decidir um breakpoint pelo ponto em que o CONTEÚDO quebra (texto espremido, cards apertados) do que por um tamanho de dispositivo específico, como 'largura de iPhone'?",
            options: [
              "Porque dispositivos novos surgem o tempo todo em tamanhos variados, mas o ponto em que o layout realmente quebra é uma referência estável",
              "Porque não é tecnicamente possível escrever uma media query para um tamanho de dispositivo específico",
              "Porque breakpoints baseados em conteúdo não precisam ser testados em navegadores reais",
              "Porque isso automaticamente melhora a performance de carregamento da página",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
