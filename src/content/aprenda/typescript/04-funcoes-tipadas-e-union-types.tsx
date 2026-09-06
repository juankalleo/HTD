import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-funcoes-tipadas-e-union-types",
  title: "Funções tipadas e union types",
  summary: "Tipar parâmetro e retorno de função, e o 'narrowing' que o TS faz sozinho dentro de um if.",
  estimatedMinutes: 15,
};

export default function Licao04FuncoesTipadasEUnionTypes() {
  return (
    <LessonBody>
      <h2>Tipando parâmetro e retorno</h2>
      <CodeExample
        language="typescript"
        code={`function somar(a: number, b: number): number {
  return a + b;
}

// o tipo de retorno geralmente é inferido, mas escrevê-lo documenta a intenção
// e o TS avisa se o corpo da função não bater com o que foi prometido:
function dividir(a: number, b: number): number {
  if (b === 0) return "erro"; // Error: Type 'string' is not assignable to type 'number'.
  return a / b;
}`}
      />

      <h2>Union type — "isso ou aquilo"</h2>
      <CodeExample
        language="typescript"
        code={`function formatarId(id: string | number): string {
  return \`ID-\${id}\`;
}

formatarId(42);     // ok
formatarId("42");   // ok
formatarId(true);   // Error: Argument of type 'boolean' is not assignable...`}
      />

      <h2>Narrowing — o TS "estreita" o tipo dentro de um if</h2>
      <p>
        Quando uma variável é <code>string | number</code>, você não pode chamar direto um método específico de
        string (o TS não sabe qual dos dois é, em tempo de compilação). Mas dentro de um <code>if</code> que testa o
        tipo, o TS "lembra" da checagem:
      </p>
      <CodeExample
        language="typescript"
        code={`function formatar(valor: string | number) {
  if (typeof valor === "string") {
    return valor.toUpperCase(); // aqui dentro, TS sabe que valor é string
  }
  return valor.toFixed(2); // aqui, só sobra number — TS sabe por eliminação
}`}
      />
      <p>
        Isso se chama <strong>narrowing</strong>: o tipo vai "estreitando" conforme o código faz checagens — sem você
        precisar de nenhuma anotação extra dentro do <code>if</code>, o TS já entende sozinho.
      </p>

      <h2>Discriminated union — o padrão pra "isso é uma coisa OU outra, com formatos diferentes"</h2>
      <CodeExample
        language="typescript"
        code={`type Resultado =
  | { sucesso: true; dado: string }
  | { sucesso: false; erro: string };

function tratar(resultado: Resultado) {
  if (resultado.sucesso) {
    console.log(resultado.dado); // TS sabe que "dado" existe aqui
  } else {
    console.log(resultado.erro); // e que "erro" existe só aqui
  }
}`}
      />
      <p>
        O campo <code>sucesso</code> (o "discriminante") é o que permite o TS saber, dentro de cada branch, qual dos
        dois formatos está em jogo — muito parecido com o padrão <code>ServiceResult</code> que aparece no Padrão API.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva uma função <code>descrever(valor: string | string[])</code> que retorna o próprio valor se for
            string, ou os valores unidos por vírgula se for array.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`function descrever(valor: string | string[]): string {
  if (Array.isArray(valor)) {
    return valor.join(", "); // TS sabe que é string[] aqui
  }
  return valor; // e que é string aqui
}`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que é 'narrowing' em TypeScript?",
            options: [
              "Reduzir o tamanho do arquivo compilado",
              "O TS refinar/estreitar o tipo de uma variável dentro de um bloco (ex.: if com typeof), sem anotação extra",
              "Um erro de compilação",
              "Uma função nativa do TypeScript",
            ],
            correctIndex: 1,
          },
          {
            question: "Num type Resultado = { sucesso: true; dado: string } | { sucesso: false; erro: string }, qual o papel do campo sucesso?",
            options: [
              "Nenhum, é só um campo qualquer",
              "É o 'discriminante' — permite o TS saber, dentro de cada if, qual dos dois formatos está sendo usado",
              "Ele precisa ser sempre true",
              "Só serve pra debug",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
