import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { LiveEditor } from "@/components/aprenda/live-editor";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-responsividade-e-variantes",
  title: "Responsividade e variantes",
  summary: "Prefixos de estado (hover, focus) e de breakpoint (sm, md, lg) — a mesma sintaxe pros dois casos.",
  estimatedMinutes: 14,
};

export default function Licao03ResponsividadeEVariantes() {
  return (
    <LessonBody>
      <p>
        Toda classe do Tailwind pode ganhar um prefixo antes de <code>:</code> que muda quando ela se aplica. Isso
        cobre dois casos completamente diferentes com a mesma sintaxe: <strong>estado</strong> (o mouse está em cima?
        o campo está focado?) e <strong>tamanho de tela</strong> (a viewport é grande o suficiente?).
      </p>

      <h2>Variantes de estado</h2>
      <CodeExample
        language="xml"
        code={`<button class="bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 disabled:opacity-50">
  Enviar
</button>`}
      />
      <p>
        <code>hover:</code>, <code>focus:</code>, <code>active:</code>, <code>disabled:</code> — o Tailwind já
        conhece os principais estados de pseudo-classe do CSS.
      </p>

      <h2>Breakpoints — mobile-first</h2>
      <p>
        Tailwind é <strong>mobile-first</strong>: uma classe sem prefixo de tamanho vale pra qualquer tela; um prefixo
        como <code>md:</code> só entra a partir daquele breakpoint <em>pra cima</em>.
      </p>
      <CodeExample
        language="xml"
        code={`<!-- 1 coluna no celular, 2 no tablet (md+), 4 no desktop (lg+) -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">`}
      />
      <p>
        Os breakpoints padrão são <code>sm</code> (640px), <code>md</code> (768px), <code>lg</code> (1024px),{" "}
        <code>xl</code> (1280px). Redimensione a janela do preview abaixo pra ver o grid mudar de coluna sozinho.
      </p>

      <LiveEditor
        code={`export default function App() {
  return (
    <div className="p-6 bg-slate-900 min-h-screen">
      <p className="text-white text-sm mb-4">Diminua/aumente a janela do preview pra ver o grid mudar.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-800 text-slate-200 rounded-lg p-4">Card 1</div>
        <div className="bg-slate-800 text-slate-200 rounded-lg p-4">Card 2</div>
        <div className="bg-slate-800 text-slate-200 rounded-lg p-4">Card 3</div>
      </div>
    </div>
  );
}
`}
      />

      <h2>Combinando os dois</h2>
      <p>
        Dá pra empilhar prefixos: <code>md:hover:bg-blue-700</code> só aplica o hover a partir do breakpoint{" "}
        <code>md</code>. E também existe <code>dark:</code>, pro modo escuro — é assim que o próprio HTD troca de
        cor conforme o tema.
      </p>

      <Exercise
        prompt={<p>Adicione uma 4ª coluna que só aparece em telas extra grandes (prefixo `xl:grid-cols-4`).</p>}
        solutionLanguage="xml"
        solutionCode={`<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">`}
      />

      <Callout href="/padrao-frontend/tecnologias/tailwind">
        Convenções de organização de classes (ordem, quando extrair um componente em vez de repetir utilitários) estão
        documentadas no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que significa 'mobile-first' no Tailwind?",
            options: [
              "Só funciona em celular",
              "Uma classe sem prefixo de tamanho vale pra qualquer tela; o prefixo entra a partir daquele breakpoint",
              "Os breakpoints são maiores no celular",
              "Desktop precisa de mais classes que mobile",
            ],
            correctIndex: 1,
          },
          {
            question: "O que `md:hover:bg-blue-700` faz?",
            options: [
              "Aplica hover:bg-blue-700 sempre, ignorando o tamanho da tela",
              "Aplica o hover azul só a partir do breakpoint md",
              "É inválido, não dá pra combinar dois prefixos",
              "Só funciona no modo escuro",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
