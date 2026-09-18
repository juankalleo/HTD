import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-imutabilidade-map-e-set",
  title: "Imutabilidade, cópia profunda e Map/Set",
  summary: "{ ...objeto } copia só o primeiro nível — um objeto aninhado dentro dele continua sendo a mesma referência nos dois lados.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao14ImutabilidadeMapESet() {
  return (
    <LessonBody>
      <p>
        Você já viu que <code>{"{ ...objeto }"}</code> resolve o problema de <code>=</code> copiar só a referência.
        Só que spread tem um limite que costuma surpreender assim que o objeto tem outro objeto dentro dele.
      </p>

      <h2>Spread é uma cópia RASA</h2>
      <CodeExample
        language="javascript"
        code={`const usuario = {
  nome: "Ana",
  endereco: { cidade: "Porto Velho" },
};

const copia = { ...usuario };

copia.nome = "Bia";
usuario.nome; // "Ana" — intacto, o primeiro nível foi copiado de verdade

copia.endereco.cidade = "Manaus";
usuario.endereco.cidade; // "Manaus" — mudou também! endereco é a MESMA referência nos dois objetos`}
      />
      <p>
        <code>{"{ ...usuario }"}</code> copia só o <strong>primeiro nível</strong> de propriedades. Quando uma
        propriedade é, ela mesma, um objeto ou array, o spread copia a <em>referência</em> pra ela — não o conteúdo.
        Isso é chamado de <strong>cópia rasa</strong> (shallow copy), e é a mesma limitação de{" "}
        <code>Object.assign()</code> e de <code>[...array]</code>.
      </p>

      <h2>structuredClone — cópia profunda de verdade</h2>
      <CodeExample
        language="javascript"
        code={`const copiaProfunda = structuredClone(usuario);

copiaProfunda.endereco.cidade = "Manaus";
usuario.endereco.cidade; // continua "Porto Velho" — copiaProfunda é 100% independente`}
      />
      <p>
        <code>structuredClone</code> é uma função global (disponível em navegadores modernos e no Node) que copia um
        objeto recursivamente, nível por nível. Ela não consegue clonar tudo — funções, por exemplo, não sobrevivem
        ao clone — mas cobre bem a maioria dos casos de dado comum (objetos, arrays, datas, Map, Set).
      </p>

      <h2>Map — quando um objeto comum não é suficiente</h2>
      <CodeExample
        language="javascript"
        code={`const contagem = new Map();
contagem.set("maçã", 3);
contagem.set("banana", 5);

contagem.get("maçã");  // 3
contagem.has("uva");    // false
contagem.size;           // 2 — não precisa de Object.keys(obj).length

for (const [fruta, qtd] of contagem) {
  console.log(fruta, qtd);
}`}
      />
      <p>
        <code>Map</code> faz mais sentido que objeto comum quando a chave não é necessariamente uma string (pode ser
        um número, um objeto, até uma função), quando você precisa do tamanho direto (<code>.size</code>) ou quando
        quer ter certeza absoluta da ordem de inserção sem depender de comportamento implícito de objeto.
      </p>

      <h2>Set — coleção que garante itens únicos</h2>
      <CodeExample
        language="javascript"
        code={`const idsUnicos = new Set([1, 2, 2, 3, 3, 3]);

idsUnicos.size;    // 3 — duplicados somem sozinhos
idsUnicos.has(2);  // true

[...idsUnicos]; // [1, 2, 3] — fácil converter de volta pra array normal`}
      />
      <p>
        <code>Set</code> faz mais sentido que array quando o que importa é <strong>se</strong> um valor existe (e
        não em que posição), ou quando você precisa remover duplicados sem escrever a lógica de filtro na mão.
      </p>

      <Exercise
        prompt={
          <p>
            Dado <code>{"const idsComDuplicados = [1, 2, 2, 3, 1, 4]"}</code>, produza um array só com os valores
            únicos, na ordem em que apareceram pela primeira vez.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`const idsComDuplicados = [1, 2, 2, 3, 1, 4];
const idsUnicos = [...new Set(idsComDuplicados)];
// [1, 2, 3, 4]`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que copia.endereco.cidade = 'Manaus' também muda usuario, mesmo copia sendo { ...usuario }?",
            options: [
              "Porque spread nunca cria nenhuma cópia real, nem no primeiro nível do objeto",
              "Porque spread faz uma cópia rasa — só o primeiro nível é copiado de verdade; propriedades que são objeto continuam sendo a mesma referência nos dois",
              "Porque endereco é uma propriedade somente leitura, herdada do protótipo de Object",
              "Porque JavaScript sincroniza automaticamente objetos aninhados que têm o mesmo nome de propriedade",
            ],
            correctIndex: 1,
          },
          {
            question: "Quando faz mais sentido usar Set em vez de array puro?",
            options: [
              "Quando você precisa manter itens duplicados de propósito, em qualquer ordem",
              "Quando o array vai guardar só números, nunca strings ou objetos",
              "Nunca — Set é mais lento que array em qualquer cenário de uso",
              "Quando você precisa garantir itens únicos e checar se um valor já existe, sem escrever essa lógica manualmente",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
