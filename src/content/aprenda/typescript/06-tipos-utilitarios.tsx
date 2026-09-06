import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-tipos-utilitarios",
  title: "Tipos utilitários (Partial, Pick, Omit)",
  summary: "Derivar um tipo novo a partir de outro que já existe, em vez de reescrever o formato do zero.",
  estimatedMinutes: 14,
};

export default function Licao06TiposUtilitarios() {
  return (
    <LessonBody>
      <p>
        É comum precisar de uma <strong>variação</strong> de um tipo que já existe — só alguns campos, todos
        opcionais, sem um campo específico. TypeScript vem com utilitários prontos pra derivar isso, sem reescrever o
        tipo do zero.
      </p>

      <h2>Partial — todos os campos viram opcionais</h2>
      <CodeExample
        language="typescript"
        code={`interface Usuario {
  nome: string;
  email: string;
  idade: number;
}

// pra um formulário de EDIÇÃO, você só quer atualizar alguns campos por vez
function atualizarUsuario(id: string, dados: Partial<Usuario>) {
  // dados pode ter só { nome: "Novo nome" }, sem precisar de email/idade
}`}
      />

      <h2>Pick — extrai só alguns campos</h2>
      <CodeExample
        language="typescript"
        code={`type ResumoUsuario = Pick<Usuario, "nome" | "email">;
// equivalente a: { nome: string; email: string }
// mas se Usuario mudar, ResumoUsuario acompanha automaticamente`}
      />

      <h2>Omit — o oposto do Pick, remove campos</h2>
      <CodeExample
        language="typescript"
        code={`type UsuarioSemEmail = Omit<Usuario, "email">;
// equivalente a: { nome: string; idade: number }

// muito comum: o formato de CRIAÇÃO não tem "id" ainda (o banco gera)
interface UsuarioComId extends Usuario {
  id: string;
}
type NovoUsuario = Omit<UsuarioComId, "id">;`}
      />

      <h2>Record — um objeto com chaves de um tipo, valores de outro</h2>
      <CodeExample
        language="typescript"
        code={`type Status = "pendente" | "pago" | "cancelado";

const corPorStatus: Record<Status, string> = {
  pendente: "amarelo",
  pago: "verde",
  cancelado: "vermelho",
};
// TS obriga as 3 chaves existirem — esquecer uma vira erro de compilação`}
      />

      <p>
        A vantagem central desses utilitários: se <code>Usuario</code> ganhar um campo novo amanhã,{" "}
        <code>Partial{"<Usuario>"}</code>/<code>Pick{"<Usuario, ...>"}</code>/<code>Omit{"<Usuario, ...>"}</code>{" "}
        acompanham automaticamente — sem precisar lembrar de atualizar 3 tipos separados manualmente.
      </p>

      <Exercise
        prompt={
          <p>
            Dado <code>interface Produto {"{ id: string; nome: string; preco: number; }"}</code>, escreva o tipo pra
            criar um produto novo (sem <code>id</code>, já que o banco gera).
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`type NovoProduto = Omit<Produto, "id">;
// { nome: string; preco: number }`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que Partial<Usuario> faz?",
            options: [
              "Remove todos os campos",
              "Torna todos os campos de Usuario opcionais, útil pra um formulário de edição parcial",
              "Deixa Usuario com metade dos campos, escolhidos ao acaso",
              "Cria uma cópia idêntica de Usuario",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que usar Omit<Usuario, 'id'> em vez de reescrever a interface sem o campo id?",
            options: [
              "Não tem diferença nenhuma",
              "Se Usuario ganhar um campo novo depois, o tipo derivado acompanha automaticamente, sem precisar editar em dois lugares",
              "Omit é mais rápido de compilar",
              "Reescrever manualmente também funciona igual, é só estilo",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
