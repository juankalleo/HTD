import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-generics",
  title: "Generics",
  summary: "Escrever uma função/tipo que funciona com qualquer tipo, sem perder a checagem — o <T> que aparece por toda API tipada.",
  estimatedMinutes: 16,
  level: "fundamentos",
};

export default function Licao05Generics() {
  return (
    <LessonBody>
      <h2>O problema que generics resolve</h2>
      <CodeExample
        language="typescript"
        code={`// versão sem generics — funciona, mas perde informação de tipo
function primeiroItem(lista: any[]): any {
  return lista[0];
}

const numero = primeiroItem([1, 2, 3]);
numero.toFixed(2); // TS não reclama... mas também não confirma que "numero" é number de verdade`}
      />
      <CodeExample
        language="typescript"
        code={`// com generics — o tipo de entrada "vaza" pro tipo de saída
function primeiroItem<T>(lista: T[]): T {
  return lista[0];
}

const numero = primeiroItem([1, 2, 3]);        // T é inferido como number
const nome = primeiroItem(["Ana", "Bia"]);       // T é inferido como string

numero.toFixed(2);   // ok, TS sabe que é number
nome.toUpperCase();   // ok, TS sabe que é string`}
      />
      <p>
        <code>{"<T>"}</code> é um "parâmetro de tipo" — um espaço reservado que só se torna um tipo concreto quando a
        função é chamada. É a mesma ideia de um parâmetro normal, só que pra <em>tipo</em> em vez de <em>valor</em>.
      </p>

      <h2>Generics em interface — o formato de uma resposta de API</h2>
      <CodeExample
        language="typescript"
        code={`interface RespostaApi<T> {
  dado: T;
  status: number;
}

const respostaUsuario: RespostaApi<{ nome: string }> = {
  dado: { nome: "Ana" },
  status: 200,
};

const respostaLista: RespostaApi<string[]> = {
  dado: ["a", "b", "c"],
  status: 200,
};`}
      />
      <p>
        Isso evita escrever <code>RespostaApiDeUsuario</code>, <code>RespostaApiDeLista</code>,{" "}
        <code>RespostaApiDeProduto</code>... — uma interface genérica cobre todos os formatos de resposta, mudando só
        o que vai dentro de <code>dado</code>.
      </p>

      <h2>Restringindo o generic com extends</h2>
      <CodeExample
        language="typescript"
        code={`function pegarNome<T extends { nome: string }>(item: T): string {
  return item.nome;
}

pegarNome({ nome: "Ana", idade: 28 }); // ok — tem "nome"
pegarNome({ idade: 28 });
// Error: Property 'nome' is missing`}
      />
      <p>
        <code>{"<T extends { nome: string }>"}</code> diz: "T pode ser qualquer tipo, contanto que tenha pelo menos um
        campo <code>nome</code> do tipo string." Sem isso, o TS não deixaria acessar <code>item.nome</code> (T
        poderia ser qualquer coisa, inclusive algo sem esse campo).
      </p>

      <Exercise
        prompt={<p>Escreva uma função genérica ultimoItem que retorna o último elemento de um array de qualquer tipo.</p>}
        solutionLanguage="typescript"
        solutionCode={`function ultimoItem<T>(lista: T[]): T {
  return lista[lista.length - 1];
}

ultimoItem([1, 2, 3]);        // number
ultimoItem(["a", "b", "c"]);  // string`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que <T> representa numa função genérica?",
            options: [
              "Um parâmetro de tipo — um espaço reservado que só vira um tipo concreto quando a função é chamada",
              "Uma anotação que transforma a função automaticamente em um método de classe",
              "Um alias para o tipo any, usado quando não se quer tipar o parâmetro",
              "Um marcador que só existe para documentação, sem nenhum efeito sobre a checagem de tipos",
            ],
            correctIndex: 0,
          },
          {
            question: "O que <T extends { nome: string }> garante?",
            options: [
              "T precisa ser exatamente igual a { nome: string }, sem nenhum campo além desse",
              "T vira automaticamente uma string, ignorando qualquer outro campo do objeto original",
              "T só aceita interfaces, nunca um type alias, por causa da palavra extends",
              "T pode ser qualquer tipo, desde que tenha pelo menos um campo nome do tipo string",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
