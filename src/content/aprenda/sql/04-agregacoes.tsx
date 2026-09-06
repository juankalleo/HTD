import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-agregacoes",
  title: "Agregações: COUNT, GROUP BY, HAVING",
  summary: "Transformar várias linhas num resumo — \"quantos pedidos por usuário\", \"faturamento por mês\".",
  estimatedMinutes: 16,
};

export default function Licao04Agregacoes() {
  return (
    <LessonBody>
      <h2>Funções de agregação — resumem várias linhas num valor</h2>
      <CodeExample
        language="sql"
        code={`SELECT COUNT(*) FROM pedidos;        -- quantas linhas existem
SELECT SUM(total) FROM pedidos;       -- soma de todos os totais
SELECT AVG(total) FROM pedidos;       -- média
SELECT MAX(total), MIN(total) FROM pedidos; -- maior e menor`}
      />

      <h2>GROUP BY — agrupar antes de agregar</h2>
      <p>
        Sozinho, <code>COUNT(*)</code> conta TODAS as linhas. Com <code>GROUP BY</code>, ele conta{" "}
        <strong>por grupo</strong> — "quantos pedidos CADA usuário fez", não o total geral.
      </p>
      <CodeExample
        label="SQL"
        language="sql"
        result={`usuario_id | total_pedidos
-----------|---------------
1          | 2
2          | 1`}
        code={`SELECT usuario_id, COUNT(*) AS total_pedidos
FROM pedidos
GROUP BY usuario_id;`}
      />
      <p>
        Regra prática: toda coluna no <code>SELECT</code> que não está dentro de uma função de agregação precisa
        estar no <code>GROUP BY</code> — o banco precisa saber "por qual coluna estou agrupando" pra cada valor que
        aparece solto.
      </p>

      <h2>HAVING — filtrar DEPOIS de agrupar</h2>
      <p>
        <code>WHERE</code> filtra linhas <strong>antes</strong> de agrupar; <code>HAVING</code> filtra grupos{" "}
        <strong>depois</strong> — por isso <code>HAVING</code> pode usar o resultado de uma agregação, e{" "}
        <code>WHERE</code> não pode.
      </p>
      <CodeExample
        label="SQL — só usuários com mais de 1 pedido"
        language="sql"
        result={`usuario_id | total_pedidos
-----------|---------------
1          | 2`}
        code={`SELECT usuario_id, COUNT(*) AS total_pedidos
FROM pedidos
GROUP BY usuario_id
HAVING COUNT(*) > 1;`}
      />
      <CodeExample
        language="sql"
        code={`-- ERRADO — WHERE não pode usar COUNT(*)
SELECT usuario_id, COUNT(*) FROM pedidos WHERE COUNT(*) > 1 GROUP BY usuario_id;
-- Error: aggregate functions are not allowed in WHERE`}
      />

      <h2>Combinando com JOIN</h2>
      <CodeExample
        label="SQL — faturamento por usuário, só nome (via JOIN)"
        language="sql"
        code={`SELECT usuarios.nome, SUM(pedidos.total) AS total_gasto
FROM pedidos
JOIN usuarios ON pedidos.usuario_id = usuarios.id
GROUP BY usuarios.nome
ORDER BY total_gasto DESC;`}
      />

      <Exercise
        prompt={<p>Escreva a consulta que mostra a categoria de produto e a média de preço, só das categorias com mais de 3 produtos.</p>}
        solutionLanguage="sql"
        solutionCode={`SELECT categoria, AVG(preco) AS preco_medio
FROM produtos
GROUP BY categoria
HAVING COUNT(*) > 3;`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre WHERE e HAVING?",
            options: [
              "São idênticos, tanto faz qual usar",
              "WHERE filtra linhas antes de agrupar (não pode usar agregação); HAVING filtra grupos depois de agrupar (pode usar agregação como COUNT/SUM)",
              "HAVING só funciona sem GROUP BY",
              "WHERE é mais rápido sempre",
            ],
            correctIndex: 1,
          },
          {
            question: "Sem GROUP BY, o que SELECT COUNT(*) FROM pedidos retorna?",
            options: [
              "Uma lista de todos os pedidos",
              "Um único número — a contagem total de todas as linhas da tabela",
              "Erro de sintaxe",
              "A contagem por usuário automaticamente",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
