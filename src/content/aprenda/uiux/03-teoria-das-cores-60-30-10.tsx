import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { ColorSwatch } from "@/components/aprenda/color-swatch";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-teoria-das-cores-60-30-10",
  title: "Teoria das cores na prática: a regra 60-30-10",
  summary: "Uma tela com cinco cores brigando entre si não parece 'colorida' — parece cansativa.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao03TeoriaDasCores603010() {
  return (
    <LessonBody>
      <p>
        Uma dúvida comum de quem programa e precisa decidir cor sozinho: "quantas cores eu uso, e em que proporção?".
        Uma resposta prática e testada há décadas em design de interior e depois adotada em design de produto é a{" "}
        <strong>regra 60-30-10</strong>.
      </p>

      <h2>O que os números representam</h2>
      <p>
        60-30-10 é sobre <strong>proporção de área</strong> ocupada na tela — não sobre opacidade, não sobre
        intensidade, não sobre ordem de aparição. Três papéis, três faixas de cor:
      </p>
      <ul>
        <li><strong>60% — cor dominante</strong>: geralmente neutra (fundo, superfícies), a base de tudo.</li>
        <li><strong>30% — cor secundária</strong>: dá personalidade sem competir com a dominante (textos de destaque, ícones, bordas).</li>
        <li><strong>10% — cor de destaque</strong>: reservada pra ação mais importante da tela (botão primário, alerta, indicador ativo).</li>
      </ul>
      <p>
        Repare que a cor de destaque é a que <strong>menos</strong> aparece — é justamente essa raridade que faz o
        olho ir direto nela quando ela aparece. Se você usar a cor de destaque em tudo (botões, títulos, ícones,
        bordas), ela deixa de significar "aja aqui" e vira só mais uma cor no meio das outras.
      </p>

      <ColorSwatch
        colors={[
          { hex: "#0f172a", label: "Dominante (60%)", role: "fundo, superfícies, texto principal sobre claro" },
          { hex: "#475569", label: "Secundária (30%)", role: "texto de apoio, ícones, bordas, estados neutros" },
          { hex: "#22c55e", label: "Destaque (10%)", role: "botão primário, confirmação, indicador de ativo" },
        ]}
      />

      <h2>Por que cinco cores competindo cansa o olho</h2>
      <p>
        Cada cor nova numa tela é mais um "grupo" que o cérebro precisa categorizar (é o princípio de{" "}
        <strong>similaridade</strong> da Gestalt, que a lição 5 detalha: itens da mesma cor parecem pertencer ao mesmo
        grupo). Quando existem cinco cores fortes disputando atenção, o cérebro não consegue decidir qual é a
        principal — o resultado não é uma tela "vibrante", é uma tela onde nenhum elemento realmente se destaca,
        porque todos estão competindo pelo mesmo papel.
      </p>
      <CodeExample
        label="Tokens de cor com papel definido"
        language="css"
        code={`:root {
  --color-base: #0f172a;      /* 60% — dominante */
  --color-secundaria: #475569; /* 30% — secundária */
  --color-destaque: #22c55e;   /* 10% — destaque, só na ação principal */
}`}
      />

      <h2>Ponto de partida, não lei obrigatória</h2>
      <p>
        60-30-10 é uma <strong>regra geral</strong> pra quem está decidindo proporção de cor sem outra referência —
        não uma lei que toda tela precisa seguir à risca. Um dashboard de visualização de dados, por exemplo, pode
        precisar de mais de três cores pra diferenciar categorias em um gráfico, e isso é uma exceção legítima: o
        propósito ali (distinguir dados) justifica quebrar a proporção. O que a regra realmente ensina é o hábito de
        perguntar "essa cor tem um papel claro?" antes de adicionar mais uma.
      </p>

      <Exercise
        prompt={
          <p>
            Uma tela usa azul no fundo do cabeçalho, roxo no botão principal, verde num ícone decorativo, laranja
            numa borda de card e vermelho num texto de aviso — cinco cores fortes, cada uma em pouca área. Aplicando o
            raciocínio de 60-30-10, o que você reduziria primeiro, e por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Reduziria pra no máximo 3 cores com papel claro: uma neutra dominante pro
fundo (60%), uma secundária pra elementos de apoio como ícones e bordas
(30%), e reservaria uma única cor de destaque (10%) só pra ação mais
importante (o botão principal). Vermelho pode continuar existindo, mas só
como cor reservada de erro/aviso — não competindo com a cor de destaque
da ação principal.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Na regra 60-30-10, o que os três números representam?",
            options: [
              "O contraste mínimo exigido entre cada cor e o fundo, em uma escala de 0 a 100",
              "A proporção de ÁREA da tela ocupada por cada cor: dominante, secundária e de destaque",
              "A ordem em que as cores devem aparecer da esquerda pra direita no layout",
              "O brilho relativo de cada cor, do mais escuro (60) ao mais claro (10)",
            ],
            correctIndex: 1,
          },
          {
            question: "A regra 60-30-10 é geralmente tratada como:",
            options: [
              "Um ponto de partida útil pra organizar proporção de cor, não uma lei obrigatória sem exceção",
              "Uma exigência técnica do CSS que trava a renderização se não for seguida",
              "Uma medida de contraste mínimo entre texto e fundo, similar ao WCAG",
              "Uma contagem máxima de quantas cores podem existir num arquivo de design",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
