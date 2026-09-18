import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-window-functions",
  title: "Window functions: ROW_NUMBER, RANK, LAG e LEAD",
  summary: "Você quer o produto mais vendido de CADA categoria, mas ainda quer ver toda linha — GROUP BY não faz isso.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao10WindowFunctions() {
  return (
    <LessonBody>
      <p>
        <code>GROUP BY</code> (lição 4) resolve "quantos pedidos por usuário", mas colapsa as linhas — você perde o
        detalhe de cada uma. Se você precisa saber a <strong>posição de cada produto dentro da categoria dele</strong>,
        sem perder a linha de cada produto individual, <code>GROUP BY</code> sozinho não serve. É pra isso que
        existem as <strong>window functions</strong>.
      </p>

      <h2>A diferença fundamental: GROUP BY colapsa, window function mantém</h2>
      <CodeExample
        label="SQL — ranking de produtos mais vendidos, por categoria"
        language="sql"
        result={`categoria   | nome        | total_vendido | posicao
------------|-------------|----------------|--------
eletronico  | Teclado     | 320            | 1
eletronico  | Mouse       | 210            | 2
eletronico  | Monitor     | 95             | 3
livro       | SQL Prático | 180            | 1
livro       | Clean Code  | 150            | 2`}
        code={`SELECT
  produtos.categoria,
  produtos.nome,
  SUM(itens_pedido.quantidade) AS total_vendido,
  ROW_NUMBER() OVER (
    PARTITION BY produtos.categoria
    ORDER BY SUM(itens_pedido.quantidade) DESC
  ) AS posicao
FROM produtos
JOIN itens_pedido ON itens_pedido.produto_id = produtos.id
GROUP BY produtos.categoria, produtos.nome
ORDER BY produtos.categoria, posicao;`}
      />
      <p>
        <code>GROUP BY produtos.categoria, produtos.nome</code> ainda agrupa pra somar a quantidade vendida — isso
        não muda. A diferença é o <code>OVER (...)</code>: em vez de colapsar tudo numa linha por categoria,{" "}
        <code>ROW_NUMBER()</code> roda <strong>sobre uma janela</strong> de linhas (<code>PARTITION BY categoria</code>{" "}
        define a janela) e adiciona uma coluna nova — <code>posicao</code> — sem remover nenhuma linha do resultado.
      </p>

      <h2>PARTITION BY — reinicia a contagem por grupo</h2>
      <p>
        Sem <code>PARTITION BY</code>, <code>ROW_NUMBER()</code> numeraria <strong>todas</strong> as linhas em
        sequência, ignorando categoria. Com <code>PARTITION BY produtos.categoria</code>, a numeração reinicia do 1
        toda vez que a categoria muda — exatamente como um <code>GROUP BY</code> separaria os grupos, mas sem
        colapsar as linhas.
      </p>

      <h2>RANK e DENSE_RANK — como cada um trata empate</h2>
      <CodeExample
        label="mesmo total_vendido em dois produtos — como cada função numera"
        language="plaintext"
        code={`total_vendido | ROW_NUMBER() | RANK() | DENSE_RANK()
--------------|--------------|--------|-------------
320           | 1            | 1      | 1
210           | 2            | 2      | 2
210           | 3            | 2      | 2
95            | 4            | 4      | 3`}
      />
      <p>
        <code>ROW_NUMBER()</code> nunca repete posição, mesmo em empate — sempre sequencial. <code>RANK()</code>{" "}
        repete a posição pros empatados e <strong>pula</strong> a posição seguinte. <code>DENSE_RANK()</code> também
        repete a posição pros empatados, mas <strong>não pula</strong> nada depois.
      </p>

      <h2>LAG e LEAD — comparar uma linha com a vizinha</h2>
      <CodeExample
        label="SQL — receita do mês comparada com o mês anterior"
        language="sql"
        code={`SELECT
  DATE_TRUNC('month', pedidos.criado_em) AS mes,
  SUM(itens_pedido.quantidade * itens_pedido.preco_unitario) AS receita,
  LAG(SUM(itens_pedido.quantidade * itens_pedido.preco_unitario)) OVER (
    ORDER BY DATE_TRUNC('month', pedidos.criado_em)
  ) AS receita_mes_anterior
FROM pedidos
JOIN itens_pedido ON itens_pedido.pedido_id = pedidos.id
GROUP BY mes
ORDER BY mes;`}
      />
      <p>
        <code>LAG(...)</code> busca o valor da linha <strong>anterior</strong> dentro da janela ordenada;{" "}
        <code>LEAD(...)</code> faz o mesmo pra linha <strong>seguinte</strong>. Sem window function, comparar "este
        mês vs. mês passado" exigiria um <code>JOIN</code> da tabela com ela mesma — <code>LAG</code> resolve numa
        linha só.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva a consulta que retorna, para cada pedido, o <code>usuario_id</code>, o <code>id</code> do pedido,
            a <code>criado_em</code> e a posição cronológica desse pedido entre os pedidos daquele usuário (o mais
            antigo do usuário = posição 1).
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`SELECT
  usuario_id,
  id AS pedido_id,
  criado_em,
  ROW_NUMBER() OVER (
    PARTITION BY usuario_id
    ORDER BY criado_em
  ) AS posicao
FROM pedidos;`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença fundamental entre GROUP BY e uma window function (como ROW_NUMBER() OVER (...))?",
            options: [
              "GROUP BY colapsa várias linhas em uma só por grupo; a window function mantém cada linha original e só adiciona uma coluna calculada sobre uma janela de linhas",
              "Window function sempre precisa vir acompanhada de um GROUP BY na mesma consulta pra funcionar",
              "GROUP BY sempre roda mais rápido que qualquer window function, independente do tamanho da tabela",
              "Window function só pode calcular uma coluna por vez, enquanto GROUP BY permite várias agregações simultâneas",
            ],
            correctIndex: 0,
          },
          {
            question:
              "Numa lista de vendas com dois produtos empatados em primeiro lugar, qual a diferença entre RANK() e ROW_NUMBER() nesse empate?",
            options: [
              "ROW_NUMBER() dá a mesma posição pros dois empatados e pula a posição seguinte; RANK() sempre numera de forma única e sequencial",
              "Não existe diferença — as duas funções tratam empates exatamente da mesma forma",
              "RANK() dá a mesma posição pros dois empatados e pula a posição seguinte (1, 1, 3); ROW_NUMBER() sempre numera de forma única e sequencial, mesmo em empate (1, 2, 3)",
              "RANK() ignora empates e ordena pela ordem de inserção na tabela; ROW_NUMBER() sempre agrupa os empatados numa linha só",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
