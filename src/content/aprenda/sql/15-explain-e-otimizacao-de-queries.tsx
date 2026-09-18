import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-explain-e-otimizacao-de-queries",
  title: "EXPLAIN e otimização de queries",
  summary: "Criar o índice não é o fim da história — o planner pode decidir não usá-lo, e EXPLAIN ANALYZE é como você descobre por quê.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao15ExplainEOtimizacaoDeQueries() {
  return (
    <LessonBody>
      <p>
        Na lição 6, <code>EXPLAIN</code> apareceu como uma única linha confirmando "Index Scan". O output real de{" "}
        <code>EXPLAIN ANALYZE</code> traz muito mais que isso — e é comum criar um índice certinho e ainda assim ver
        o banco decidir <strong>não usá-lo</strong>. Não é bug: é o planner fazendo uma escolha, e dá pra entender
        qual.
      </p>

      <h2>Antes do índice — lendo um EXPLAIN ANALYZE completo</h2>
      <CodeExample
        label="SQL (PostgreSQL)"
        language="sql"
        result={`Seq Scan on pedidos  (cost=0.00..2200.00 rows=8 width=24) (actual time=0.008..18.412 rows=6 loops=1)
  Filter: (usuario_id = 42)
  Rows Removed by Filter: 99994
Planning Time: 0.085 ms
Execution Time: 18.437 ms`}
        code={`EXPLAIN ANALYZE SELECT * FROM pedidos WHERE usuario_id = 42;`}
      />
      <p>
        <code>Seq Scan</code> confirma que o banco varreu a tabela inteira. <code>cost=0.00..2200.00</code> é a
        estimativa de custo <em>antes</em> de rodar (arranque..total, numa unidade arbitrária do planner, não
        milissegundos) — serve pra comparar planos entre si, não pra medir tempo real.{" "}
        <code>actual time=0.008..18.412</code> já é <strong>tempo medido de verdade</strong>, porque{" "}
        <code>ANALYZE</code> manda o Postgres executar a consulta, não só estimar. <code>Rows Removed by
        Filter: 99994</code> mostra o preço do <code>Seq Scan</code>: quase 100 mil linhas lidas e descartadas só
        pra achar as 6 que interessavam.
      </p>

      <h2>Depois do índice — o mesmo EXPLAIN, plano diferente</h2>
      <CodeExample
        label="SQL (PostgreSQL)"
        language="sql"
        result={`Index Scan using idx_pedidos_usuario_id on pedidos  (cost=0.29..8.31 rows=8 width=24) (actual time=0.015..0.019 rows=6 loops=1)
  Index Cond: (usuario_id = 42)
Planning Time: 0.095 ms
Execution Time: 0.041 ms`}
        code={`CREATE INDEX idx_pedidos_usuario_id ON pedidos (usuario_id);

EXPLAIN ANALYZE SELECT * FROM pedidos WHERE usuario_id = 42;`}
      />
      <p>
        O custo estimado caiu de <code>2200.00</code> pra <code>8.31</code>, e o tempo de execução real caiu de{" "}
        ~18ms pra ~0.04ms — sem <code>Rows Removed by Filter</code> nenhum, porque o <code>Index Scan</code> vai
        direto nas linhas certas em vez de varrer tudo.
      </p>

      <h2>Quando o planner ignora um índice que existe</h2>
      <p>
        Criar o índice não garante que ele sempre será usado — o planner escolhe pelo <strong>custo estimado</strong>
        , não por "existe índice, então usa". Alguns motivos comuns pra ele preferir <code>Seq Scan</code> mesmo com
        índice disponível:
      </p>
      <CodeExample
        label="motivos comuns"
        language="plaintext"
        code={`1. Tabela pequena — ler tudo sequencialmente já é barato o
   suficiente; abrir o índice teria um custo relativo maior.

2. Baixa seletividade — se o filtro combina com uma fração grande
   da tabela (ex.: 40% das linhas), varrer tudo pode sair mais
   barato do que ficar saltando entre índice e tabela.

3. Estatísticas desatualizadas — o planner decide com base em
   estatísticas de distribuição de dado. Se a tabela mudou muito
   e ninguém rodou ANALYZE nome_da_tabela;, a estimativa de custo
   pode estar errada.

4. Função aplicada na coluna indexada — WHERE LOWER(email) = ...
   não usa um índice normal em email; precisaria de um índice
   sobre a expressão LOWER(email) especificamente.`}
      />
      <CodeExample
        label="SQL — índice de expressão pro caso da função"
        language="sql"
        code={`-- índice comum em email não ajuda aqui:
SELECT * FROM usuarios WHERE LOWER(email) = 'ana@exemplo.com';

-- índice sobre a expressão, sim:
CREATE INDEX idx_usuarios_email_lower ON usuarios (LOWER(email));`}
      />

      <Exercise
        prompt={
          <p>
            Você roda <code>EXPLAIN ANALYZE</code> numa consulta e vê <code>Seq Scan</code>, mesmo existindo um
            índice na coluna do <code>WHERE</code>. Cite duas razões plausíveis (vistas nesta lição) pra isso
            acontecer, sem trocar o índice de coluna.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`1) A tabela (ou a fração de linhas que o filtro retorna) é pequena/pouco
   seletiva o suficiente pra o planner estimar que um Seq Scan sai mais
   barato que abrir o índice — não é bug, é a estimativa de custo dele.

2) As estatísticas da tabela estão desatualizadas e o planner está
   estimando errado quantas linhas o filtro realmente retorna; rodar
   ANALYZE nome_da_tabela; pode corrigir a decisão.

(também válido: a consulta aplica uma função sobre a coluna indexada,
como LOWER(email), e não existe um índice de expressão pra essa
função específica.)`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Numa saída de EXPLAIN ANALYZE, qual a diferença entre 'Seq Scan' e 'Index Scan'?",
            options: [
              "Seq Scan só aparece em comandos INSERT/UPDATE; Index Scan só aparece em comandos SELECT",
              "Index Scan sempre executa num tempo fixo, não importa o tamanho da tabela; Seq Scan sempre demora o dobro disso",
              "Seq Scan varre a tabela inteira linha por linha; Index Scan usa a estrutura do índice pra ir direto às linhas que combinam com o filtro",
              "São nomes diferentes pro mesmo mecanismo interno — o banco executa a consulta da mesma forma nos dois casos",
            ],
            correctIndex: 2,
          },
          {
            question: "Cite um motivo real pelo qual o planner pode decidir ignorar um índice que existe na coluna do WHERE.",
            options: [
              "Índices só funcionam em colunas do tipo INTEGER, então colunas de texto nunca são usadas pelo planner",
              "O planner sempre usa o índice quando ele existe; 'Seq Scan' na saída do EXPLAIN significa que o índice foi deletado",
              "O banco escolhe aleatoriamente entre Seq Scan e Index Scan a cada execução, pra distribuir a carga",
              "A tabela (ou a fração de linhas que o filtro retorna) é pequena o suficiente pra o planner estimar que um Seq Scan sai mais barato que usar o índice",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
