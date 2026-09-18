import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-projeto-guiado-otimizando-schema",
  title: "Projeto guiado: otimizando um schema com CTE, window function e transação",
  summary: "Voltando ao e-commerce da lição 8 — agora com relatório em janela, checkout atômico e um índice justificado por EXPLAIN.",
  estimatedMinutes: 26,
  level: "intermediario",
};

export default function Licao16ProjetoGuiadoOtimizandoSchema() {
  return (
    <LessonBody>
      <p>
        A lição 8 deixou o schema de e-commerce (<code>usuarios</code>, <code>produtos</code>, <code>pedidos</code>,{" "}
        <code>itens_pedido</code>) rodando com <code>JOIN</code> e agregação simples. Este projeto pega esse mesmo
        schema e aplica três coisas do intermediário: um relatório com CTE + window function, um checkout que
        precisa ser uma transação, e um índice criado a partir do que o <code>EXPLAIN</code> realmente mostrou —
        não de achismo.
      </p>

      <h2>1. Adicionando controle de estoque ao schema</h2>
      <CodeExample
        language="sql"
        code={`ALTER TABLE produtos
  ADD COLUMN estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0);
-- CHECK garante que o estoque nunca fique negativo — nem por
-- um bug de aplicação, nem por uma migration futura mal escrita`}
      />

      <h2>2. Relatório: top 3 produtos mais vendidos, por categoria</h2>
      <p>
        Isso combina duas lições: uma CTE (9) que calcula o total vendido por produto, e uma window function (10)
        que ranqueia dentro de cada categoria sem colapsar as linhas.
      </p>
      <CodeExample
        label="SQL"
        language="sql"
        result={`nome        | categoria  | total_vendido | posicao
------------|------------|----------------|--------
Teclado     | eletronico | 320            | 1
Mouse       | eletronico | 210            | 2
Monitor     | eletronico | 95             | 3
SQL Prático | livro      | 180            | 1`}
        code={`WITH vendas_por_produto AS (
  SELECT
    produtos.id,
    produtos.nome,
    produtos.categoria,
    SUM(itens_pedido.quantidade) AS total_vendido
  FROM produtos
  JOIN itens_pedido ON itens_pedido.produto_id = produtos.id
  GROUP BY produtos.id, produtos.nome, produtos.categoria
),
ranking AS (
  SELECT
    *,
    ROW_NUMBER() OVER (
      PARTITION BY categoria
      ORDER BY total_vendido DESC
    ) AS posicao
  FROM vendas_por_produto
)
SELECT nome, categoria, total_vendido, posicao
FROM ranking
WHERE posicao <= 3
ORDER BY categoria, posicao;`}
      />
      <p>
        A primeira CTE resolve "quanto cada produto vendeu" — um passo isolado e nomeado. A segunda usa esse
        resultado como entrada pra ranquear <strong>dentro de cada categoria</strong>, sem precisar reescrever a
        agregação. Tentar fazer isso numa consulta só, com subqueries aninhadas, seria bem mais difícil de ler.
      </p>

      <h2>3. Checkout — por que precisa ser uma transação</h2>
      <p>
        Fechar um pedido não é um comando só: precisa criar o pedido, criar os itens do pedido, e debitar o estoque
        de cada produto vendido. Se o estoque for debitado sem o item ser registrado (ou vice-versa), o pedido fica
        num estado que nunca deveria existir — o mesmo problema da transferência bancária da lição 11.
      </p>
      <CodeExample
        label="SQL"
        language="sql"
        code={`BEGIN;

INSERT INTO pedidos (usuario_id) VALUES (1) RETURNING id;
-- suponha que retornou id = 501

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
VALUES (501, 3, 2, 250.00);

UPDATE produtos SET estoque = estoque - 2 WHERE id = 3;
-- se o CHECK (estoque >= 0) for violado aqui (estoque insuficiente),
-- a transação inteira é abortada — nem o pedido, nem o item, nem
-- o débito de estoque ficam gravados

COMMIT;`}
      />
      <p>
        Se o <code>UPDATE</code> falhasse por violar o <code>CHECK</code> de estoque, o comando certo seria{" "}
        <code>ROLLBACK</code> — desfazendo o <code>INSERT</code> do pedido e do item também, em vez de deixar um
        pedido "fantasma" sem estoque debitado.
      </p>

      <h2>4. Um índice guiado por EXPLAIN, não por achismo</h2>
      <CodeExample
        label="SQL (PostgreSQL) — antes do índice"
        language="sql"
        result={`Hash Join  (cost=1.09..3450.22 rows=1200 width=48) (actual time=0.041..22.885 rows=1180 loops=1)
  Hash Cond: (itens_pedido.produto_id = produtos.id)
  ->  Seq Scan on itens_pedido  (cost=0.00..3200.00 rows=1200 width=16) (actual time=0.010..19.204 rows=1180 loops=1)
Planning Time: 0.112 ms
Execution Time: 22.931 ms`}
        code={`EXPLAIN ANALYZE
SELECT produto_id, SUM(quantidade)
FROM itens_pedido
GROUP BY produto_id;`}
      />
      <p>
        O <code>Seq Scan on itens_pedido</code> mostra que a consulta varre a tabela de itens inteira — se essa
        consulta roda toda vez que o relatório do passo 2 é aberto, vale investigar um índice.
      </p>
      <CodeExample
        label="SQL — criando o índice e conferindo de novo"
        language="sql"
        code={`CREATE INDEX idx_itens_pedido_produto_id ON itens_pedido (produto_id);

EXPLAIN ANALYZE
SELECT produto_id, SUM(quantidade)
FROM itens_pedido
GROUP BY produto_id;
-- compare o "Execution Time" antes e depois — só cria valor se
-- o plano realmente mudar pra usar o índice e o tempo cair de verdade`}
      />

      <Exercise
        prompt={
          <p>
            Escreva a transação que registra um novo pedido para o usuário de id 2, com um item do produto de id 5
            (quantidade 1, ao preço atual do produto), debitando o estoque correspondente — tudo de forma atômica.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`BEGIN;

INSERT INTO pedidos (usuario_id) VALUES (2) RETURNING id;
-- suponha que retornou id = 777

INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
SELECT 777, id, 1, preco
FROM produtos
WHERE id = 5;

UPDATE produtos SET estoque = estoque - 1 WHERE id = 5;

COMMIT;
-- as três operações só ficam gravadas juntas — se o UPDATE violasse o
-- CHECK (estoque >= 0), a transação inteira seria abortada e um
-- ROLLBACK desfaria os dois INSERT também`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "No checkout guiado desta aula, por que o INSERT em itens_pedido e o UPDATE do estoque do produto precisam estar na mesma transação?",
            options: [
              "Porque cada INSERT no PostgreSQL exige um BEGIN explícito antes — sem transação, o comando nem seria aceito",
              "Porque se uma das duas mudanças acontecer sem a outra, o pedido fica com um estado que nunca deveria existir — a transação garante que aconteçam juntas ou nenhuma aconteça",
              "Porque agrupar os comandos numa transação faz o INSERT rodar mais rápido do que rodá-los separados",
              "Porque uma CHECK constraint, como estoque >= 0, só é avaliada quando os comandos estão dentro de um BEGIN/COMMIT",
            ],
            correctIndex: 1,
          },
          {
            question:
              "Depois de rodar EXPLAIN ANALYZE no relatório de ranking e ver um Seq Scan em itens_pedido durante o JOIN com produtos, qual é o próximo passo mais direto pra investigar?",
            options: [
              "Trocar todo JOIN por uma subquery equivalente, já que subqueries nunca geram Seq Scan",
              "Trocar ROW_NUMBER() por RANK() na window function, o que muda automaticamente o plano de execução",
              "Aumentar o valor do LIMIT no final da consulta, pra reduzir o tempo de execução",
              "Verificar se existe (ou criar) um índice na coluna usada no JOIN, como produto_id, e rodar EXPLAIN ANALYZE de novo pra confirmar se o plano passa a usar Index Scan",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
