import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-tipos-basicos-e-inferencia",
  title: "Tipos básicos e inferência",
  summary: "string, number, boolean, array, e por que você não precisa anotar tipo em quase nada.",
  estimatedMinutes: 14,
};

export default function Licao02TiposBasicosEInferencia() {
  return (
    <LessonBody>
      <h2>Os tipos primitivos</h2>
      <CodeExample
        language="typescript"
        code={`let nome: string = "Ana";
let idade: number = 28;
let ativo: boolean = true;
let tags: string[] = ["admin", "dev"];       // array de string
let coordenada: [number, number] = [10, 20];  // tupla — tamanho e tipos fixos`}
      />

      <h2>Inferência — o motivo de você não escrever tipo em tudo</h2>
      <p>
        Na maioria do código real, você <strong>não</strong> escreve <code>: string</code> depois de toda variável —
        o TypeScript já deduz o tipo pelo valor inicial:
      </p>
      <CodeExample
        language="typescript"
        code={`let nome = "Ana";      // TS já sabe: string, sem você escrever
let idade = 28;         // TS já sabe: number

nome = 42;
// Error: Type 'number' is not assignable to type 'string'.
// mesmo sem anotação explícita, o tipo já foi fixado pelo valor inicial`}
      />
      <p>
        Anotar tipo explicitamente (<code>: number</code>) importa principalmente em <strong>parâmetro de
        função</strong> (onde não existe valor inicial pra inferir de onde tirar o tipo) e em variável declarada sem
        valor ainda.
      </p>

      <h2>any — a saída de emergência que devia ser rara</h2>
      <CodeExample
        language="typescript"
        code={`let dado: any = buscarDeAlgumLugar();
dado.qualquerCoisa();     // TS não reclama de nada — perdeu toda a checagem
dado.metodoQueNaoExiste(); // também não reclama, e vai quebrar em runtime

// unknown é a alternativa mais segura: obriga verificar o tipo antes de usar
let dadoSeguro: unknown = buscarDeAlgumLugar();
if (typeof dadoSeguro === "string") {
  dadoSeguro.toUpperCase(); // só permite depois de confirmar que é string
}`}
      />
      <p>
        <code>any</code> desliga a checagem de tipo pra aquele valor — útil como escape hatch temporário, mas usar
        demais é basicamente voltar a escrever JavaScript sem nenhum dos benefícios do TS.
      </p>

      <Exercise
        prompt={
          <p>
            Que tipo o TypeScript infere pra <code>{"const cores = ['vermelho', 'azul', 'verde'];"}</code>, sem
            nenhuma anotação?
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`// string[] — um array de strings. O TS olha o valor inicial (3 strings)
// e infere o tipo do array a partir disso, sem precisar de anotação.`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que a maioria do código TypeScript não anota tipo em toda variável?",
            options: [
              "Porque anotar é opcional e ninguém faz isso nunca",
              "Porque o TypeScript infere o tipo automaticamente a partir do valor inicial, na maioria dos casos",
              "Porque só funciona sem anotação",
              "Porque anotação de tipo é só para funções",
            ],
            correctIndex: 1,
          },
          {
            question: "Qual a diferença entre any e unknown?",
            options: [
              "São idênticos",
              "any desliga toda checagem; unknown obriga confirmar o tipo (ex.: com typeof) antes de usar o valor",
              "unknown só existe em versões antigas do TS",
              "any é mais seguro que unknown",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
