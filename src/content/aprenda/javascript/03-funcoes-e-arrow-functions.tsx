import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-funcoes-e-arrow-functions",
  title: "Funções e arrow functions",
  summary: "Declaração vs. expressão, arrow function e a diferença real de comportamento do 'this'.",
  estimatedMinutes: 15,
};

export default function Licao03FuncoesEArrowFunctions() {
  return (
    <LessonBody>
      <h2>3 jeitos de escrever a mesma função</h2>
      <CodeExample
        language="javascript"
        code={`// declaração de função — pode ser chamada antes mesmo de aparecer no arquivo
function somar(a, b) {
  return a + b;
}

// expressão de função — só existe a partir da linha onde é definida
const subtrair = function (a, b) {
  return a - b;
};

// arrow function — mais curta, e com uma diferença real de comportamento (abaixo)
const multiplicar = (a, b) => a * b;`}
      />

      <h2>Parâmetro padrão e rest</h2>
      <CodeExample
        language="javascript"
        code={`function saudar(nome = "visitante") {
  return \`Olá, \${nome}!\`;
}
saudar();       // "Olá, visitante!"
saudar("Ana");  // "Olá, Ana!"

function somarTodos(...numeros) {
  return numeros.reduce((total, n) => total + n, 0);
}
somarTodos(1, 2, 3, 4); // 10`}
      />

      <h2>A diferença real: arrow function não tem o próprio "this"</h2>
      <p>
        Uma função normal ganha seu próprio <code>this</code> dependendo de <strong>como</strong> ela é chamada. Uma
        arrow function não tem <code>this</code> próprio — ela usa o <code>this</code> de onde foi{" "}
        <strong>escrita</strong>. Isso importa muito dentro de um método de objeto ou de uma classe:
      </p>
      <CodeExample
        language="javascript"
        code={`const contador = {
  valor: 0,
  incrementarNormal: function () {
    setTimeout(function () {
      this.valor++; // "this" aqui NÃO é o "contador" — é undefined/window
      console.log(this.valor); // NaN ou erro
    }, 100);
  },
  incrementarArrow: function () {
    setTimeout(() => {
      this.valor++; // arrow function herda o "this" de incrementarArrow, que É o contador
      console.log(this.valor); // 1
    }, 100);
  },
};`}
      />
      <p>
        Essa é a razão prática de arrow function ser tão usada em callback (<code>setTimeout</code>,{" "}
        <code>.then()</code>, handler de evento dentro de um método) — evita o clássico bug de "this virou undefined
        dentro do callback".
      </p>

      <Exercise
        prompt={
          <p>
            Escreva uma função <code>ehPar(numero)</code> que retorna <code>true</code> se o número for par, como
            arrow function.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`const ehPar = (numero) => numero % 2 === 0;

ehPar(4); // true
ehPar(7); // false`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença de comportamento entre arrow function e função normal?",
            options: [
              "Não tem diferença nenhuma, é só sintaxe",
              "Arrow function não tem 'this' próprio — usa o 'this' de onde foi escrita, em vez de depender de como é chamada",
              "Arrow function é sempre mais rápida",
              "Arrow function não pode receber parâmetros",
            ],
            correctIndex: 1,
          },
          {
            question: "O que ...numeros faz em function somarTodos(...numeros)?",
            options: [
              "É um erro de sintaxe",
              "Junta todos os argumentos passados num array só, dentro da função",
              "Só aceita exatamente 3 argumentos",
              "Converte os argumentos pra string",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
