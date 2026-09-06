import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-chaves-e-normalizacao",
  title: "Chaves primárias/estrangeiras e normalização",
  summary: "O mecanismo que garante que uma referência entre tabelas nunca aponte pro vazio.",
  estimatedMinutes: 16,
};

export default function Licao07ChavesENormalizacao() {
  return (
    <LessonBody>
      <h2>Chave primária (PRIMARY KEY) — o identificador único de cada linha</h2>
      <CodeExample
        language="sql"
        code={`CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY, -- gera 1, 2, 3... sozinho, nunca repete
  nome VARCHAR(255)
);`}
      />

      <h2>Chave estrangeira (FOREIGN KEY) — a garantia de que a referência existe</h2>
      <CodeExample
        language="sql"
        code={`CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id), -- FOREIGN KEY
  total DECIMAL
);

INSERT INTO pedidos (usuario_id, total) VALUES (999, 50.00);
-- Error: insert or update on table "pedidos" violates foreign key constraint
-- (não existe usuário com id 999 — o banco RECUSA o dado inconsistente)`}
      />
      <p>
        Sem <code>FOREIGN KEY</code>, nada impede um <code>pedidos.usuario_id</code> apontar pra um usuário que não
        existe (ou que foi deletado depois) — um "registro órfão". Com a chave estrangeira, o próprio banco garante
        essa integridade, recusando o insert/update que quebraria a referência.
      </p>

      <h2>ON DELETE — o que fazer quando o "pai" é removido</h2>
      <CodeExample
        language="sql"
        code={`CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  total DECIMAL
);
-- CASCADE: deletar um usuário deleta automaticamente todos os pedidos dele
-- (a alternativa RESTRICT bloquearia o delete do usuário enquanto ele tiver pedido)`}
      />

      <h2>Normalização — o motivo de separar em várias tabelas</h2>
      <CodeExample
        label="não-normalizado — dado duplicado e sujeito a inconsistência"
        language="plaintext"
        code={`pedido_id | cliente_nome | cliente_email      | produto
----------|--------------|--------------------|---------
1         | Ana          | ana@exemplo.com    | Teclado
2         | Ana          | ana@exemplo.com    | Mouse
-- se o e-mail da Ana mudar, precisa atualizar em CADA linha onde ela aparece`}
      />
      <CodeExample
        label="normalizado — cada fato mora em um lugar só"
        language="plaintext"
        code={`usuarios: id, nome, email
pedidos: id, usuario_id
itens_pedido: pedido_id, produto_id
-- o e-mail da Ana existe em UMA linha só, referenciada por todo o resto`}
      />
      <p>
        Normalizar tem um custo: consultas precisam de mais <code>JOIN</code>s pra reconstruir a informação
        completa. Na prática, a maioria dos sistemas normaliza o suficiente pra evitar duplicação de dado que muda
        com frequência (nome, e-mail, preço), aceitando o custo do JOIN em troca de consistência.
      </p>

      <Exercise
        prompt={
          <p>
            Por que <code>ON DELETE CASCADE</code> pode ser perigoso numa tabela de pedidos, mesmo sendo conveniente?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Deletar um usuário por engano apagaria TODOS os pedidos dele
silenciosamente — histórico financeiro real desaparecendo junto com
uma ação que talvez devesse ser só "desativar conta", não remover o
usuário de verdade. Em dados sensíveis/financeiros, RESTRICT (ou soft
delete, fora do escopo desta lição) costuma ser mais seguro que CASCADE.`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que uma FOREIGN KEY garante?",
            options: [
              "Que a coluna nunca fica vazia",
              "Que o valor referenciado (ex.: usuario_id) corresponde a uma linha que realmente existe na tabela referenciada",
              "Que a tabela nunca pode ser deletada",
              "Que a consulta roda mais rápido",
            ],
            correctIndex: 1,
          },
          {
            question: "O que normalização busca evitar?",
            options: [
              "Evitar usar JOIN",
              "Evitar duplicar o mesmo dado em várias linhas, o que causaria inconsistência quando esse dado precisasse mudar",
              "Evitar ter mais de uma tabela",
              "Evitar índices",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
