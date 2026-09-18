import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-tipando-componentes-react",
  title: "Tipando componentes React",
  summary: "Sem tipo, um componente aceita qualquer prop maluca sem reclamar — até estourar em produção, longe de onde o erro nasceu.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao11TipandoComponentesReact() {
  return (
    <LessonBody>
      <p>
        Você já viu <code>interface</code> pra tipar props na lição de interfaces. Aqui o foco é o que aparece de
        verdade num componente React do dia a dia: <code>children</code>, eventos de formulário e um hook genérico
        simples.
      </p>

      <h2>Props com interface — revisitando com mais detalhe</h2>
      <CodeExample
        language="typescript"
        code={`interface CardProps {
  titulo: string;
  destaque?: boolean;
  onFechar?: () => void;
}

function Card({ titulo, destaque = false, onFechar }: CardProps) {
  return (
    <div className={destaque ? "border-blue-500" : "border-gray-200"}>
      <h3>{titulo}</h3>
      {onFechar && <button onClick={onFechar}>Fechar</button>}
    </div>
  );
}`}
      />

      <h2>children — o tipo certo é ReactNode</h2>
      <p>
        <code>children</code> pode ser texto, um elemento JSX, uma lista de elementos, ou nada — <code>undefined</code>{" "}
        quando o componente é usado sem filhos. <code>ReactNode</code> é o tipo do React que já cobre todos esses
        casos:
      </p>
      <CodeExample
        language="typescript"
        code={`import type { ReactNode } from "react";

interface PainelProps {
  titulo: string;
  children: ReactNode; // aceita string, <span>, array de elementos, null...
}

function Painel({ titulo, children }: PainelProps) {
  return (
    <section>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

<Painel titulo="Resumo">Só um texto simples.</Painel>
<Painel titulo="Detalhes"><ul><li>Item 1</li></ul></Painel>`}
      />

      <h2>Tipando evento de formulário</h2>
      <p>
        Sem anotar o tipo do parâmetro de um handler de evento, o TS não sabe o que <code>event.target</code>{" "}
        contém. O React exporta tipos específicos por tipo de elemento e evento:
      </p>
      <CodeExample
        language="typescript"
        code={`import { useState, type ChangeEvent } from "react";

function CampoBusca() {
  const [valor, setValor] = useState("");

  function lidarComMudanca(event: ChangeEvent<HTMLInputElement>) {
    setValor(event.target.value); // TS sabe que .value existe e é string
  }

  return <input value={valor} onChange={lidarComMudanca} />;
}`}
      />

      <h2>Um hook genérico simples</h2>
      <p>
        Generics também são úteis dentro de hooks customizados — um <code>useToggle</code> ou um{" "}
        <code>useLocalStorage</code> genérico funcionam pra qualquer tipo de estado, sem perder a checagem:
      </p>
      <CodeExample
        language="typescript"
        code={`import { useState } from "react";

function useLocalStorage<T>(chave: string, valorInicial: T) {
  const [valor, setValor] = useState<T>(() => {
    const salvo = localStorage.getItem(chave);
    return salvo ? (JSON.parse(salvo) as T) : valorInicial;
  });

  function atualizar(novoValor: T) {
    setValor(novoValor);
    localStorage.setItem(chave, JSON.stringify(novoValor));
  }

  return [valor, atualizar] as const;
}

const [tema, setTema] = useLocalStorage<"claro" | "escuro">("tema", "claro");
setTema("escuro"); // ok
setTema("azul");
// Error: Argument of type '"azul"' is not assignable to parameter of type '"claro" | "escuro"'.`}
      />

      <Exercise
        prompt={
          <p>
            Escreva o handler <code>lidarComSelecao</code> de um <code>{"<select onChange={...}>"}</code> que só
            precisa logar o valor selecionado no console, tipando o parâmetro do evento corretamente.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`import type { ChangeEvent } from "react";

function lidarComSelecao(event: ChangeEvent<HTMLSelectElement>) {
  console.log(event.target.value); // TS sabe que existe e é string
}

// uso: <select onChange={lidarComSelecao}>...</select>`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual o tipo correto para representar children que aceita texto, elementos JSX ou nada, numa prop de componente React?",
            options: [
              "string, porque children sempre acaba sendo convertido em texto pelo React antes de renderizar",
              "JSX.Element, porque children nunca pode ser um texto simples nem undefined",
              "ReactNode, porque cobre texto, elementos, arrays de elementos e a ausência de conteúdo",
              "any, já que não existe um tipo específico do React para representar children",
            ],
            correctIndex: 2,
          },
          {
            question: "Ao tipar o manipulador de um <input onChange={...}>, por que usar ChangeEvent<HTMLInputElement> em vez de deixar o parâmetro sem tipo?",
            options: [
              "Porque sem esse tipo o React se recusa a disparar o evento onChange no navegador",
              "Porque ChangeEvent<HTMLInputElement> faz o input validar o valor digitado automaticamente",
              "Porque isso transforma o evento num Promise, permitindo usar await dentro do handler",
              "Porque assim o editor sabe que event.target.value existe e é do tipo string, com autocomplete",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
