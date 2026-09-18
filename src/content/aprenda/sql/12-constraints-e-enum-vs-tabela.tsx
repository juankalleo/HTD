import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-constraints-e-enum-vs-tabela",
  title: "Constraints avançadas: enum vs. tabela de referência",
  summary: "\"Já validei isso no backend\" não é o mesmo que o banco garantir que um dado inválido nunca entra.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao12ConstraintsEEnumVsTabela() {
  return (
    <LessonBody>
      <p>
        É tentador achar que, se o backend já valida "preço não pode ser negativo", o banco não precisa repetir essa
        regra. Mas o backend não é o único jeito de escrever numa tabela: um bug, uma migration rodada à mão, um
        script de importação, ou uma segunda aplicação acessando o mesmo banco podem inserir dado inválido sem passar
        pela validação nenhuma. O banco é a <strong>última linha de defesa</strong> — e é pra isso que servem
        constraints além de <code>NOT NULL</code> e <code>FOREIGN KEY</code>.
      </p>

      <h2>CHECK — regra de valor dentro da própria tabela</h2>
      <CodeExample
        language="sql"
        code={`CREATE TABLE produtos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  preco DECIMAL NOT NULL CHECK (preco >= 0),
  estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0)
);

INSERT INTO produtos (nome, preco) VALUES ('Teclado', -50.00);
-- Error: new row for relation "produtos" violates check constraint
-- (o banco recusa, mesmo que o backend tivesse deixado passar)`}
      />

      <h2>UNIQUE composto — unicidade que só faz sentido combinando colunas</h2>
      <CodeExample
        language="sql"
        code={`CREATE TABLE favoritos (
  usuario_id INTEGER REFERENCES usuarios(id),
  produto_id INTEGER REFERENCES produtos(id),
  UNIQUE (usuario_id, produto_id)
  -- o mesmo usuário não pode favoritar o mesmo produto duas vezes,
  -- mas usuários diferentes podem favoritar o mesmo produto à vontade
);`}
      />
      <p>
        Um <code>UNIQUE</code> em <code>usuario_id</code> sozinho impediria um usuário de ter mais de um favorito, o
        que não é a regra desejada. A combinação das duas colunas é que precisa ser única — cada par{" "}
        <code>(usuario_id, produto_id)</code> só pode aparecer uma vez.
      </p>

      <h2>NOT NULL com DEFAULT — obrigatório, mas com um valor sensato se ninguém informar</h2>
      <CodeExample
        language="sql"
        code={`CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pendente'
);

INSERT INTO pedidos (usuario_id) VALUES (1);
-- status vira 'pendente' automaticamente, sem precisar ser informado`}
      />

      <h2>Enum vs. tabela de referência — o mesmo problema, duas soluções</h2>
      <p>
        Quando um valor só pode ser um de um conjunto fixo (status de pedido, por exemplo), existem duas formas
        comuns de garantir isso no banco.
      </p>
      <CodeExample
        label="opção 1 — enum de banco"
        language="sql"
        code={`CREATE TYPE status_pedido AS ENUM ('pendente', 'pago', 'enviado', 'cancelado');

CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  status status_pedido NOT NULL DEFAULT 'pendente'
);`}
      />
      <CodeExample
        label="opção 2 — tabela de referência"
        language="sql"
        code={`CREATE TABLE status_pedidos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(20) NOT NULL UNIQUE,
  descricao TEXT
);

CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  status_id INTEGER NOT NULL REFERENCES status_pedidos(id)
);`}
      />
      <p>
        Enum é mais compacto e simples de declarar, mas é rígido: adicionar um valor novo exige alterar o tipo (uma
        operação estrutural, não um <code>INSERT</code>), e não dá pra guardar metadata extra sobre cada valor —
        descrição, ordem de exibição, tradução. A tabela de referência resolve isso: adicionar um valor novo é um{" "}
        <code>INSERT</code> comum, e ela pode carregar qualquer coluna extra que fizer sentido. O custo é ter mais
        uma tabela pra manter e precisar de <code>JOIN</code> pra mostrar o nome do status.
      </p>
      <p>
        Regra prática: valores que mudam raramente e não precisam de informação extra tendem bem com enum; valores
        que crescem com o negócio, ou que precisam de descrição/ordem/configuração, pedem tabela de referência.
      </p>

      <Callout href="/padrao-banco-de-dados/conceitos-tecnicos/tabela-de-referencia-vs-enum">
        O critério completo de quando o padrão usa enum e quando usa tabela de referência está documentado no Padrão
        Banco de Dados.
      </Callout>

      <Exercise
        prompt={
          <p>
            Crie uma tabela <code>cupons</code> (<code>codigo</code>, <code>desconto_percentual</code>) garantindo
            que o código nunca se repita e que o desconto esteja sempre entre 1 e 100.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`CREATE TABLE cupons (
  id SERIAL PRIMARY KEY,
  codigo VARCHAR(20) NOT NULL UNIQUE,
  desconto_percentual INTEGER NOT NULL CHECK (desconto_percentual BETWEEN 1 AND 100)
);`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Por que vale a pena colocar uma CHECK constraint no banco (ex.: preco >= 0), mesmo já validando isso no backend?",
            options: [
              "Porque o banco é a última linha de defesa — bugs no backend, uma migration manual ou outra aplicação acessando o mesmo banco ainda podem tentar inserir um valor inválido",
              "Porque uma CHECK constraint faz a consulta SELECT rodar mais rápido, além de validar o dado",
              "Porque toda coluna marcada como NOT NULL é obrigada a ter uma CHECK constraint também",
              "Porque com uma CHECK constraint no banco não é mais necessário testar essa regra no backend",
            ],
            correctIndex: 0,
          },
          {
            question:
              "Qual o principal trade-off de usar um enum de banco em vez de uma tabela de referência para um campo como status_pedido?",
            options: [
              "Uma tabela de referência nunca pode ser referenciada por FOREIGN KEY, diferente do enum",
              "Enum permite adicionar um valor novo com um simples INSERT, exatamente como numa tabela de referência",
              "Enum é mais simples e compacto, mas alterar seus valores é mais rígido e não permite guardar metadata extra (como descrição ou ordem de exibição), que uma tabela de referência permite",
              "Não existe trade-off real — enum e tabela de referência se comportam de forma idêntica no banco",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
