import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-declarando-tipos-de-bibliotecas",
  title: "Módulos sem tipo e arquivos .d.ts",
  summary: "O import quebrar com 'Could not find a declaration file' não é bug seu — é a biblioteca que não trouxe tipos junto.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao12DeclarandoTiposDeBibliotecas() {
  return (
    <LessonBody>
      <p>
        Nem toda biblioteca JavaScript publicada no npm vem com tipos TypeScript inclusos. Quando isso acontece, o
        editor não trava — mas some com todo o autocomplete e checagem pra aquele import, e o compilador reclama.
      </p>

      <h2>O erro clássico</h2>
      <CodeExample
        language="typescript"
        code={`import confetti from "alguma-lib-sem-tipo";
// Error: Could not find a declaration file for module 'alguma-lib-sem-tipo'.
// 'alguma-lib-sem-tipo' implicitly has an 'any' type.`}
      />
      <p>
        O TypeScript está avisando: essa biblioteca não trouxe um arquivo <code>.d.ts</code> (arquivo só de
        declaração de tipo, sem código de verdade) — nem embutido, nem em separado. Existem duas saídas.
      </p>

      <h2>Saída 1: @types/... — tipos escritos por terceiros</h2>
      <p>
        Pra bibliotecas populares sem tipo próprio, geralmente já existe um pacote de tipos mantido pela comunidade
        no projeto <strong>DefinitelyTyped</strong>, publicado sob o escopo <code>@types</code>:
      </p>
      <CodeExample
        language="bash"
        code={`npm install lodash
npm install -D @types/lodash
# a biblioteca em si (lodash) roda em produção — o pacote de tipos (@types/lodash)
# só existe pro editor/compilador, por isso entra como dependência de desenvolvimento`}
      />
      <p>
        Depois de instalado, <code>import _ from "lodash"</code> passa a ter autocomplete e checagem normalmente — o{" "}
        <code>@types/lodash</code> só descreve o formato, quem roda em runtime continua sendo o pacote{" "}
        <code>lodash</code> de sempre.
      </p>

      <h2>Saída 2: declare module — quando nem @types existe</h2>
      <p>
        Se a biblioteca for pequena, interna, ou não tiver tipos publicados em nenhum lugar, você mesmo escreve uma
        declaração mínima, num arquivo <code>.d.ts</code> dentro do projeto (por exemplo{" "}
        <code>src/types/alguma-lib-sem-tipo.d.ts</code>):
      </p>
      <CodeExample
        language="typescript"
        code={`// src/types/alguma-lib-sem-tipo.d.ts
declare module "alguma-lib-sem-tipo" {
  export interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
  }

  export default function confetti(options?: ConfettiOptions): void;
}`}
      />
      <p>
        A partir daí, <code>import confetti from "alguma-lib-sem-tipo"</code> funciona com tipo — mesmo a biblioteca
        nunca tendo publicado um único tipo oficial.
      </p>

      <h2>Ambient declaration — o que esse "declare" significa</h2>
      <p>
        <code>declare</code> diz ao compilador: "confie em mim, isso existe com esse formato — não gere nem
        verifique nenhum código pra essa declaração". É diferente de uma <code>interface</code> normal, que só
        descreve o formato de algo que <em>também</em> existe como código TypeScript real. Uma declaração ambiente é
        pura promessa de tipo, usada também pra descrever coisas globais que o projeto não define diretamente, como
        uma variável injetada por um script externo (<code>declare global</code>).
      </p>

      <Exercise
        prompt={
          <p>
            Uma lib chamada <code>mini-toast</code> não tem tipos. Ela exporta uma função default{" "}
            <code>toast(mensagem: string, duracaoMs?: number): void</code>. Escreva a declaração <code>.d.ts</code>{" "}
            mínima pra tipar esse import.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`// src/types/mini-toast.d.ts
declare module "mini-toast" {
  export default function toast(mensagem: string, duracaoMs?: number): void;
}`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre instalar uma biblioteca comum e instalar um pacote @types/nome-da-lib?",
            options: [
              "Não existe diferença, os dois comandos instalam exatamente o mesmo código-fonte da biblioteca",
              "@types/nome-da-lib substitui a biblioteca inteira, sem precisar instalar o pacote original",
              "@types/nome-da-lib só funciona em projetos que não usam nenhum bundler ou framework",
              "A biblioteca traz o código JavaScript que roda; @types/nome-da-lib traz só as declarações de tipo para o editor",
            ],
            correctIndex: 3,
          },
          {
            question: "O que a palavra-chave declare faz dentro de um arquivo .d.ts, como em declare module 'lib-sem-tipo' { ... }?",
            options: [
              "Executa o código dentro das chaves em tempo de build, gerando JavaScript real",
              "Impede que a biblioteca declarada seja importada em qualquer arquivo do projeto",
              "Diz ao TypeScript que aquele módulo existe com aquele formato, sem gerar nenhum código — é só uma promessa de tipo",
              "Cria uma cópia local da biblioteca, substituindo a versão instalada no node_modules",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
