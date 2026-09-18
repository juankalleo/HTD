import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-insert-update-delete",
  title: "INSERT, UPDATE, DELETE",
  summary: "Os três comandos que mudam dado — e por que UPDATE/DELETE sem WHERE é o erro mais caro do SQL.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao05InsertUpdateDelete() {
  return (
    <LessonBody>
      <h2>INSERT — criar uma linha nova</h2>
      <CodeExample
        language="sql"
        code={`INSERT INTO usuarios (nome, email)
VALUES ('Carla', 'carla@exemplo.com');`}
      />

      <h2>UPDATE — alterar linhas existentes</h2>
      <CodeExample
        language="sql"
        code={`UPDATE produtos
SET preco = 279.90
WHERE id = 1;`}
      />

      <h2>DELETE — remover linhas</h2>
      <CodeExample
        language="sql"
        code={`DELETE FROM pedidos
WHERE status = 'cancelado';`}
      />

      <h2>O erro mais caro: esquecer o WHERE</h2>
      <CodeExample
        label="isso apaga a tabela inteira"
        language="sql"
        code={`DELETE FROM pedidos;
-- sem WHERE, TODA linha da tabela é removida — não só uma

UPDATE produtos SET preco = 0;
-- sem WHERE, TODO produto vira preço 0`}
      />
      <p>
        Sem <code>WHERE</code>, <code>UPDATE</code>/<code>DELETE</code> aplicam a{" "}
        <strong>toda</strong> a tabela — esse é literalmente o erro de produção mais contado em histórias de
        desastre de banco de dados. Em produção, times sérios rodam um <code>SELECT</code> com o mesmo{" "}
        <code>WHERE</code> primeiro, pra conferir quantas/quais linhas seriam afetadas, antes de trocar pra{" "}
        <code>DELETE</code>/<code>UPDATE</code>.
      </p>

      <h2>RETURNING — ver o que mudou, sem uma segunda consulta</h2>
      <CodeExample
        label="SQL (PostgreSQL)"
        language="sql"
        result={`id | nome  | email
---|-------|------------------
5  | Carla | carla@exemplo.com`}
        code={`INSERT INTO usuarios (nome, email)
VALUES ('Carla', 'carla@exemplo.com')
RETURNING *;`}
      />

      <Exercise
        prompt={
          <p>
            Escreva o comando que marca como <code>"pago"</code> só o pedido de id 42, sem afetar nenhum outro
            pedido.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`UPDATE pedidos
SET status = 'pago'
WHERE id = 42;`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que UPDATE produtos SET preco = 0; (sem WHERE) faz?",
            options: [
              "Zera o preço de TODOS os produtos da tabela, não só de um produto específico",
              "Não faz nada, porque UPDATE exige uma cláusula WHERE pra ser executado",
              "Pede uma confirmação no terminal antes de aplicar a mudança em massa",
              "Afeta só a primeira linha da tabela, na ordem em que os dados foram inseridos",
            ],
            correctIndex: 0,
          },
          {
            question: "Qual prática ajuda a evitar um DELETE/UPDATE destrutivo em produção?",
            options: [
              "Sempre rodar o comando duas vezes seguidas, pra garantir que a segunda execução corrija a primeira",
              "Evitar usar transações, já que elas deixam o DELETE/UPDATE mais lento em produção",
              "Rodar um SELECT com o mesmo WHERE antes, pra conferir quais e quantas linhas seriam afetadas antes de aplicar o DELETE/UPDATE",
              "Usar sempre DELETE no lugar de UPDATE, porque DELETE é mais fácil de reverter depois",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
