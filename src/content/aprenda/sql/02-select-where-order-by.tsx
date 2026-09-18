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
  level: "fundamentos",
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
              "SELECT ... WHERE ... FROM ... LIMIT ... ORDER BY, porque o filtro sempre precisa vir antes de declarar a tabela",
              "FROM ... SELECT ... ORDER BY ... WHERE ... LIMIT, já que o banco decide a tabela antes de saber quais colunas mostrar",
              "SELECT ... FROM ... ORDER BY ... WHERE ... LIMIT, porque ordenar precisa acontecer antes de filtrar as linhas",
              "SELECT ... FROM ... WHERE ... ORDER BY ... LIMIT — primeiro filtra as linhas, depois ordena o resultado, só então corta a quantidade",
            ],
            correctIndex: 3,
          },
          {
            question: "O que WHERE nome LIKE '%teclado%' encontra?",
            options: [
              "Só linhas onde o campo nome é exatamente igual à palavra 'teclado', sem nenhum caractere a mais",
              "Linhas onde a sequência 'teclado' aparece em qualquer posição do campo nome — no início, no meio ou no fim",
              "Só linhas onde o campo nome começa com a palavra 'teclado', ignorando o restante do texto",
              "Só linhas onde 'teclado' aparece como uma palavra isolada, separada por espaços do restante do texto",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
