import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-migrations-seguras-em-producao",
  title: "Migrations seguras em produção",
  summary: "O mesmo ALTER TABLE que roda instantâneo no seu banco de teste pode travar uma tabela real por minutos.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao13MigrationsSegurasEmProducao() {
  return (
    <LessonBody>
      <p>
        Numa tabela de teste com 200 linhas, <code>ALTER TABLE usuarios ADD COLUMN documento VARCHAR(20) NOT
        NULL</code> roda em milissegundos. Na mesma tabela em produção, com 5 milhões de linhas e tráfego real
        acontecendo ao mesmo tempo, o mesmo comando pode segurar um lock que trava leituras e escritas por minutos —
        e minutos de indisponibilidade em produção custam caro.
      </p>

      <h2>Por que NOT NULL numa tabela grande é arriscado</h2>
      <p>
        Adicionar uma coluna nova, sozinha e sem obrigatoriedade, costuma ser rápido. O problema aparece quando você
        exige que <strong>toda linha já existente</strong> respeite uma regra nova — como <code>NOT NULL</code> — o
        banco precisa varrer a tabela inteira, linha por linha, pra confirmar que nenhuma viola a regra antes de
        aceitar a constraint. Numa tabela pequena isso é instantâneo; numa tabela de milhões de linhas, é uma
        varredura completa segurando um lock enquanto roda.
      </p>

      <h2>Estratégia em etapas — a forma segura</h2>
      <CodeExample
        label="etapa 1 — coluna nova, ainda opcional"
        language="sql"
        code={`ALTER TABLE usuarios ADD COLUMN documento VARCHAR(20);
-- sem NOT NULL: essa etapa é rápida mesmo numa tabela grande`}
      />
      <CodeExample
        label="etapa 2 — backfill em lotes, não tudo de uma vez"
        language="sql"
        code={`UPDATE usuarios
SET documento = 'PENDENTE'
WHERE documento IS NULL AND id BETWEEN 1 AND 50000;
-- repete por faixas de id até cobrir a tabela inteira — em produção,
-- isso roda em background, em pedaços pequenos, nunca numa transação
-- gigante que trava a tabela do início ao fim`}
      />
      <CodeExample
        label="etapa 3 — só depois que toda linha já tem valor"
        language="sql"
        code={`ALTER TABLE usuarios ALTER COLUMN documento SET NOT NULL;
-- agora essa validação é rápida: já não existe nenhuma linha com
-- documento vazio pra encontrar no meio da varredura`}
      />
      <p>
        Cada etapa é pequena e reversível separadamente — se algo der errado no backfill, dá pra pausar sem afetar a
        aplicação, já que a coluna ainda é opcional. Uma migration "tudo de uma vez" (criar a coluna já{" "}
        <code>NOT NULL</code>) não te dá esse meio-termo: ou funciona de primeira, ou trava a tabela tentando.
      </p>

      <h2>NOT VALID / VALIDATE CONSTRAINT — a mesma ideia pra CHECK</h2>
      <CodeExample
        language="sql"
        code={`ALTER TABLE usuarios
  ADD CONSTRAINT documento_nao_vazio CHECK (documento <> '') NOT VALID;
-- a constraint já vale pra todo INSERT/UPDATE novo a partir de agora,
-- sem varrer o dado existente nesse momento

ALTER TABLE usuarios VALIDATE CONSTRAINT documento_nao_vazio;
-- essa segunda etapa varre o dado já existente, mas com um lock mais
-- leve do que adicionar a constraint validada de uma vez só`}
      />

      <h2>Pensando em rollback</h2>
      <p>
        Migrations em etapas pequenas facilitam reverter: tirar um <code>NOT NULL</code> recém-aplicado é rápido;
        apagar uma coluna nullable que ainda não é usada por nenhum código não quebra nada. O risco cresce quando uma
        migration remove ou renomeia algo que o código em produção ainda depende — o código antigo (rodando enquanto
        o deploy novo ainda não terminou) não pode quebrar por causa da migration mais nova.
      </p>

      <Callout href="/padrao-banco-de-dados/conceitos-tecnicos/migrations">
        Como o padrão estrutura migrations em etapas (coluna opcional → backfill → constraint) está documentado no
        Padrão Banco de Dados.
      </Callout>

      <Exercise
        prompt={
          <p>
            Você precisa tornar obrigatória (<code>NOT NULL</code>) a coluna <code>telefone</code> numa tabela{" "}
            <code>usuarios</code> com 5 milhões de linhas, em produção, sem causar indisponibilidade. Escreva o SQL
            essencial de cada etapa.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`-- 1. Adiciona a coluna sem NOT NULL
ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(20);

-- 2. Faz o backfill em lotes, preenchendo as linhas existentes
UPDATE usuarios
SET telefone = 'NAO_INFORMADO'
WHERE telefone IS NULL AND id BETWEEN 1 AND 50000;
-- repete por faixas de id até cobrir toda a tabela

-- 3. Só depois de confirmar que toda linha já tem valor
ALTER TABLE usuarios ALTER COLUMN telefone SET NOT NULL;`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Por que um ALTER TABLE que adiciona uma constraint NOT NULL numa tabela de milhões de linhas pode ser perigoso em produção?",
            options: [
              "Porque NOT NULL só pode ser definido na criação da tabela, nunca pode ser adicionado depois",
              "Porque a coluna nova sempre ocupa espaço em disco proporcional ao tamanho da tabela inteira, mesmo antes de ter dado",
              "Porque o banco precisa varrer a tabela inteira pra confirmar que toda linha já respeita a regra, e isso pode segurar um lock que bloqueia outras queries por um bom tempo",
              "Porque o comando falha imediatamente com erro de sintaxe se a tabela já tiver alguma linha",
            ],
            correctIndex: 2,
          },
          {
            question:
              "Qual a estratégia mais segura pra tornar uma coluna nova obrigatória (NOT NULL) numa tabela grande já em produção?",
            options: [
              "Adicionar a coluna como nullable primeiro, fazer o backfill dos dados existentes em lotes, e só então aplicar o NOT NULL quando toda linha já tiver valor",
              "Criar a coluna já como NOT NULL desde o início, com um valor DEFAULT fixo, pra evitar rodar duas migrations separadas",
              "Deixar a coluna sempre nullable e resolver a obrigatoriedade inteiramente na validação do backend, sem nunca usar NOT NULL",
              "Rodar a migration inteira dentro de uma única transação bem longa, garantindo que tudo aconteça de uma vez só",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
