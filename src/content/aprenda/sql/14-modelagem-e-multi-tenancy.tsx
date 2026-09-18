import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-modelagem-e-multi-tenancy",
  title: "Modelagem de dados e multi-tenancy",
  summary: "\"Normalizar é sempre melhor\" é meia-verdade — e servir vários clientes no mesmo banco levanta uma pergunta que normalização não responde.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao14ModelagemEMultiTenancy() {
  return (
    <LessonBody>
      <p>
        A lição 7 tratou normalização quase como regra fixa: separe em tabelas, evite duplicar dado. Na prática é
        mais um <strong>trade-off</strong> do que uma regra — às vezes desnormalizar de propósito é a decisão certa,
        contanto que você entenda o custo que está aceitando em troca.
      </p>

      <h2>Desnormalizar de propósito — você já viu isso na lição 8</h2>
      <p>
        <code>itens_pedido.preco_unitario</code> guardando o preço no momento da compra, em vez de sempre consultar{" "}
        <code>produtos.preco</code>, já era uma desnormalização proposital. Outro caso comum: cachear um total
        calculado pra evitar recalcular em toda leitura.
      </p>
      <CodeExample
        language="sql"
        code={`CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  total_gasto_cache DECIMAL NOT NULL DEFAULT 0
  -- desnormalizado de propósito: evita somar itens_pedido inteiro
  -- toda vez que um dashboard carrega a lista de usuários
);`}
      />
      <p>
        O ganho é leitura instantânea, sem <code>JOIN</code> nem <code>SUM</code> a cada consulta. O custo é real:
        alguém precisa manter <code>total_gasto_cache</code> sincronizado (um job, um trigger, ou o próprio código da
        aplicação) — e se essa sincronização falhar silenciosamente uma vez, o valor cacheado fica desatualizado sem
        ninguém perceber. Normalizar evita esse risco; desnormalizar aceita o risco em troca de velocidade de
        leitura. Não existe resposta certa universal — existe a pergunta "com que frequência esse dado muda, e o
        quanto essa leitura precisa ser rápida".
      </p>

      <h2>Multi-tenancy — vários clientes, uma aplicação só</h2>
      <p>
        Multi-tenancy é quando um único sistema atende vários clientes (tenants) isolados uns dos outros — cada
        cliente só deveria ver o próprio dado, nunca o de outro. Duas estratégias comuns resolvem isso de formas bem
        diferentes.
      </p>

      <h3>Estratégia 1 — coluna tenant_id compartilhada</h3>
      <CodeExample
        language="sql"
        code={`CREATE TABLE pedidos (
  id SERIAL PRIMARY KEY,
  tenant_id INTEGER NOT NULL REFERENCES tenants(id),
  usuario_id INTEGER REFERENCES usuarios(id),
  criado_em TIMESTAMP DEFAULT NOW()
);

SELECT * FROM pedidos WHERE tenant_id = 42 AND usuario_id = 7;
-- toda consulta precisa lembrar de filtrar por tenant_id`}
      />
      <p>
        Todos os clientes compartilham as mesmas tabelas; <code>tenant_id</code> separa o dado de cada um. É
        operacionalmente simples — um schema só, uma migration só pra manter — mas o isolamento entre clientes
        depende inteiramente de disciplina: <strong>esquecer o <code>WHERE tenant_id = ...</code> numa única
        consulta vaza dado de um cliente pro outro</strong>, porque não existe nenhuma barreira física entre eles.
      </p>

      <h3>Estratégia 2 — schema (ou banco) separado por cliente</h3>
      <CodeExample
        language="plaintext"
        code={`tenant_empresa_a.pedidos
tenant_empresa_b.pedidos
tenant_empresa_c.pedidos
-- cada cliente tem seu próprio schema (ou banco) com as mesmas tabelas`}
      />
      <p>
        O isolamento aqui é físico, não uma questão de lembrar do filtro certo: um <code>SELECT</code> sem filtro
        nenhum simplesmente não tem como alcançar dado de outro cliente, porque ele está em outro schema. O custo é
        operacional — uma migration precisa rodar em <em>cada</em> schema/banco, não em um só, e um relatório que
        precisa cruzar dado de vários clientes fica bem mais complicado de escrever.
      </p>

      <p>
        Nenhuma das duas é "a certa" — <code>tenant_id</code> compartilhado escala melhor operacionalmente conforme
        o número de clientes cresce; schema separado isola melhor, ao custo de multiplicar o trabalho de manutenção.
        A maioria dos produtos SaaS começa com <code>tenant_id</code> compartilhado, com um índice composto (
        <code>tenant_id</code> primeiro) garantindo que filtrar por cliente continue rápido mesmo com muitos tenants
        na mesma tabela.
      </p>

      <Callout href="/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base">
        A modelagem base do padrão (convenção de nome, timestamps, comportamento padrão de model) está documentada
        no Padrão Banco de Dados.
      </Callout>
      <Callout href="/padrao-banco-de-dados/conceitos-tecnicos/multi-tenancy">
        A estratégia de multi-tenancy adotada pelo padrão, e como ela é aplicada nas migrations e nos models, está
        documentada no Padrão Banco de Dados.
      </Callout>

      <Exercise
        prompt={
          <p>
            Um sistema multi-tenant usa a estratégia de coluna <code>tenant_id</code> compartilhada. Escreva a
            consulta que lista os pedidos do tenant 7, e explique numa frase por que esquecer o filtro de{" "}
            <code>tenant_id</code> nessa estratégia é particularmente perigoso.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`SELECT * FROM pedidos WHERE tenant_id = 7;

-- Sem o WHERE tenant_id = 7, a consulta devolveria pedidos de TODOS os
-- clientes misturados: na estratégia compartilhada, o isolamento entre
-- tenants existe só porque toda query lembra de filtrar — não há
-- barreira física separando o dado de clientes diferentes.`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Por que desnormalizar de propósito (ex.: guardar um total_gasto_cache já calculado) pode ser uma decisão certa, mesmo violando a normalização?",
            options: [
              "Evita recalcular uma agregação cara toda vez que o dado é lido, em troca de precisar manter esse valor sincronizado com a origem",
              "Porque desnormalizar elimina completamente a necessidade de índices nas tabelas envolvidas",
              "Porque todo sistema com mais de uma tabela relacionada precisa desnormalizar em algum ponto, sem exceção",
              "Porque desnormalizar remove por completo o risco de inconsistência entre os dados",
            ],
            correctIndex: 0,
          },
          {
            question:
              "Qual o principal risco da estratégia de multi-tenancy com uma coluna tenant_id compartilhada entre todos os clientes na mesma tabela?",
            options: [
              "Essa estratégia impede fisicamente que mais de um cliente use o mesmo banco de dados ao mesmo tempo",
              "Esquecer o filtro por tenant_id numa única query vaza dado de um cliente pro outro, já que não existe isolamento físico entre eles",
              "Cada cliente novo exige rodar uma migration inteira separada, específica só pra ele",
              "JOIN entre tabelas relacionadas deixa de funcionar quando todas compartilham a mesma coluna tenant_id",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
