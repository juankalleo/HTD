import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-transacoes-e-acid",
  title: "Transações e ACID",
  summary: "Dois UPDATE que precisam acontecer juntos ou nenhum dos dois — o problema que uma transação existe pra resolver.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao11TransacoesEAcid() {
  return (
    <LessonBody>
      <p>
        Transferir dinheiro entre duas contas parece só dois <code>UPDATE</code>: debitar de uma, creditar na outra.
        Mas se o segundo <code>UPDATE</code> falhar — queda de conexão, erro de aplicação, o que for — depois do
        primeiro já ter rodado, o dinheiro simplesmente <strong>desaparece</strong>: saiu de uma conta e nunca chegou
        na outra. É exatamente esse problema que uma <strong>transação</strong> resolve.
      </p>

      <h2>BEGIN, COMMIT — agrupando comandos que precisam ser tudo ou nada</h2>
      <CodeExample
        label="SQL"
        language="sql"
        code={`BEGIN;

UPDATE contas SET saldo = saldo - 200 WHERE id = 1;
UPDATE contas SET saldo = saldo + 200 WHERE id = 2;

COMMIT;`}
      />
      <p>
        Entre <code>BEGIN</code> e <code>COMMIT</code>, os dois <code>UPDATE</code> fazem parte da{" "}
        <strong>mesma transação</strong>. Só quando o <code>COMMIT</code> roda é que as mudanças ficam gravadas de
        verdade — até lá, elas existem só dentro da transação em andamento.
      </p>

      <h2>ROLLBACK — desfazer tudo, como se nada tivesse acontecido</h2>
      <CodeExample
        label="SQL"
        language="sql"
        code={`BEGIN;

UPDATE contas SET saldo = saldo - 200 WHERE id = 1;
-- algo deu errado aqui (ex.: o saldo ficaria negativo)

ROLLBACK;
-- nenhuma das linhas mudou — é como se a transação inteira nunca tivesse rodado`}
      />
      <p>
        Se qualquer comando dentro da transação falhar, ou se você decidir explicitamente que não quer aplicar as
        mudanças, <code>ROLLBACK</code> desfaz <strong>tudo</strong> que aconteceu desde o <code>BEGIN</code>. É essa
        garantia de "tudo ou nada" que resolve o problema da transferência: se o crédito na segunda conta falhar, um{" "}
        <code>ROLLBACK</code> desfaz o débito da primeira também.
      </p>

      <h2>ACID — o que cada letra garante na prática</h2>
      <CodeExample
        label="referência rápida"
        language="plaintext"
        code={`Atomicity (Atomicidade)
  Todos os comandos da transação acontecem, ou nenhum acontece.
  → a transferência não pode debitar sem creditar.

Consistency (Consistência)
  A transação nunca deixa o banco num estado que viola suas regras
  (CHECK, FOREIGN KEY, UNIQUE...), mesmo que precise abortar no meio.
  → um saldo não pode ficar negativo se existe CHECK (saldo >= 0).

Isolation (Isolamento)
  Transações rodando ao mesmo tempo não enxergam o estado parcial
  (não commitado) uma da outra.
  → outra consulta não vê o saldo "só debitado, ainda não creditado".

Durability (Durabilidade)
  Depois do COMMIT, a mudança persiste mesmo que o banco trave ou
  a energia caia logo em seguida.
  → a transferência não "desaparece" se o servidor reiniciar.`}
      />
      <p>
        Repare que <strong>Consistency</strong> depende das constraints que você já viu nas lições 7 e 12 — uma
        transação não inventa regra nenhuma, ela só garante que as regras existentes nunca fiquem violadas nem
        temporariamente.
      </p>

      <h2>O banco aborta a transação inteira se um comando falhar</h2>
      <p>
        Em Postgres, se um comando dentro de <code>BEGIN...COMMIT</code> falha (por exemplo, viola uma{" "}
        <code>CHECK</code>), a transação inteira entra num estado de erro — nenhum comando seguinte roda até você
        digitar <code>ROLLBACK</code>. Não existe "só desfazer o comando que falhou e seguir com o resto": é tudo ou
        nada, do <code>BEGIN</code> até o fim.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva a transação que transfere R$ 100 da conta de id 3 pra conta de id 4, e explique numa frase por
            que os dois <code>UPDATE</code> precisam estar dentro do mesmo <code>BEGIN</code>/<code>COMMIT</code>.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`BEGIN;

UPDATE contas SET saldo = saldo - 100 WHERE id = 3;
UPDATE contas SET saldo = saldo + 100 WHERE id = 4;

COMMIT;
-- Sem a transação, se o segundo UPDATE falhar depois do primeiro já ter
-- rodado, R$ 100 saem da conta 3 e nunca chegam na conta 4. BEGIN/COMMIT
-- garante que as duas mudanças aconteçam juntas ou nenhuma aconteça —
-- um ROLLBACK desfaria o débito se o crédito não pudesse ser aplicado.`}
      />

      <Quiz
        track="sql"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Por que a transferência bancária (debitar de uma conta, creditar em outra) precisa ser uma transação atômica?",
            options: [
              "Porque rodar os dois UPDATE dentro de uma transação deixa a consulta mais rápida do que rodá-los separados",
              "Porque, se só o débito acontecer e o crédito falhar por algum motivo, o dinheiro desaparece; a transação garante que as duas mudanças aconteçam juntas ou nenhuma aconteça",
              "Porque uma transação serve só pra registrar um log da operação, sem afetar o resultado final",
              "Porque isso só é necessário quando as duas contas estão em bancos de dados diferentes",
            ],
            correctIndex: 1,
          },
          {
            question: "O que a garantia de Durability (o D de ACID) assegura?",
            options: [
              "Que o dado, uma vez gravado, nunca mais pode ser deletado ou atualizado por nenhum comando",
              "Que duas transações rodando ao mesmo tempo nunca enxergam o estado parcial uma da outra",
              "Que toda mudança respeita as constraints da tabela, como CHECK e FOREIGN KEY, mesmo dentro de uma transação",
              "Que, uma vez que a transação foi commitada, a mudança persiste mesmo que o banco trave ou a energia caia logo em seguida",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
