import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { LiveEditor } from "@/components/aprenda/live-editor";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-classes-fundamentais",
  title: "Classes fundamentais",
  summary: "Espaçamento, cor, tipografia e o par flex/grid — o vocabulário que resolve 90% das telas.",
  estimatedMinutes: 16,
};

export default function Licao02ClassesFundamentais() {
  return (
    <LessonBody>
      <p>
        Toda classe do Tailwind segue um padrão: <code>propriedade-valor</code>. Uma vez que você entende a lógica,
        não precisa decorar centenas de classes — você deduz.
      </p>

      <h2>Espaçamento</h2>
      <p>
        <code>p</code> (padding) e <code>m</code> (margin), combinados com um eixo opcional — <code>t</code>/<code>b</code>/
        <code>l</code>/<code>r</code> (top/bottom/left/right) ou <code>x</code>/<code>y</code> (horizontal/vertical) — e um
        número na escala do Tailwind (múltiplos de 0.25rem: <code>4</code> = 1rem = 16px).
      </p>
      <CodeExample
        language="xml"
        code={`<div class="p-4">      <!-- padding de 1rem nos 4 lados -->
<div class="px-6 py-2"> <!-- padding horizontal 1.5rem, vertical 0.5rem -->
<div class="mt-8">     <!-- margin-top de 2rem -->
<div class="gap-4">    <!-- espaço entre itens de um flex/grid -->`}
      />

      <h2>Cor</h2>
      <p>
        <code>bg-</code> (background), <code>text-</code> (cor do texto) e <code>border-</code> seguem{" "}
        <code>cor-intensidade</code>, onde intensidade vai de <code>50</code> (quase branco) a <code>950</code> (quase
        preto). <code>blue-600</code> é bem diferente de <code>blue-100</code>.
      </p>
      <CodeExample language="xml" code={`<p class="text-slate-600 bg-slate-100 border border-slate-300">`} />

      <h2>Tipografia</h2>
      <CodeExample
        language="xml"
        code={`<h1 class="text-3xl font-bold tracking-tight">Título</h1>
<p class="text-sm font-medium text-slate-500">Legenda</p>`}
      />

      <h2>Flex e grid — os dois layouts que resolvem quase tudo</h2>
      <p>
        <code>flex</code> organiza itens numa linha ou coluna (bom pra barras de navegação, listas, formulários);{" "}
        <code>grid</code> organiza numa malha de linhas e colunas (bom pra cards, dashboards, galerias).
      </p>

      <LiveEditor
        code={`export default function App() {
  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-6">
        <span className="text-white font-bold">Barra flex</span>
        <button className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm">Ação</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-800 text-slate-200 rounded-lg p-4">Card 1</div>
        <div className="bg-slate-800 text-slate-200 rounded-lg p-4">Card 2</div>
        <div className="bg-slate-800 text-slate-200 rounded-lg p-4">Card 3</div>
      </div>
    </div>
  );
}
`}
      />

      <Exercise
        prompt={
          <p>
            Mude o grid acima de 3 pra 2 colunas (<code>grid-cols-2</code>) e aumente o espaçamento entre os cards pra{" "}
            <code>gap-6</code>.
          </p>
        }
        solutionLanguage="xml"
        solutionCode={`<div className="grid grid-cols-2 gap-6">`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual classe aplica padding só nos eixos horizontal e vertical, com valores diferentes?",
            options: ["p-4", "px-6 py-2", "mt-8", "gap-4"],
            correctIndex: 1,
          },
          {
            question: "Quando usar grid em vez de flex?",
            options: [
              "Nunca — flex resolve tudo",
              "Quando o layout é uma malha de linhas e colunas, tipo cards ou dashboard",
              "Só em telas grandes",
              "Grid é sempre mais rápido que flex",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
