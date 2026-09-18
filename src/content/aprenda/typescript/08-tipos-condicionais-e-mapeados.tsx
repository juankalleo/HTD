import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-tipos-condicionais-e-mapeados",
  title: "Tipos condicionais e mapeados",
  summary: "Partial, Pick e Omit parecem mágica pronta do TypeScript — na real, são só alguns tipos que você também consegue escrever.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao08TiposCondicionaisEMapeados() {
  return (
    <LessonBody>
      <p>
        Na lição de tipos utilitários você usou <code>Partial{"<Usuario>"}</code>, <code>Pick</code> e{" "}
        <code>Omit</code> como se fossem comandos prontos do compilador. Não são — cada um é definido usando duas
        ferramentas que qualquer código TypeScript pode usar: <strong>mapped types</strong> e{" "}
        <strong>conditional types</strong>.
      </p>

      <h2>Mapped types — percorrendo as chaves de um tipo</h2>
      <p>
        Um mapped type olha para as chaves de um tipo já existente e gera um novo tipo, uma chave por vez. É o mesmo
        espírito de um <code>.map()</code> num array, só que em cima de chaves de tipo:
      </p>
      <CodeExample
        language="typescript"
        code={`interface Usuario {
  nome: string;
  email: string;
}

// [K in keyof Usuario] percorre cada chave de Usuario ("nome", "email"...)
type MeuPartial<T> = {
  [K in keyof T]?: T[K];
};

type UsuarioParcial = MeuPartial<Usuario>;
// equivalente a: { nome?: string; email?: string }
// — é literalmente assim que Partial<T> é definido dentro do próprio TypeScript`}
      />

      <h2>Conditional types — um "if" que acontece nos tipos</h2>
      <p>
        <code>{"T extends U ? X : Y"}</code> funciona como um <code>if/else</code>, mas avaliado durante a checagem de
        tipo, não em runtime: se <code>T</code> for atribuível a <code>U</code>, o tipo resultante é <code>X</code>;
        senão, é <code>Y</code>.
      </p>
      <CodeExample
        language="typescript"
        code={`type EhString<T> = T extends string ? true : false;

type A = EhString<"oi">;   // true
type B = EhString<42>;      // false

// útil pra tipos condicionais mais realistas, como escolher o retorno certo:
type ResultadoBusca<T> = T extends string ? string[] : T[];`}
      />

      <h2>infer — extraindo um tipo de dentro de outro</h2>
      <p>
        Dentro de uma conditional type, <code>infer</code> "captura" um pedaço do tipo pra usar do outro lado do{" "}
        <code>?</code>. É como declarar uma variável de tipo só pra aquela checagem:
      </p>
      <CodeExample
        language="typescript"
        code={`// extrai o tipo dos elementos de um array
type ElementoDe<T> = T extends (infer U)[] ? U : T;

type A = ElementoDe<string[]>; // string
type B = ElementoDe<number[]>; // number

// é assim que o utilitário nativo ReturnType<T> é implementado:
type MeuReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function buscarPedido() {
  return { id: "1", total: 99.9 };
}

type Pedido = MeuReturnType<typeof buscarPedido>;
// { id: string; total: number } — sem precisar declarar essa interface na mão`}
      />

      <h2>De onde vêm de verdade Partial, Pick e Omit</h2>
      <p>
        As definições reais (simplificadas) que vivem dentro da instalação do TypeScript combinam as duas ideias
        acima:
      </p>
      <CodeExample
        language="typescript"
        code={`type MeuPartial<T> = { [K in keyof T]?: T[K] };

type MeuPick<T, K extends keyof T> = { [P in K]: T[P] };

// Omit é o mais interessante: usa Pick + Exclude (que também é uma conditional type)
type MeuExclude<T, U> = T extends U ? never : T;
type MeuOmit<T, K extends keyof any> = MeuPick<T, MeuExclude<keyof T, K>>;`}
      />
      <p>
        Nenhum desses utilitários é tratado como caso especial pelo compilador — eles só vêm prontos numa biblioteca
        de tipos que todo projeto TypeScript já inclui por padrão.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva um mapped type <code>MeuRequired{"<T>"}</code> que faz o oposto de <code>Partial</code>: torna
            todos os campos de <code>T</code> obrigatórios, mesmo que já sejam opcionais no tipo original. Dica: o
            modificador <code>-?</code> remove o <code>?</code> de uma chave dentro de um mapped type.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`type MeuRequired<T> = {
  [K in keyof T]-?: T[K];
};

interface Config {
  timeout?: number;
  retries?: number;
}

type ConfigCompleta = MeuRequired<Config>;
// { timeout: number; retries: number } — nenhum campo opcional sobra`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que o mapped type { [K in keyof T]?: T[K] } faz, exatamente?",
            options: [
              "Ele cria uma cópia de T em que cada valor é convertido para string automaticamente",
              "Ele remove todas as chaves de T que não tiverem um valor padrão definido",
              "Ele transforma T num union de todas as suas chaves, descartando os valores",
              "Ele percorre cada chave de T e gera um novo tipo com essas mesmas chaves, aqui tornando cada uma opcional",
            ],
            correctIndex: 3,
          },
          {
            question: "Numa conditional type como T extends U ? X : Y, quando o resultado é X?",
            options: [
              "Quando T é atribuível a U — ou seja, quando T satisfaz o formato exigido por U",
              "Sempre, independente da relação entre T e U, porque X vem antes de Y na expressão",
              "Somente quando T e U são exatamente o mesmo tipo, sem nenhuma diferença entre eles",
              "Quando U ainda não existe no escopo, e o TS usa X como valor padrão",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
