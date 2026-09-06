import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-projeto-guiado-schema-ecommerce",
  title: "Projeto guiado: modelando e consultando um schema de e-commerce",
  summary: "4 tabelas relacionadas, do CREATE TABLE a uma consulta de relatório com JOIN + agregação.",
  estimatedMinutes: 24,
};

export default function Licao08ProjetoGuiadoSchemaEcommerce() {
  return (
    <LessonBody>
      <h2>1. O schema — 4 tabelas relacionadas</h2>
      <CodeExample
        language="sql"
        code={`CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL NOT NULL,
  categoria VARCHAR(100)
);

CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE itens_pedido (
  id SERIAL PRIMARY KEY,
  pedido_id INTEGER REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id INTEGER REFERENCES produtos(id),
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL NOT NULL -- preço no momento da compra, não o preço atual do produto
);`}
      />
      <p>
        <code>preco_unitario</code> em <code>itens_pedido</code> não é redundante — é proposital:{" "}
        <code>produtos.preco</code> muda com o tempo, mas o valor pago num pedido antigo não deveria mudar
        retroativamente só porque o produto ficou mais caro depois.
      </p>

      <h2>2. Inserindo dado</h2>
      <CodeExample
        language="sql"
        code={`INSERT INTO usuarios (nome, email) VALUES ('Ana', 'ana@exemplo.com');
INSERT INTO produtos (nome, preco, categoria) VALUES ('Teclado', 250.00, 'eletronico');
INSERT INTO pedidos (usuario_id) VALUES (1);
INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario)
VALUES (1, 1, 1, 250.00);`}
      />

      <h2>3. O total de cada pedido — JOIN + agregação</h2>
      <CodeExample
        label="SQL"
        language="sql"
        result={`pedido_id | total
----------|-------
1         | 250.00`}
        code={`SELECT
  pedidos.id AS pedido_id,
  SUM(itens_pedido.quantidade * itens_pedido.preco_unitario) AS total
FROM pedidos
JOIN itens_pedido ON itens_pedido.pedido_id = pedidos.id
GROUP BY pedidos.id;`}
      />

      <h2>4. Relatório: os 5 usuários que mais gastaram</h2>
      <CodeExample
        language="sql"
        code={`SELECT
  usuarios.nome,
  SUM(itens_pedido.quantidade * itens_pedido.preco_unitario) AS total_gasto
FROM usuarios
JOIN pedidos ON pedidos.usuario_id = usuarios.id
JOIN itens_pedido ON itens_pedido.pedido_id = pedidos.id
GROUP BY usuarios.nome
ORDER BY total_gasto DESC
LIMIT 5;`}
      />

      <h2>5. Produtos nunca vendidos — LEFT JOIN pra achar "ausência"</h2>
      <CodeExample
        language="sql"
        code={`SELECT produtos.nome
FROM produtos
LEFT JOIN itens_pedido ON itens_pedido.produto_id = produtos.id
WHERE itens_pedido.id IS NULL;
-- LEFT JOIN traz todo produto; WHERE ... IS NULL filtra só os que NUNCA
-- combinaram com nenhuma linha de itens_pedido — ou seja, nunca foram vendidos`}
      />

      <Exercise
        prompt={
          <p>
            Escreva a consulta que mostra a categoria de produto e o total vendido (quantidade × preço_unitario) por
            categoria, só das categorias que já venderam mais de R$ 1000 no total.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`SELECT
  produtos.categoria,
  SUM(itens_pedido.quantidade * itens_pedido.preco_unitario) AS total_vendido
FROM produtos
JOIN itens_pedido ON itens_pedido.produto_id = produtos.id
GROUP BY produtos.categoria
HAVING SUM(itens_pedido.quantidade * itens_pedido.preco_unitario) > 1000;`}
      />

      <Callout href="/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base">
        A modelagem real do padrão (convenção de nome, timestamps, comportamento base de model) está documentada no
        Padrão Banco de Dados.
      </Callout>

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que itens_pedido guarda preco_unitario, em vez de sempre consultar produtos.preco?",
            options: [
              "É redundante sem motivo, um erro de design",
              "O preço do produto muda com o tempo; o valor pago num pedido já feito não deve mudar retroativamente",
              "Só pra facilitar consultas mais rápidas",
              "produtos.preco não pode ser consultado via JOIN",
            ],
            correctIndex: 1,
          },
          {
            question: "Como a consulta de 'produtos nunca vendidos' usa LEFT JOIN + WHERE ... IS NULL?",
            options: [
              "Não faz sentido, deveria usar INNER JOIN",
              "LEFT JOIN traz todo produto mesmo sem venda; WHERE IS NULL filtra só os que não combinaram com nenhuma linha de itens_pedido",
              "IS NULL só funciona em colunas de texto",
              "LEFT JOIN e INNER JOIN dão o mesmo resultado aqui",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
