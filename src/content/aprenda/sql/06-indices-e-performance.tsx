import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-indices-e-performance",
  title: "Índices e performance",
  summary: "Por que uma consulta fica lenta com 10 milhões de linhas — e o que um índice realmente faz.",
  estimatedMinutes: 15,
  level: "fundamentos",
};

export default function Licao06IndicesEPerformance() {
  return (
    <LessonBody>
      <p>
        Sem índice, <code>WHERE email = 'ana@exemplo.com'</code> numa tabela de 10 milhões de linhas faz o banco
        olhar <strong>linha por linha</strong>, do início ao fim, até achar (ou confirmar que não existe) — chamado{" "}
        <em>full table scan</em>. Um índice existe pra evitar exatamente isso.
      </p>

      <h2>O que um índice realmente é</h2>
      <p>
        Pense num índice remissivo no final de um livro — em vez de ler o livro inteiro procurando "container",
        você vai direto na página que o índice aponta. Um índice de banco de dados faz a mesma coisa: uma estrutura
        auxiliar ordenada que aponta direto pra onde cada valor está, sem precisar varrer a tabela inteira.
      </p>

      <CodeExample
        language="sql"
        code={`CREATE INDEX idx_usuarios_email ON usuarios (email);

-- agora esta consulta usa o índice em vez de full table scan:
SELECT * FROM usuarios WHERE email = 'ana@exemplo.com';`}
      />

      <h2>O preço de um índice</h2>
      <p>
        Índice não é de graça: toda vez que uma linha é inserida/atualizada, o índice também precisa ser atualizado —
        mais índices significam <code>INSERT</code>/<code>UPDATE</code> um pouco mais lentos, em troca de{" "}
        <code>SELECT</code> muito mais rápido. A regra prática: indexe colunas usadas com frequência em{" "}
        <code>WHERE</code>, <code>JOIN</code> e <code>ORDER BY</code> — não toda coluna da tabela.
      </p>

      <h2>Chave primária já vem indexada de graça</h2>
      <CodeExample
        language="sql"
        code={`CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY, -- já cria um índice automaticamente
  email VARCHAR(255)      -- esse, se buscado com frequência, merece um índice manual
);`}
      />

      <h2>EXPLAIN — ver o que o banco realmente faz</h2>
      <CodeExample
        label="SQL (PostgreSQL)"
        language="sql"
        result={`Index Scan using idx_usuarios_email on usuarios
  Index Cond: (email = 'ana@exemplo.com'::text)`}
        code={`EXPLAIN SELECT * FROM usuarios WHERE email = 'ana@exemplo.com';`}
      />
      <p>
        "Index Scan" confirma que o índice foi usado. Se aparecesse "Seq Scan" (sequential scan), a consulta estaria
        varrendo a tabela inteira mesmo com o índice existindo — geralmente porque faltou criar o índice na coluna
        certa, ou porque a tabela é pequena demais pro banco achar que vale a pena usar o índice.
      </p>

      <Callout href="/padrao-banco-de-dados/conceitos-tecnicos/migrations">
        Como declarar índices nas migrations do padrão (add_index, unique: true) está documentado no Padrão Banco de
        Dados.
      </Callout>

      <Callout
        title="Isso é aprofundado no intermediário"
        href="/aprenda/sql/15-explain-e-otimizacao-de-queries"
        linkLabel="Ver aula completa →"
      >
        Aqui você só viu "Index Scan" vs. "Seq Scan"; a aula intermediária ensina a ler um EXPLAIN ANALYZE inteiro,
        incluindo quando o planner decide ignorar um índice que existe.
      </Callout>

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que um índice evita?",
            options: [
              "Evita que a tabela tenha dado duplicado, funcionando como uma constraint de unicidade",
              "Evita a necessidade de usar WHERE nas consultas, já que o índice filtra sozinho",
              "Evita que a tabela precise ter uma chave primária definida",
              "Evita um full table scan ao buscar por uma coluna indexada, tornando a busca muito mais rápida que varrer linha por linha",
            ],
            correctIndex: 3,
          },
          {
            question: "Qual o 'preço' de se ter muitos índices numa tabela?",
            options: [
              "SELECT fica mais lento, porque o banco precisa verificar todos os índices antes de responder",
              "INSERT e UPDATE ficam um pouco mais lentos, porque cada índice também precisa ser atualizado a cada mudança na tabela",
              "A tabela passa a aceitar menos colunas do que teria sem os índices",
              "Só ocupa mais espaço em disco, sem nenhum efeito na velocidade de leitura ou escrita",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
