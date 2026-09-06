import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-arrays-e-metodos",
  title: "Arrays e seus métodos",
  summary: "map, filter e reduce — os três métodos que substituem quase todo loop manual sobre array.",
  estimatedMinutes: 18,
};

export default function Licao04ArraysEMetodos() {
  return (
    <LessonBody>
      <p>
        Quase toda vez que você pensaria em escrever um <code>for</code> pra transformar, filtrar ou somar um array,
        existe um método pronto — mais curto e mais claro sobre a <em>intenção</em> do código.
      </p>

      <h2>map — transforma cada item, devolve um array do mesmo tamanho</h2>
      <CodeExample
        language="javascript"
        code={`const precos = [10, 20, 30];
const comDesconto = precos.map((preco) => preco * 0.9);
// [9, 18, 27] — mesmo tamanho, cada item transformado`}
      />

      <h2>filter — mantém só os itens que passam num teste</h2>
      <CodeExample
        language="javascript"
        code={`const produtos = [
  { nome: "Teclado", preco: 250 },
  { nome: "Mouse", preco: 80 },
  { nome: "Monitor", preco: 900 },
];

const caros = produtos.filter((produto) => produto.preco > 100);
// [{ nome: "Teclado", ... }, { nome: "Monitor", ... }] — Mouse ficou de fora`}
      />

      <h2>reduce — junta tudo num valor só</h2>
      <CodeExample
        language="javascript"
        code={`const precos = [10, 20, 30];
const total = precos.reduce((acumulador, precoAtual) => acumulador + precoAtual, 0);
// 0 é o valor inicial do acumulador; a cada item, soma e segue
// total = 60`}
      />
      <p>
        <code>reduce</code> é o mais poderoso e o mais confuso no começo: pense nele como "eu tenho uma caixa
        (acumulador) que começa com um valor, e cada item do array pode mudar o que está na caixa."
      </p>

      <h2>Encadeando os três</h2>
      <CodeExample
        language="javascript"
        code={`const produtos = [
  { nome: "Teclado", preco: 250 },
  { nome: "Mouse", preco: 80 },
  { nome: "Monitor", preco: 900 },
];

const totalDosCaros = produtos
  .filter((p) => p.preco > 100)   // tira o Mouse
  .map((p) => p.preco)             // vira [250, 900]
  .reduce((total, preco) => total + preco, 0); // 1150`}
      />

      <h2>Outros que valem conhecer</h2>
      <CodeExample
        language="javascript"
        code={`[1, 2, 3].find((n) => n > 1);        // 2 — primeiro item que passa no teste
[1, 2, 3].some((n) => n > 2);        // true — algum item passa?
[1, 2, 3].every((n) => n > 0);       // true — TODOS os itens passam?
[1, 2, 3].includes(2);                // true — o array contém esse valor?`}
      />

      <Exercise
        prompt={
          <p>
            Dado <code>{'const nomes = ["ana", "bia", "caio"]'}</code>, produza um novo array com cada nome
            capitalizado (<code>["Ana", "Bia", "Caio"]</code>) usando <code>map</code>.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`const nomes = ["ana", "bia", "caio"];
const capitalizados = nomes.map(
  (nome) => nome.charAt(0).toUpperCase() + nome.slice(1)
);
// ["Ana", "Bia", "Caio"]`}
      />

      <Callout href="/padrao-frontend/tecnologias/tanstack-table">
        Esses três métodos aparecem o tempo todo transformando dado vindo de uma API antes de exibir numa tabela —
        ver o padrão de tabelas do projeto.
      </Callout>

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual método usar pra manter só os itens de um array que passam num teste?",
            options: ["map", "filter", "reduce", "forEach"],
            correctIndex: 1,
          },
          {
            question: "O que o segundo argumento de reduce (o '0' no exemplo) representa?",
            options: [
              "O índice inicial do array",
              "O valor inicial do acumulador",
              "O tamanho máximo do resultado",
              "Não faz nada, é opcional e ignorado",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
