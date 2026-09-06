import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-join",
  title: "JOIN — juntando tabelas",
  summary: "Como buscar dado que está espalhado em duas tabelas relacionadas, numa consulta só.",
  estimatedMinutes: 18,
};

export default function Licao03Join() {
  return (
    <LessonBody>
      <p>
        Lembra da lição 1: <code>pedidos</code> guarda só <code>usuario_id</code>, não o nome do usuário. Pra mostrar
        "Ana fez um pedido de R$150", você precisa combinar as duas tabelas — é exatamente pra isso que existe{" "}
        <code>JOIN</code>.
      </p>

      <h2>INNER JOIN — só linhas que combinam nos dois lados</h2>
      <CodeExample
        label="SQL"
        language="sql"
        result={`nome | total
-----|------
Ana  | 150.00
Ana  | 89.90
Bruno| 320.00`}
        code={`SELECT usuarios.nome, pedidos.total
FROM pedidos
JOIN usuarios ON pedidos.usuario_id = usuarios.id;`}
      />
      <p>
        <code>ON pedidos.usuario_id = usuarios.id</code> é a regra de combinação — "junte a linha de pedidos com a
        linha de usuarios onde esses dois valores forem iguais". <code>JOIN</code> sozinho já significa{" "}
        <code>INNER JOIN</code> — só aparecem linhas que existem nos dois lados.
      </p>

      <h2>LEFT JOIN — mantém tudo do lado esquerdo, mesmo sem combinação</h2>
      <CodeExample
        label="SQL — usuário sem pedido nenhum ainda"
        language="sql"
        result={`nome  | total
------|------
Ana   | 150.00
Ana   | 89.90
Bruno | 320.00
Caio  | NULL`}
        code={`SELECT usuarios.nome, pedidos.total
FROM usuarios
LEFT JOIN pedidos ON pedidos.usuario_id = usuarios.id;`}
      />
      <p>
        Com <code>INNER JOIN</code>, o Caio (que nunca fez pedido) simplesmente não apareceria. Com{" "}
        <code>LEFT JOIN</code>, todo usuário aparece — os que não têm pedido correspondente mostram{" "}
        <code>NULL</code> na coluna do lado direito. Use <code>LEFT JOIN</code> quando "não ter combinação" ainda é
        uma resposta que importa (ex.: "quais usuários nunca compraram nada?").
      </p>

      <h2>Juntando 3 tabelas</h2>
      <CodeExample
        language="sql"
        code={`SELECT usuarios.nome, produtos.nome AS produto, itens_pedido.quantidade
FROM itens_pedido
JOIN pedidos ON itens_pedido.pedido_id = pedidos.id
JOIN usuarios ON pedidos.usuario_id = usuarios.id
JOIN produtos ON itens_pedido.produto_id = produtos.id;`}
      />
      <p>
        <code>AS produto</code> é um apelido — sem ele, duas colunas chamadas <code>nome</code> (uma de usuários,
        outra de produtos) ficariam ambíguas no resultado.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva a consulta que lista o nome de todo usuário e o total de pedidos dele, incluindo usuários que
            nunca fizeram nenhum pedido (mostrando 0 ou NULL nesse caso).
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`SELECT usuarios.nome, pedidos.total
FROM usuarios
LEFT JOIN pedidos ON pedidos.usuario_id = usuarios.id;
-- LEFT JOIN garante que usuários sem pedido ainda apareçam na lista`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre INNER JOIN e LEFT JOIN?",
            options: [
              "Não tem diferença, são sinônimos",
              "INNER JOIN só traz linhas que combinam nos dois lados; LEFT JOIN mantém todas as linhas do lado esquerdo, mesmo sem combinação (mostrando NULL)",
              "LEFT JOIN é sempre mais rápido",
              "INNER JOIN só funciona com 2 tabelas, LEFT JOIN com 3+",
            ],
            correctIndex: 1,
          },
          {
            question: "Pra que serve a cláusula ON num JOIN?",
            options: [
              "Define qual tabela vem primeiro",
              "Define a regra de combinação — quais colunas devem ser iguais pra juntar as linhas das duas tabelas",
              "Ordena o resultado",
              "Filtra por data",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
