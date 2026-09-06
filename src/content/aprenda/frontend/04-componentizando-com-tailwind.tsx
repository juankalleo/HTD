import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { LiveEditor } from "@/components/aprenda/live-editor";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-componentizando-com-tailwind",
  title: "Componentizando com Tailwind",
  summary: "O que fazer quando a mesma pilha de classes se repete em vários lugares — cva e clsx na prática.",
  estimatedMinutes: 16,
};

export default function Licao04ComponentizandoComTailwind() {
  return (
    <LessonBody>
      <p>
        Depois de algumas telas, um padrão aparece: o mesmo botão, com as mesmas 8 classes, colado em vários lugares.
        A resposta certa <strong>não</strong> é criar uma classe CSS nova pra "resolver" isso — é extrair um{" "}
        <strong>componente React</strong>. O Tailwind resolve estilo; componente resolve repetição.
      </p>

      <CodeExample
        label="button.tsx"
        language="typescript"
        code={`function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
    >
      {children}
    </button>
  );
}`}
      />

      <h2>E quando o componente tem variantes?</h2>
      <p>
        Um botão "primário" e um "de perigo" compartilham metade das classes. Concatenar strings na mão funciona até
        parar de funcionar — é aí que entram duas bibliotecas pequenas: <code>clsx</code> (junta classes
        condicionalmente) e <code>class-variance-authority</code> (<code>cva</code>, define variantes tipadas).
      </p>

      <CodeExample
        label="button.tsx — com cva"
        language="typescript"
        code={`import { cva, type VariantProps } from "class-variance-authority";

const button = cva("px-4 py-2 rounded-lg font-semibold transition", {
  variants: {
    intent: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    },
  },
  defaultVariants: { intent: "primary" },
});

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>;

function Button({ intent, className, ...props }: ButtonProps) {
  return <button className={button({ intent, className })} {...props} />;
}`}
      />

      <p>
        Agora <code>{"<Button intent=\"danger\">Excluir</Button>"}</code> troca a variante inteira sem repetir uma
        classe sequer, e o TypeScript te avisa se você passar um <code>intent</code> que não existe.
      </p>

      <LiveEditor
        code={`function Button({ variant, children }) {
  const base = "px-4 py-2 rounded-lg font-semibold transition";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  return <button className={\`\${base} \${variants[variant]}\`}>{children}</button>;
}

export default function App() {
  return (
    <div className="p-8 bg-slate-900 min-h-screen flex gap-4 items-center justify-center">
      <Button variant="primary">Salvar</Button>
      <Button variant="danger">Excluir</Button>
    </div>
  );
}
`}
      />

      <Exercise
        prompt={
          <p>
            Adicione uma terceira variante <code>ghost</code> (fundo transparente, texto azul,{" "}
            <code>hover:bg-blue-50</code>) e use-a num terceiro botão.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  ghost: "bg-transparent text-blue-600 hover:bg-blue-50",
};

<Button variant="ghost">Cancelar</Button>`}
      />

      <Callout href="/padrao-frontend/tecnologias/class-variance-authority">
        A adoção do cva como padrão pra variantes de componente — incluindo quando NÃO vale a pena usá-lo — está
        documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Quando o mesmo conjunto de classes Tailwind se repete em vários lugares, o que fazer?",
            options: [
              "Criar uma classe CSS customizada pra substituir as utilitárias",
              "Extrair um componente React que encapsula essas classes",
              "Copiar e colar sempre que precisar",
              "Usar !important pra forçar o estilo",
            ],
            correctIndex: 1,
          },
          {
            question: "Pra que serve o cva (class-variance-authority)?",
            options: [
              "Substituir o Tailwind inteiro",
              "Definir variantes tipadas de um componente sem concatenar strings na mão",
              "Fazer requisições HTTP",
              "Gerenciar estado global",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
