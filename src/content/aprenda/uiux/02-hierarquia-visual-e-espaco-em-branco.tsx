import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-hierarquia-visual-e-espaco-em-branco",
  title: "Hierarquia visual e espaço em branco",
  summary: "Se tudo na tela grita do mesmo jeito, nada é ouvido — o olho precisa saber por onde começar.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao02HierarquiaVisualEEspacoEmBranco() {
  return (
    <LessonBody>
      <p>
        Antes de ler uma única palavra, o olho já decidiu por onde vai começar. Isso não é intuição da pessoa — é o
        resultado de decisões visuais que você toma (ou deixa de tomar): tamanho, peso, cor e espaço. Quando nenhuma
        dessas decisões existe, tudo na tela parece ter a mesma importância, e "tudo importante" na prática significa{" "}
        <strong>nada se destaca</strong>.
      </p>

      <h2>O que cria hierarquia</h2>
      <p>
        Quatro sinais fazem o olho notar um elemento antes dos outros, numa fração de segundo:
      </p>
      <ul>
        <li><strong>Tamanho</strong> — maior chama mais atenção que menor.</li>
        <li><strong>Peso</strong> — <code>font-weight: 700</code> pesa mais visualmente que <code>400</code>.</li>
        <li><strong>Contraste</strong> — cor ou luminância bem diferente do que está ao redor.</li>
        <li><strong>Posição</strong> — o topo e o início de uma leitura recebem atenção primeiro.</li>
      </ul>
      <p>
        Combinar dois ou três desses sinais no mesmo elemento (por exemplo, um título grande, <strong>e</strong>{" "}
        pesado, <strong>e</strong> com cor de destaque) cria uma hierarquia clara sem exigir nada explícito — a pessoa
        não "decide" ler o título primeiro, ela simplesmente olha pra lá primeiro.
      </p>
      <CodeExample
        label="Uma escala simples de hierarquia"
        language="css"
        code={`.titulo    { font-size: 1.5rem; font-weight: 700; color: var(--text-forte); }
.subtitulo { font-size: 1rem;   font-weight: 500; color: var(--text-medio); }
.corpo     { font-size: 0.9rem; font-weight: 400; color: var(--text-fraco); }`}
      />

      <h2>Espaço em branco não é espaço desperdiçado</h2>
      <p>
        Um erro comum de quem começa: olhar pra um espaço vazio na tela e sentir que "precisa preencher com algo".
        Mas o espaço em branco (whitespace) faz um trabalho ativo — ele separa visualmente o que pertence junto do que
        não pertence, e dá "respiro" pro elemento que precisa de atenção. Um título cercado de espaço se destaca mais
        do que o mesmo título espremido entre outros três elementos, mesmo sem mudar uma única propriedade de fonte.
      </p>
      <p>
        Isso é especialmente verdade em telas densas de informação (dashboards, tabelas): reduzir a quantidade de
        elementos visíveis ao mesmo tempo, ou aumentar o espaço entre grupos, costuma comunicar mais clareza do que
        adicionar mais bordas, linhas ou cores pra "organizar visualmente".
      </p>

      <h2>Ordem de leitura</h2>
      <p>
        Em culturas de leitura ocidental, o olho tende a percorrer uma tela em um padrão parecido com um <strong>Z</strong>{" "}
        ou um <strong>F</strong> (mais comum em telas com bastante texto): começa no topo esquerdo, varre pra direita,
        desce. Isso não é uma regra rígida — é uma tendência que você pode usar a seu favor, posicionando o elemento
        mais importante (título, ação principal) nos pontos que esse padrão naturalmente visita primeiro.
      </p>

      <Exercise
        prompt={
          <p>
            Um card de produto tem: nome do produto, preço, descrição longa e botão "Comprar" — todos com o mesmo{" "}
            <code>font-size</code> e <code>font-weight</code>, um embaixo do outro sem espaçamento extra entre os
            grupos. Escreva uma versão em CSS que cria hierarquia entre esses quatro elementos.
          </p>
        }
        solutionLanguage="css"
        solutionCode={`.card-nome        { font-size: 1.125rem; font-weight: 700; }
.card-preco       { font-size: 1.25rem;  font-weight: 700; color: var(--color-primary); margin-top: 0.25rem; }
.card-descricao   { font-size: 0.875rem; font-weight: 400; color: var(--text-fraco); margin: 0.75rem 0; }
.card-botao       { font-size: 0.9rem;   font-weight: 600; margin-top: 1rem; }
/* preço e nome se destacam por peso e tamanho; a descrição recua em contraste
   pra não competir; espaçamento maior antes do botão o separa como próxima ação */`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que faz o olho notar um elemento antes dos outros, numa fração de segundo, antes mesmo de ler o texto?",
            options: [
              "Contraste de tamanho, peso ou cor em relação ao que está ao redor",
              "A ordem em que os elementos aparecem no código-fonte HTML",
              "O número total de elementos que existem na mesma tela",
              "O tempo que a pessoa já está de olho aberto olhando a tela",
            ],
            correctIndex: 0,
          },
          {
            question: "Por que espaço em branco (whitespace) não deve ser tratado como 'espaço desperdiçado' que precisa ser preenchido?",
            options: [
              "Porque ele deixa o arquivo CSS menor e o site carrega mais rápido",
              "Porque preencher todo espaço vazio é tecnicamente impossível em CSS",
              "Porque ele separa visualmente o que importa do que não importa, dando respiro pro que precisa de atenção",
              "Porque o espaço em branco aumenta automaticamente o contraste de cor entre os elementos",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
