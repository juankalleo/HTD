import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { LiveEditor } from "@/components/aprenda/live-editor";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-por-que-tailwind",
  title: "Por que Tailwind",
  summary: "Utility-first na prática, comparado com CSS tradicional.",
  estimatedMinutes: 12,
};

export default function Licao01PorQueTailwind() {
  return (
    <LessonBody>
      <p>
        Tailwind é um framework <strong>utility-first</strong>: em vez de escrever uma classe CSS nova pra cada
        componente (<code>.card</code>, <code>.btn-primary</code>...), você compõe o visual direto no HTML/JSX usando
        classes utilitárias pequenas e de propósito único — <code>flex</code>, <code>gap-4</code>, <code>rounded-lg</code>,{" "}
        <code>bg-blue-600</code>.
      </p>

      <h2>CSS tradicional vs. utility-first</h2>
      <p>Veja o mesmo botão dos dois jeitos:</p>

      <CodeExample
        label="CSS tradicional"
        language="css"
        code={`.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}`}
      />

      <CodeExample
        label="Com Tailwind"
        language="xml"
        code={`<button class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold">
  Salvar
</button>`}
      />

      <p>
        Repare que não existe mais um arquivo <code>.css</code> separado pra manter sincronizado com o componente — o
        estilo mora junto do elemento que ele estiliza. Isso parece estranho no começo (HTML "poluído" de classes), mas
        na prática elimina um problema real: CSS que cresce sem parar porque ninguém tem certeza se uma classe antiga
        ainda é usada em algum lugar.
      </p>

      <h2>Experimente</h2>
      <p>Edite as classes abaixo e veja o resultado mudar na hora — isso roda de verdade no seu navegador, sem servidor nenhum por trás.</p>

      <LiveEditor
        code={`export default function App() {
  return (
    <div className="p-8 bg-slate-900 min-h-screen flex items-center justify-center">
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition">
        Salvar
      </button>
    </div>
  );
}
`}
      />

      <Exercise
        prompt={
          <p>
            Troque o botão acima pra um botão vermelho (<code>bg-red-600</code>/<code>hover:bg-red-700</code>) com
            bordas totalmente arredondadas (<code>rounded-full</code>) e texto em maiúsculas (<code>uppercase</code>).
          </p>
        }
        solutionLanguage="xml"
        solutionCode={`<button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-semibold uppercase shadow-lg transition">
  Salvar
</button>`}
      />

      <Callout href="/padrao-frontend/tecnologias/tailwind">
        A escolha do Tailwind como padrão do projeto, incluindo convenções de organização de classes, está documentada
        no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que caracteriza uma abordagem 'utility-first'?",
            options: [
              "Escrever uma classe CSS nova pra cada componente",
              "Compor o visual com classes utilitárias pequenas e de propósito único",
              "Usar só CSS-in-JS",
              "Evitar classes CSS completamente",
            ],
            correctIndex: 1,
          },
          {
            question: "Qual problema comum o utility-first ajuda a evitar?",
            options: [
              "Sites lentos",
              "CSS que cresce sem controle porque ninguém sabe se uma classe antiga ainda é usada",
              "Falta de responsividade",
              "Erros de JavaScript",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
