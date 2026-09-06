import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-variaveis-tipos-e-operadores",
  title: "Variáveis, tipos e operadores",
  summary: "let, const, os tipos primitivos e por que === substituiu == na maioria do código moderno.",
  estimatedMinutes: 14,
};

export default function Licao01VariaveisTiposEOperadores() {
  return (
    <LessonBody>
      <h2>let e const — var praticamente não se usa mais</h2>
      <CodeExample
        language="javascript"
        code={`let idade = 28;      // pode ser reatribuída depois
const nome = "Ana";  // não pode ser reatribuída

idade = 29;           // ok
nome = "Bia";         // erro: Assignment to constant variable.`}
      />
      <p>
        <code>const</code> é a escolha padrão — sinaliza "isso não muda". <code>let</code> só quando você sabe que
        vai reatribuir (um contador, um acumulador). <code>var</code> existe por compatibilidade histórica e tem
        regras de escopo mais confusas — evite em código novo.
      </p>

      <h2>Os tipos primitivos</h2>
      <CodeExample
        language="javascript"
        code={`typeof 42          // "number"   — só existe UM tipo numérico em JS (sem int/float separados)
typeof "oi"         // "string"
typeof true         // "boolean"
typeof undefined    // "undefined" — variável declarada mas sem valor
typeof null         // "object"    — isso é um bug histórico da linguagem, aceito como está
typeof Symbol()      // "symbol"
typeof 10n           // "bigint"`}
      />

      <h2>== vs. === — a diferença que mais causa bug em quem começa</h2>
      <p>
        <code>==</code> converte os tipos antes de comparar (coerção); <code>===</code> compara o valor{" "}
        <strong>e</strong> o tipo, sem conversão nenhuma. Quase todo código moderno usa só <code>===</code>.
      </p>
      <CodeExample
        language="javascript"
        code={`0 == "0"      // true  — "0" vira número 0 antes de comparar
0 === "0"     // false — tipos diferentes (number vs string), não converte

null == undefined    // true  — caso especial da linguagem
null === undefined   // false`}
      />

      <h2>Template strings — interpolar sem concatenar</h2>
      <CodeExample
        language="javascript"
        code={`const nome = "Ana";
const idade = 28;

// jeito antigo
"Olá, " + nome + "! Você tem " + idade + " anos."

// template string
\`Olá, \${nome}! Você tem \${idade} anos.\``}
      />

      <Exercise
        prompt={
          <p>
            Por que <code>const lista = [1, 2, 3]; lista.push(4);</code> funciona, mesmo <code>lista</code> sendo{" "}
            <code>const</code>?
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`// const impede REATRIBUIR a variável (lista = outraCoisa seria erro),
// mas não impede mutar o conteúdo do que ela aponta. push() muda o
// array existente no lugar, não cria um array novo — a variável
// "lista" continua apontando pro mesmo array o tempo todo.`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que === verifica que == não verifica?",
            options: [
              "Nada, são idênticos",
              "=== compara tipo e valor sem converter; == converte os tipos antes de comparar",
              "=== é mais rápido, só isso",
              "== só funciona com número",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que const é a escolha padrão em vez de let?",
            options: [
              "const é mais rápido de executar",
              "Sinaliza que a variável não vai ser reatribuída, deixando o código mais previsível — use let só quando for reatribuir de verdade",
              "let não existe em navegadores antigos",
              "Não tem diferença nenhuma",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
