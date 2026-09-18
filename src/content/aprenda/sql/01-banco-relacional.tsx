import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-banco-relacional",
  title: "O que é um banco relacional",
  summary: "Tabelas, linhas, colunas — e por que 'relacional' se refere às relações ENTRE tabelas, não dentro de uma só.",
  estimatedMinutes: 12,
  level: "fundamentos",
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
              "Que tabelas diferentes se relacionam entre si através de referências, como usuario_id apontando pra uma linha de outra tabela, evitando duplicar o mesmo dado",
              "Que as tabelas se conectam automaticamente sempre que duas colunas têm o mesmo nome, sem precisar declarar nenhuma referência",
              "Que cada tabela guarda uma cópia completa do dado das outras tabelas, pra consultas ficarem mais rápidas",
              "Que o banco relaciona apenas números entre si, e por isso texto precisa ser convertido antes de ser salvo",
            ],
            correctIndex: 0,
          },
          {
            question: "Por que a tabela pedidos guarda usuario_id em vez do nome e e-mail do usuário repetidos?",
            options: [
              "Porque nome e e-mail ocupam mais espaço em disco do que um número, e isso é sempre a prioridade no design de tabelas",
              "Porque o banco de dados não permite guardar o mesmo texto em mais de uma tabela ao mesmo tempo",
              "Porque evita duplicar o mesmo dado em várias linhas — se o e-mail do usuário mudar, ele muda em um lugar só, na tabela usuarios",
              "Porque usuario_id é a única forma de fazer uma consulta com ORDER BY funcionar corretamente",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
