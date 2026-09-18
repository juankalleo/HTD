import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-modulos-es",
  title: "Módulos ES: import e export",
  summary: "require e import não são a mesma coisa por baixo — misturar os dois sem entender por quê é a causa do erro clássico 'Cannot use import statement outside a module'.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao12ModulosEs() {
  return (
    <LessonBody>
      <p>
        Todo projeto Next.js que você já usou tem arquivos se importando o tempo todo com <code>import</code>. Vale
        entender o que essa sintaxe realmente é — e por que ela não é intercambiável com o <code>require</code> que
        você às vezes vê em código Node mais antigo.
      </p>

      <h2>Named export vs. default export</h2>
      <CodeExample
        label="matematica.js"
        language="javascript"
        code={`export function somar(a, b) {
  return a + b;
}
export function subtrair(a, b) {
  return a - b;
}

export default function multiplicar(a, b) {
  return a * b;
}`}
      />
      <CodeExample
        label="uso.js"
        language="javascript"
        code={`import multiplicar, { somar, subtrair } from "./matematica.js";
// default não usa chaves e você escolhe o nome livremente;
// named precisa das chaves e do nome exato (ou "as" pra renomear)

import { somar as soma } from "./matematica.js";`}
      />
      <p>
        Um arquivo pode ter <strong>só um</strong> <code>export default</code>, mas quantos <code>export</code>{" "}
        nomeados quiser. Use default pra "a coisa principal que esse arquivo exporta"; named pra utilitários que
        fazem sentido em conjunto.
      </p>

      <h2>CommonJS vs. ES Modules — dois sistemas diferentes</h2>
      <CodeExample
        label="CommonJS — Node clássico, sem 'type: module' no package.json"
        language="javascript"
        code={`const { somar } = require("./matematica");
module.exports = { somar };`}
      />
      <CodeExample
        label="ES Modules — Node moderno com 'type: module', ou qualquer código pra navegador"
        language="javascript"
        code={`import { somar } from "./matematica.js";
export { somar };`}
      />
      <p>
        Não são dois jeitos de escrever a mesma coisa — são <strong>dois sistemas de módulo diferentes</strong>, com
        regras próprias. <code>require</code> é resolvido em tempo de execução, então pode aparecer dentro de um{" "}
        <code>if</code> ou de uma função. <code>import</code> é <strong>estático</strong> — analisado antes mesmo do
        código começar a rodar — e por isso só pode ficar no nível mais externo do arquivo.
      </p>

      <h2>O erro clássico</h2>
      <CodeExample
        language="javascript"
        code={`// Cannot use import statement outside a module
import { somar } from "./matematica.js";`}
      />
      <p>
        Esse erro aparece quando o arquivo está sendo executado no modo CommonJS (o padrão do Node quando o{" "}
        <code>package.json</code> não declara <code>"type": "module"</code>), mas o código usa sintaxe de ES Modules.
        O motor lê <code>import</code> e não sabe interpretar aquilo naquele modo — não é um erro do seu código, é um
        descompasso entre a sintaxe usada e como o arquivo está sendo rodado.
      </p>

      <Exercise
        prompt={
          <p>
            Reescreva este trecho CommonJS como ES Modules:{" "}
            <code>{'const { formatar } = require("./utils"); module.exports = { formatar };'}</code>
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`import { formatar } from "./utils.js";
export { formatar };`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre export default e named export num mesmo arquivo?",
            options: [
              "Um arquivo pode ter vários export default, mas só um named export",
              "Named export só funciona no Node.js; export default só funciona no navegador",
              "Não existe diferença real, os dois se comportam de forma idêntica na importação",
              "Um arquivo pode ter só um export default (importado sem chaves, com qualquer nome), mas quantos named exports quiser (importados com chaves e o nome exato)",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que aparece o erro 'Cannot use import statement outside a module'?",
            options: [
              "Porque a função importada não existe no arquivo de origem",
              "Porque o arquivo está sendo executado como CommonJS (sem 'type: module' configurado), mas contém sintaxe de ES Modules, que é estática e só é entendida nesse modo",
              "Porque import só pode ser usado dentro de uma função async",
              "Porque o nome do arquivo importado não termina em .mjs",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
