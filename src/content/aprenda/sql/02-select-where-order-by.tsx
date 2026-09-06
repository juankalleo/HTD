import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-select-where-order-by",
  title: "SELECT, WHERE, ORDER BY",
  summary: "A consulta mais comum de todas: escolher colunas, filtrar linhas, definir a ordem.",
  estimatedMinutes: 15,
};

export default function Licao02SelectWhereOrderBy() {
  return (
    <LessonBody>
      <h2>SELECT — escolher colunas</h2>
      <CodeExample
        label="SQL"
        language="sql"
        result={`id | nome  | email
---|-------|------------------
1  | Ana   | ana@exemplo.com
2  | Bruno | bruno@exemplo.com`}
        code={`SELECT id, nome, email FROM usuarios;`}
      />
      <CodeExample language="sql" code={`SELECT * FROM usuarios; -- * = todas as colunas (útil pra explorar, evite em código de produção)`} />

      <h2>WHERE — filtrar linhas</h2>
      <CodeExample
        label="SQL"
        language="sql"
        result={`id | nome | email
---|------|------------------
1  | Ana  | ana@exemplo.com`}
        code={`SELECT * FROM usuarios WHERE nome = 'Ana';`}
      />
      <CodeExample
        language="sql"
        code={`SELECT * FROM produtos WHERE preco > 100;
SELECT * FROM produtos WHERE preco > 100 AND categoria = 'eletronico';
SELECT * FROM produtos WHERE nome LIKE '%teclado%'; -- contém "teclado" em qualquer posição
SELECT * FROM pedidos WHERE status IN ('pendente', 'pago'); -- um valor OU outro`}
      />

      <h2>ORDER BY — definir a ordem</h2>
      <CodeExample
        label="SQL"
        language="sql"
        result={`id | nome    | preco
---|---------|-------
3  | Monitor | 900.00
1  | Teclado | 250.00
2  | Mouse   | 80.00`}
        code={`SELECT * FROM produtos ORDER BY preco DESC; -- DESC = decrescente, ASC = crescente (padrão)`}
      />

      <h2>LIMIT — parar depois de N linhas</h2>
      <CodeExample
        language="sql"
        code={`SELECT * FROM produtos ORDER BY preco DESC LIMIT 3; -- só os 3 mais caros`}
      />

      <p>
        A ordem de leitura dessas cláusulas é sempre a mesma:{" "}
        <code>SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT ...</code> — filtra primeiro (WHERE), depois ordena
        (ORDER BY), depois corta (LIMIT).
      </p>

      <Exercise
        prompt={
          <p>
            Escreva a consulta que retorna nome e preço dos 5 produtos mais baratos da categoria{" "}
            <code>"livro"</code>.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`SELECT nome, preco
FROM produtos
WHERE categoria = 'livro'
ORDER BY preco ASC
LIMIT 5;`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a ordem correta das cláusulas numa consulta SELECT?",
            options: [
              "ORDER BY, WHERE, SELECT, FROM",
              "SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT",
              "LIMIT vem sempre antes de WHERE",
              "Não importa a ordem, o SQL reorganiza sozinho",
            ],
            correctIndex: 1,
          },
          {
            question: "O que WHERE nome LIKE '%teclado%' encontra?",
            options: [
              "Só linhas onde nome é exatamente 'teclado'",
              "Linhas onde a palavra 'teclado' aparece em qualquer posição do campo nome",
              "Só linhas que começam com 'teclado'",
              "Um erro de sintaxe",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
