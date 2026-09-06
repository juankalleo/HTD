import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-condicionais-e-loops",
  title: "Condicionais e loops",
  summary: "if/else, switch, os 3 tipos de loop mais comuns e por que for...of substituiu o for clássico na maioria dos casos.",
  estimatedMinutes: 14,
};

export default function Licao02CondicionaisELoops() {
  return (
    <LessonBody>
      <h2>if / else e o operador ternário</h2>
      <CodeExample
        language="javascript"
        code={`const idade = 20;

if (idade >= 18) {
  console.log("Maior de idade");
} else {
  console.log("Menor de idade");
}

// a mesma coisa, como expressão (útil quando o resultado vira um valor)
const status = idade >= 18 ? "Maior de idade" : "Menor de idade";`}
      />

      <h2>&& e || fazem mais que "e"/"ou" — curto-circuito</h2>
      <CodeExample
        language="javascript"
        code={`const usuario = null;

// se usuario for null/undefined, && já para e retorna null,
// sem tentar acessar .nome (que quebraria o programa)
usuario && usuario.nome;

// valor padrão — se nome vier vazio/undefined, usa "Visitante"
const nome = usuario?.nome || "Visitante";`}
      />

      <h2>Os 3 loops que cobrem quase tudo</h2>
      <CodeExample
        label="for...of — percorre VALORES de um array"
        language="javascript"
        code={`const frutas = ["maçã", "banana", "uva"];
for (const fruta of frutas) {
  console.log(fruta);
}`}
      />
      <CodeExample
        label="for...in — percorre CHAVES de um objeto"
        language="javascript"
        code={`const usuario = { nome: "Ana", idade: 28 };
for (const chave in usuario) {
  console.log(chave, usuario[chave]);
}`}
      />
      <CodeExample
        label="while — repete enquanto a condição for verdadeira"
        language="javascript"
        code={`let tentativas = 0;
while (tentativas < 3) {
  console.log("Tentativa", tentativas + 1);
  tentativas++;
}`}
      />
      <p>
        O <code>for</code> clássico (<code>{"for (let i = 0; i < arr.length; i++)"}</code>) ainda existe e funciona,
        mas <code>for...of</code> é preferido hoje pra percorrer arrays — menos código, menos chance de errar o
        índice.
      </p>

      <Exercise
        prompt={<p>Escreva um loop que soma todos os números de 1 a 10 e imprime o resultado (55).</p>}
        solutionLanguage="javascript"
        solutionCode={`let soma = 0;
for (let i = 1; i <= 10; i++) {
  soma += i;
}
console.log(soma); // 55

// ou, com for...of sobre um range gerado:
const numeros = Array.from({ length: 10 }, (_, i) => i + 1);
let soma2 = 0;
for (const n of numeros) soma2 += n;`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre for...of e for...in?",
            options: [
              "Não tem diferença, são sinônimos",
              "for...of percorre valores (bom pra array); for...in percorre chaves (bom pra objeto)",
              "for...in é mais rápido sempre",
              "for...of só funciona com número",
            ],
            correctIndex: 1,
          },
          {
            question: "O que usuario?.nome || \"Visitante\" faz se usuario for null?",
            options: [
              "Quebra o programa com erro",
              "Retorna 'Visitante', sem tentar acessar .nome de um valor null",
              "Retorna undefined",
              "Retorna null",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
