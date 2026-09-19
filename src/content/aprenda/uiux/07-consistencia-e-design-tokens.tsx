import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-consistencia-e-design-tokens",
  title: "Consistência e design tokens",
  summary: "Se cada tela inventa uma cor e um espaçamento novo, quem usa precisa reaprender o produto a cada clique.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao07ConsistenciaEDesignTokens() {
  return (
    <LessonBody>
      <p>
        Toda vez que uma tela nova inventa uma cor de azul diferente, um espaçamento diferente, um raio de borda
        diferente — mesmo que cada escolha pareça pequena e defensável sozinha — o resultado acumulado é uma
        interface que <strong>parece feita por pessoas diferentes que nunca se falaram</strong>. E o custo não é só
        estético: quem usa o produto precisa reaprender padrões visuais a cada tela nova, porque nada se repete de
        forma confiável.
      </p>

      <h2>O que é um design token</h2>
      <p>
        Um <strong>design token</strong> é um valor de design nomeado e reutilizável — definido uma única vez e
        referenciado em todo lugar que precisa dele. Em vez de espalhar <code>#2563eb</code> em quinze arquivos
        CSS diferentes, você define <code>--color-primary: #2563eb</code> uma vez, e todo componente que precisa da
        cor primária referencia o token.
      </p>
      <CodeExample
        label="Tokens de cor e espaçamento"
        language="css"
        code={`:root {
  --color-primary: #2563eb;
  --color-danger: #dc2626;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --radius-md: 8px;
}

.botao {
  background: var(--color-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
}`}
      />
      <p>
        A vantagem não é só evitar repetição de código — é que quando o token muda (o time decide ajustar o azul da
        marca, por exemplo), <strong>todo lugar que usa aquele token muda junto</strong>, sem precisar caçar cada
        ocorrência manualmente.
      </p>

      <h2>A ponte entre design e código</h2>
      <p>
        Design tokens são o que permite um designer e um dev falarem a mesma língua sem ambiguidade: em vez de "usa
        um azul mais ou menos assim", a conversa vira "usa <code>--color-primary</code>". Isso elimina a
        interpretação livre que gera inconsistência — cada pessoa do time escolhendo "um azul parecido" de memória
        não é a mesma coisa que todo mundo usando o mesmo valor exato.
      </p>

      <Callout
        title="O Tailwind já é baseado em tokens"
        href="/padrao-frontend/tecnologias/tailwind"
        linkLabel="Ver na documentação →"
      >
        Quando você usa <code>bg-blue-600</code> ou <code>p-4</code> no Tailwind, você já está usando um sistema de
        tokens — a escala de cor e espaçamento do framework é, na prática, um conjunto de design tokens prontos.
      </Callout>

      <Exercise
        prompt={
          <p>
            Um projeto tem três componentes de botão diferentes, cada um com seu próprio azul (<code>#2463ea</code>,{" "}
            <code>#2563eb</code>, <code>#2660e8</code> — quase idênticos, mas não iguais) escritos direto no CSS de
            cada um. Como um design token resolveria isso, e o que mudaria se o time decidisse trocar o azul da marca
            no futuro?
          </p>
        }
        solutionLanguage="css"
        solutionCode={`:root {
  --color-primary: #2563eb;
}
/* os três botões passam a usar var(--color-primary) em vez de um hex
   próprio. Se o azul da marca mudar no futuro, muda-se o valor do token
   uma única vez, e os três botões (e qualquer outro lugar que use o
   token) atualizam automaticamente, sem precisar editar cada arquivo. */`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual é o principal problema de inventar uma cor ou espaçamento novo em cada tela, sem seguir um padrão?",
            options: [
              "A interface fica inconsistente, forçando quem usa a reaprender padrões visuais a cada tela nova",
              "O CSS gerado passa a ocupar mais espaço em disco no servidor",
              "O navegador passa a exigir mais memória RAM para renderizar a página",
              "Isso impede completamente o uso de qualquer framework de CSS",
            ],
            correctIndex: 0,
          },
          {
            question: "O que é um design token, como --color-primary ou --space-4?",
            options: [
              "Um componente React pronto que já vem com todos os estilos aplicados",
              "Um valor de design nomeado e reutilizável, definido uma vez e referenciado em vários lugares",
              "Uma permissão de acesso que controla quem pode editar os estilos do projeto",
              "Um teste automatizado que verifica se as cores usadas passam no contraste mínimo",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
