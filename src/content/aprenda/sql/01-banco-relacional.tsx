import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-banco-relacional",
  title: "O que é um banco relacional",
  summary: "Tabelas, linhas, colunas — e por que 'relacional' se refere às relações ENTRE tabelas, não dentro de uma só.",
  estimatedMinutes: 12,
};

export default function Licao01BancoRelacional() {
  return (
    <LessonBody>
      <p>
        Um banco relacional (PostgreSQL, MySQL, SQLite...) guarda dado em <strong>tabelas</strong> — cada tabela com
        colunas fixas (o formato) e linhas (os registros). "Relacional" vem de como tabelas diferentes se{" "}
        <strong>relacionam</strong> entre si através de referências, em vez de duplicar dado.
      </p>

      <h2>Uma tabela</h2>
      <CodeExample
        label="tabela usuarios"
        language="plaintext"
        code={`id | nome  | email
---|-------|------------------
1  | Ana   | ana@exemplo.com
2  | Bruno | bruno@exemplo.com`}
      />

      <h2>Duas tabelas relacionadas</h2>
      <CodeExample
        label="tabela pedidos — referencia usuarios pelo id"
        language="plaintext"
        code={`id | usuario_id | total
---|------------|------
1  | 1          | 150.00
2  | 1          | 89.90
3  | 2          | 320.00`}
      />
      <p>
        Em vez de repetir "Ana, ana@exemplo.com" em cada pedido dela, a tabela <code>pedidos</code> só guarda{" "}
        <code>usuario_id</code> — um número que aponta pra linha correspondente em <code>usuarios</code>. Se o e-mail
        da Ana mudar, muda em UM lugar só; todos os pedidos continuam apontando pro mesmo <code>usuario_id</code>, sem
        nenhum dado duplicado ficando desatualizado.
      </p>

      <h2>Por que não guardar tudo numa tabela só</h2>
      <p>
        Juntar tudo (nome e e-mail do usuário dentro de cada linha de pedido) parece mais simples no começo, mas
        duplica dado (o mesmo nome/e-mail repetido em cada pedido) e cria um problema real: atualizar o e-mail exige
        atualizar <em>todas</em> as linhas de pedido daquele usuário, ou o dado fica inconsistente. Separar em
        tabelas relacionadas é a solução — e o assunto da lição 7 (normalização).
      </p>

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que 'relacional' significa num banco de dados relacional?",
            options: [
              "Que os dados têm relação romântica entre si",
              "Que tabelas diferentes se relacionam através de referências (como usuario_id), em vez de duplicar dado",
              "Que só existe uma tabela por banco",
              "Que o banco só funciona com números",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que a tabela pedidos guarda usuario_id em vez do nome e e-mail do usuário repetidos?",
            options: [
              "Por limitação técnica do banco",
              "Evita duplicar dado — se o e-mail mudar, muda em um lugar só (na tabela usuarios), sem inconsistência",
              "Não tem motivo real, é só convenção",
              "usuario_id ocupa mais espaço que nome e e-mail juntos",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
