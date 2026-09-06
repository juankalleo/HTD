import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-interfaces-e-type-aliases",
  title: "Interfaces e type aliases",
  summary: "Dar nome ao formato de um objeto — e por que isso substitui comentário explicando 'o que essa função espera'.",
  estimatedMinutes: 15,
};

export default function Licao03InterfacesETypeAliases() {
  return (
    <LessonBody>
      <h2>interface — o formato de um objeto, com nome</h2>
      <CodeExample
        language="typescript"
        code={`interface Usuario {
  nome: string;
  idade: number;
  email?: string; // "?" = opcional, pode não vir
}

function saudar(usuario: Usuario) {
  return \`Olá, \${usuario.nome}!\`;
}

saudar({ nome: "Ana", idade: 28 });               // ok, email é opcional
saudar({ nome: "Bia" });
// Error: Property 'idade' is missing`}
      />
      <p>
        Sem a interface, qualquer pessoa chamando <code>saudar</code> teria que adivinhar (ou ler o corpo da função)
        quais campos o objeto precisa ter. Com ela, o editor autocompleta os campos e avisa na hora se faltar algum.
      </p>

      <h2>type — mais genérico que interface</h2>
      <CodeExample
        language="typescript"
        code={`type ID = string | number;               // "union" — pode ser um OU outro
type Status = "pendente" | "pago" | "cancelado"; // union de valores literais, não só tipos

type Usuario = {
  nome: string;
  idade: number;
};`}
      />
      <p>
        <code>interface</code> só descreve formato de objeto; <code>type</code> descreve qualquer coisa — inclusive
        um union como <code>Status</code> acima, que não tem como ser escrito como interface. Na prática: use{" "}
        <code>interface</code> pra formato de objeto (mais comum em props de componente), <code>type</code> quando
        precisar de union, interseção, ou tipo mais genérico.
      </p>

      <h2>Um exemplo real: props de componente React</h2>
      <CodeExample
        language="typescript"
        code={`interface BotaoProps {
  children: React.ReactNode;
  variante?: "primario" | "perigo";
  onClick?: () => void;
}

function Botao({ children, variante = "primario", onClick }: BotaoProps) {
  return <button onClick={onClick} className={variante === "perigo" ? "bg-red-600" : "bg-blue-600"}>{children}</button>;
}`}
      />

      <Exercise
        prompt={
          <p>
            Escreva uma interface <code>Produto</code> com <code>nome</code> (string), <code>preco</code> (number) e{" "}
            <code>categoria</code> que só pode ser <code>"eletronico"</code> | <code>"livro"</code> |{" "}
            <code>"roupa"</code>.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`type Categoria = "eletronico" | "livro" | "roupa";

interface Produto {
  nome: string;
  preco: number;
  categoria: Categoria;
}`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que email?: string significa numa interface?",
            options: [
              "O campo é obrigatório e do tipo string",
              "O campo é opcional — o objeto pode ou não ter essa propriedade",
              "É um erro de sintaxe",
              "O campo só aceita o valor '?'",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que type Status = 'pendente' | 'pago' | 'cancelado' não pode ser escrito como interface?",
            options: [
              "interface é sempre mais poderosa que type",
              "interface só descreve formato de objeto; um union de valores literais precisa de type",
              "Não tem diferença, os dois funcionam igual",
              "Union só existe em versões novas do TypeScript",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
