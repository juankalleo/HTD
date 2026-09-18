import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-subqueries-e-ctes",
  title: "Subqueries e CTEs (WITH)",
  summary: "Uma consulta dentro de outra — e o WITH que existe pra você não precisar empilhar parênteses até perder a conta.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao09SubqueriesECtes() {
  return (
    <LessonBody>
      <p>
        Às vezes uma consulta depende do resultado de outra consulta. "Produtos mais caros que a média" não dá pra
        responder com um número fixo no <code>WHERE</code> — a média em si já é uma consulta. Uma{" "}
        <strong>subquery</strong> é exatamente isso: uma consulta SQL dentro de outra.
      </p>

      <h2>Subquery no WHERE — um valor calculado antes de comparar</h2>
      <CodeExample
        label="SQL"
        language="sql"
        result={`nome     | preco
---------|-------
Monitor  | 900.00
Notebook | 3200.00`}
        code={`SELECT nome, preco
FROM produtos
WHERE preco > (SELECT AVG(preco) FROM produtos);`}
      />
      <p>
        A subquery entre parênteses roda primeiro, calcula <strong>um único valor</strong> (a média de todos os
        preços), e só depois a consulta de fora compara o preço de cada linha contra esse valor. Não tem nada de
        mágico — é sequencial: primeiro resolve o que está dentro dos parênteses, depois usa o resultado.
      </p>

      <h2>Subquery no FROM — tratar um resultado como se fosse uma tabela</h2>
      <CodeExample
        label="SQL"
        language="sql"
        code={`SELECT categoria, media_preco
FROM (
  SELECT categoria, AVG(preco) AS media_preco
  FROM produtos
  GROUP BY categoria
) AS resumo_categoria
WHERE media_preco > 100;`}
      />
      <p>
        Aqui a subquery entre parênteses vira uma tabela temporária (por isso precisa de um apelido, <code>AS
        resumo_categoria</code>), e a consulta de fora filtra em cima dela. Funciona, mas repare que já ficou mais
        difícil de ler — e isso só piora se você precisar de uma subquery dentro da subquery.
      </p>

      <h2>CTE (WITH) — o mesmo resultado, com nome</h2>
      <CodeExample
        label="SQL — mesmo resultado da consulta anterior"
        language="sql"
        code={`WITH resumo_categoria AS (
  SELECT categoria, AVG(preco) AS media_preco
  FROM produtos
  GROUP BY categoria
)
SELECT categoria, media_preco
FROM resumo_categoria
WHERE media_preco > 100;`}
      />
      <p>
        Uma <strong>CTE</strong> (<em>Common Table Expression</em>, declarada com <code>WITH</code>) faz exatamente o
        que a subquery no <code>FROM</code> fazia — só que com nome, declarada antes da consulta principal em vez de
        aninhada dentro dela. O banco executa do mesmo jeito; a diferença é só legibilidade: você lê de cima pra
        baixo, um passo por vez, em vez de decifrar parênteses aninhados.
      </p>

      <h2>Quando a CTE vale mais que a subquery</h2>
      <p>
        Pra uma comparação simples como a primeira desta lição, subquery no <code>WHERE</code> já é suficiente — não
        vale complicar. A CTE compensa quando você tem <strong>vários passos</strong> encadeados, ou quando o mesmo
        resultado intermediário seria reaproveitado mais de uma vez na consulta: nomear o passo deixa claro o que
        cada parte da consulta representa, em vez de forçar quem lê a montar mentalmente uma subquery dentro de
        outra dentro de outra.
      </p>

      <Exercise
        prompt={
          <p>
            Usando uma CTE, escreva a consulta que lista nome e total gasto dos usuários que gastaram{" "}
            <strong>mais que a média de gasto entre todos os usuários</strong> (some quantidade × preco_unitario de{" "}
            <code>itens_pedido</code>, via <code>pedidos</code>).
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`WITH gastos_por_usuario AS (
  SELECT usuarios.id, usuarios.nome,
         SUM(itens_pedido.quantidade * itens_pedido.preco_unitario) AS total_gasto
  FROM usuarios
  JOIN pedidos ON pedidos.usuario_id = usuarios.id
  JOIN itens_pedido ON itens_pedido.pedido_id = pedidos.id
  GROUP BY usuarios.id, usuarios.nome
)
SELECT nome, total_gasto
FROM gastos_por_usuario
WHERE total_gasto > (SELECT AVG(total_gasto) FROM gastos_por_usuario);
-- a CTE calcula o gasto de cada usuário uma vez só, e é reaproveitada
-- duas vezes: na lista final e dentro da subquery que calcula a média`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a principal vantagem de uma CTE (WITH) sobre uma subquery aninhada dentro de outra?",
            options: [
              "CTE sempre executa mais rápido que uma subquery equivalente, porque o banco a otimiza de um jeito diferente",
              "CTE dá nome a um passo intermediário da consulta, deixando mais legível reaproveitar ou entender consultas com várias subqueries encadeadas",
              "CTE elimina a necessidade da cláusula FROM na consulta principal",
              "CTE substitui o uso de JOIN sempre que duas tabelas precisam ser combinadas",
            ],
            correctIndex: 1,
          },
          {
            question:
              "Na subquery SELECT * FROM produtos WHERE preco > (SELECT AVG(preco) FROM produtos), o que a subquery calcula?",
            options: [
              "Uma lista com todos os produtos, que depois é comparada individualmente contra cada linha da consulta externa",
              "A média de preço agrupada automaticamente por categoria, mesmo sem um GROUP BY explícito",
              "Só funciona se vier acompanhada de um JOIN explícito com a tabela produtos",
              "Um único valor — a média de todos os preços da tabela — calculado antes de comparar com o preço de cada linha",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
